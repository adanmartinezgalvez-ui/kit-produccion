/* Kit de Producción — service worker.
   Hace que el kit y cada herramienta se puedan instalar como app y abran sin internet.
   - Páginas: primero la red (siempre ves la versión más nueva); sin conexión, la copia guardada.
   - Librerías y tipografías de CDN: se guardan la primera vez y se reutilizan.
   - Los modelos de IA los guarda la propia librería; aquí no se tocan. */
const VERSION = "2026-11-24-1";
const PAGES = "kit-paginas-" + VERSION;
const LIBS = "kit-librerias-v1";
const PRECACHE = ["./", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./foto-3d/", "./foto-3d/manifest.webmanifest", "./foto-3d/icon-192.png", "./quitar-fondo/", "./quitar-fondo/manifest.webmanifest", "./quitar-fondo/icon-192.png", "./subtitulos-automaticos/", "./subtitulos-automaticos/manifest.webmanifest", "./subtitulos-automaticos/icon-192.png", "./cortador-de-silencios/", "./cortador-de-silencios/manifest.webmanifest", "./cortador-de-silencios/icon-192.png", "./escalador-de-video/manifest.webmanifest", "./escalador-de-video/icon-192.png", "./analizador-de-referencias/", "./analizador-de-referencias/manifest.webmanifest", "./analizador-de-referencias/icon-192.png", "./generador-de-preguntas/", "./generador-de-preguntas/manifest.webmanifest", "./generador-de-preguntas/icon-192.png", "./reloj-de-intervencion/", "./reloj-de-intervencion/manifest.webmanifest", "./reloj-de-intervencion/icon-192.png", "./pantalla-de-preguntas/", "./pantalla-de-preguntas/manifest.webmanifest", "./pantalla-de-preguntas/icon-192.png", "./tiempo-de-entrevista/", "./tiempo-de-entrevista/manifest.webmanifest", "./tiempo-de-entrevista/icon-192.png", "./planta-de-entrevista/", "./planta-de-entrevista/manifest.webmanifest", "./planta-de-entrevista/icon-192.png", "./autorizacion-de-imagen/", "./autorizacion-de-imagen/manifest.webmanifest", "./autorizacion-de-imagen/icon-192.png", "./citas-destacadas/", "./citas-destacadas/manifest.webmanifest", "./citas-destacadas/icon-192.png", "./plantillas-de-entrevista/", "./plantillas-de-entrevista/manifest.webmanifest", "./plantillas-de-entrevista/icon-192.png", "./claqueta-digital/", "./claqueta-digital/manifest.webmanifest", "./claqueta-digital/icon-192.png", "./teleprompter/", "./teleprompter/manifest.webmanifest", "./teleprompter/icon-192.png", "./bitacora-de-rodaje/", "./bitacora-de-rodaje/manifest.webmanifest", "./bitacora-de-rodaje/icon-192.png", "./checklist-de-equipo/", "./checklist-de-equipo/manifest.webmanifest", "./checklist-de-equipo/icon-192.png", "./pantalla-de-luz/", "./pantalla-de-luz/manifest.webmanifest", "./pantalla-de-luz/icon-192.png", "./hoja-de-llamado/", "./hoja-de-llamado/manifest.webmanifest", "./hoja-de-llamado/icon-192.png", "./cotizador-de-video/", "./cotizador-de-video/manifest.webmanifest", "./cotizador-de-video/icon-192.png", "./hora-dorada/", "./hora-dorada/manifest.webmanifest", "./hora-dorada/icon-192.png", "./calculadora-de-almacenamiento/", "./calculadora-de-almacenamiento/manifest.webmanifest", "./calculadora-de-almacenamiento/icon-192.png", "./profundidad-de-campo/", "./profundidad-de-campo/manifest.webmanifest", "./profundidad-de-campo/icon-192.png", "./calculadora-de-timelapse/", "./calculadora-de-timelapse/manifest.webmanifest", "./calculadora-de-timelapse/icon-192.png", "./locucion-a-tiempo/", "./locucion-a-tiempo/manifest.webmanifest", "./locucion-a-tiempo/icon-192.png", "./taller-de-cintillos/", "./taller-de-cintillos/manifest.webmanifest", "./taller-de-cintillos/icon-192.png", "./miniaturas-para-youtube/", "./miniaturas-para-youtube/manifest.webmanifest", "./miniaturas-para-youtube/icon-192.png", "./recortador-para-redes/", "./recortador-para-redes/manifest.webmanifest", "./recortador-para-redes/icon-192.png", "./marca-de-agua-en-lote/", "./marca-de-agua-en-lote/manifest.webmanifest", "./marca-de-agua-en-lote/icon-192.png", "./qr-con-logo/", "./qr-con-logo/manifest.webmanifest", "./qr-con-logo/icon-192.png", "./paleta-de-una-foto/", "./paleta-de-una-foto/manifest.webmanifest", "./paleta-de-una-foto/icon-192.png", "./simulador-de-exposicion/", "./simulador-de-exposicion/manifest.webmanifest", "./simulador-de-exposicion/icon-192.png", "./quiz-de-foto-y-video/", "./quiz-de-foto-y-video/manifest.webmanifest", "./quiz-de-foto-y-video/icon-192.png", "./ruleta-de-retos/", "./ruleta-de-retos/manifest.webmanifest", "./ruleta-de-retos/icon-192.png", "./antes-y-despues/", "./antes-y-despues/manifest.webmanifest", "./antes-y-despues/icon-192.png", "./constancias-en-lote/", "./constancias-en-lote/manifest.webmanifest", "./constancias-en-lote/icon-192.png", "./mockup-en-perspectiva/", "./mockup-en-perspectiva/manifest.webmanifest", "./mockup-en-perspectiva/icon-192.png", "./rescate-de-fotos/manifest.webmanifest", "./rescate-de-fotos/icon-192.png", "./scouting-de-locaciones/", "./scouting-de-locaciones/manifest.webmanifest", "./scouting-de-locaciones/icon-192.png", "./banco-de-transiciones/", "./banco-de-transiciones/manifest.webmanifest", "./banco-de-transiciones/icon-192.png"];
const CDN = /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)\//;
const BASE = new URL("./", self.location).href;

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(PAGES);
    // De a uno, para que una página que falle no impida instalar las demás
    await Promise.all(PRECACHE.map((u) => c.add(new Request(new URL(u, BASE), { cache: "reload" })).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("kit-paginas-") && k !== PAGES) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function fromNetworkFirst(req) {
  const c = await caches.open(PAGES);
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 6000);
    const res = await fetch(req, { signal: ctl.signal });
    clearTimeout(t);
    if (res.ok) c.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === "navigate") {
      return new Response(
        '<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Sin conexión</title>' +
        '<body style="font:16px -apple-system,sans-serif;padding:32px;max-width:520px;margin:auto;background:#f3f2ef;color:#191a1c">' +
        "<h1>Sin conexión</h1><p>Esta herramienta todavía no estaba guardada en este equipo. Ábrela una vez con internet y después funcionará sin conexión.</p>" +
        '<p><a href="' + BASE + '">Volver al kit</a></p>',
        { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
    throw err;
  }
}

async function fromCacheFirst(req) {
  const c = await caches.open(LIBS);
  const hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === "opaque") c.put(req, res.clone()).catch(() => {});
  return res;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = req.url;
  if (url.startsWith(BASE)) { e.respondWith(fromNetworkFirst(req)); return; }
  if (CDN.test(url) && !/\.(onnx|bin|safetensors)(\?|$)/.test(url)) { e.respondWith(fromCacheFirst(req)); return; }
});
