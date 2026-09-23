// Generates real JPEG XL fixtures using the @jsquash/jxl encoder (no fabricated bytes).
// Run: node scripts/gen-fixtures.mjs
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'public', 'fixtures');
fs.mkdirSync(outDir, { recursive: true });

const enc = await import('@jsquash/jxl/encode.js');
const encWasm = fs.readFileSync(path.join(root, 'node_modules/@jsquash/jxl/codec/enc/jxl_enc.wasm'));
await enc.init(new WebAssembly.Module(encWasm));

const dec = await import('@jsquash/jxl/decode.js');
const decWasm = fs.readFileSync(path.join(root, 'node_modules/@jsquash/jxl/codec/dec/jxl_dec.wasm'));
await dec.init(new WebAssembly.Module(decWasm));

function gradient(w, h, seed = 1) {
  const data = new Uint8ClampedArray(w * h * 4);
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      data[i] = (x * 255 / w) | 0;
      data[i + 1] = (y * 255 / h) | 0;
      data[i + 2] = ((x + y) * 255 / (w + h)) | 0;
      data[i + 3] = 255;
    }
  }
  for (let n = 0; n < Math.max(1, (w * h) / 4000); n++) {
    const i = ((rnd() * h * w) | 0) * 4;
    data[i] = (rnd() * 255) | 0;
    data[i + 1] = (rnd() * 255) | 0;
    data[i + 2] = (rnd() * 255) | 0;
  }
  return { data, width: w, height: h };
}

async function write(name, imageData, quality = 80) {
  const buf = await enc.default(imageData, { quality, effort: 3 });
  fs.writeFileSync(path.join(outDir, name), Buffer.from(buf));
  const back = await dec.default(buf);
  console.log(`${name}: ${buf.byteLength} bytes, decodes to ${back.width}x${back.height}`);
  return buf;
}

const tinyBuf = await write('tiny.jxl', gradient(64, 64), 70);
await write('photo-2k.jxl', gradient(2048, 1536), 85);
await write('photo-4k.jxl', gradient(4096, 3072), 80);
await write('with-icc.jxl', gradient(800, 600), 85);

// truncated: valid stream cut short -> CORRUPT
fs.writeFileSync(path.join(outDir, 'truncated.jxl'), Buffer.from(tinyBuf.slice(0, Math.floor(tinyBuf.byteLength / 2))));
console.log('truncated.jxl written (half of tiny)');

// fake.jxl: a real JPEG renamed to .jxl -> NOT_JXL (magic check rejects it)
const jpeg = Buffer.from(
  'ffd8ffe000104a46494600010100000100010000ffdb004300ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc00011080001000103012200021101031101ffc4001f0000010501010101010100000000000000000102030405060708090a0bffc400b5100002010303020403050504040000017d01020300041105122131410613516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728292a3435363738393a434445464748494a535455565758595a636465666768696a737475767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4f5f6f7f8f9faffda000c03010002110311003f00fefa28a28a00ffd9',
  'hex'
);
fs.writeFileSync(path.join(outDir, 'fake.jxl'), jpeg);
console.log('fake.jxl written (JPEG bytes)');

console.log('done -> public/fixtures/');
