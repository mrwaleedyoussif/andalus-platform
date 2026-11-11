/* =============================================================================
 *  cal.js — calendar of program dates: a month grid (starts and ends marked on each day), the chosen
 *  day's programs, and "this week" at a glance. Follows the stage drop-down; staff see their own programs,
 *  leadership can switch to the whole school. Loaded after passkey.js.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, {
  navCal: 'التقويم', tCal: 'التقويم', tCalD: 'مواعيد البرامج بالشهر والأسبوع', calToday: 'اليوم', calMine: 'برامجي', calAll: 'كل البرامج',
  calStarts: 'يبدأ', calEnds: 'ينتهي', calRunning: 'جارٍ', calWeek: 'هذا الأسبوع', calNone: 'لا توجد برامج في هذا اليوم.', calWeekNone: 'لا يبدأ ولا ينتهي شيء هذا الأسبوع.',
  calLegend: '● يبدأ  ● ينتهي  ● متأخر', calDayTitle: 'برامج {d}'
});
Object.assign(I18N.en, {
  navCal: 'Calendar', tCal: 'Calendar', tCalD: 'Program dates by month and week', calToday: 'Today', calMine: 'My programs', calAll: 'All programs',
  calStarts: 'Starts', calEnds: 'Ends', calRunning: 'Running', calWeek: 'This week', calNone: 'No programs on this day.', calWeekNone: 'Nothing starts or ends this week.',
  calLegend: '● starts  ● ends  ● late', calDayTitle: 'Programs on {d}'
});
const CAL = { y: 0, m: 0, sel: '', scope: '' };
const isoOf = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const calList = () => {
  if (!CAL.scope) CAL.scope = isAdmin() ? 'all' : 'mine';
  const n = myName(); return CAL.scope === 'all' && isAdmin() ? S.programs : S.programs.filter(p => isExec(n, p) || isFollow(n, p));
};
const lateP = p => !['مكتمل', 'ملغى', 'مؤجل'].includes(p.status) && p.end && p.end < todayISO();
function renderCal() {
  if (!S.me) return;
  const now = new Date(); if (!CAL.y) { CAL.y = now.getFullYear(); CAL.m = now.getMonth(); CAL.sel = todayISO(); }
  const list = calList(), first = new Date(CAL.y, CAL.m, 1), loc = EN() ? 'en-GB' : 'ar-SA-u-ca-gregory-nu-latn';
  const title = first.toLocaleDateString(loc, { month: 'long', year: 'numeric' });
  let hij = ''; try { const a = new Date(CAL.y, CAL.m, 1).toLocaleDateString(EN() ? 'en-u-ca-islamic-umalqura' : 'ar-SA-u-ca-islamic-umalqura-nu-latn', { month: 'long', year: 'numeric' }), b = new Date(CAL.y, CAL.m + 1, 0).toLocaleDateString(EN() ? 'en-u-ca-islamic-umalqura' : 'ar-SA-u-ca-islamic-umalqura-nu-latn', { month: 'long', year: 'numeric' }); hij = a === b ? a : a + ' – ' + b; } catch (e) {}
  $('calHead').innerHTML = `<div class="row between" style="align-items:center;gap:8px"><div><h2 style="margin:0">${esc(title)}</h2><div class="mini">${esc(hij)}</div></div>
    <div class="row" style="gap:6px"><button class="btn sm" aria-label="prev" onclick="calMove(-1)">${ic(EN() ? 'chevron-left' : 'chevron-right')}</button><button class="btn sm" onclick="calMove(0)">${esc(t('calToday'))}</button><button class="btn sm" aria-label="next" onclick="calMove(1)">${ic(EN() ? 'chevron-right' : 'chevron-left')}</button></div></div>
    ${isAdmin() ? `<div class="chips" style="margin-top:8px"><button class="${CAL.scope === 'mine' ? 'on' : ''}" onclick="CAL.scope='mine';renderCal()">${esc(t('calMine'))}</button><button class="${CAL.scope === 'all' ? 'on' : ''}" onclick="CAL.scope='all';renderCal()">${esc(t('calAll'))} (${S.programs.length})</button></div>` : ''}
    <div class="mini cal-legend"><span class="d s"></span>${esc(t('calStarts'))} <span class="d e"></span>${esc(t('calEnds'))} <span class="d l"></span>${esc(t('late'))}</div>`;
  const by = {}; const add = (d, k, p) => { (by[d] || (by[d] = { s: [], e: [] }))[k].push(p); };
  list.forEach(p => { if (p.start) add(p.start, 's', p); if (p.end) add(p.end, 'e', p); });
  const wd = []; for (let i = 0; i < 7; i++) wd.push(new Date(2026, 10, 1 + i).toLocaleDateString(loc, { weekday: 'short' }));   // 1 Nov 2026 is a Sunday
  let h = `<div class="calg">${wd.map(w => `<div class="cwd">${esc(w)}</div>`).join('')}`;
  const lead = first.getDay(), days = new Date(CAL.y, CAL.m + 1, 0).getDate(), today = todayISO();
  for (let i = 0; i < lead; i++) h += '<div class="cd out"></div>';
  for (let d = 1; d <= days; d++) {
    const iso = isoOf(new Date(CAL.y, CAL.m, d)), x = by[iso] || { s: [], e: [] }, late = x.e.filter(lateP).length;
    h += `<button class="cd ${iso === today ? 'today' : ''} ${iso === CAL.sel ? 'sel' : ''}" onclick="CAL.sel='${iso}';renderCal()"><span class="cn">${d}</span><span class="cdots">${x.s.length ? `<i class="s">${x.s.length}</i>` : ''}${x.e.length - late ? `<i class="e">${x.e.length - late}</i>` : ''}${late ? `<i class="l">${late}</i>` : ''}</span></button>`;
  }
  $('calGrid').innerHTML = h + '</div>';
  // the chosen day + this week
  const sel = CAL.sel || today, sx = by[sel] || { s: [], e: [] };
  const run = list.filter(p => p.start && p.end && p.start < sel && p.end > sel && !['مكتمل', 'ملغى'].includes(p.status));
  const item = (p, k) => `<button class="cal-i k-${k} ${lateP(p) ? 'late' : ''}" onclick="openProg(${jsq(p.id)})"><span class="ck">${esc(t(k === 's' ? 'calStarts' : k === 'e' ? 'calEnds' : 'calRunning'))}</span><span class="grow"><b>${esc(p.program)}</b><span class="mini">${esc(tStage(p.stage))} · ${esc(p.icode)} · ${esc(p.presp || p.iresp || '')}</span></span><span class="status s-${esc(p.status).replace(/ /g, '-')}">${esc(tStatus(p.status))}</span></button>`;
  const dd = new Date(sel + 'T12:00:00').toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long' });
  let w = `<h3>${ic('calendar')} ${esc(t('calDayTitle', { d: dd }))}</h3>`;
  const dayItems = sx.s.map(p => item(p, 's')).concat(sx.e.map(p => item(p, 'e')), run.slice(0, 30).map(p => item(p, 'r')));
  w += dayItems.length ? dayItems.join('') : `<p class="meta">${esc(t('calNone'))}</p>`;
  const ws = new Date(today + 'T12:00:00'); ws.setDate(ws.getDate() - ws.getDay()); const we = new Date(ws); we.setDate(ws.getDate() + 6);
  const a = isoOf(ws), b = isoOf(we), wk = [];
  list.forEach(p => { if (p.start >= a && p.start <= b) wk.push([p.start, item(p, 's')]); if (p.end >= a && p.end <= b) wk.push([p.end, item(p, 'e')]); });
  wk.sort((x, y) => x[0] < y[0] ? -1 : 1);
  w += `<h3 style="margin-top:16px">${ic('calendar-days')} ${esc(t('calWeek'))} <span class="mini">${fmtD(a)} – ${fmtD(b)}</span></h3>` + (wk.length ? wk.map(x => x[1]).join('') : `<p class="meta">${esc(t('calWeekNone'))}</p>`);
  $('calDay').innerHTML = w;
}
function calMove(k) { const n = new Date(); if (!k) { CAL.y = n.getFullYear(); CAL.m = n.getMonth(); CAL.sel = todayISO(); } else { const d = new Date(CAL.y, CAL.m + k, 1); CAL.y = d.getFullYear(); CAL.m = d.getMonth(); } renderCal(); }
const _goCal = go;
go = function (v) { _goCal(v); if (v === 'cal') renderCal(); };
if (typeof STAGE_VIEWS !== 'undefined') STAGE_VIEWS.push('cal');
TILES.splice(TILES.findIndex(x => x[0] === 'appr'), 0, ['cal', 'calendar-range', 'tCal', 'tCalD']);
