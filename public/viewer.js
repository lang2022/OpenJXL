(function(){
var lang = (document.currentScript && document.currentScript.dataset.lang) || 'en';
var S = {
en: { running:'Checking JPEG XL support…', native:'This browser can display JPEG XL natively.', wasm:'This browser cannot display JPEG XL natively. Local decoder enabled.', fail:'Could not load the local decoder. Try Chrome, Firefox, Safari, or Edge.', loading:'Decoding on this device…', notjxl:'This does not look like a JPEG XL file.', corrupt:'Could not decode this file. It may be damaged.', animated:'V1 does not support animated JPEG XL.', large:'This image is too large for this browser. Try a smaller file.', multi:'V1 opens one file at a time. Using the first file.', tagline:'Preview JPEG XL (.jxl) locally. Nothing is uploaded.', dropT:'Drop a .jxl file', dropS:'or tap to choose from your files', dropSDesktop:'or click to choose, paste also works', first:'First visit loads a local decoder (~0.9 MB), then works offline for this session.', jpg:'Download JPG', png:'Download PNG', paste:'Please paste a .jxl file, not a decoded image.', frame:'Note: animated images show the first frame only.', hint:'Prefer Chinese? View the Chinese version.', sample:'Try a sample file', batchT:'Batch convert', batchD:'Convert several .jxl files in a row. Files download one by one.', batchPick:'Choose files', batchGoJ:'Convert all to JPG', batchGoP:'Convert all to PNG', batchWait:'Waiting', batchRun:'Working…', batchOk:'Done', batchFail:'Failed', batchClear:'Clear queue', batchCancel:'Cancel', batchOne:'One by one', batchZip:'Single ZIP', batchHintDl:'Tip: your browser may ask permission for multiple downloads — choose Allow.', batchCount:'files', batchCancelled:'Cancelled' },
zh: { running:'正在检测浏览器是否支持 JPEG XL…', native:'当前浏览器可原生显示 JPEG XL。', wasm:'当前浏览器不能原生显示 JPEG XL。已启用本地解码。', fail:'本地解码组件加载失败。请改用 Chrome、Firefox、Safari 或 Edge。', loading:'正在本机解码…', notjxl:'这不像 JPEG XL 文件。', corrupt:'无法解码。文件可能已损坏。', animated:'V1 暂不支持动画 JPEG XL。', large:'图片太大，当前浏览器无法预览。请换更小的文件。', multi:'V1 每次仅打开一个文件，已使用第一份。', tagline:'本地预览 JPEG XL（.jxl）。文件不上传。', dropT:'拖入 .jxl 文件', dropS:'或点此从文件里选择', dropSDesktop:'或点击选择，也可粘贴', first:'首次访问会加载本地解码组件（约 0.9 MB），之后本会话可继续使用。', jpg:'下载 JPG', png:'下载 PNG', paste:'请粘贴 .jxl 文件，而不是已解码的图片', frame:'说明：动画图片仅显示第一帧。', hint:'Prefer English? View the English version.', sample:'试用示例文件', batchT:'批量转换', batchD:'逐个转换多个 .jxl 文件，文件会逐个下载。', batchPick:'选择多个文件', batchGoJ:'全部转 JPG', batchGoP:'全部转 PNG', batchWait:'等待', batchRun:'处理中…', batchOk:'完成', batchFail:'失败', batchClear:'清空队列', batchCancel:'取消', batchOne:'逐个下载', batchZip:'打包 ZIP', batchHintDl:'提示：浏览器可能询问多文件下载权限，请选“允许”。', batchCount:'个文件', batchCancelled:'已取消' },
es: { running:'Comprobando si tu navegador muestra JPEG XL…', native:'Este navegador muestra JPEG XL de forma nativa.', wasm:'Este navegador no muestra JPEG XL de forma nativa. Decodificador local activado.', fail:'No se pudo cargar el decodificador local. Prueba con Chrome, Firefox, Safari o Edge.', loading:'Decodificando en tu dispositivo…', notjxl:'Esto no parece un archivo JPEG XL (.jxl).', corrupt:'No se pudo decodificar. El archivo puede estar dañado.', animated:'La V1 no admite JPEG XL animado. Se muestra el primer fotograma.', large:'Imagen demasiado grande para este navegador. Prueba con una más pequeña (ideal < 30 MP).', multi:'La V1 abre un archivo a la vez. Usando el primero.', tagline:'Previsualiza JPEG XL (.jxl) en tu dispositivo. Nada se sube.', dropT:'Suelta tu .jxl aquí', dropS:'o toca para elegirlo desde tus archivos', dropSDesktop:'o haz clic para elegir, también puedes pegar (Ctrl+V)', first:'La primera visita carga el decodificador local (~0.9 MB); después funciona sin conexión en esta sesión.', jpg:'Descargar JPG', png:'Descargar PNG', paste:'Pega un archivo .jxl, no una imagen ya decodificada.', frame:'Nota: en animados solo se muestra el primer fotograma.', hint:'¿Prefieres español? Ver la versión en español.', sample:'Probar con un ejemplo', batchT:'Conversión por lotes', batchD:'Convierte varios .jxl seguidos. Se descargan uno por uno.', batchPick:'Elegir archivos', batchGoJ:'Todo a JPG', batchGoP:'Todo a PNG', batchWait:'En espera', batchRun:'Procesando…', batchOk:'Listo', batchFail:'Falló', batchClear:'Vaciar cola', batchCancel:'Cancelar', batchOne:'Uno por uno', batchZip:'Un ZIP', batchHintDl:'Aviso: el navegador puede pedir permiso para descargas múltiples. Elige Permitir.', batchCount:'archivos', batchCancelled:'Cancelado' }
}[lang] || {};
function $(id){ return document.getElementById(id); }
function setT(id, v){ var e=$(id); if(e) e.textContent=v; return e; }
setT('tagline2', S.tagline); setT('drop-title', S.dropT); setT('drop-sub', S.dropS);
setT('wasm-note', S.first); setT('loading-t', S.loading); setT('dl-jpg', S.jpg); setT('dl-png', S.png);
var foot = document.getElementById('seo-foot'); if(foot) foot.textContent = lang==='zh' ? 'JPEG XL 是一种图片格式。Open JXL 是本地查看器，与车机摄像头或 Java 库无关。' : lang==='es' ? 'JPEG XL es un formato de imagen. Open JXL es un visor local, no una app de cámara ni una librería Java.' : 'JPEG XL is an image format. Open JXL is a local viewer, not a camera app or Java library.';
(function langHint(){
  try{
    var nav = (navigator.language || '').toLowerCase();
    var bar = document.getElementById('lang-hint');
    if(!bar) return;
    function link(href, txt){ bar.hidden = false; bar.innerHTML = ''; var a = document.createElement('a'); a.href = href; a.textContent = txt; bar.appendChild(a); }
    if(lang === 'en' && nav.indexOf('zh') === 0){ link('/zh/', S.hint); }
    else if(lang === 'en' && nav.indexOf('es') === 0){ link('/es/', S.hint); }
    else if(lang === 'zh' && nav.indexOf('es') === 0){ link('/es/', S.hint); }
    else if(lang === 'es' && nav.indexOf('en') === 0){ link('/', S.hint); }
    else if(lang === 'zh' && nav.indexOf('zh') !== 0 && nav.indexOf('en') === 0){ link('/', S.hint); }
    else if(lang === 'es' && nav.indexOf('es') !== 0){ link('/', S.hint); }
  }catch(e){}
})();
(function touchCopy(){
  try{
    var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if(touch){
      if(lang !== 'es' && S.dropS && S.dropS.indexOf('toca') !== -1){ /* es already touch-first */ }
      setT('drop-sub', S.dropS);
      var kb = document.querySelector('.drop-kbd');
      if(kb) kb.style.display = 'none';
    } else {
      if(S.dropSDesktop) setT('drop-sub', S.dropSDesktop);
    }
    if(touch){ var dropEl=$('drop'); if(dropEl) dropEl.classList.add('touch'); var t=$('drop-title'); if(t) t.textContent = lang==='zh' ? '点此选择 JXL 文件' : lang==='es' ? 'Toca para elegir tu .jxl' : 'Tap to choose your JXL file'; }
  }catch(e){}
})();
(function zoomCtl(){
  try{
    var frame=document.querySelector('.preview-frame'); if(!frame) return;
    var bar=document.getElementById('zoom-bar'); if(!bar) return;
    var z=1; function apply(){ var img=$('preview-img'), c=$('preview'); [img,c].forEach(function(el){ if(!el) return; el.style.transform='scale('+z+')'; el.style.transformOrigin='center'; }); frame.style.overflow='auto'; }
    function btn(id,fn){ var b=document.getElementById(id); if(b) b.onclick=fn; }
    btn('z-in',function(){ z=Math.min(4,z+0.25); apply(); });
    btn('z-out',function(){ z=Math.max(0.25,z-0.25); apply(); });
    btn('z-fit',function(){ z=1; apply(); });
    btn('z-full',function(){ if(frame.requestFullscreen) frame.requestFullscreen(); });
    btn('z-open',function(){ var img=$('preview-img'), c=$('preview'); var url = (img && !img.hidden && img.src) ? img.src : (c ? c.toDataURL('image/png') : null); if(url) window.open(url,'_blank'); });
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
  setTimeout(function(){
    if(mode==='unknown'){
      setStatus(S.fail);
      showErr((S.fail||'Decoder failed.') + ' ', 'LOAD_FAIL');
      var e=$('err'); if(e){ var b=document.createElement('button'); b.className='btn ghost'; b.style.cssText='margin-top:10px'; b.textContent = lang==='zh' ? '重新检测' : lang==='es' ? 'Reintentar' : 'Retry'; b.onclick=function(){ location.reload(); }; e.appendChild(document.createElement('br')); e.appendChild(b); }
    }
  }, 8000);
  function toWasm(){ if(mode!=='unknown') return; mode='wasm'; setStatus(S.wasm); track('detect_wasm'); ensureWorker(); }
}
function ensureWorker(){ if(worker) return worker; try{ worker = new Worker('/jxl-worker.js', {type:'module'}); }catch(e){ setStatus(S.fail); track('detect_fail'); } return worker; }
function showErr(msg, code){ try{ clearInterval(timer); var l=$('loading'); if(l) l.hidden=true; var e=$('err'); if(!e) return; e.hidden=false; e.textContent=msg; }catch(x){} try{ if(window.plausible) window.plausible('preview_fail', {props:{error_code: code || 'UNKNOWN'}}); }catch(x){} }
function safeBase(name){ var n = (name||'image').replace(/\.jxl$/i,''); n = n.replace(/\.[a-z0-9]{1,5}$/i,''); n = n.replace(/[\\/:*?"<>|]+/g,'-').trim() || 'image'; return n.slice(0,80); }
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
    var mp = (w*h/1000000); var mpTxt = mp >= 0.1 ? mp.toFixed(1)+' MP' : (w*h/1000).toFixed(0)+' Kpx';
    var items=[lastName + '.jxl', w + 'x' + h, mpTxt, fmt(size), ms + ' ms', how];
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
    lastName = safeBase(f.name);
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
(function sampleBtn(){
  try{
    var dropEl=$('drop'); if(!dropEl || $('try-sample')) return;
    var b=document.createElement('button'); b.id='try-sample'; b.className='btn ghost'; b.type='button';
    b.style.cssText='margin:14px auto 0'; b.textContent=S.sample||'Try a sample';
    b.onclick=function(ev){ ev.stopPropagation(); fetch('/fixtures/tiny.jxl').then(function(r){ if(!r.ok) throw 0; return r.blob(); }).then(function(bl){ handleFile(new File([bl],'sample.jxl',{type:'image/jxl'})); }).catch(function(){ showErr(S.corrupt,'CORRUPT'); }); };
    dropEl.insertAdjacentElement('afterend', b);
  }catch(e){}
})();
(function batch(){
  try{
    var card=document.querySelector('.tool-card'); if(!card||$('batch')) return;
    var sec=document.createElement('section'); sec.className='card'; sec.id='batch'; sec.style.marginTop='16px';
    var h=document.createElement('h3'); h.textContent=S.batchT||'Batch'; sec.appendChild(h);
    var d=document.createElement('p'); d.style.cssText='color:var(--muted);font-size:14px;margin:6px 0 0'; d.textContent=S.batchD||''; sec.appendChild(d);
    var row=document.createElement('div'); row.className='batch-row';
    var pick=document.createElement('button'); pick.className='btn ghost'; pick.type='button'; pick.textContent=S.batchPick||'Choose';
    var goJ=document.createElement('button'); goJ.className='btn primary'; goJ.type='button'; goJ.textContent=S.batchGoJ||'JPG'; goJ.disabled=true;
    var goP=document.createElement('button'); goP.className='btn ghost'; goP.type='button'; goP.textContent=S.batchGoP||'PNG'; goP.disabled=true;
    var clearB=document.createElement('button'); clearB.className='btn ghost'; clearB.type='button'; clearB.textContent=S.batchClear||'Clear'; clearB.disabled=true;
    var cancelB=document.createElement('button'); cancelB.className='btn ghost'; cancelB.type='button'; cancelB.textContent=S.batchCancel||'Cancel'; cancelB.hidden=true;
    var modeOne=document.createElement('button'); modeOne.className='btn ghost'; modeOne.type='button'; modeOne.textContent='● '+(S.batchOne||'One by one');
    var modeZip=document.createElement('button'); modeZip.className='btn ghost'; modeZip.type='button'; modeZip.textContent='○ '+(S.batchZip||'ZIP');
    var zipMode=false;
    modeOne.onclick=function(){ zipMode=false; modeOne.textContent='● '+(S.batchOne||'One by one'); modeZip.textContent='○ '+(S.batchZip||'ZIP'); };
    modeZip.onclick=function(){ zipMode=true; modeZip.textContent='● '+(S.batchZip||'ZIP'); modeOne.textContent='○ '+(S.batchOne||'One by one'); };
    row.appendChild(pick); row.appendChild(goJ); row.appendChild(goP); row.appendChild(clearB); row.appendChild(cancelB); sec.appendChild(row);
    var row2=document.createElement('div'); row2.className='batch-row'; row2.appendChild(modeOne); row2.appendChild(modeZip); sec.appendChild(row2);
    var count=document.createElement('p'); count.style.cssText='color:var(--muted);font-size:13px;margin:10px 0 0'; sec.appendChild(count);
    var hint=document.createElement('p'); hint.style.cssText='color:var(--muted);font-size:12.5px;margin:4px 0 0'; hint.textContent=S.batchHintDl||''; sec.appendChild(hint);
    var bar=document.createElement('div'); bar.className='batch-bar'; bar.hidden=true; var fill=document.createElement('i'); bar.appendChild(fill); sec.appendChild(bar);
    var ul=document.createElement('ul'); ul.className='batch-list'; sec.appendChild(ul);
    var inp=document.createElement('input'); inp.type='file'; inp.accept='.jxl,image/jxl'; inp.multiple=true; inp.hidden=true; sec.appendChild(inp);
    card.insertAdjacentElement('afterend', sec);
    var queue=[], running=false, cancelled=false;
    function refresh(){
      var n=queue.length, bytes=0, i;
      for(i=0;i<n;i++) bytes+=queue[i].f.size||0;
      count.textContent = n ? (n+' '+(S.batchCount||'files')+' · '+fmt(bytes)) : '';
      var canEdit=!running&&n>0;
      goJ.disabled=!canEdit; goP.disabled=!canEdit; clearB.disabled=!canEdit;
    }
    clearB.onclick=function(){ if(running) return; queue=[]; ul.innerHTML=''; refresh(); };
    cancelB.onclick=function(){ cancelled=true; };
    function blobOf(c,type,q){ return new Promise(function(res,rej){ try{ c.toBlob(function(b){ b?res(b):rej('TOO_LARGE'); },type,q); }catch(e){ rej('TOO_LARGE'); } }); }
    function decBuf(buf){
      return new Promise(function(res,rej){
        if(mode==='native'){
          var url=URL.createObjectURL(new Blob([buf],{type:'image/jxl'})); var img=new Image();
          img.onload=function(){ try{ var c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight; c.getContext('2d').drawImage(img,0,0); URL.revokeObjectURL(url); res(c); }catch(e){ URL.revokeObjectURL(url); rej('TOO_LARGE'); } };
          img.onerror=function(){ URL.revokeObjectURL(url); rej('CORRUPT'); };
          img.src=url; return;
        }
        try{
          ensureWorker(); var w=worker; if(!w) return rej('FAIL');
          var id=Date.now()+Math.random();
          var h2=function(e){ if(e.data.id===id){ w.removeEventListener('message',h2); var r=e.data; if(r.ok){ try{ var c=document.createElement('canvas'); c.width=r.width; c.height=r.height; c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(r.data),r.width,r.height),0,0); res(c); }catch(e){ rej('TOO_LARGE'); } } else rej(r.errorCode||'CORRUPT'); } };
          w.addEventListener('message',h2);
          w.postMessage({id:id,buffer:buf},[buf]);
        }catch(e){ rej('CORRUPT'); }
      });
    }
    pick.onclick=function(){ inp.click(); };
    inp.onchange=function(){
      var fs=Array.prototype.slice.call(inp.files||[]); inp.value='';
      fs.forEach(function(f){
        var li=document.createElement('li');
        var nm=document.createElement('span'); nm.textContent=f.name; li.appendChild(nm);
        var st=document.createElement('span'); st.className='st'; st.textContent=S.batchWait||''; li.appendChild(st);
        var del=document.createElement('button'); del.className='btn ghost'; del.type='button'; del.style.cssText='padding:2px 8px;font-size:12px;min-height:0'; del.textContent='✕'; del.setAttribute('aria-label','Remove');
        li.appendChild(del);
        ul.appendChild(li);
        var item={f:f,st:st,li:li};
        del.onclick=function(){ if(running) return; ul.removeChild(li); queue.splice(queue.indexOf(item),1); refresh(); };
        queue.push(item);
      });
      refresh();
    };
    function crc32(u8){ var t=crc32.t; if(!t){ t=new Uint32Array(256); for(var n=0;n<256;n++){ var c=n; for(var k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; t[n]=c; } crc32.t=t; } var s=0xFFFFFFFF; for(var i=0;i<u8.length;i++) s=t[(s^u8[i])&255]^(s>>>8); return (s^0xFFFFFFFF)>>>0; }
    function makeZip(files){
      var enc=new TextEncoder(), parts=[], central=[], off=0, i;
      function dw(n){ var b=new ArrayBuffer(n); return {v:new DataView(b), u:new Uint8Array(b)}; }
      function pushU(u){ parts.push(u); off+=u.length; }
      files.forEach(function(f){
        var nb=enc.encode(f.name), crc=crc32(f.data), size=f.data.length;
        var lh=dw(30); lh.v.setUint32(0,0x04034b50,true); lh.v.setUint16(4,20,true); lh.v.setUint16(6,0,true);
        lh.v.setUint16(8,0,true); lh.v.setUint16(10,0,true); lh.v.setUint16(12,0,true);
        lh.v.setUint32(14,crc,true); lh.v.setUint32(18,size,true); lh.v.setUint32(22,size,true);
        lh.v.setUint16(26,nb.length,true); lh.v.setUint16(28,0,true);
        var coff=off; pushU(lh.u); pushU(nb); pushU(f.data);
        var ch=dw(46); ch.v.setUint32(0,0x02014b50,true); ch.v.setUint16(4,20,true); ch.v.setUint16(6,20,true);
        ch.v.setUint32(12,crc,true); ch.v.setUint32(16,size,true); ch.v.setUint32(20,size,true);
        ch.v.setUint16(24,nb.length,true); ch.v.setUint32(38,coff,true);
        central.push({h:ch.u,n:nb});
      });
      var coff2=off, csize=0;
      central.forEach(function(c){ parts.push(c.h); parts.push(c.n); csize+=c.h.length+c.n.length; });
      off+=csize;
      var en=dw(22); en.v.setUint32(0,0x06054b50,true); en.v.setUint16(8,central.length,true); en.v.setUint16(10,central.length,true);
      en.v.setUint32(12,csize,true); en.v.setUint32(16,coff2,true);
      parts.push(en.u);
      return new Blob(parts,{type:'application/zip'});
    }
    function runAll(type,q,ext){
      if(running||!queue.length) return;
      running=true; cancelled=false;
      goJ.disabled=true; goP.disabled=true; pick.disabled=true; clearB.disabled=true; cancelB.hidden=false;
      bar.hidden=false; fill.style.width='0%';
      var done=0, collected=[];
      track('batch_start');
      (function next(i){
        if(cancelled){
          for(var k=i;k<queue.length;k++){ queue[k].st.textContent=S.batchCancelled||'Cancelled'; queue[k].st.className='st'; }
          running=false; pick.disabled=false; cancelB.hidden=true; refresh(); track('batch_done'); return;
        }
        if(i>=queue.length){
          if(zipMode&&collected.length) dl(URL.createObjectURL(makeZip(collected)), 'jxl-batch.zip');
          running=false; pick.disabled=false; cancelB.hidden=true; refresh(); track('batch_done'); return;
        }
        var item=queue[i]; item.st.textContent=S.batchRun||'…'; item.st.className='st run';
        item.f.arrayBuffer().then(function(buf){
          if(!looksJXL(buf)) throw 'NOT_JXL';
          return decBuf(buf);
        }).then(function(c){ return blobOf(c,type,q); }).then(function(b){
          track(ext==='jpg'?'export_jpg':'export_png');
          var name=safeBase(item.f.name)+'.'+ext;
          if(zipMode){ return b.arrayBuffer().then(function(ab){ collected.push({name:name,data:new Uint8Array(ab)}); }); }
          dl(URL.createObjectURL(b), name);
        }).then(function(){
          if(!cancelled){ item.st.textContent=S.batchOk||'OK'; item.st.className='st ok'; }
        }).catch(function(code){
          try{ if(window.plausible) window.plausible('preview_fail',{props:{error_code:'BATCH_'+(code||'UNKNOWN')}}); }catch(x){}
          item.st.textContent=(S.batchFail||'Failed'); item.st.className='st err';
        }).then(function(){
          done++; fill.style.width=Math.round(done/queue.length*100)+'%';
          next(i+1);
        });
      })(0);
    }
    goJ.onclick=function(){ runAll('image/jpeg',0.92,'jpg'); };
    goP.onclick=function(){ runAll('image/png',undefined,'png'); };
  }catch(e){}
})();
}catch(e){}
try{ detectNative(); }catch(e){}
})();
