/* =============================================================================
 *  passkey.js — sign in with the phone's fingerprint / Face ID (passkeys, WebAuthn). Turned on per device
 *  from «حسابي» after a normal sign-in; the fingerprint never leaves the phone — the phone signs a one-time
 *  challenge and the server checks the signature. Loaded after notify.js.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, {
  pkLogin: 'الدخول بالبصمة / Face ID', pkTitle: '🔐 الدخول بالبصمة / Face ID', pkIntro: 'ادخل بلمسة إصبع أو بالوجه بدل كتابة كلمة المرور. تبقى بصمتك على جهازك ولا تُرسل إلى أي مكان.',
  pkAdd: 'تفعيل على هذا الجهاز', pkAdded: '✅ فُعّل الدخول بالبصمة على هذا الجهاز', pkNone: 'غير مفعّل على أي جهاز.', pkDel: 'إزالة', pkConfirmDel: 'إزالة الدخول بالبصمة من «{n}»؟',
  pkUsed: 'آخر استخدام: {d}', pkNever: 'لم يُستخدم بعد', pkNoSupport: 'هذا الجهاز أو المتصفح لا يدعم الدخول بالبصمة.', pkCancel: 'أُلغيت العملية', pkWorking: 'ضع إصبعك أو انظر إلى الكاميرا…',
  pkChoose: 'اختر اسمك أولاً، أو تابع وسيعرض الجهاز الحسابات المحفوظة عليه.'
});
Object.assign(I18N.en, {
  pkLogin: 'Sign in with fingerprint / Face ID', pkTitle: '🔐 Fingerprint / Face ID sign-in', pkIntro: 'Sign in with a touch or a glance instead of typing the password. Your fingerprint stays on your device and is never sent anywhere.',
  pkAdd: 'Turn on for this device', pkAdded: '✅ Fingerprint sign-in is on for this device', pkNone: 'Not turned on for any device.', pkDel: 'Remove', pkConfirmDel: 'Remove fingerprint sign-in from “{n}”?',
  pkUsed: 'Last used: {d}', pkNever: 'Not used yet', pkNoSupport: 'This device or browser does not support fingerprint sign-in.', pkCancel: 'Cancelled', pkWorking: 'Touch the sensor or look at the camera…',
  pkChoose: 'Choose your name first, or continue and the device will show the accounts saved on it.'
});
Object.assign(I18N.ar.err, { PK_FAIL: 'لم يُقبل التحقق بالبصمة — ادخل بكلمة المرور', PK_UNKNOWN: 'هذه البصمة غير مسجّلة في التطبيق — ادخل بكلمة المرور ثم فعّلها من «حسابي»', PK_BAD: 'تعذّر التحقق — أعد المحاولة', PK_ALG: 'نوع المفتاح في هذا الجهاز غير مدعوم', PK_NO_UV: 'يجب التحقق بالبصمة أو الوجه أو رمز الجهاز' });
Object.assign(I18N.en.err, { PK_FAIL: 'Fingerprint check not accepted — sign in with your password', PK_UNKNOWN: 'This passkey is not registered — sign in with your password, then turn it on in “My account”', PK_BAD: 'Could not verify — try again', PK_ALG: 'This device’s key type is not supported', PK_NO_UV: 'Fingerprint, face or device PIN is required' });

const b64u = buf => btoa(String.fromCharCode.apply(null, new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
let PK_OK = false;
(async function () {
  try { PK_OK = !!(window.PublicKeyCredential && window.isSecureContext && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()); } catch (e) { PK_OK = false; }
  const b = $('pkLoginBtn'); if (b) b.hidden = !PK_OK;
})();

async function pkSignIn() {
  if (!PK_OK) return toast(t('pkNoSupport'), 5000);
  const btn = $('pkLoginBtn'); btn.disabled = true;
  try {
    const name = ($('loginName') || {}).value || '';
    const b = await api('pkBegin', { name });
    toast(t('pkWorking'), 30000);
    const cred = await navigator.credentials.get({ publicKey: { challenge: b64uToU8(b.challenge), rpId: b.rpId, timeout: 60000, userVerification: 'required',
      allowCredentials: (b.allow || []).map(id => ({ type: 'public-key', id: b64uToU8(id), transports: ['internal', 'hybrid'] })) } });
    const r = await api('pkLogin', { id: cred.id, clientDataJSON: b64u(cred.response.clientDataJSON), authenticatorData: b64u(cred.response.authenticatorData), signature: b64u(cred.response.signature), userHandle: cred.response.userHandle ? b64u(cred.response.userHandle) : '' });
    toast('', 1);
    await loginDone(r, r.me.name, '');
  } catch (e) {
    toast(e && (e.name === 'NotAllowedError' || e.name === 'AbortError') ? t('pkCancel') : '❌ ' + (e.message || e), 5000);
    if (!S.me) go('login');
  } finally { btn.disabled = false; }
}
async function pkAdd() {
  if (!PK_OK) return toast(t('pkNoSupport'), 5000);
  try {
    const b = await api('pkRegBegin');
    const cred = await navigator.credentials.create({ publicKey: {
      challenge: b64uToU8(b.challenge), rp: { id: b.rpId, name: 'منصة الأندلس ١٤٤٨' },
      user: { id: b64uToU8(b.userId), name: b.userName, displayName: b.userName },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }], timeout: 60000, attestation: 'none',
      authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'preferred', requireResidentKey: false },
      excludeCredentials: (b.exclude || []).map(id => ({ type: 'public-key', id: b64uToU8(id) })) } });
    const res = cred.response;
    if (typeof res.getPublicKey !== 'function' || typeof res.getAuthenticatorData !== 'function') throw new Error(t('pkNoSupport'));
    await api('pkRegFinish', { id: cred.id, clientDataJSON: b64u(res.clientDataJSON), authenticatorData: b64u(res.getAuthenticatorData()), publicKey: b64u(res.getPublicKey()), alg: res.getPublicKeyAlgorithm ? res.getPublicKeyAlgorithm() : -7, label: deviceLabel() });
    toast(t('pkAdded'), 4000); S.x.pk = (S.x.pk || 0) + 1; store.set('xstate', S.x); renderPkCard();
  } catch (e) { toast(e && (e.name === 'NotAllowedError' || e.name === 'AbortError') ? t('pkCancel') : e && e.name === 'InvalidStateError' ? t('pkAdded') : '❌ ' + (e.message || e), 5000); renderPkCard(); }
}
async function pkDel(id, label) {
  if (!confirm(t('pkConfirmDel', { n: label }))) return;
  try { await api('pkDel', { id }); S.x.pk = Math.max(0, (S.x.pk || 1) - 1); store.set('xstate', S.x); renderPkCard(); } catch (e) { toast('❌ ' + e.message, 5000); }
}
async function renderPkCard() {
  const el = meSlot('mePk'); if (!el) return;
  let items = []; try { items = (await api('pkList')).items; } catch (e) {}
  el.innerHTML = `<h3>${esc(t('pkTitle'))}</h3><p class="mini">${esc(t('pkIntro'))}</p>` +
    (items.length ? `<div class="pkl">${items.map(k => `<div class="pkr">${ic('fingerprint')}<div class="grow"><b>${esc(k.label || '—')}</b><div class="mini">${esc(fmtDT(k.at))} · ${esc(k.used ? t('pkUsed', { d: fmtDT(k.used) }) : t('pkNever'))}</div></div><button class="btn sm" onclick="pkDel(${jsq(k.id)},${jsq(k.label || '')})">${esc(t('pkDel'))}</button></div>`).join('')}</div>` : `<p class="meta">${esc(t('pkNone'))}</p>`) +
    (PK_OK ? `<button class="btn p sm" style="margin-top:8px" onclick="pkAdd()">${ic('fingerprint')} ${esc(t('pkAdd'))}</button>` : `<p class="mini warn">${esc(t('pkNoSupport'))}</p>`);
}
const _renderMePk = renderMe;
renderMe = function () { _renderMePk(); renderPkCard(); };
