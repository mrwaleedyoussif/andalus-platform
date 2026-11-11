/* =============================================================================
 *  notify.js — the bell and the notifications inbox; phone notifications (Web Push, enabled per device
 *  from «حسابي»); and offline changes: saved on the device and sent when the connection returns.
 *  Loaded after prog.js.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, {
  inboxTitle: 'الإشعارات', inboxReadAll: 'تعليم الكل كمقروء', inboxNone: 'لا توجد إشعارات.', navInbox: 'الإشعارات', tInbox: 'الإشعارات', tInboxD: 'التنبيهات والتعليقات والاعتمادات',
  today: 'اليوم', yesterday: 'أمس',
  pushTitle: '🔔 تنبيهات الجوال', pushIntro: 'تصلك على هذا الجهاز حتى والتطبيق مغلق: طلبات الاعتماد، التعليقات، البرامج المسندة إليك، وتذكير يومي بما يبدأ أو ينتهي غداً.',
  pushOn: 'مفعّلة على هذا الجهاز', pushOff: 'غير مفعّلة على هذا الجهاز', pushEnable: 'تفعيل التنبيهات', pushDisable: 'إيقاف', pushTest: 'إرسال تنبيه تجريبي',
  pushDenied: 'التنبيهات محظورة في إعدادات المتصفح لهذا الموقع — اسمح بها من إعدادات المتصفح ثم أعد المحاولة.', pushNoSupport: 'هذا المتصفح لا يدعم تنبيهات الجوال. على iPhone: ثبّت التطبيق على الشاشة الرئيسية أولاً (iOS 16.4 أو أحدث).',
  pushDone: '✅ فُعّلت التنبيهات', pushStopped: 'أُوقفت التنبيهات على هذا الجهاز', pushSent: '✅ أُرسل — يصلك خلال ثوانٍ', pushNeedRemember: 'لعرض تفاصيل التنبيه والتطبيق مغلق فعّل «تذكرني على هذا الجهاز» عند الدخول.',
  offline: '📴 غير متصل بالإنترنت — تُعرض آخر بيانات محفوظة، وتُحفظ تعديلاتك على الجهاز وتُرسل عند عودة الاتصال.',
  outQueued: '💾 حُفظ على الجهاز — سيُرسل عند عودة الاتصال', outBar: '{n} تعديل محفوظ على الجهاز بانتظار الاتصال', outSend: 'إرسال الآن', outSent: '✅ أُرسلت التعديلات المحفوظة ({n})', outFail: 'تعذّر إرسال التعديلات المحفوظة: {m}'
});
Object.assign(I18N.en, {
  inboxTitle: 'Notifications', inboxReadAll: 'Mark all as read', inboxNone: 'No notifications.', navInbox: 'Notifications', tInbox: 'Notifications', tInboxD: 'Reminders, comments and approvals',
  today: 'Today', yesterday: 'Yesterday',
  pushTitle: '🔔 Phone notifications', pushIntro: 'Arrive on this device even when the app is closed: approval requests, comments, programs assigned to you, and a daily reminder of what starts or ends tomorrow.',
  pushOn: 'On for this device', pushOff: 'Off for this device', pushEnable: 'Turn on notifications', pushDisable: 'Turn off', pushTest: 'Send a test notification',
  pushDenied: 'Notifications are blocked for this site in the browser settings — allow them there, then try again.', pushNoSupport: 'This browser does not support phone notifications. On iPhone, install the app on the Home Screen first (iOS 16.4 or later).',
  pushDone: '✅ Notifications are on', pushStopped: 'Notifications are off for this device', pushSent: '✅ Sent — it arrives in a few seconds', pushNeedRemember: 'To see the details while the app is closed, tick “Remember me on this device” when signing in.',
  offline: '📴 You are offline — showing the last saved data. Your changes are kept on the device and sent when the connection returns.',
  outQueued: '💾 Saved on the device — it will be sent when the connection returns', outBar: '{n} change(s) saved on the device, waiting for a connection', outSend: 'Send now', outSent: '✅ Saved changes sent ({n})', outFail: 'Could not send the saved changes: {m}'
});

// ------------------------------------------------------------------ the bell
function paintBell() {
  const b = $('bellBtn'), n = $('bellN'); if (!b) return;
  b.hidden = !S.me || !!S.mustChange; const u = +(S.x && S.x.unread) || 0;
  n.hidden = !u; n.textContent = u > 99 ? '99+' : String(u);
  b.setAttribute('aria-label', t('inboxTitle') + (u ? ' (' + u + ')' : ''));
}
const _applyRoleN = applyRole;
applyRole = function () { _applyRoleN(); paintBell(); };
let INBOX = [];
const KIND_IC = { approval: 'badge-check', approved: 'circle-check', rejected: 'undo-2', comment: 'message-circle', assign: 'arrow-right-left', remind: 'alarm-clock', test: 'bell-ring' };
async function renderInbox() {
  const box = $('inboxList'); if (!box) return; box.innerHTML = `<p class="mini">${esc(t('xLoading'))}</p>`;
  try {
    const r = await api('inbox', { limit: 100 }); INBOX = r.items; S.x.unread = r.unread; store.set('xstate', S.x); paintBell();
    const day = iso => { const d = new Date(iso), k = d.toDateString(), n = new Date(); const y = new Date(n); y.setDate(n.getDate() - 1); return k === n.toDateString() ? t('today') : k === y.toDateString() ? t('yesterday') : d.toLocaleDateString(EN() ? 'en-GB' : 'ar-SA-u-ca-gregory-nu-latn', { weekday: 'long', day: 'numeric', month: 'long' }); };
    let last = '', h = '';
    INBOX.forEach(x => { const d = day(x.at); if (d !== last) { h += `<div class="ibday">${esc(d)}</div>`; last = d; }
      h += `<button class="ib ${x.read ? '' : 'un'}" onclick="inboxOpen(${jsq(x.nid)})"><span class="ibic k-${esc(x.kind)}">${ic(KIND_IC[x.kind] || 'bell')}</span><span class="grow"><b>${esc(x.title)}</b><span class="ibb">${esc(x.body)}</span><span class="mini">${new Date(x.at).toLocaleTimeString(EN() ? 'en-GB' : 'ar-SA-u-nu-latn', { hour: '2-digit', minute: '2-digit' })}</span></span></button>`; });
    box.innerHTML = h || `<p class="meta">${esc(t('inboxNone'))}</p>`;
  } catch (e) { box.innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; }
}
async function inboxOpen(nid) {
  const x = INBOX.find(i => i.nid === nid); if (!x) return;
  if (!x.read) { x.read = true; S.x.unread = Math.max(0, (S.x.unread || 0) - 1); paintBell(); api('inboxRead', { nid }).then(r => { S.x.unread = r.unread; paintBell(); }).catch(() => {}); const el = document.querySelector(`.ib[onclick*='${nid}']`); if (el) el.classList.remove('un'); }
  if (x.pid && progOf(x.pid)) openProg(x.pid, x.kind === 'approval' ? 'ap' : x.kind === 'comment' ? 'cm' : 'ev');
  else if (x.kind === 'remind') { S.filter = 'soon'; go('mine'); }
}
async function inboxReadAll() { try { const r = await api('inboxRead', { all: true }); S.x.unread = r.unread; paintBell(); renderInbox(); } catch (e) { toast('❌ ' + e.message, 5000); } }
const _goN = go;
go = function (v) { _goN(v); if (v === 'inbox' && S.me) renderInbox(); };
TILES.splice(TILES.findIndex(x => x[0] === 'me'), 0, ['inbox', 'bell', 'tInbox', 'tInboxD']);
const _renderHomeN = renderHome;
renderHome = function () { _renderHomeN(); const b = document.querySelector(`#homeTiles .htile[onclick="go('inbox')"]`); if (b && S.x.unread) b.insertAdjacentHTML('beforeend', `<span class="tbdg">${S.x.unread}</span>`); };
// a light check every 2 minutes while the app is open
setInterval(async () => {
  if (!S.me || !S.online || document.visibilityState !== 'visible' || S.mustChange) return;
  try { const r = await api('inbox', { limit: 1 }); if (r.unread !== S.x.unread) { S.x.unread = r.unread; store.set('xstate', S.x); paintBell(); } } catch (e) {}
}, 120000);

// ------------------------------------------------------------------ phone notifications (Web Push)
// The service worker reads the inbox itself when a push arrives, so it needs the session token: kept in IndexedDB
// only when «تذكرني» is on (a shared phone keeps nothing).
const IDB = {
  db: null,
  open() { return this.db || (this.db = new Promise((ok, bad) => { const r = indexedDB.open('andalusPlat1448', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => ok(r.result); r.onerror = () => bad(r.error); })); },
  async set(k, v) { try { const db = await this.open(); await new Promise(ok => { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = ok; tx.onerror = ok; }); } catch (e) {} },
  async del(k) { try { const db = await this.open(); await new Promise(ok => { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').delete(k); tx.oncomplete = ok; tx.onerror = ok; }); } catch (e) {} }
};
function idbSync() {
  if (!('indexedDB' in window)) return;
  IDB.set('cfg', { api: CONFIG.API_URL, key: CONFIG.APP_KEY, lang: S.lang });
  if (S.token && REMEMBER) IDB.set('token', S.token); else IDB.del('token');
}
const _refreshN = refresh;
refresh = async function (silent) { await _refreshN(silent); idbSync(); flushOutbox(); };
const _logoutN = logout;
logout = function (silent) { IDB.del('token'); store.del('outbox'); paintOut(); _logoutN(silent); };
const pushOK = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const b64uToU8 = s => { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; const b = atob(s), u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
const swReady = () => Promise.race([navigator.serviceWorker.ready, new Promise((_, bad) => setTimeout(() => bad(new Error(t('pushNoSupport'))), 4000))]);
async function pushSubNow() { if (!pushOK()) return null; const reg = await swReady(); return reg.pushManager.getSubscription(); }
async function pushEnable() {
  if (!pushOK()) return toast(t('pushNoSupport'), 7000);
  try {
    const perm = await Notification.requestPermission(); if (perm !== 'granted') return toast(t('pushDenied'), 8000);
    if (!S.x.vapid) await syncX();
    const reg = await swReady();
    let sub = await reg.pushManager.getSubscription();
    if (sub && S.x.vapid) { const k = sub.options && sub.options.applicationServerKey; if (k && btoa(String.fromCharCode.apply(null, new Uint8Array(k))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') !== S.x.vapid) { await sub.unsubscribe(); sub = null; } }
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToU8(S.x.vapid) });
    await api('pushSub', { sub: sub.toJSON(), device: deviceLabel() }); idbSync();
    S.x.push = (S.x.push || 0) + 1; store.set('xstate', S.x); toast(t('pushDone'), 3500); renderPushCard();
  } catch (e) { toast('❌ ' + (e.message || e), 7000); }
}
async function pushDisable() {
  try { const sub = await pushSubNow(); if (sub) { await api('pushUnsub', { endpoint: sub.endpoint }); await sub.unsubscribe(); } toast(t('pushStopped'), 3000); renderPushCard(); } catch (e) { toast('❌ ' + e.message, 6000); }
}
async function pushTest() { try { await api('pushTest'); toast(t('pushSent'), 4000); } catch (e) { toast('❌ ' + e.message, 6000); } }
function deviceLabel() { const u = navigator.userAgent; return /iPhone/.test(u) ? 'iPhone' : /iPad/.test(u) ? 'iPad' : /Android/.test(u) ? 'Android' : /Windows/.test(u) ? 'Windows' : /Mac/.test(u) ? 'Mac' : 'Browser'; }
function meSlot(id) { const box = $('meX'); if (!box) return null; let el = $(id); if (!el) { el = document.createElement('div'); el.id = id; el.className = 'card'; box.appendChild(el); } return el; }
async function renderPushCard() {
  const el = meSlot('mePush'); if (!el) return;
  ['meTheme', 'mePush', 'mePk'].forEach(id => { const x = $(id); if (x) $('meX').appendChild(x); });   // fixed order
  el.innerHTML = `<h3>${esc(t('pushTitle'))}</h3><p class="mini">${esc(t('pushIntro'))}</p><p class="mini">${esc(t('xLoading'))}</p>`;
  let on = false; try { on = !!(await pushSubNow()) && Notification.permission === 'granted'; } catch (e) {}
  el.innerHTML = `<h3>${esc(t('pushTitle'))}</h3><p class="mini">${esc(t('pushIntro'))}</p>` +
    (!pushOK() ? `<p class="mini warn">${esc(t('pushNoSupport'))}</p>` :
      `<div class="row" style="gap:8px;align-items:center"><span class="pill ${on ? 'on' : ''}">${esc(t(on ? 'pushOn' : 'pushOff'))}</span>${on ? `<button class="btn sm" onclick="pushTest()">${esc(t('pushTest'))}</button><button class="btn sm" onclick="pushDisable()">${esc(t('pushDisable'))}</button>` : `<button class="btn p sm" onclick="pushEnable()">${ic('bell-ring')} ${esc(t('pushEnable'))}</button>`}</div>` +
      (on && !REMEMBER ? `<p class="mini" style="margin-top:6px">${esc(t('pushNeedRemember'))}</p>` : ''));
}
const _renderMeN = renderMe;
renderMe = function () { _renderMeN(); renderPushCard(); };

// open a program / the inbox from a notification (the service worker sends a message, or opens ?prog=…)
function openFromLink(pid) { if (!S.me) return; if (pid && progOf(pid)) openProg(pid); else go('inbox'); }
if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', e => { const d = e.data || {}; if (d.type === 'open') openFromLink(d.pid); if (d.type === 'push') syncX(); });
(function () {
  const q = new URLSearchParams(location.search), pid = q.get('prog'), ib = q.get('inbox');
  if (!pid && !ib) return;
  try { history.replaceState(null, '', location.pathname); } catch (e) {}
  let n = 0; const tm = setInterval(() => { n++; if (S.me && S.programs && S.programs.length) { clearInterval(tm); openFromLink(pid); } else if (n > 40) clearInterval(tm); }, 300);
})();

// ------------------------------------------------------------------ offline changes
function outbox() { return store.get('outbox', []); }
function paintOut() {
  const bar = $('outBar'); if (!bar) return; const n = outbox().length;
  bar.hidden = !n || !S.me;
  if (n) bar.innerHTML = `${ic('cloud-off')} <span>${esc(t('outBar', { n }))}</span>${S.online ? `<button class="btn sm" onclick="flushOutbox(true)">${esc(t('outSend'))}</button>` : ''}`;
}
function applyLocal(list) {
  const all = allProgs();
  list.forEach(it => { const p = all.find(x => String(x.id) === String(it.id)); if (!p) return;
    ['start', 'end', 'status', 'pct', 'presp', 'evid', 'notes'].forEach(k => { if (k in it) p[k] = it[k]; });
    if (p.status === 'مكتمل') p.pct = 100; else if (p.status === 'لم يبدأ') p.pct = 0; p.upd = t('outQueued').replace(/^\S+\s/, '').split('—')[0].trim(); });
  S.programs = all; store.set('tr_cache', { boot: S.boot, programs: all, at: S.loadedAt });
}
const isNetErr = e => !S.online || [t('netNone'), t('netFail'), t('netTimeout')].includes(e && e.message);
const _persistN = persist;
persist = async function (list) {
  if (!S.online) { queueOut(list); return; }
  try { const res = await api('saveMany', { list }); return finishSave(res); }
  catch (e) { if (isNetErr(e)) { queueOut(list); return; } toast('❌ ' + e.message, 6000); }
};
async function finishSave(res) {
  const fresh = await api('programs'); S.programs = fresh.programs; S.loadedAt = fresh.at; S.dash = null;
  store.set('tr_cache', { boot: S.boot, programs: S.programs, at: S.loadedAt });
  const nPend = (res.pending || []).length;
  toast(nPend ? t('xSentForApproval', { n: nPend }) : t('saved', { n: res.changed }), nPend ? 6000 : 2600);
  const v = document.querySelector('.view.on').id.slice(2); go(v); syncX();
}
function queueOut(list) {
  const q = outbox(); list.forEach(it => q.push(Object.assign({}, it, { _at: Date.now() }))); store.set('outbox', q);
  applyLocal(list); toast(t('outQueued'), 4000); paintOut();
  const v = document.querySelector('.view.on').id.slice(2); go(v);
}
let FLUSHING = false;
async function flushOutbox(manual) {
  const q = outbox(); if (!q.length || !S.online || !S.me || FLUSHING) { paintOut(); return; }
  FLUSHING = true;
  const merged = {}; q.forEach(it => { const k = String(it.id); merged[k] = Object.assign(merged[k] || {}, it); delete merged[k]._at; });
  try {
    const res = await api('saveMany', { list: Object.values(merged) });
    store.set('outbox', []); paintOut();
    toast(t('outSent', { n: Object.keys(merged).length }), 4000);
    const fresh = await api('programs'); S.programs = fresh.programs; S.loadedAt = fresh.at; S.dash = null; store.set('tr_cache', { boot: S.boot, programs: S.programs, at: S.loadedAt });
    const on = document.querySelector('.view.on'); if (on) go(on.id.slice(2)); syncX();
    if ((res.pending || []).length) toast(t('xSentForApproval', { n: res.pending.length }), 6000);
  } catch (e) { if (!isNetErr(e)) { store.set('outbox', []); toast(t('outFail', { m: e.message }), 8000); } paintOut(); }
  finally { FLUSHING = false; }
}
window.addEventListener('online', () => setTimeout(() => flushOutbox(), 1500));
window.addEventListener('offline', paintOut);
setTimeout(paintOut, 500);
