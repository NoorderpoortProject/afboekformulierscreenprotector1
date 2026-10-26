// Netwerk eerst, cache als terugval. Zo landt een nieuwe versie altijd,
// maar werkt de app ook zonder verbinding op de winkelvloer.
const CACHE = "sp-verlies-2026-09-08-een-bestand";
// exceljs en zxing worden pas bij gebruik geladen, maar wel gecached zodat
// het formulier en de scanner ook zonder verbinding werken.
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./diagnose.html",
  "./icon-192.png", "./icon-512.png", "./afboekformulier.xlsx", "./qrcode.min.js"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // API-verkeer nooit cachen
  if (url.hostname.endsWith("supabase.co")) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.status === 200 && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req);
        if (hit) return hit;
        // Alleen bij het openen van een pagina terugvallen op de app zelf.
        // Nooit bij API-verzoeken: die moeten falen, zodat de app zijn
        // offline-modus aanzet in plaats van HTML als data te ontvangen.
        if (req.mode === "navigate") {
          const shell = await caches.match("./index.html");
          if (shell) return shell;
        }
        return Response.error();
      })
  );
});
