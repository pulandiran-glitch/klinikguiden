const CACHE_NAME = 'klinikguiden-v4';
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/vidensbase.html",
  "/hvor-ofte-skal-man-ga-til-tandlaege.html",
  "/hvor-ofte-skal-man-borste-taender.html",
  "/hvilken-tandpasta-er-bedst.html",
  "/er-tandtrad-nodvendigt.html",
  "/hvordan-undgar-man-huller.html",
  "/hvad-er-paradentose.html",
  "/kan-paradentose-helbredes.html",
  "/hvad-er-tandsten.html",
  "/hvorfor-far-man-huller.html",
  "/hvad-er-fluor.html",
  "/hvad-koster-en-rodbehandling.html",
  "/hvad-koster-en-krone.html",
  "/hvad-er-tandrensning.html",
  "/hvad-er-tandkoedsbetaendelse.html",
  "/hvorfor-bloder-tandkodet.html",
  "/hvad-er-visdomstaender.html",
  "/gor-det-ondt-at-fa-en-tand-trukket-ud.html",
  "/hvad-er-en-plastfyldning.html",
  "/hvad-er-forskellen-pa-plast-og-porcelaen.html",
  "/hvad-gor-man-ved-tandlaegeskraek.html",
  "/rodbehandling.html",
  "/regningen.html",
  "/tandlaegeangst.html",
  "/boern.html",
  "/besoegsfrekvens.html",
  "/bedoevelse.html",
  "/hvad-er-caries.html",
  "/hvad-er-en-fyldning.html",
  "/hvor-laenge-holder-en-fyldning.html",
  "/gor-det-ondt-at-fa-lavet-et-hul.html",
  "/kan-et-hul-i-tanden-ga-vaek-af-sig-selv.html",
  "/hvad-er-gingivitis.html",
  "/hvorfor-traekker-tandkodet-sig-tilbage.html",
  "/hvad-koster-en-tandrensning.html",
  "/hvad-koster-en-tandkrone.html",
  "/hvad-er-en-tandkrone.html",
  "/hvornaar-skal-man-have-en-krone.html",
  "/hvad-er-et-tandimplantat.html",
  "/hvad-koster-et-tandimplantat.html",
  "/hvad-koster-en-tandudtraekning.html",
  "/hvornaar-skal-en-tand-fjernes.html",
  "/hvornaar-skal-visdomstaender-fjernes.html",
  "/hvad-maa-man-spise-efter-fjernelse-af-visdomstand.html",
  "/hvor-lang-tid-tager-heling-efter-tandudtraekning.html",
  "/hvad-sker-der-ved-foerste-tandlaegebesoeg.html",
  "/hvorfor-gor-mine-taender-ondt.html",
  "/hvorfor-isner-mine-taender.html",
  "/hvad-gor-man-ved-en-knaekket-tand.html",
  "/hvornar-er-tandpine-akut.html",
  "/hvad-daekker-sygesikringen-hos-tandlaegen.html",
  "/hvorfor-far-boern-huller-i-taenderne.html",
  "/hvornaar-skal-boern-foerste-gang-til-tandlaege.html",
  "/hvad-er-plak.html",
  "/hvordan-laeser-man-et-tandlaegeoverslag.html",
  "/guide-komplette.html",
  "/shop.html",
  "/om-os.html",
  "/tilskudsberegner.html",
  "/kontakt.html",
  "/nyhedsbrev.html",
  "/privatliv.html",
  "/tak.html",
  "/tjekliste_tandlaegebesoeg.pdf",
  "/site.webmanifest",
  "/icon.svg",
  "/analytics.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => key === CACHE_NAME ? null : caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
    return response;
  })));
});
