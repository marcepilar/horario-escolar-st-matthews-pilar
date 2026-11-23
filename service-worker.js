/* MARK-TECH SOFTWARE — St. Matthew’s College Sede Pilar · DEMO NO OFICIAL */
const CACHE_NAME='marktech-horario-st-matthews-pilar-demo-v1.0.0';
const SHELL=[ './', './index.html', './manifest.webmanifest', './version.json',
  './logotipo-st-matthews.png', './escudo-st-matthews.png',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  './apple-touch-icon.png', './favicon-48.png', './qr-horario.png' ];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(SHELL)));});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys
    .filter(k=>k.startsWith('marktech-horario-st-matthews-pilar-demo-')&&k!==CACHE_NAME)
    .map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url),scope=new URL('./',self.location.href);
  if(url.origin!==self.location.origin||!url.pathname.startsWith(scope.pathname))return;
  if(url.pathname.endsWith('/version.json')){
    e.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match('./version.json')));return;
  }
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).catch(()=>caches.match('./index.html')));return;
  }
  e.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
