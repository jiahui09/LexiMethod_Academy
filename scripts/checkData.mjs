/* 数据层深度验收：esbuild 打包 dataCheck.entry.ts 后在 node 中执行断言 */
import { build } from 'esbuild';
import { writeFile, unlink } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const outfile = new URL('./.dataCheck.bundle.mjs', import.meta.url);
const result = await build({
  entryPoints: ['scripts/dataCheck.entry.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: outfile.pathname,
  logLevel: 'silent',
  alias: { '@': './src' },
  jsx: 'automatic',
});
void result;

let code = 1;
try {
  await import(pathToFileURL(outfile.pathname).href + `?t=${Date.now()}`);
  code = 0;
} catch (e) {
  if (e && typeof e === 'object' && 'exitCode' in e) code = Number((e).exitCode) || 1;
  else {
    console.error(e);
    code = 1;
  }
}
await unlink(outfile.pathname).catch(() => {});
process.exit(code);
