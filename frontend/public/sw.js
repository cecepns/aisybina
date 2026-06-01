const CACHE_NAME = "aisybina-export-v3";
const PRECACHE = ["/", "/index.html", "/logo.png", "/manifest.webmanifest"];

function isHttpRequest(request) {
  const url = new URL(request.url);
  return url.protocol === "http:" || url.protocol === "https:";
}

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

/** Never cache Vite dev modules or hashed JS/CSS — prevents duplicate React chunks. */
function shouldBypassCache(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (url.search && (path.includes("/assets/") || path.endsWith(".js") || path.endsWith(".css"))) {
    return true;
  }
  if (
    path.includes("/@") ||
    path.includes("/node_modules/") ||
    path.includes("/src/") ||
    path.startsWith("/@vite") ||
    path.startsWith("/@react-refresh")
  ) {
    return true;
  }
  return false;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || caches.match("/index.html");
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || !isHttpRequest(request) || !isSameOrigin(request)) {
    return;
  }

  if (shouldBypassCache(request)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  const url = new URL(request.url);
  const isPrecached = PRECACHE.includes(url.pathname);

  if (isPrecached) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // All other requests: network only (no aggressive caching)
});
