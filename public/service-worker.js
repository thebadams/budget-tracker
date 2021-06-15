let version = 4

const CACHE_NAME = `cache-v${version}`
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
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log(`${CACHE_NAME} has been opened`)
          cache.addAll(FILES_TO_CACHE)
        }))
  self.skipWaiting();

})

self.addEventListener('activate', function(e) {
  console.log('Service Worker Activated')
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