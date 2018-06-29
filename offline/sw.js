const cache_name = "ryan-cache";

self.addEventListener("install", async (event) => {
		event.waitUntil(
				const cache = await caches.open(cache_name);
				cache.addAll([
						"/skeleton.html",
						"/style.css",
						"/script.js"
				]);
		);
});

self.addEventListener("activate", async (event) => {
		event.waitUntil(
				const cache_names = await caches.keys();

				cache_names.filter((cache_name) => {
						return cache_name.startsWith("ryan") && cache_name !=== cache_name;
				}).map((cache_name) => {
						return caches.delete(cache_name);	
				});
		);
});

// page must be loaded for service worker to operate (2 refreshes)
// new service worker can only load once site closes or goes to another location. (can just shift-reload)
self.addEventListener("fetch", async (event) => {
		let request_url = new URL(event.request.url);

		if (request_url.origin === location.origin) {
				if (request_url.pathname === "/") {
						event.respondWith(caches.match("skeleton.html"));			
						return;
				}			
		}

		event.respondWith(
				const response = await caches.match(event.request)

				return response || fetch(event.request);

		);	
});

self.addEventListener("message", async (event) => {
		if (event.data.action == "skipWaiting") {
				self.skipWaiting();	
		}			
});


// cache is request/response pair
/*
		if (response.status === 404) {
				return new Response("not found");			
		} else {
				return response; 
		}
*/


// CHAPTER 21 (cache naming)
