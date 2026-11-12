/* =============================================================================
 *  back.js — «رجوع»: a back button in the header that returns to the previous page, and the phone's own
 *  back gesture / button doing the same (each page change is a history entry; the program sheet keeps its own).
 *  Also covers one employee's page inside «الموظفون» (back returns to the list). Loaded last.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, { backBtn: 'رجوع', backHome: 'الرئيسية' });
Object.assign(I18N.en, { backBtn: 'Back', backHome: 'Home' });

const NB = { stack: [], quiet: false };                 // pages to return to, newest last
const NB_OUT = ['login', 'loading', 'pwforce'];         // never kept: signing in / forced password change
const nbView = () => ((document.querySelector('.view.on') || {}).id || '').slice(2);
const nbKey = () => { const v = nbView(); return v === 'emp' && typeof E !== 'undefined' && E.row ? 'emp:' + E.row : v; };
const nbOut = k => !k || NB_OUT.includes(k.split(':')[0]);

function nbPush(from) {
  NB.stack.push(from); if (NB.stack.length > 80) NB.stack.shift();
  try { history.pushState({ nb: NB.stack.length }, ''); } catch (e) {}
}
/** after a page change: remember where we came from */
function nbAfter(from) {
  const to = nbKey();
  if (nbOut(to)) NB.stack.length = 0;
  else if (!NB.quiet && to !== from && !nbOut(from)) nbPush(from);
  paintBack();
}
/** show a remembered page without adding a new entry */
function nbShow(key) {
  NB.quiet = true;
  try {
    const [v, row] = key.split(':');
    if (v === 'emp' && typeof E !== 'undefined') { E.row = row || ''; E.tab = 'progs'; E.role = 'all'; E.filter = 'all'; E.ind = ''; }
    go(v);
  } finally { NB.quiet = false; }
  paintBack();
}

const _goNB = go;
go = function (v) { const from = nbKey(); const r = _goNB.apply(this, arguments); nbAfter(from); return r; };

// one employee's page is a step of its own; opening it from another page (e.g. the dashboard card) also switches to «الموظفون»
if (typeof empOpen === 'function') {
  const _empOpenNB = empOpen;
  empOpen = function (row, fromPeople) {
    const from = nbKey();
    const r = _empOpenNB.call(this, row, fromPeople || nbView() !== 'emp');
    if (!fromPeople && from.split(':')[0] === 'emp') nbAfter(from); else paintBack();
    return r;
  };
}

/** the header button: one step back, or Home when there is nothing to go back to */
function goBack() {
  if (typeof PM !== 'undefined' && PM.id) { closeProg(); return; }               // an open program sheet closes first
  if (NB.stack.length) { try { history.back(); return; } catch (e) {} }
  if (nbView() !== 'home') go('home');
}

// the phone's back button / gesture (and the browser's): the program sheet's own entry is handled in prog.js
window.addEventListener('popstate', e => {
  const depth = (e.state && e.state.nb) || 0;
  if (depth >= NB.stack.length) { paintBack(); return; }                          // only the program sheet closed, or a forward step
  let key = null; while (NB.stack.length > depth) key = NB.stack.pop();
  if (key && !nbOut(key) && S.me) nbShow(key); else paintBack();
});

function paintBack() {
  const b = $('backBtn'); if (!b) return;
  const v = nbView(), show = !!S.me && !nbOut(v) && (NB.stack.length > 0 || v !== 'home');
  b.hidden = !show;
  const lbl = t(NB.stack.length ? 'backBtn' : 'backHome');
  b.title = lbl; b.setAttribute('aria-label', lbl); const s = b.querySelector('span'); if (s) s.textContent = t('backBtn');
}

// signing out forgets the way back
const _logoutNB = logout;
logout = function () { NB.stack.length = 0; const r = _logoutNB.apply(this, arguments); paintBack(); return r; };
const _setLangNB = typeof setLang === 'function' ? setLang : null;
if (_setLangNB) setLang = function () { const r = _setLangNB.apply(this, arguments); paintBack(); return r; };
paintBack();
