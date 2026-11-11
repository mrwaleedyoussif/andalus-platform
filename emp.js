/* =============================================================================
 *  emp.js — متابعة الموظفين (employee tracker): pick an employee and see his programs or his
 *  indicators with their progress; without a choice, every employee ranked side by side.
 *  For the leadership (app admins). Follows the stage drop-down. Loaded after stage.js.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, {
  navEmp: 'الموظفون', tEmp: 'متابعة الموظفين', tEmpD: 'برامج كل موظف ومؤشراته ونسب إنجازها',
  empTitle: 'متابعة الموظفين', empAll: '— كل الموظفين —', empPickHint: 'اختر موظفاً لعرض برامجه أو مؤشراته، أو تصفّح الترتيب أدناه.',
  sortLate: 'الأكثر تأخراً', sortLow: 'الأقل إنجازاً', sortHigh: 'الأعلى إنجازاً', sortName: 'الاسم',
  empCount: '{n} موظفاً لديهم برامج', empNoProgs: 'و{n} بلا برامج في هذه المرحلة', empNone: 'لا برامج لهذا الموظف في المرحلة المختارة.',
  tabProgs: 'البرامج', tabInds: 'المؤشرات', kProgs: 'البرامج', kDone: 'مكتملة', kRun: 'قيد التنفيذ', kLate: 'متأخرة', kAvg: 'متوسط الإنجاز', kEvid: 'بشواهد',
  kRoles: '{e} منفّذ · {f} متابع', indOwner: 'مسؤول المؤشر', indExec: 'منفّذ', empIndLine: '{n} برنامج · {d} مكتمل · {l} متأخر', showProgs: 'عرض برامجه',
  indFilter: 'المؤشر: {c}', backAll: 'كل الموظفين', openEmp: 'متابعة الموظف'
});
Object.assign(I18N.en, {
  navEmp: 'Staff', tEmp: 'Staff tracker', tEmpD: 'Each employee’s programs, indicators and progress',
  empTitle: 'Staff tracker', empAll: '— All staff —', empPickHint: 'Choose an employee to see their programs or indicators, or browse the ranking below.',
  sortLate: 'Most overdue', sortLow: 'Lowest progress', sortHigh: 'Highest progress', sortName: 'Name',
  empCount: '{n} staff with programs', empNoProgs: 'and {n} without programs in this stage', empNone: 'No programs for this employee in the chosen stage.',
  tabProgs: 'Programs', tabInds: 'Indicators', kProgs: 'Programs', kDone: 'Completed', kRun: 'In progress', kLate: 'Overdue', kAvg: 'Average progress', kEvid: 'With evidence',
  kRoles: '{e} implementer · {f} follower', indOwner: 'Indicator owner', indExec: 'Implementer', empIndLine: '{n} programs · {d} done · {l} overdue', showProgs: 'Show programs',
  indFilter: 'Indicator: {c}', backAll: 'All staff', openEmp: 'Staff tracker'
});
const E = { row: '', tab: 'progs', role: 'all', filter: 'all', ind: '', sort: 'late' };

// ------------------------------------------------------------------ figures for one person
function empStats(name) {
  const ps = S.programs.filter(x => isExec(name, x) || isFollow(name, x));
  const act = ps.filter(x => x.status !== 'ملغى');
  return {
    ps, n: ps.length, exec: ps.filter(x => isExec(name, x)).length, fol: ps.filter(x => isFollow(name, x)).length,
    done: ps.filter(x => x.status === 'مكتمل').length, run: ps.filter(x => x.status === 'قيد التنفيذ').length, late: applyFilter(ps, 'late').length,
    evid: ps.filter(x => x.evid).length, avg: act.length ? Math.round(act.reduce((s, x) => s + (x.status === 'مكتمل' ? 100 : (+x.pct || 0)), 0) / act.length) : 0
  };
}
const initials = n => String(n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('');
const empPeople = () => (S.boot.people || []).filter(p => p.name);
const empPerson = row => empPeople().find(p => String(p.row) === String(row));
const pctBar = (v, cls) => `<div class="bar ${cls || ''}"><span style="width:${Math.max(0, Math.min(100, v))}%"></span></div>`;

// ------------------------------------------------------------------ navigation
const _goEmp = go;
go = function (v) {
  if (v === 'emp' && S.me && !isAdmin()) v = 'home';
  _goEmp(v);
  if (v === 'emp') renderEmp();
};
function empOpen(row, fromPeople) { E.row = row ? String(row) : ''; E.tab = 'progs'; E.role = 'all'; E.filter = 'all'; E.ind = ''; if (fromPeople) go('emp'); else renderEmp(); window.scrollTo(0, 0); }

function renderEmp() {
  if (!S.boot || !isAdmin()) return;
  const sel = $('empSel'), ppl = empPeople().slice().sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  sel.innerHTML = `<option value="">${esc(t('empAll'))}</option>` + ppl.map(p => `<option value="${p.row}">${esc(p.name)}${p.role ? ' — ' + esc(tRole(p.role)) : ''}</option>`).join('');
  sel.value = E.row;
  const p = E.row && empPerson(E.row);
  if (!p) { E.row = ''; sel.value = ''; return renderEmpAll(); }
  renderEmpOne(p);
}

// ------------------------------------------------------------------ everyone, ranked
function renderEmpAll() {
  const rows = empPeople().map(p => Object.assign({ p }, empStats(p.name))), withP = rows.filter(r => r.n), without = rows.length - withP.length;
  const sorters = { late: (a, b) => b.late - a.late || a.avg - b.avg, low: (a, b) => a.avg - b.avg || b.late - a.late, high: (a, b) => b.avg - a.avg || a.late - b.late, name: (a, b) => a.p.name.localeCompare(b.p.name, 'ar') };
  withP.sort(sorters[E.sort] || sorters.late);
  const sortBtns = [['late', 'sortLate'], ['low', 'sortLow'], ['high', 'sortHigh'], ['name', 'sortName']].map(x => `<button class="${E.sort === x[0] ? 'on' : ''}" onclick="E.sort='${x[0]}';renderEmp()">${esc(t(x[1]))}</button>`).join('');
  $('empBody').innerHTML = `<div class="card">
      <p class="mini" style="margin:0 0 10px">${esc(t('empPickHint'))}</p>
      <div class="row between"><b>${esc(t('empCount', { n: withP.length }))}</b><span class="mini">${without ? esc(t('empNoProgs', { n: without })) : ''}</span></div>
      <div class="chips" style="margin-top:8px">${sortBtns}</div></div>
    <div class="emp-list">${withP.map(r => `<button class="emp-row" onclick="empOpen(${r.p.row})">
        ${avatar(r.p.name)}
        <span class="er-main"><b>${esc(r.p.name)}</b><small>${esc(tRole(r.p.role || ''))}${r.p.stage ? ' · ' + esc(tStage(r.p.stage)) : ''}</small></span>
        <span class="er-nums"><span title="${esc(t('kProgs'))}">📋 ${r.n}</span><span class="ok" title="${esc(t('kDone'))}">✅ ${r.done}</span><span class="${r.late ? 'late' : ''}" title="${esc(t('kLate'))}">⛔ ${r.late}</span></span>
        <span class="er-bar">${pctBar(r.avg)}<small>${r.avg}%</small></span></button>`).join('')}</div>`;
}

// ------------------------------------------------------------------ one employee
function renderEmpOne(p) {
  const s = empStats(p.name);
  const kpi = (icon, label, v, cls) => `<div class="kpi ${cls || ''}"><span class="kic">${ic(icon)}</span><b>${v}</b><span>${esc(label)}</span></div>`;
  const head = `<div class="card emp-head">
      <div class="eh-top">${avatar(p.name, 'big')}
        <div class="grow"><h2>${esc(p.name)}</h2><div class="mini">${esc(tRole(p.role || ''))}${p.stage ? ' · ' + esc(tStage(p.stage)) : ''} · ${esc(t('kRoles', { e: s.exec, f: s.fol }))}</div></div>
        <div class="eh-ring" style="--v:${s.avg}"><b>${s.avg}%</b><small>${esc(t('kAvg'))}</small></div></div>
      <div class="kpis emp-kpis">${kpi('layers', t('kProgs'), s.n)}${kpi('circle-check', t('kDone'), s.done, 'ok')}${kpi('play', t('kRun'), s.run, 'run')}${kpi('octagon-x', t('kLate'), s.late, 'late')}${kpi('paperclip', t('kEvid'), s.evid)}</div>
      <div class="row between" style="margin-top:12px">
        <div class="seg"><button class="${E.tab === 'progs' ? 'on' : ''}" onclick="E.tab='progs';renderEmp()">📋 ${esc(t('tabProgs'))}</button><button class="${E.tab === 'inds' ? 'on' : ''}" onclick="E.tab='inds';renderEmp()">🎯 ${esc(t('tabInds'))}</button></div>
        <div class="row" style="gap:6px"><button class="btn sm" onclick="empOpen('')">⊞ ${esc(t('backAll'))}</button><button class="btn sm" onclick="exportXlsx(empList())" data-i18n="exportXlsx">${esc(t('exportXlsx'))}</button><button class="btn sm" onclick="printPage()">${esc(t('printPdf'))}</button></div>
      </div></div>`;
  $('empBody').innerHTML = head + (s.n ? (E.tab === 'inds' ? empInds(p, s) : empProgs(p, s)) : `<div class="card empty">${esc(t('empNone'))}</div>`);
}
function empList() {
  const p = empPerson(E.row); if (!p) return [];
  let list = empStats(p.name).ps;
  if (E.role === 'exec') list = list.filter(x => isExec(p.name, x)); else if (E.role === 'follow') list = list.filter(x => isFollow(p.name, x));
  if (E.ind) list = list.filter(x => x.icode === E.ind);
  return applyFilter(list, E.filter);
}
function empProgs(p, s) {
  let base = s.ps;
  const roles = [['all', t('roleAll'), s.n], ['exec', t('roleExec'), s.exec], ['follow', t('roleFollow'), s.fol]].map(x => `<button class="rolechip ${E.role === x[0] ? 'on' : ''}" onclick="E.role='${x[0]}';renderEmp()">${x[1]} (${x[2]})</button>`).join('');
  if (E.role === 'exec') base = base.filter(x => isExec(p.name, x)); else if (E.role === 'follow') base = base.filter(x => isFollow(p.name, x));
  if (E.ind) base = base.filter(x => x.icode === E.ind);
  const labels = { all: t('fAll'), nodate: t('fNoDate'), soon: t('fSoon'), run: t('fRun'), late: t('fLate'), done: t('fDone') };
  const chips = Object.keys(labels).map(k => `<button class="${E.filter === k ? 'on' : ''}" onclick="E.filter='${k}';renderEmp()">${labels[k]} (${applyFilter(base, k).length})</button>`).join('');
  const list = applyFilter(base, E.filter);
  const indChip = E.ind ? `<button class="rolechip on" onclick="E.ind='';renderEmp()">${esc(t('indFilter', { c: E.ind }))} ✕</button>` : '';
  return `<div class="chips roles">${roles}${indChip}</div><div class="chips">${chips}</div>
    <p class="mini">${esc(t('nProg', { n: list.length }))}</p>
    <div class="list">${list.length ? list.slice(0, 150).map(card).join('') : `<div class="empty">${esc(t('emptyCat'))}</div>`}</div>`;
}
function empInds(p, s) {
  const by = {}; s.ps.forEach(x => (by[x.icode] = by[x.icode] || []).push(x));
  const codes = Object.keys(by).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  return `<div class="list">${codes.map(code => {
    const ps = by[code], one = ps[0], owner = ps.some(x => isFollow(p.name, x)), exec = ps.some(x => isExec(p.name, x));
    const done = ps.filter(x => x.status === 'مكتمل').length, late = applyFilter(ps, 'late').length, act = ps.filter(x => x.status !== 'ملغى');
    const avg = act.length ? Math.round(act.reduce((a, x) => a + (x.status === 'مكتمل' ? 100 : (+x.pct || 0)), 0) / act.length) : 0;
    const stages = [...new Set(ps.map(x => x.stage))];
    const perStage = stages.length > 1 ? stages.map(sg => { const q = ps.filter(x => x.stage === sg), qa = q.filter(x => x.status !== 'ملغى'), qv = qa.length ? Math.round(qa.reduce((a, x) => a + (x.status === 'مكتمل' ? 100 : (+x.pct || 0)), 0) / qa.length) : 0;
      return `<div class="ei-stage"><span>${esc(tStage(sg))}</span>${pctBar(qv)}<small>${qv}% · ${q.length}</small></div>`; }).join('') : '';
    return `<div class="card emp-ind">
      <div class="row between" style="align-items:flex-start"><h3 style="margin:0"><span class="tag">${esc(code)}</span> ${plink(one, 'ind', esc(tInd(code, one.ind)))}</h3>
        <div class="row" style="gap:4px">${owner ? `<span class="badge own">🎯 ${esc(t('indOwner'))}</span>` : ''}${exec ? `<span class="badge exe">🛠 ${esc(t('indExec'))}</span>` : ''}</div></div>
      <div class="ei-line"><span class="mini">${esc(t('empIndLine', { n: ps.length, d: done, l: late }))}</span><b>${avg}%</b></div>${pctBar(avg, late ? 'warn' : '')}
      ${perStage}
      <div class="row" style="margin-top:8px"><button class="btn sm" onclick="E.tab='progs';E.ind='${esc(code)}';E.filter='all';renderEmp()">📋 ${esc(t('showProgs'))}</button></div></div>`;
  }).join('')}</div>`;
}
