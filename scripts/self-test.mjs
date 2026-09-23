// Self-test: does the vendored wasm decode our tiny.jxl exactly like the site would?
import fs from 'node:fs';
const { initEmscriptenModule } = await import('../public/jxl/utils.js');
const jxlDecoder = (await import('../public/jxl/jxl_dec.js')).default;
const wasmBytes = fs.readFileSync('public/jxl/jxl_dec.wasm');
const buf = fs.readFileSync('public/fixtures/tiny.jxl');
const b = new Uint8Array(buf.slice(0, 16));
const isJxl = (b[0]===0xFF&&b[1]===0x0A)||(b[4]===0x4A&&b[5]===0x58&&b[6]===0x4C&&b[7]===0x20);
console.log('magic isJxl:', isJxl);
const mod = await initEmscriptenModule(jxlDecoder, new WebAssembly.Module(wasmBytes), {});
const img = mod.decode(new Uint8Array(buf));
console.log('decoded:', img.width, 'x', img.height, 'data bytes:', img.data.byteLength);
const fakeOk = (() => {
  const f = new Uint8Array(fs.readFileSync('public/fixtures/fake.jxl'));
  return !((f[0]===0xFF&&f[1]===0x0A)||(f[4]===0x4A&&f[5]===0x58&&f[6]===0x4C&&f[7]===0x20));
})();
console.log('fake.jxl rejected by magic:', fakeOk);