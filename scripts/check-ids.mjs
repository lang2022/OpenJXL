import fs from 'node:fs';
for (const page of ['dist/index.html', 'dist/zh/index.html']) {
  const s = fs.readFileSync(page, 'utf8');
  const ids = ['status','drop','file','wasm-note','err','loading','loading-t','secs','result','preview','preview-img','meta','dl-jpg','dl-png','again','lang-hint','seo-foot'];
  const missing = ids.filter((id) => !s.includes('id="' + id + '"'));
  console.log(page, missing.length ? 'MISSING ' + missing.join(',') : 'all IDs ok',
    '| viewer:', s.includes('/viewer.js'),
    '| pill:', s.includes('class="pill"'),
    '| tool-card:', s.includes('tool-card'));
}
