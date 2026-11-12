/* =============================================================================
 *  stage.js — one stage selector for the whole app: ابتدائي أهلي · ابتدائي عالمي · متوسط عالمي · الكل
 *  The chosen stage filters the indicators, every program list, Home, the dashboard and the platform
 *  sections, and is remembered on this device. Loaded after home.js.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, { stageLbl: 'المرحلة', stageAll: 'الكل', stageOnly: 'المعروض الآن: {s} فقط', stageLocked: 'المرحلة محددة من قائمة «المرحلة» أعلى الصفحة' });
Object.assign(I18N.en, { stageLbl: 'Stage', stageAll: 'All', stageOnly: 'Showing {s} only', stageLocked: 'The stage is set by the “Stage” list at the top of the page' });

const STAGE_VIEWS = ['home', 'ind', 'mine', 'quick', 'all', 'dash', 'plat', 'emp'];
S.stage = store.get('stage', '');                     // a program stage label, e.g. «ابتدائي بنين (أهلي)»; '' = all stages
S.stageActive = true;
const inStage = p => !S.stage || stNorm(p.stage) === stNorm(S.stage);
const modelStage = s => { if (!s) return ''; const m = (P.model && P.model.stages) || KEEP_LABELS; return m.find(x => stNorm(x) === stNorm(s)) || String(s).replace(/[()]/g, '').replace(/\s+/g, ' ').trim(); };
const KEEP_LABELS = ['ابتدائي بنين أهلي', 'ابتدائي بنين عالمي', 'متوسط بنين عالمي'];
const stageName = s => s ? stShort(String(s).replace(/[()]/g, '').replace(/\s+/g, ' ').trim()) : t('stageAll');
function stageOkBlock(label) { return !S.stage || !S.stageActive || stNorm(label) === stNorm(S.stage); }

// S.programs becomes a stage-filtered view of the full list (people / send centre / account always see everything)
(function () {
  let all = S.programs || [], memo = null;
  Object.defineProperty(S, 'programs', {
    configurable: true, enumerable: true,
    get() { if (!S.stage || !S.stageActive) return all; if (memo && memo.src === all && memo.k === S.stage) return memo.list; memo = { src: all, k: S.stage, list: all.filter(inStage) }; return memo.list; },
    set(v) { all = Array.isArray(v) ? v : []; memo = null; }
  });
})();

// ------------------------------------------------------------------ the drop-down
function fillStageSel() {
  const sel = $('stageSel'); if (!sel || !S.boot) return;
  const stages = S.boot.stages || [];
  if (S.stage && !stages.some(s => stNorm(s) === stNorm(S.stage))) S.stage = '';
  sel.innerHTML = stages.map(s => `<option value="${esc(s)}">${esc(stageName(s))}</option>`).join('') + `<option value="">${esc(t('stageAll'))}</option>`;
  sel.value = S.stage || '';
  paintStageBar();
}
function paintStageBar() {
  const bar = $('stageBar'); if (!bar) return;
  bar.classList.toggle('filtered', !!S.stage);
  $('stageNote').textContent = S.stage ? t('stageOnly', { s: stageName(S.stage) }) : '';
}
function syncStageFilters() {
  const f = $('fStage'), q = $('qStage');
  if (f) { f.value = S.stage || ''; f.disabled = !!S.stage; f.title = S.stage ? t('stageLocked') : ''; }
  if (q && S.stage) { if (q.value !== S.stage) { q.value = S.stage; fillQInd(false); } q.disabled = true; q.title = t('stageLocked'); }
  else if (q) { q.disabled = false; q.title = ''; }
  P.indOverride = '';
}
function setStage(v) {
  S.stage = v || ''; store.set('stage', S.stage);
  syncStageFilters(); paintStageBar();
  const cur = document.querySelector('.view.on'), view = cur ? cur.id.slice(2) : 'home';
  if (view === 'plat') { if (P.gid != null) platOpenTab(P.gid); }
  else if (STAGE_VIEWS.includes(view)) go(view);
}

// ------------------------------------------------------------------ hooks into the screens
const _goStage = go;
go = function (v) {
  S.stageActive = STAGE_VIEWS.includes(v);
  _goStage(v);
  const bar = $('stageBar'); if (bar) bar.hidden = !S.me || !S.stageActive || S.mustChange;
};
const _applyRoleStage = applyRole;
applyRole = function () { _applyRoleStage(); fillStageSel(); };
const _fillSelectsStage = fillSelects;
fillSelects = function () { _fillSelectsStage(); syncStageFilters(); };

// indicators: the chips follow the drop-down; the branch chip is an extra view of its own
function pickIndStage(label) {
  if (!label) { P.indOverride = ''; return setStage(''); }
  const prog = (S.boot.stages || []).find(s => stNorm(s) === stNorm(label));
  if (prog) { P.indOverride = ''; $('stageSel').value = prog; return setStage(prog); }
  P.indOverride = label; renderInd();                     // «التخطيط على مستوى الفرع»
}
const _renderIndStage = renderInd;
renderInd = function () { P.indStage = P.indOverride || modelStage(S.stage); return _renderIndStage(); };

// platform: a sheet opens at the chosen stage's section
async function platOpenTab(gid) {
  if (!S.stage) return platLoad(gid, 1, 0);
  let m = null; try { m = await loadModel(); } catch (e) {}
  const lbl = modelStage(S.stage); let row = 0;
  if (m) m.indicators.forEach(i => i.blocks.forEach(b => { if (b.gid === gid && stNorm(b.label) === stNorm(lbl) && (!row || b.row < row)) row = b.row; }));
  return row ? platLoad(gid, Math.max(1, row - 8), row) : platLoad(gid, 1, 0);
}

// dashboard: with a stage chosen, the figures and lists are worked out for that stage only (same rules as the server)
const _renderDashStage = renderDash;
renderDash = function () {
  if (!S.stage || !S.dash || S.dash.__emp) return _renderDashStage();         // an employee's figures are already worked out for the stage
  const orig = S.dash; S.dash = stageDash(orig);
  try { _renderDashStage(); } finally { S.dash = orig; }
};
function stageDash(d) {
  const P2 = S.programs, today = new Date(); today.setHours(0, 0, 0, 0);
  const dd = iso => { if (!iso) return null; const [y, m, x] = iso.split('-').map(Number); return Math.round((new Date(y, m - 1, x) - today) / 86400000); };
  const active = p => !['مكتمل', 'ملغى', 'مؤجل'].includes(p.status);
  const k = { total: P2.length, done: 0, running: 0, notStarted: 0, late: 0, noDates: 0, startWeek: 0, avg: 0 }; let sum = 0, cnt = 0;
  P2.forEach(p => {
    if (p.status === 'مكتمل') k.done++; if (p.status === 'قيد التنفيذ') k.running++; if (p.status === 'لم يبدأ') k.notStarted++;
    if (p.status !== 'ملغى') { sum += p.status === 'مكتمل' ? 100 : (+p.pct || 0); cnt++; }
    if (!p.start && !p.end && active(p)) k.noDates++;
    const ds = dd(p.start), de = dd(p.end);
    if (active(p) && de !== null && de < 0) k.late++;
    if (active(p) && ds !== null && ds >= 0 && ds <= 7) k.startWeek++;
  });
  k.avg = cnt ? Math.round(sum / cnt) : 0;
  const keep = e => stNorm(e.stage) === stNorm(S.stage);
  return Object.assign({}, d, { kpis: k, stages: (d.stages || []).filter(s => stNorm(s.name) === stNorm(S.stage)), today: (d.today || []).filter(keep), late: (d.late || []).filter(keep), week: (d.week || []).filter(keep) });
}
