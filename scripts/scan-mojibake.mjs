import fs from 'node:fs';
import path from 'node:path';
const BAD = String.fromCharCode(0xfffd);
function walk(d, out) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) { if (f.name === 'node_modules' || f.name === '.git') continue; walk(p, out); continue; }
    if (/\.(astro|ts|js|mjs|css|html|xml|txt|json|md|webmanifest|svg)$/.test(f.name)) out.push(p);
  }
}
const files = [];
walk('src', files); walk('public', files);
walk('scripts', files);
let bad = 0;
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  const hits = [];
  if (s.includes(BAD)) hits.push('U+FFFD');
  const re = /[A-Za-z0-9\u4e00-\u9fff\)\]] \?([ ,.)\]]|$)/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const ctx = s.slice(Math.max(0, m.index - 30), m.index + 10).replace(/\n/g, ' ');
    if (/what|What|is a |file\?$/i.test(ctx) && !ctx.includes(' ?')) continue;
    hits.push('QMARK:...' + ctx + '...');
    if (hits.length > 6) break;
  }
  if (hits.length) { console.log(f); hits.forEach((h) => console.log('   ', h)); bad++; }
}
console.log(bad ? 'FOUND ' + bad + ' files' : 'SOURCE CLEAN');
const d = fs.readFileSync('dist/index.html', 'utf8');
console.log('dist Checking?:', d.includes('Checking?') ? 'YES' : 'no');
console.log('dist efficient,,:', d.includes('efficient,,') ? 'YES' : 'no');
