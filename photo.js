/* =============================================================================
 *  photo.js — staff photos. Each employee uploads their own picture from «حسابي»; the phone shrinks it
 *  to a small square JPEG before sending. Photos appear in the header, Home, Contacts and the staff tracker,
 *  only for signed-in users. Admins can remove a photo. Loaded after emp.js.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, {
  photoTitle: '👤 صورتي', photoHint: 'تظهر صورتك لزملائك داخل التطبيق فقط. يُفضّل صورة واضحة للوجه بخلفية بسيطة.',
  photoUpload: '📤 رفع صورة', photoChange: '📤 تغيير الصورة', photoDel: 'حذف الصورة', photoSaved: '✅ حُفظت صورتك', photoDeleted: 'حُذفت الصورة',
  photoBadFile: 'اختر ملف صورة (JPG أو PNG)', photoBig: 'تعذّر تصغير الصورة — جرّب صورة أخرى', photoWorking: 'جارٍ تجهيز الصورة…',
  confirmPhotoDel: 'حذف الصورة؟', photoDelOther: 'حذف صورة {n}'
});
Object.assign(I18N.en, {
  photoTitle: '👤 My photo', photoHint: 'Your photo is shown to colleagues inside the app only. A clear face photo on a plain background works best.',
  photoUpload: '📤 Upload a photo', photoChange: '📤 Change photo', photoDel: 'Remove photo', photoSaved: '✅ Your photo is saved', photoDeleted: 'Photo removed',
  photoBadFile: 'Choose an image file (JPG or PNG)', photoBig: 'Could not shrink this picture — try another one', photoWorking: 'Preparing the photo…',
  confirmPhotoDel: 'Remove the photo?', photoDelOther: 'Remove {n}’s photo'
});
Object.assign(I18N.ar.err, { BAD_PHOTO: 'الصورة غير صالحة' });
Object.assign(I18N.en.err, { BAD_PHOTO: 'The picture is not valid' });

S.photos = store.get('photos', { ver: -1, map: {} });
const photoOf = name => (S.photos && S.photos.map && S.photos.map[name]) || '';
/** a round avatar: the photo when there is one, otherwise the initials */
function avatar(name, cls) {
  const src = photoOf(name);
  return src ? `<img class="avatar ph ${cls || ''}" src="${src}" alt="" loading="lazy" decoding="async">` : `<span class="avatar ${cls || ''}">${esc(initials(name))}</span>`;
}
async function syncPhotos(force) {
  if (!S.boot || (!force && (S.boot.photosVer === undefined || S.boot.photosVer === S.photos.ver))) return;
  try { const r = await api('photos'); S.photos = { ver: r.ver, map: r.photos || {} }; store.set('photos', S.photos); repaintPhotos(); } catch (e) {}
}
function repaintPhotos() {
  try { applyRole(); } catch (e) {}
  const on = (document.querySelector('.view.on') || {}).id;
  if (on === 'v-home') renderHome(); else if (on === 'v-emp') renderEmp(); else if (on === 'v-people') renderPeople(); else if (on === 'v-me') renderMePhoto();
}

// ------------------------------------------------------------------ where photos show
const _refreshPhoto = refresh;
refresh = async function (silent) { await _refreshPhoto(silent); syncPhotos(); };
const _applyRolePhoto = applyRole;
applyRole = function () {
  _applyRolePhoto();
  const chip = $('userChip'), src = S.me && photoOf(S.me.name);
  if (chip && src) chip.innerHTML = `<img class="avatar xs ph" src="${src}" alt="">` + esc(chip.textContent.replace(/^\s*👤\s*/, ''));
};
const _renderHomePhoto = renderHome;
renderHome = function () {
  _renderHomePhoto();
  const box = document.querySelector('#v-home .hero-txt'); if (!box || !S.me) return;
  let a = $('homeAvatar'); if (!a) { a = document.createElement('button'); a.id = 'homeAvatar'; a.className = 'hero-av'; a.onclick = () => go('me'); box.prepend(a); }
  a.title = t('photoTitle').replace(/^\S+\s/, ''); a.innerHTML = avatar(myName(), 'big');
};
const _renderMePhoto0 = renderMe;
renderMe = function () { _renderMePhoto0(); renderMePhoto(); };
function renderMePhoto() {
  if (!S.me || !$('mePhoto')) return;
  const has = !!photoOf(myName());
  $('mePhoto').innerHTML = avatar(myName(), 'xl');
  $('photoUpTxt').textContent = t(has ? 'photoChange' : 'photoUpload');
  $('photoDelBtn').hidden = !has;
}

// ------------------------------------------------------------------ upload: square crop + JPEG on the device, then send (≈10–30 KB)
const readAsDataURL = f => new Promise((ok, bad) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = () => bad(new Error(t('photoBadFile'))); r.readAsDataURL(f); });
async function pickPhoto(inp) {
  const f = inp.files && inp.files[0]; inp.value = '';
  if (!f) return;
  if (!/^image\//.test(f.type)) return toast(t('photoBadFile'), 5000);
  if (f.size > 25e6) return toast(t('photoBig'), 5000);
  toast(t('photoWorking'), 20000);
  try {
    const img = new Image(); img.src = await readAsDataURL(f);
    await new Promise((ok, bad) => { if (img.complete && img.naturalWidth) return ok(); img.onload = ok; img.onerror = () => bad(new Error(t('photoBadFile'))); });
    const SIDE = 256, c = document.createElement('canvas'); c.width = c.height = SIDE;
    const g = c.getContext('2d'), w = img.naturalWidth, h = img.naturalHeight, side = Math.min(w, h);
    const sx = (w - side) / 2, sy = Math.max(0, Math.min(h - side, (h - side) * 0.3));   // portraits: keep the upper part (the face)
    g.fillStyle = '#fff'; g.fillRect(0, 0, SIDE, SIDE); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(img, sx, sy, side, side, 0, 0, SIDE, SIDE);
    let q = 0.86, data = c.toDataURL('image/jpeg', q);
    while (data.length > 45000 && q > 0.35) { q -= 0.08; data = c.toDataURL('image/jpeg', q); }
    if (data.length > 45000 || data.indexOf('data:image/jpeg;base64,') !== 0) throw new Error(t('photoBig'));
    const r = await api('setPhoto', { data });
    S.photos.map = Object.assign({}, S.photos.map, { [myName()]: data }); S.photos.ver = r.ver; store.set('photos', S.photos);
    repaintPhotos(); toast(t('photoSaved'), 3000);
  } catch (e) { toast('❌ ' + e.message, 6000); }
}
async function delPhoto(row) {
  const p = row ? (S.boot.people || []).find(x => x.row === row) : null;
  if (!confirm(p ? t('photoDelOther', { n: p.name }) + '؟' : t('confirmPhotoDel'))) return;
  try {
    const r = await api('delPhoto', row ? { row } : {});
    const m = Object.assign({}, S.photos.map); delete m[r.name || myName()]; S.photos = { ver: r.ver, map: m }; store.set('photos', S.photos);
    repaintPhotos(); toast(t('photoDeleted'), 3000);
  } catch (e) { toast('❌ ' + e.message, 6000); }
}
// a shared phone: signing out also forgets the cached photos
const _logoutPhoto = logout;
logout = function (silent) { store.del('photos'); S.photos = { ver: -1, map: {} }; _logoutPhoto(silent); };
