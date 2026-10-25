const V="night-drive-v2";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const same=new URL(r.url).origin===location.origin;
  if(same){ // own files: newest first, cache as backup
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c)).catch(()=>{});return res}).catch(()=>caches.match(r).then(h=>h||caches.match("index.html"))));
  }else{ // CDN: cache first
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c)).catch(()=>{});return res})));
  }
});
