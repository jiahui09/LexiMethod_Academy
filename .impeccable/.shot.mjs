import puppeteer from 'puppeteer-core';
const BASE = 'http://127.0.0.1:5173';
const routes = process.argv[2] ? process.argv[2].split(',') : ['/methods', '/methods/phonics-syllables', '/lab/phonemes', '/lab/dictation', '/settings'];
const tag = process.argv[3] || 'cur';
const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--font-render-hinting=none'] });
for (const [w, h, vp] of [[1280, 900, 'd'], [375, 812, 'm']]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: 'networkidle2' });
    await new Promise((s) => setTimeout(s, 900));
    const name = (r.replace(/\W+/g, '_') || '_root') + '_' + vp;
    await page.screenshot({ path: `.impeccable/shots/${tag}_${name}.png`, fullPage: true });
    const m = await page.evaluate(() => {
      const de = document.documentElement;
      const tall = [...document.querySelectorAll('main *')]
        .filter((e) => e.getBoundingClientRect().height > 900 && e.children.length > 2)
        .slice(0, 5)
        .map((e) => `${e.tagName}.${(e.className + '').slice(0, 60)} h=${Math.round(e.getBoundingClientRect().height)}`);
      return { docH: de.scrollHeight, overflow: de.scrollWidth - de.clientWidth, tall };
    });
    console.log(tag, vp, r, JSON.stringify(m));
  }
  await page.close();
}
await browser.close();
