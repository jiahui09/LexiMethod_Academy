/* 首屏体积门禁（规格「二 / Bundle 体积目标」）
 *   首屏 JS+CSS（gzip）< 200KB   首屏 CSS（gzip）< 30KB
 * 用法：npm run build && npm run size
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, '..', 'dist');
const assets = join(dist, 'assets');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('✗ 未找到 dist/index.html，请先执行 npm run build');
  process.exit(1);
}

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const gzipLen = (file) => gzipSync(readFileSync(file)).length;

/** 静态 import 依赖图（动态 import() 的路由分包不计入 eager 图） */
function staticDeps(file) {
  const src = readFileSync(join(assets, file), 'utf8');
  const out = new Set();
  for (const m of src.matchAll(/(?:from|import)\s*["']\.\/([\w.\-]+)["']/g)) out.add(m[1]);
  return out;
}

function walk(entry) {
  const seen = new Set();
  const stack = [entry];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || seen.has(cur) || !existsSync(join(assets, cur))) continue;
    seen.add(cur);
    for (const d of staticDeps(cur)) stack.push(d);
  }
  return [...seen];
}

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const entryJs = html.match(/src="\/assets\/([\w.\-]+\.js)"/)?.[1];
const entryCss = [...html.matchAll(/href="\/assets\/([\w.\-]+\.css)"/g)].map((m) => m[1]);
if (!entryJs) {
  console.error('✗ 未能从 dist/index.html 解析入口 JS');
  process.exit(1);
}

// 首屏 = 入口 eager 图 + 首页路由分包（'/' 直达）
const homeChunk = readdirSync(assets).find((f) => f.startsWith('Home-') && f.endsWith('.js'));
const eagerJs = walk(entryJs);
const homeJs = homeChunk ? walk(homeChunk) : [];
const firstScreenJs = [...new Set([...eagerJs, ...homeJs])];

const jsBytes = firstScreenJs.reduce((s, f) => s + gzipLen(join(assets, f)), 0);
const cssBytes = entryCss.reduce((s, f) => s + gzipLen(join(assets, f)), 0);
const totalBytes = jsBytes + cssBytes;

console.log('首屏体积（gzip）');
console.log(`  入口 eager JS : ${kb(eagerJs.reduce((s, f) => s + gzipLen(join(assets, f)), 0))}（${eagerJs.length} 个分包）`);
console.log(`  首页分包 JS   : ${kb(homeJs.reduce((s, f) => s + gzipLen(join(assets, f)), 0))}（${homeJs.length} 个分包）`);
console.log(`  首屏 CSS      : ${kb(cssBytes)}（${entryCss.length} 个）`);
console.log(`  首屏合计      : ${kb(totalBytes)}`);

const all = readdirSync(assets).filter((f) => /\.(js|css)$/.test(f));
const allBytes = all.reduce((s, f) => s + gzipLen(join(assets, f)), 0);
console.log(`  JS/CSS 资源   : ${kb(allBytes)}（${all.length} 个，gzip）`);

/* 全量站点口径：dist 全部文件（文本 gzip、音频等二进制按原始字节——压缩产物 gzip 无收益） */
function walkDist(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkDist(p, out);
    else out.push(p);
  }
  return out;
}
const TEXT_EXT = /\.(js|css|html|svg|json|txt|map|md|css\.map|js\.map)$/;
const siteFiles = walkDist(dist);
const siteBytes = siteFiles.reduce((s, f) => s + (TEXT_EXT.test(f) ? gzipLen(f) : readFileSync(f).length), 0);
const audioBytes = siteFiles.filter((f) => f.endsWith('.mp3')).reduce((s, f) => s + readFileSync(f).length, 0);
console.log(`  全量站点      : ${kb(siteBytes)}（${siteFiles.length} 个，其中音频 ${kb(audioBytes)}）`);

const fails = [];
if (totalBytes >= 200 * 1024) fails.push(`首屏 ${kb(totalBytes)} ≥ 200 KB`);
if (cssBytes >= 30 * 1024) fails.push(`首屏 CSS ${kb(cssBytes)} ≥ 30 KB`);
if (allBytes >= 2 * 1024 * 1024) fails.push(`JS/CSS 资源 ${kb(allBytes)} ≥ 2 MB`);
if (siteBytes >= 2 * 1024 * 1024) fails.push(`全量站点 ${kb(siteBytes)} ≥ 2 MB`);

if (fails.length) {
  console.error(`\n✗ 体积超限：${fails.join('；')}`);
  process.exit(1);
}
console.log('\n✓ 体积达标（首屏 <200KB / CSS <30KB / 全量站点 <2MB）');
