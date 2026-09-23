(function(){
var lang = (document.currentScript && document.currentScript.dataset.lang) || 'en';
var T = lang === 'zh'
  ? { yes: '原生支持：是', no: '原生支持：否（可用本地解码预览）', checking: '检测中' }
  : { yes: 'Native support: YES', no: 'Native support: NO (local decoder available)', checking: 'Checking' };
fetch('/fixtures/tiny.jxl').then(function(r){ if(!r.ok) throw 0; return r.arrayBuffer(); }).then(function(b){
  var u=URL.createObjectURL(new Blob([b],{type:'image/jxl'})); var i=new Image(); var d=false;
  function f(ok){ if(d) return; d=true; URL.revokeObjectURL(u); var el=document.getElementById('s'); if(el) el.textContent = ok ? T.yes : T.no; }
  i.onload=function(){ f(true); }; i.onerror=function(){ f(false); };
  setTimeout(function(){ f(false); },1500); i.src=u;
}).catch(function(){ var el=document.getElementById('s'); if(el) el.textContent=T.no; });
})();
