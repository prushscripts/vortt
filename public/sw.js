const CACHE_NAME = "vortt-v1";
const OFFLINE_CACHE = "vortt-offline-v1";

// Core app shell to cache
const SHELL_URLS = [
  "/dashboard",
  "/dispatch",
  "/jobs",
  "/customers",
  "/contracts",
  "/inventory",
  "/invoices",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== OFFLINE_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: "Offline — data will sync when reconnected" }),
          { headers: { "Content-Type": "application/json" }, status: 503 }
        );
      })
    );
    return;
  }

  // Cache-first for navigation
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok && request.method === "GET") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match("/dashboard"));
    })
  );
});

// Background sync for offline job updates
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-jobs") {
    event.waitUntil(syncPendingJobs());
  }
});

async function syncPendingJobs() {
  const cache = await caches.open(OFFLINE_CACHE);
  const requests = await cache.keys();
  for (const request of requests) {
    const cached = await cache.match(request);
    if (cached) {
      const body = await cached.json();
      try {
        await fetch(request, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        await cache.delete(request);
      } catch {
        // Will retry on next sync
      }
    }
  }
}
