import fs from 'node:fs';
import path from 'node:path';
const pages = [
  'dist/index.html', 'dist/zh/index.html',
  'dist/how-to-open-jxl-file/index.html', 'dist/zh/how-to-open-jxl-file/index.html',
  'dist/jxl-browser-support/index.html', 'dist/zh/jxl-browser-support/index.html',
  'dist/privacy/index.html', 'dist/zh/privacy/index.html',
];
let errors = 0;
for (const p of pages) {
  const s = fs.readFileSync(p, 'utf8');
  const need = ['rel="canonical"', 'hreflang="en"', 'hreflang="zh-Hans"', 'hreflang="x-default"', 'property="og:title"', 'property="og:url"', 'application/ld+json'];
  const miss = need.filter((k) => !s.includes(k));
  const canon = (s.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  const badAbs = [...s.matchAll(/<a href="https:\/\/example\.com[^"]*"/g)].length;
  const title = (s.match(/<title>([^<]+)<\/title>/) || [])[1];
  const h1 = (s.match(/<h1>([\s\S]*?)<\/h1>/) || [])[1];
  console.log('---', p);
  console.log('  title:', title);
  console.log('  h1:', h1 ? h1.replace(/<[^>]+>/g, '').slice(0, 60) : 'MISSING');
  console.log('  canonical:', canon);
  if (miss.length) { console.log('  MISSING TAGS:', miss.join(',')); errors++; }
  if (badAbs) { console.log('  ABSOLUTE example.com <a> links:', badAbs); errors++; }
}
// sitemap coverage
const sm = fs.readFileSync('dist/sitemap.xml', 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log('--- sitemap urls:', locs.length);
for (const u of locs) console.log('  ', u);
// internal link graph: every page should link to / (tool)
for (const p of pages) {
  const s = fs.readFileSync(p, 'utf8');
  const isZh = p.includes('/zh/');
  const home = isZh ? 'href="/zh/"' : 'href="/"';
  const hasHome = s.includes(home) || s.includes('href="/zh/"') || s.includes('href="/"');
  const hasHow = s.includes('how-to-open-jxl-file');
  const hasSup = s.includes('jxl-browser-support');
  const hasPri = s.includes('/privacy');
  if (!hasHome || !hasHow || !hasSup || !hasPri) { console.log('LINK GAP in', p, { hasHome, hasHow, hasSup, hasPri }); errors++; }
}
console.log(errors ? 'FAIL: ' + errors + ' issues' : 'ALL SEO CHECKS PASS');
