import puppeteer from 'puppeteer-core';

const BASE = 'http://127.0.0.1:5173/';
const errors = [];
const log = (...a) => console.log(...a);

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

const goto = async (path) => {
  await page.evaluate((p) => {
    window.history.pushState({}, '', p);
    window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
  }, path);
  await new Promise((r) => setTimeout(r, 700));
};

await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 800));

// 1) zero storage
const storage = await page.evaluate(() => ({
  ls: Object.keys(localStorage).length,
  ss: Object.keys(sessionStorage).length,
  cookies: document.cookie.split(';').filter(Boolean).length,
}));
log('storage:', JSON.stringify(storage));

// 2) breadcrumbs on every route
const routes = ['/', '/methods', '/methods/phonics-syllables', '/lab/phonemes', '/lab/mapping', '/lab/dictation', '/practice', '/analyze', '/toolbox', '/review', '/stats', '/settings', '/feynman', '/nope-not-found'];
for (const r of routes) {
  await goto(r);
  const info = await page.evaluate(() => {
    const bc = document.querySelector('nav[aria-label="面包屑"]');
    const bar = document.querySelector('[data-testid="next-step-bar"]');
    const xp = document.querySelector('[data-testid="header-xp"]')?.textContent?.trim() ?? null;
    const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
    return { crumbs: bc ? bc.querySelectorAll('span > a, span > span').length : 0, bar: !!bar, xp, overflow };
  });
  log(`route ${r}: crumbs=${info.crumbs} nextbar=${info.bar} xp=${info.xp} hOverflow=${info.overflow}`);
}

// 3) home progress panel: +3 on method 0 => XP +30, then continue -> ?step=3
await goto('/');
const before = await page.$eval('[data-testid="header-xp"]', (e) => e.textContent.trim());
for (let i = 0; i < 3; i++) {
  await page.click('[data-step-inc="0"]');
  await new Promise((r) => setTimeout(r, 120));
}
const after = await page.$eval('[data-testid="header-xp"]', (e) => e.textContent.trim());
const count = await page.$eval('[data-step-count="0"]', (e) => e.textContent.trim());
const resume = await page.$eval('[data-testid="resume-btn"]', (e) => e.textContent.trim());
const resumeStep = await page.$eval('[data-testid="resume-step"]', (e) => e.textContent.trim());
log(`xp: ${before} -> ${after}; counter=${count}; resumeBtn="${resume}"; resumeStep="${resumeStep}"`);

await page.click('[data-testid="resume-btn"]');
await new Promise((r) => setTimeout(r, 1200));
log('after continue url:', new globalThis.URL(page.url()).pathname + new globalThis.URL(page.url()).search);
const courseStep = await page.$eval('[data-testid="course-step"]', (e) => e.textContent.trim()).catch(() => 'MISSING');
const bc4 = await page.evaluate(() => document.querySelector('nav[aria-label="面包屑"]')?.innerText.replace(/\n/g, ' ') ?? 'MISSING');
log('course-step:', courseStep, '| crumbs:', bc4);

// 4) bottom nav at 375px
await page.setViewport({ width: 375, height: 812 });
await new Promise((r) => setTimeout(r, 600));
const bn = await page.evaluate(() => {
  const nav = document.querySelector('[data-testid="bottom-nav"]');
  if (!nav) return null;
  const items = [...nav.querySelectorAll('a')].map((a) => ({ t: a.innerText.trim().replace(/\n/g, ''), on: a.getAttribute('aria-current') }));
  const visible = nav.getBoundingClientRect().width > 0;
  return { count: items.length, items, visible, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 };
});
log('bottom-nav:', JSON.stringify(bn));
if (bn) await page.click('[data-testid="bottom-nav"] li:nth-child(3) a');
await new Promise((r) => setTimeout(r, 800));
log('after bottom nav click:', new globalThis.URL(page.url()).pathname);

// 5) refresh => back to initial (zero storage)
await page.goto(BASE, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 800));
const xpFresh = await page.$eval('[data-testid="header-xp"]', (e) => e.textContent.trim());
log('xp after full reload:', xpFresh);

log('errors:', errors.length ? JSON.stringify(errors, null, 1) : 'none');
await browser.close();
