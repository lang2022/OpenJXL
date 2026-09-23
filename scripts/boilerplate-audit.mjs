import fs from 'node:fs';
const s = fs.readFileSync('dist/index.html', 'utf8');
const head = s.slice(0, s.indexOf('</head>'));
const order = ['charset', 'viewport', '<title>', 'site.css', 'description', 'og:title', 'og:description', 'favicon.svg', 'og:image', 'og:image:alt', 'canonical', 'hreflang', 'og:site_name', 'author', 'color-scheme', 'theme-color', 'site.webmanifest'];
let last = -1, ok = true;
for (const k of order) {
  const i = head.indexOf(k);
  if (i < 0) { console.log('MISSING:', k); ok = false; continue; }
  if (i < last) { console.log('OUT OF ORDER:', k); ok = false; }
  last = i;
}
const checks = {
  'has doctype': s.startsWith('<!DOCTYPE html>'),
  'html lang en': s.includes('<html lang="en">'),
  'skip link': s.includes('skip-link') && s.includes('href="#main"'),
  'main id': s.includes('<main id="main">'),
  'footer id': s.includes('<footer id="footer">'),
  'viewport clean': !s.includes('maximum-scale') && !s.includes('user-scalable'),
  'favicon in dist': fs.existsSync('dist/favicon.svg'),
  'manifest in dist': fs.existsSync('dist/site.webmanifest'),
};
for (const [k, v] of Object.entries(checks)) { if (!v) { console.log('FAIL:', k); ok = false; } }
const zh = fs.readFileSync('dist/zh/index.html', 'utf8');
if (!zh.includes('<html lang="zh-Hans">')) { console.log('FAIL: zh lang tag'); ok = false; }
console.log(ok ? 'BOILERPLATE AUDIT PASS' : 'BOILERPLATE AUDIT FAIL');
