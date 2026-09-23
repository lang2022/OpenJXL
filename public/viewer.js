(function(){
var lang = (document.currentScript && document.currentScript.dataset.lang) || 'en';
var S = {
en: { running:'Checking JPEG XL support…', native:'This browser can display JPEG XL natively.', wasm:'This browser cannot display JPEG XL natively. Local decoder enabled.', fail:'Could not load the local decoder. Try Chrome, Firefox, Safari, or Edge.', loading:'Decoding on this device…', notjxl:'This does not look like a JPEG XL file.', corrupt:'Could not decode this file. It may be damaged.', animated:'V1 does not support animated JPEG XL.', large:'This image is too large for this browser. Try a smaller file.', multi:'V1 opens one file at a time. Using the first file.', tagline:'Preview JPEG XL (.jxl) locally. Nothing is uploaded.', dropT:'Drop a .jxl file', dropS:'or click to choose, paste also works', first:'First visit loads a local decoder (~0.9 MB), then works offline for this session.', jpg:'Download JPG', png:'Download PNG', paste:'Please paste a .jxl file, not a decoded image.', frame:'Note: animated images show the first frame only.', hint:'Prefer Chinese? View the Chinese version.' },
zh: { running:'正在检测浏览器是否支持 JPEG XL…', native:'当前浏览器可原生显示 JPEG XL。', wasm:'当前浏览器不能原生显示 JPEG XL。已启用本地解码。', fail:'本地解码组件加载失败。请改用 Chrome、Firefox、Safari 或 Edge。', loading:'正在本机解码…', notjxl:'这不像 JPEG XL 文件。', corrupt:'无法解码。文件可能已损坏。', animated:'V1 暂不支持动画 JPEG XL。', large:'图片太大，当前浏览器无法预览。请换更小的文件。', multi:'V1 每次仅打开一个文件，已使用第一份。', tagline:'本地预览 JPEG XL（.jxl）。文件不上传。', dropT:'拖入 .jxl 文件', dropS:'或点击选择，也可粘贴', first:'首次访问会加载本地解码组件（约 0.9 MB），之后本会话可继续使用。', jpg:'下载 JPG', png:'下载 PNG', paste:'请粘贴 .jxl 文件，而不是已解码的图片', frame:'说明：动画图片仅显示第一帧。', hint:'Prefer English? View the English version.' }
}[lang] || {};
function $(id){ return document.getElementById(id); }
function setT(id, v){ var e=$(id); if(e) e.textContent=v; return e; }
setT('tagline2', S.tagline); setT('drop-title', S.dropT); setT('drop-sub', S.dropS);
setT('wasm-note', S.first); setT('loading-t', S.loading); setT('dl-jpg', S.jpg); setT('dl-png', S.png);
var foot = document.getElementById('seo-foot'); if(foot) foot.textContent = lang==='zh' ? 'JPEG XL 是一种图片格式。Open JXL 是本地查看器，与车机摄像头或 Java 库无关。' : 'JPEG XL is an image format. Open JXL is a local viewer, not a camera app or Java library.';
(function langHint(){
  try{
    var nav = (navigator.language || '').toLowerCase();
    var bar = document.getElementById('lang-hint');
    if(!bar) return;
    if(lang === 'en' && nav.indexOf('zh') === 0){ bar.hidden = false; bar.innerHTML = ''; var a = document.createElement('a'); a.href = '/zh/'; a.textContent = S.hint; bar.appendChild(a); }
    else if(lang === 'zh' && nav.indexOf('zh') !== 0 && nav.indexOf('en') === 0){ bar.hidden = false; bar.innerHTML = ''; var b = document.createElement('a'); b.href = '/'; b.textContent = S.hint; bar.appendChild(b); }
  }catch(e){}
})();
var mode = 'unknown', worker = null, lastName = 'image', startT = 0, timer = null;
function track(n){ try{ if(window.plausible) window.plausible(n); }catch(e){} }
function looksJXL(buf){ var b = new Uint8Array(buf.slice(0,16)); if(b[0]===0xFF&&b[1]===0x0A) return true; if(b[4]===0x4A&&b[5]===0x58&&b[6]===0x4C&&b[7]===0x20) return true; return false; }
function setStatus(txt, ok){ var e=$('status'); if(!e){ return; } e.setAttribute('role','status'); e.setAttribute('aria-live','polite'); e.innerHTML=''; var d=document.createElement('span'); d.className='dot'; e.appendChild(d); var t=document.createElement('span'); t.textContent=txt; e.appendChild(t); if(ok) e.classList.add('ok'); }
function detectNative(){
  setStatus(S.running);
  fetch('/fixtures/tiny.jxl').then(function(r){ if(!r.ok) throw 0; return r.arrayBuffer(); }).then(function(ab){
    var url = URL.createObjectURL(new Blob([ab],{type:'image/jxl'}));
    var img = new Image();
    var done = false;
    function fin(ok){ if(done) return; done = true; URL.revokeObjectURL(url); if(ok){ mode='native'; setStatus(S.native, true); track('detect_native'); } else { toWasm(); } }
    img.onload = function(){ fin(true); }; img.onerror = function(){ fin(false); };
    setTimeout(function(){ fin(false); }, 1500); img.src = url;
  }).catch(toWasm);
  setTimeout(function(){ if(mode==='unknown'){ toWasm(); } }, 2500);
  function toWasm(){ if(mode!=='unknown') return; mode='wasm'; setStatus(S.wasm); track('detect_wasm'); ensureWorker(); }
}
function ensureWorker(){ if(worker) return worker; try{ worker = new Worker('/jxl-worker.js', {type:'module'}); }catch(e){ setStatus(S.fail); track('detect_fail'); } return worker; }
function showErr(msg, code){ try{ clearInterval(timer); var l=$('loading'); if(l) l.hidden=true; var e=$('err'); if(!e) return; e.hidden=false; e.textContent=msg; }catch(x){} try{ if(window.plausible) window.plausible('preview_fail', {props:{error_code: code || 'UNKNOWN'}}); }catch(x){} }
function fmt(n){ return n>1048576 ? (n/1048576).toFixed(1)+' MB' : Math.round(n/1024)+' KB'; }
function dl(u,n){ var a=document.createElement('a'); a.href=u; a.download=n; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); },5000); }
function exportFromNativeImg(type, quality, filename){
  var img = $('preview-img'), c = $('preview');
  try{
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    var ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
    c.toBlob(function(b){ if(!b){ showErr(S.large, 'TOO_LARGE'); return; } track(type === 'image/jpeg' ? 'export_jpg' : 'export_png'); dl(URL.createObjectURL(b), filename); }, type, quality);
  }catch(e){ showErr(S.large, 'TOO_LARGE'); }
}
function doneMeta(w,h,size,how,kind,url,note){
  clearInterval(timer); $('loading').hidden=true; $('result').hidden=false;
  var ms=Math.round(performance.now()-startT);
  var box=$('meta');
  if(box){
    box.innerHTML='';
    var items=[lastName + '.jxl', w + 'x' + h, fmt(size), ms + ' ms', how];
    if(note) items.push(note);
    for(var ci=0; ci<items.length; ci++){ var cp=document.createElement('span'); cp.className='chip'; cp.textContent=items[ci]; box.appendChild(cp); }
  }
  var bj=$('dl-jpg'), bp=$('dl-png');
  if(bj) bj.disabled=false; if(bp) bp.disabled=false;
  $('dl-jpg').onclick=function(){
    if(kind==='native-img'){ exportFromNativeImg('image/jpeg', 0.92, lastName+'.jpg'); return; }
    var c=$('preview');
    try{ c.toBlob(function(b){ if(!b){ showErr(S.large, 'TOO_LARGE'); return; } track('export_jpg'); dl(URL.createObjectURL(b), lastName+'.jpg'); },'image/jpeg',0.92); }catch(e){ showErr(S.large, 'TOO_LARGE'); }
  };
  $('dl-png').onclick=function(){
    if(kind==='native-img'){ exportFromNativeImg('image/png', undefined, lastName+'.png'); return; }
    var c=$('preview');
    try{ c.toBlob(function(b){ if(!b){ showErr(S.large, 'TOO_LARGE'); return; } track('export_png'); dl(URL.createObjectURL(b), lastName+'.png'); },'image/png'); }catch(e){ showErr(S.large, 'TOO_LARGE'); }
  };
  track('preview_success');
}
function drawWasm(res,size){
  var c=$('preview');
  try{
    c.width=res.width; c.height=res.height;
    var ctx=c.getContext('2d'); ctx.putImageData(new ImageData(new Uint8ClampedArray(res.data),res.width,res.height),0,0);
  }catch(e){ showErr(S.large, 'TOO_LARGE'); return; }
  c.hidden=false; $('preview-img').hidden=true; doneMeta(res.width,res.height,size, lang==='zh'?'本地解码':'Local decoder', 'wasm', null, S.frame);
}
function handleFile(f){
  if(!f) return;
  f.arrayBuffer().then(function(buf){
    if(!looksJXL(buf)){ showErr(S.notjxl, 'NOT_JXL'); return; }
    lastName = f.name.replace(/\.jxl$/i,'') || 'image';
    startT = performance.now(); $('err').hidden=true; $('result').hidden=true; $('loading').hidden=false;
    var t0=Date.now(); clearInterval(timer); timer=setInterval(function(){ $('secs').textContent=((Date.now()-t0)/1000).toFixed(0); },250);
    if(mode==='native'){
      var url=URL.createObjectURL(new Blob([buf],{type:'image/jxl'}));
      var img=$('preview-img');
      img.onload=function(){ img.hidden=false; $('preview').hidden=true; doneMeta(img.naturalWidth,img.naturalHeight,f.size, lang==='zh'?'原生':'Native','native-img',url); };
      img.onerror=function(){ URL.revokeObjectURL(url); decodeWasm(buf,f.size); };
      img.src=url;
      return;
    }
    decodeWasm(buf,f.size);
  });
}
function decodeWasm(buf,size){
  try{
    ensureWorker(); var w=worker; if(!w){ showErr(S.fail); return; } var id=Date.now()+Math.random();
    var h=function(e){ if(e.data.id===id){ w.removeEventListener('message',h); var res=e.data; if(res.ok){ drawWasm(res,size); } else { var map={NOT_JXL:S.notjxl,CORRUPT:S.corrupt,TOO_LARGE:S.large}; showErr(map[res.errorCode]||S.corrupt, res.errorCode); } } };
    w.addEventListener('message',h);
    w.postMessage({id:id, buffer:buf},[buf]);
  }catch(e){ showErr(S.corrupt, 'CORRUPT'); }
}
try{
var drop=$('drop'), inp=$('file');
if(!drop||!inp) throw new Error('no-tool');
drop.addEventListener('click',function(){ inp.click(); });
inp.addEventListener('change',function(){ var fs=Array.prototype.slice.call(inp.files); if(fs.length>1) alert(S.multi); handleFile(fs[0]); inp.value=''; });
['dragover','dragenter'].forEach(function(ev){ drop.addEventListener(ev,function(e){ e.preventDefault(); drop.classList.add('over'); }); });
['dragleave','drop'].forEach(function(ev){ drop.addEventListener(ev,function(e){ e.preventDefault(); drop.classList.remove('over'); }); });
drop.addEventListener('drop',function(e){ var fs=(e.dataTransfer&&e.dataTransfer.files)?Array.prototype.slice.call(e.dataTransfer.files):[]; if(fs.length>1) alert(S.multi); if(fs[0]) handleFile(fs[0]); });
document.addEventListener('paste',function(e){ var fs=(e.clipboardData&&e.clipboardData.files)?Array.prototype.slice.call(e.clipboardData.files):[]; if(!fs.length) return; var f=fs[0]; if(!(/\.jxl$/i.test(f.name)) && f.type!=='image/jxl'){ alert(S.paste); return; } handleFile(f); });
$('again').onclick=function(){ var r=$('result'),e=$('err'); if(r) r.hidden=true; if(e) e.hidden=true; };
}catch(e){}
try{ detectNative(); }catch(e){}
})();
