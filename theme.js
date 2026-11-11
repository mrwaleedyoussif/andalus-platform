/* =============================================================================
 *  theme.js — light / dark / automatic appearance (chosen in «حسابي», remembered on this device).
 *  The page applies the saved choice before it is drawn (small script in <head>). Loaded last.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, { thTitle: '🌗 المظهر', thAuto: 'تلقائي', thLight: 'فاتح', thDark: 'داكن', thHint: '«تلقائي» يتبع إعداد الجهاز.' });
Object.assign(I18N.en, { thTitle: '🌗 Appearance', thAuto: 'Automatic', thLight: 'Light', thDark: 'Dark', thHint: '“Automatic” follows the device setting.' });
const THEME_Q = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
function themeChoice() { return store.get('theme', 'auto'); }
function applyTheme() {
  const c = themeChoice(), dark = c === 'dark' || (c === 'auto' && THEME_Q && THEME_Q.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = dark ? '#0d1b3d' : '#173a86';
  if ((document.querySelector('.view.on') || {}).id === 'v-dash' && typeof drawProgress === 'function') drawProgress(false);
}
function setTheme(c) { store.set('theme', c); applyTheme(); renderThemeCard(); }
if (THEME_Q) { try { THEME_Q.addEventListener('change', () => { if (themeChoice() === 'auto') applyTheme(); }); } catch (e) {} }
function renderThemeCard() {
  const el = meSlot('meTheme'); if (!el) return;
  const c = themeChoice();
  el.innerHTML = `<div class="row between" style="align-items:center;gap:8px"><h3 style="margin:0">${esc(t('thTitle'))}</h3>
    <div class="seg th-seg" role="radiogroup">${[['auto', 'sun-moon', 'thAuto'], ['light', 'sun', 'thLight'], ['dark', 'moon', 'thDark']].map(x => `<button type="button" role="radio" aria-checked="${c === x[0]}" class="${c === x[0] ? 'on' : ''}" onclick="setTheme('${x[0]}')">${ic(x[1])} ${esc(t(x[2]))}</button>`).join('')}</div></div>
    <p class="mini" style="margin:6px 0 0">${esc(t('thHint'))}</p>`;
  ['meTheme', 'mePush', 'mePk'].forEach(id => { const x = $(id); if (x) $('meX').appendChild(x); });
}
const _renderMeTh = renderMe;
renderMe = function () { _renderMeTh(); renderThemeCard(); };
applyTheme();
