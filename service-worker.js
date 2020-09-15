/* eslint-disable no-undef */
// service-worker.js

// set LATEST_VERSION in index.html
// const NEW_VERSION = self.LATEST_VERSION
const NEW_VERSION = 'v1.0.10'
workbox.core.setCacheNameDetails({ prefix: 'd4' })
self.addEventListener('activate', event => {
  console.log(`%c ${NEW_VERSION} `, 'background: #ddd; color: #0000ff')
  if (caches) {
    caches.keys().then(arr => {
      arr.forEach(key => {
        if (key.indexOf('d4-precache') < -1) {
          caches
            .delete(key)
            .then(() =>
              console.log(
                `%c Cleared ${key}`,
                'background: #333; color: #ff0000'
              )
            )
        } else {
          caches.open(key).then(cache => {
            cache.match('version').then(res => {
              if (!res) {
                cache.put(
                  'version',
                  new Response(NEW_VERSION, {
                    status: 200,
                    statusText: NEW_VERSION
                  })
                )
              } else if (res.statusText !== NEW_VERSION) {
                caches
                  .delete(key)
                  .then(() =>
                    console.log(
                      `%c Cleared Cache ${NEW_VERSION}`,
                      'background: #333; color: #ff0000'
                    )
                  )
              } else {
                console.log(
                  `%c Great you have the latest version ${NEW_VERSION}`,
                  'background: #333; color: #00ff00'
                )
              }
            })
          })
        }
      })
    })
  }
})

self.skipWaiting()
// self.clientsClaim()

self.__precacheManifest = [].concat(self.__precacheManifest || [])
// workbox.precaching.suppressWarnings()
workbox.precaching.precacheAndRoute(self.__precacheManifest, {})
