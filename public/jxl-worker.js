import jxlDecoder from '/jxl/jxl_dec.js';
import { initEmscriptenModule } from '/jxl/utils.js';
let mod = null;
async function getMod(){ if(!mod) mod = initEmscriptenModule(jxlDecoder, undefined, { locateFile: (p) => '/jxl/' + p }); return mod; }
self.onmessage = async (e) => {
  const { id, buffer } = e.data;
  try {
    if (buffer.byteLength > 80 * 1024 * 1024) { self.postMessage({ id, ok: false, errorCode: 'TOO_LARGE' }); return; }
    const b = new Uint8Array(buffer.slice(0, 16));
    const isJxl = (b[0]===0xFF&&b[1]===0x0A)||(b[4]===0x4A&&b[5]===0x58&&b[6]===0x4C&&b[7]===0x20);
    if (!isJxl) { self.postMessage({ id, ok: false, errorCode: 'NOT_JXL' }); return; }
    const m = await getMod();
    const img = m.decode(new Uint8Array(buffer));
    if (!img || !img.width) { self.postMessage({ id, ok: false, errorCode: 'CORRUPT' }); return; }
    self.postMessage({ id, ok: true, width: img.width, height: img.height, data: img.data.buffer }, [img.data.buffer]);
  } catch (err) {
    // V1 policy: single behavior. The decoder emits the first frame only;
    // anything it cannot decode surfaces as CORRUPT (fail loudly, never silent).
    const s = String((err && err.message) || err);
    const code = /large|memory|size/i.test(s) ? 'TOO_LARGE' : 'CORRUPT';
    self.postMessage({ id, ok: false, errorCode: code });
  }
};
