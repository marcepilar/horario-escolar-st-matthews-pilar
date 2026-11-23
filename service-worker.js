/* Horario Escolar St. Matthew’s DEMO V1.0.1 */
const PREFIX='horario-escolar-st-matthews-v';
const CACHE=PREFIX+'1.0.1';
const CORE=['./','./index.html','./manifest.webmanifest','./version.json',
  './favicon-48.png','./icon-192.png','./icon-512.png','./icon-maskable-512.png',
  './apple-touch-icon.png','./escudo-st-matthews.png','./logotipo-st-matthews.png','./qr-horario.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(req.mode==='navigate'||url.pathname.endsWith('/index.html')){
   e.respondWith(fetch(req).then(response=>{if(response.ok){const clone=response.clone();e.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,clone)));}return response;}).catch(async()=>await caches.match(req)||await caches.match('./index.html')));
   return;
 }
 e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{if(response.ok){const clone=response.clone();e.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,clone)));}return response;})));
});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
