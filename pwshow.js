/* =============================================================================
 *  pwshow.js — an eye button inside every password field (sign-in, first-sign-in change, change password)
 *  to show or hide what was typed. Shown passwords are hidden again when the screen changes.
 *  Loaded after photo.js.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, { pwShow: 'إظهار كلمة المرور', pwHide: 'إخفاء كلمة المرور' });
Object.assign(I18N.en, { pwShow: 'Show password', pwHide: 'Hide password' });

function pwPaint(inp, btn, show) {
  inp.type = show ? 'text' : 'password';
  inp.classList.toggle('pw-shown', show);
  btn.innerHTML = ic(show ? 'eye-off' : 'eye');
  btn.title = t(show ? 'pwHide' : 'pwShow');
  btn.setAttribute('aria-label', btn.title);
  btn.setAttribute('aria-pressed', show ? 'true' : 'false');
}
function pwEye(inp) {
  if (!inp || inp.dataset.eye) return;
  inp.dataset.eye = '1';
  ['autocapitalize', 'autocorrect'].forEach(a => inp.setAttribute(a, 'off'));
  inp.spellcheck = false;                                                   // no keyboard suggestions while the password is visible
  const wrap = document.createElement('div'); wrap.className = 'pw-wrap';
  inp.parentNode.insertBefore(wrap, inp); wrap.appendChild(inp);
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pw-eye';
  btn.setAttribute('aria-controls', inp.id);
  btn.addEventListener('mousedown', e => e.preventDefault());              // keep the cursor in the field
  btn.onclick = () => {
    const s = inp.selectionStart, e = inp.selectionEnd, focused = document.activeElement === inp;
    pwPaint(inp, btn, inp.type === 'password');
    if (focused) try { inp.setSelectionRange(s, e); } catch (x) {}
  };
  wrap.appendChild(btn);
  pwPaint(inp, btn, false);
}
function pwEach(fn) { document.querySelectorAll('.pw-wrap').forEach(w => { const i = w.querySelector('input'), b = w.querySelector('.pw-eye'); if (i && b) fn(i, b); }); }
function pwHideAll() { pwEach((i, b) => { if (i.type !== 'password') pwPaint(i, b, false); }); }

document.querySelectorAll('input[type=password]').forEach(pwEye);
// hide again whenever the screen changes (after signing in, saving a new password, signing out …)
const _goPw = go;
go = function (v) { pwHideAll(); return _goPw.apply(this, arguments); };
// … and right after a password change is sent
const _changePinPw = changePin;
changePin = async function () { const r = await _changePinPw.apply(this, arguments); pwHideAll(); return r; };
// button labels follow the language
const _applyI18nPw = applyI18n;
applyI18n = function () { _applyI18nPw(); pwEach((i, b) => pwPaint(i, b, i.type !== 'password')); };
