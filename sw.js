/* Service worker — caches the app shell so it opens instantly and works offline, and shows phone notifications.
   API calls (script.google.com) are never cached. Bump CACHE on every release. */
const CACHE = 'andalus-platform-v17';
const SHELL = ['./', './index.html', './styles.css?v=20', './icons.js?v=4', './app.js?v=13', './plat.js?v=7', './home.js?v=7', './stage.js?v=3', './emp.js?v=2', './photo.js?v=1', './pwshow.js?v=1', './prog.js?v=1', './notify.js?v=1', './passkey.js?v=1', './cal.js?v=1', './lead.js?v=2', './theme.js?v=1', './dashemp.js?v=1', './i18n.js?v=12', './config.js?v=12', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-192.png', './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png', './icons/favicon-64.png', './icons/school-logo.png', './icons/school-logo-ahliyya.png', './icons/ahliya-mark.png',
  './fonts/ibm-plex-sans-arabic-arabic-400-normal.woff2', './fonts/ibm-plex-sans-arabic-arabic-600-normal.woff2', './fonts/ibm-plex-sans-arabic-arabic-700-normal.woff2',
  './fonts/ibm-plex-sans-arabic-latin-400-normal.woff2', './fonts/ibm-plex-sans-arabic-latin-600-normal.woff2', './fonts/ibm-plex-sans-arabic-latin-700-normal.woff2', './vendor/xlsx.mini.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;           // API & external → network only
  // navigation requests → app shell (so deep links like ?v=dash work offline)
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // static assets → stale-while-revalidate
  e.respondWith(caches.match(req).then(cached => {
    const net = fetch(req).then(r => { if (r && r.ok) caches.open(CACHE).then(c => c.put(req, r.clone())); return r; }).catch(() => cached);
    return cached || net;
  }));
});

// ---------------------------------------------------------------- phone notifications
// The push carries no content: the worker reads the person's own inbox from the API (token kept in IndexedDB
// only when «تذكرني» is on), so nothing private passes through the push service.
const idbGet = k => new Promise(ok => { try { const r = indexedDB.open('andalusPlat1448', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onerror = () => ok(null);
  r.onsuccess = () => { try { const g = r.result.transaction('kv').objectStore('kv').get(k); g.onsuccess = () => ok(g.result || null); g.onerror = () => ok(null); } catch (e) { ok(null); } }; } catch (e) { ok(null); } });
async function showFromInbox() {
  const [tok, cfg] = await Promise.all([idbGet('token'), idbGet('cfg')]);
  const en = cfg && cfg.lang === 'en', opts = { icon: './icons/icon-192.png', badge: './icons/favicon-64.png', lang: en ? 'en' : 'ar', dir: en ? 'ltr' : 'rtl' };
  let items = [];
  if (tok && cfg && cfg.api) {
    try { const r = await fetch(cfg.api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ key: cfg.key, action: 'inbox', token: tok, limit: 6 }) });
      const j = await r.json(); if (j && j.ok) items = j.items.filter(x => !x.read).slice(0, 3); } catch (e) {}
  }
  const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  wins.forEach(c => c.postMessage({ type: 'push' }));
  if (!items.length) return self.registration.showNotification(en ? 'Andalus Platform 1448' : 'منصة الأندلس ١٤٤٨', Object.assign({ body: en ? 'You have a new notification' : 'لديك تنبيه جديد', tag: 'andalus-new', data: {} }, opts));
  for (const it of items) await self.registration.showNotification(it.title, Object.assign({ body: it.body, tag: it.nid, timestamp: Date.parse(it.at) || Date.now(), data: { pid: it.pid || '' } }, opts));
}
self.addEventListener('push', e => { e.waitUntil(showFromInbox()); });
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const pid = (e.notification.data && e.notification.data.pid) || '';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const mine = list.find(c => new URL(c.url).pathname.indexOf(new URL(self.registration.scope).pathname) === 0);
    if (mine) { mine.postMessage({ type: 'open', pid }); return mine.focus(); }
    return self.clients.openWindow('./?' + (pid ? 'prog=' + encodeURIComponent(pid) : 'inbox=1'));
  }));
});
