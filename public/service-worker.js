let version = 4

const STATIC_CACHE_NAME = `static-cache-v${version}`
const DATA_CACHE_NAME = `data-cache-v${version}`
const FILES_TO_CACHE =[
  "/",
  "/index.html",
  "/styles.css",
  "/manifest.webmanifest",
  "/index.js",
  "/service-worker.js",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png"
]

self.addEventListener('install', function(e) {
  console.log('Service Worker Installed')
   e.waitUntil(
      caches.open(STATIC_CACHE_NAME)
        .then((cache) => {
          console.log(`${STATIC_CACHE_NAME} has been opened`)
          cache.addAll(FILES_TO_CACHE)
        }))
  self.skipWaiting();

})
// listen for activation
self.addEventListener('activate', function(e) {
  console.log('Service Worker Activated')
  //get cache keys, check keys to see if they can be removed
  e.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if(key !== STATIC_CACHE_NAME && key !== DATA_CACHE_NAME ) {
              console.log('Old Cache Being Removed', key)
              return caches.delete(key);
            }
          })
        )
      })
  )
  self.clients.claim()
})
 
// listen for fetches to intercept
self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('/api')) {
    e.respondWith(
      cache.open(DATA_CACHE_NAME)
        .then(cache => {
          return fetch(e.request)
            .then(res => {
              if(res.status === 200) {
                cache.put(e.request.url, res.clone())
              }
              return res
            })
        })
        .catch(err=> {
          return cache.match(e.request);
        })
    )
    .catch(err=> console.log(err))
  }
  e.respondWith(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        return cache.match(e.request)
          .then(res => {
            return response || fetch(e.request);
          })
      })
  )
})
// caches.open(CACHE_NAME)
//   .then(cache=> {
//     console.log(`${CACHE_NAME} Has Been Opened`)
//     cache.add(FILES_TO_CACHE)
//     cache.keys()
//       .then(keys=>{
//         keys.forEach((key)=> {
//           console.log(key)
//         })
//       })
//  })