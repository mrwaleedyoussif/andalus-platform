/* =============================================================================
 *  dashemp.js — «لوحة المتابعة» for one employee: a drop-down (separate from the stage list) that recalculates
 *  the figures, the status chart and the lists for the chosen person's programs, plus a card listing them.
 *  Works together with the stage drop-down. Leadership only (admins). Loaded last.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, {
  deEmp: 'الموظف', deAll: 'كل الموظفين', deBoth: 'منفّذ ومتابع', deExec: 'منفّذ', deFollow: 'متابع', deClear: 'عرض الكل',
  deTitle: 'برامج {n}', deCount: '{n} برنامج', deNone: 'لا توجد برامج لهذا الموظف في المرحلة المختارة.', deOpenEmp: 'متتبع الموظف',
  deShowing: 'اللوحة تعرض برامج {n} فقط', deEnd: 'ينتهي {d}', deLate: 'متأخر {n} يوم'
});
Object.assign(I18N.en, {
  deEmp: 'Employee', deAll: 'All employees', deBoth: 'Doing + following', deExec: 'Doing', deFollow: 'Following', deClear: 'Show all',
  deTitle: '{n}’s programs', deCount: '{n} programs', deNone: 'No programs for this person in the chosen stage.', deOpenEmp: 'Staff tracker',
  deShowing: 'The dashboard shows {n}’s programs only', deEnd: 'ends {d}', deLate: '{n} days late'
});
const DE = { name: '', role: 'both' };
const deMatch = p => DE.role === 'exec' ? isExec(DE.name, p) : DE.role === 'follow' ? isFollow(DE.name, p) : (isExec(DE.name, p) || isFollow(DE.name, p));
dashProgs = () => (DE.name && isAdmin() ? S.programs.filter(deMatch) : S.programs);          // the status chart follows the choice

/** the dashboard figures for a list of programs (same rules as the server's dashboard) */
function dashFor(d, list) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dd = iso => { if (!iso) return null; const [y, m, x] = iso.split('-').map(Number); return Math.round((new Date(y, m - 1, x) - today) / 86400000); };
  const active = p => !['مكتمل', 'ملغى', 'مؤجل'].includes(p.status);
  const k = { total: list.length, done: 0, running: 0, notStarted: 0, late: 0, noDates: 0, startWeek: 0, avg: 0 }; let sum = 0, cnt = 0;
  const stages = (d.stages || []).filter(s => !S.stage || stNorm(s.name) === stNorm(S.stage)).map(s => ({ name: s.name, total: 0, done: 0, running: 0, late: 0 }));
  list.forEach(p => {
    const st = stages.find(s => stNorm(s.name) === stNorm(p.stage)); if (st) st.total++;
    if (p.status === 'مكتمل') { k.done++; if (st) st.done++; }
    if (p.status === 'قيد التنفيذ') { k.running++; if (st) st.running++; }
    if (p.status === 'لم يبدأ') k.notStarted++;
    if (p.status !== 'ملغى') { sum += p.status === 'مكتمل' ? 100 : (+p.pct || 0); cnt++; }
    if (!p.start && !p.end && active(p)) k.noDates++;
    const ds = dd(p.start), de = dd(p.end);
    if (active(p) && de !== null && de < 0) { k.late++; if (st) st.late++; }
    if (active(p) && ds !== null && ds >= 0 && ds <= 7) k.startWeek++;
  });
  k.avg = cnt ? Math.round(sum / cnt) : 0;
  const ids = new Set(list.map(p => String(p.id))), keep = e => ids.has(String(e.id));
  return Object.assign({}, d, { kpis: k, stages, today: (d.today || []).filter(keep), late: (d.late || []).filter(keep), week: (d.week || []).filter(keep), __emp: true });
}

const _renderDashE = renderDash;
renderDash = function () {
  if (!S.dash || !DE.name || !isAdmin()) { _renderDashE(); paintDashEmp(); return; }
  const orig = S.dash; S.dash = dashFor(orig, S.programs.filter(deMatch));
  try { _renderDashE(); } finally { S.dash = orig; }
  paintDashEmp();
};

function paintDashEmp() {
  const view = $('v-dash'); if (!view) return;
  let bar = $('dashEmpBar');
  if (!isAdmin()) { if (bar) bar.remove(); const c = $('dashEmpCard'); if (c) c.remove(); return; }
  if (!bar) { bar = document.createElement('div'); bar.id = 'dashEmpBar'; bar.className = 'dash-f noprint-sel'; view.insertBefore(bar, $('dashNotice')); }
  // people who have programs in the current stage view, with how many
  const ppl = (S.boot.people || []).filter(p => p.name).map(p => ({ p, n: S.programs.filter(x => isExec(p.name, x) || isFollow(p.name, x)).length }))
    .filter(x => x.n || x.p.name === DE.name).sort((a, b) => a.p.name.localeCompare(b.p.name, 'ar'));
  if (DE.name && !ppl.some(x => x.p.name === DE.name)) DE.name = '';
  bar.innerHTML = `<label class="f" for="dashEmpSel">${ic('user')} ${esc(t('deEmp'))}</label>
    <select id="dashEmpSel" onchange="DE.name=this.value;DE.role='both';renderDash()"><option value="">${esc(t('deAll'))}</option>${ppl.map(x => `<option value="${esc(x.p.name)}" ${x.p.name === DE.name ? 'selected' : ''}>${esc(x.p.name)} (${x.n})</option>`).join('')}</select>
    ${DE.name ? `<div class="chips de-role">${[['both', 'deBoth'], ['exec', 'deExec'], ['follow', 'deFollow']].map(r => `<button class="${DE.role === r[0] ? 'on' : ''}" onclick="DE.role='${r[0]}';renderDash()">${esc(t(r[1]))}</button>`).join('')}</div>
      <button class="btn sm" onclick="DE.name='';renderDash()">${ic('x')} ${esc(t('deClear'))}</button>` : ''}`;
  // the chosen person's programs
  let card = $('dashEmpCard');
  if (!DE.name) { if (card) card.remove(); view.classList.remove('de-on'); return; }
  view.classList.add('de-on');
  if (!card) { card = document.createElement('div'); card.id = 'dashEmpCard'; card.className = 'card'; const g = view.querySelector('.grid2'); g.parentNode.insertBefore(card, g.nextSibling); }
  const list = S.programs.filter(deMatch), today = todayISO();
  const active = p => !['مكتمل', 'ملغى', 'مؤجل'].includes(p.status), late = p => active(p) && p.end && p.end < today;
  const rank = p => late(p) ? 0 : p.status === 'قيد التنفيذ' ? 1 : p.status === 'لم يبدأ' ? 2 : p.status === 'مؤجل' ? 3 : p.status === 'مكتمل' ? 4 : 5;
  list.sort((a, b) => rank(a) - rank(b) || String(a.end || '9').localeCompare(String(b.end || '9')));
  const person = (S.boot.people || []).find(p => p.name === DE.name) || {};
  const days = p => Math.round((new Date(today) - new Date(p.end)) / 86400000);
  card.innerHTML = `<div class="de-head">${avatar(DE.name, 'sm')}<div class="grow"><h3 style="margin:0">${esc(t('deTitle', { n: DE.name }))}</h3><div class="mini">${esc(tRole(person.role || ''))}${S.stage ? ' · ' + esc(tStage(S.stage)) : ''} · ${esc(t('deCount', { n: list.length }))}</div></div>
      ${person.row ? `<button class="btn sm" onclick="empOpen(${person.row})">${ic('chart-column')} ${esc(t('deOpenEmp'))}</button>` : ''}</div>` +
    (list.length ? `<div class="de-list">${list.map(p => {
      const pct = p.status === 'مكتمل' ? 100 : (+p.pct || 0), roleTag = isExec(DE.name, p) ? (isFollow(DE.name, p) ? t('deBoth') : t('deExec')) : t('deFollow');
      return `<button class="de-i ${late(p) ? 'late' : ''}" onclick="openProg(${jsq(p.id)})"><span class="grow"><b>${esc(p.program)}</b><span class="mini">${esc(tStage(p.stage))} · <span class="tag">${esc(p.icode)}</span> · ${esc(roleTag)}</span></span>
        <span class="de-s"><span class="status s-${esc(p.status).replace(/ /g, '-')}">${esc(tStatus(p.status))}</span><span class="mini">${late(p) ? esc(t('deLate', { n: days(p) })) : p.end ? esc(t('deEnd', { d: fmtD(p.end) })) : '—'}</span><span class="bar"><i style="width:${pct}%"></i></span></span></button>`;
    }).join('')}</div>` : `<p class="meta">${esc(t('deNone'))}</p>`);
}
const _logoutDE = logout;
logout = function (silent) { DE.name = ''; DE.role = 'both'; _logoutDE(silent); };
