/* =============================================================================
 *  lead.js — progress over the weeks (dashboard chart), the activity log (admins), the weekly report and
 *  backups / daily job (owner, principal, academic VP, academic supervisor), and recognition: the month's
 *  top performers with a printable certificate of appreciation. Loaded after cal.js.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar.err, { BAD_TIME: 'الوقت غير صالح' });
Object.assign(I18N.en.err, { BAD_TIME: 'Invalid time' });
Object.assign(I18N.ar, {
  progTitle: '📈 التقدم عبر الأسابيع', progNote: 'نسبة البرامج المكتملة لكل مرحلة. النقاط المفرغة تقديرية من تواريخ الإكمال السابقة، والممتلئة لقطات يومية فعلية.', progFew: 'يتكوّن الرسم مع الأيام — تُسجَّل لقطة كل يوم.',
  navLog: 'سجل النشاط', tLog: 'سجل النشاط', tLogD: 'من غيّر ماذا ومتى', logTitle: 'سجل النشاط', logSearch: 'ابحث باسم أو برنامج أو إجراء…', logGo: 'بحث', logMore: 'عرض المزيد', logNone: 'لا نتائج.', logCount: '{n} سجلاً',
  navReport: 'التقرير الأسبوعي', tReport: 'التقرير الأسبوعي', tReportD: 'ملخص الأسبوع، أوقات الإرسال والنسخ الاحتياطي', repTitle: 'التقرير الأسبوعي',
  repIntro: 'يُرسل تلقائياً صباح كل أحد بالبريد (مع نسخة PDF) إلى المالك ومدير المدرسة ووكيل الشؤون الأكاديمية والمشرف الأكاديمي عند تفعيل التشغيل اليومي.',
  repShow: 'عرض تقرير هذا الأسبوع', repSendNow: 'إرسال الآن للإدارة', repConfirm: 'إرسال التقرير الأسبوعي الآن بالبريد إلى الإدارة؟', repSent: '✅ أُرسل التقرير إلى {n}', repOnlyCtrl: 'هذه الصفحة للمالك ومدير المدرسة ووكيل الشؤون الأكاديمية والمشرف الأكاديمي.', repTimesOnly: 'التقرير نفسه للمالك ومدير المدرسة ووكيل الشؤون الأكاديمية والمشرف الأكاديمي — ويمكنك هنا تغيير أوقات الإرسال اليومي.',
  autoTitle: '⏰ أوقات الإرسال اليومي', autoIntro: 'يغيّرها المالك والمطوّر ومديرو التطبيق ومدير المدرسة. يبدأ العمل بالوقت الجديد من الموعد التالي، ويرسل Google في حدود ربع ساعة من الوقت المختار (بتوقيت الرياض).',
  schAlerts: 'تنبيهات البريد وواتساب', schAlertsD: 'مواعيد بدء البرامج وانتهائها والتأخر — للمنفّذ والمتابع، والمدير والوكيل الأكاديمي قبل 24 ساعة وفي اليوم نفسه.',
  schDaily: 'تنبيهات التطبيق والجوال', schDailyD: 'تذكير كل موظف بما يبدأ أو ينتهي غداً وما تأخر، ولقطة التقدم اليومية. وكل أحد في الوقت نفسه: التقرير الأسبوعي بالبريد ونسخة احتياطية.',
  schAt: 'الوقت', schSave: 'حفظ الوقت', schSaved: '✅ حُفظ — {w} الساعة {t}', schLastMail: 'آخر إرسال: {d}', schNever: 'لم يُرسل بعد',
  autoOn: 'مفعّل', autoOff: 'متوقف', autoEnable: 'تفعيل', autoDisable: 'إيقاف', autoLast: 'آخر تشغيل: {d}', autoOwner: 'التفعيل والإيقاف للمالك فقط.', schView: 'يغيّر الوقت المالك والمطوّر ومديرو التطبيق ومدير المدرسة فقط.',
  autoTitle2: '💾 النسخ الاحتياطي',
  bkTitle: 'النسخ الاحتياطية', bkNow: 'نسخة احتياطية الآن', bkDone: '✅ أُنشئت نسخة احتياطية', bkNone: 'لا توجد نسخ بعد.', bkWorking: 'جارٍ إنشاء النسخة…',
  navStars: 'المتميزون', tStars: 'المتميزون', tStarsD: 'الأكثر إنجازاً هذا الشهر', starsTitle: '🏆 المتميزون', starsIntro: 'ترتيب الموظفين بعدد البرامج التي اكتملت واعتُمدت خلال الشهر، وكم منها في موعده.',
  starsDone: '{n} مكتمل', starsOnTime: '{n} في موعده', starsNone: 'لا توجد برامج مكتملة مسجلة في هذا الشهر بعد.', starsCert: '🏅 شهادة شكر', starsTotal: 'اكتمل {n} برنامجاً هذا الشهر',
  certPrint: 'طباعة / حفظ PDF', back: 'رجوع', certTitle: 'شهادة شكر وتقدير', certTo: 'تتقدّم إدارة مدارس الأندلس بالطائف بخالص الشكر والتقدير إلى',
  certBody: 'تقديراً لتميّزه في تنفيذ برامج الخطة التشغيلية لعام ١٤٤٨هـ خلال شهر {m}، بإنجاز ({n}) من البرامج{k}، سائلين الله له دوام التوفيق والسداد.', certOnTime: '، منها ({n}) في موعدها',
  certSign1: 'مدير المدرسة', certSign2: 'وكيل الشؤون الأكاديمية', certMr: 'الأستاذ'
});
Object.assign(I18N.en, {
  progTitle: '📈 Progress over the weeks', progNote: 'Share of completed programs per stage. Hollow points are estimated from earlier completion dates; filled points are real daily snapshots.', progFew: 'The chart builds up day by day — one snapshot is taken every day.',
  navLog: 'Activity log', tLog: 'Activity log', tLogD: 'Who changed what, and when', logTitle: 'Activity log', logSearch: 'Search a name, program or action…', logGo: 'Search', logMore: 'Show more', logNone: 'No results.', logCount: '{n} entries',
  navReport: 'Weekly report', tReport: 'Weekly report', tReportD: 'The week’s summary, send times and backups', repTitle: 'Weekly report',
  repIntro: 'Sent automatically every Sunday morning by e-mail (with a PDF copy) to the owner, the principal, the academic VP and the academic supervisor when the daily job is on.',
  repShow: 'Show this week’s report', repSendNow: 'Send to management now', repConfirm: 'E-mail the weekly report to management now?', repSent: '✅ Report sent to {n}', repOnlyCtrl: 'This page is for the owner, the principal, the academic VP and the academic supervisor.', repTimesOnly: 'The report itself is for the owner, the principal, the academic VP and the academic supervisor — here you can change the daily send times.',
  autoTitle: '⏰ Daily send times', autoIntro: 'The owner & developer, the app admins and the school principal can change them. A new time applies from the next run; Google sends within about 15 minutes of the chosen time (Riyadh time).',
  schAlerts: 'E-mail and WhatsApp alerts', schAlertsD: 'Program start, end and overdue alerts — to the person doing it and the follower, and to the principal and academic VP 24 hours before and on the day.',
  schDaily: 'App and phone notifications', schDailyD: 'Each person is reminded of what starts or ends tomorrow and what is overdue, plus the daily progress snapshot. Every Sunday at the same time: the weekly report by e-mail and a backup.',
  schAt: 'Time', schSave: 'Save time', schSaved: '✅ Saved — {w} at {t}', schLastMail: 'Last sent: {d}', schNever: 'Not sent yet',
  autoOn: 'On', autoOff: 'Off', autoEnable: 'Turn on', autoDisable: 'Turn off', autoLast: 'Last run: {d}', autoOwner: 'Only the owner can switch these on or off.', schView: 'Only the owner & developer, the app admins and the school principal can change the time.',
  autoTitle2: '💾 Backups',
  bkTitle: 'Backups', bkNow: 'Back up now', bkDone: '✅ Backup created', bkNone: 'No backups yet.', bkWorking: 'Creating the backup…',
  navStars: 'Top performers', tStars: 'Top performers', tStarsD: 'Most completed this month', starsTitle: '🏆 Top performers', starsIntro: 'Staff ranked by the programs completed and approved in the month, and how many were on time.',
  starsDone: '{n} completed', starsOnTime: '{n} on time', starsNone: 'No completed programs recorded this month yet.', starsCert: '🏅 Certificate', starsTotal: '{n} programs completed this month',
  certPrint: 'Print / save PDF', back: 'Back', certTitle: 'Certificate of Appreciation', certTo: 'The administration of Andalus Schools – Taif is pleased to thank',
  certBody: 'in recognition of outstanding work on the operational plan programs for 1448 AH during {m}, completing ({n}) programs{k}. With our best wishes for continued success.', certOnTime: ', ({n}) of them on time',
  certSign1: 'School Principal', certSign2: 'Academic Vice Principal', certMr: 'Mr.'
});

// ------------------------------------------------------------------ progress over the weeks (dashboard)
let HIST = null;
const STAGE_COL = ['#173a86', '#00a8d0', '#994a96'], ALL_COL = '#df6263';
async function drawProgress(force) {
  let card = $('progCard');
  if (!card) { const meta = $('dashMeta'); if (!meta) return; card = document.createElement('div'); card.className = 'card'; card.id = 'progCard'; meta.parentNode.insertBefore(card, meta); }
  card.innerHTML = `<h3>${esc(t('progTitle'))}</h3><div id="progChart" class="pchart"><p class="mini">${esc(t('xLoading'))}</p></div><p class="mini">${esc(t('progNote'))}</p>`;
  if (!HIST || force) { try { HIST = (await api('history')).points; } catch (e) { $('progChart').innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; return; } }
  const stages = (S.boot.stages || []).filter(s => !S.stage || stNorm(s) === stNorm(S.stage));
  const ser = stages.map((s, i) => ({ name: stageName(s), col: STAGE_COL[(S.boot.stages || []).indexOf(s)] || STAGE_COL[i % 3], pts: HIST.filter(h => stNorm(h.stage) === stNorm(s)) }));
  if (!S.stage) ser.push({ name: t('stageAll'), col: ALL_COL, pts: HIST.filter(h => h.stage === 'الكل'), bold: true });
  ser.forEach(s => { s.pts = s.pts.filter(p => p.total).map(p => ({ d: p.d, v: Math.round(p.done * 1000 / p.total) / 10, est: p.est })).sort((a, b) => a.d < b.d ? -1 : 1); });
  const all = ser.flatMap(s => s.pts); if (all.length < 2) { $('progChart').innerHTML = `<p class="meta">${esc(t('progFew'))}</p>`; return; }
  const rtl = !EN(), W = 680, H = 250, L = rtl ? 16 : 44, R = rtl ? 44 : 16, T = 12, B = 30, d0 = new Date(all.reduce((a, p) => p.d < a ? p.d : a, all[0].d)), d1 = new Date(all.reduce((a, p) => p.d > a ? p.d : a, all[0].d));
  const span = Math.max(1, d1 - d0), f = d => (new Date(d) - d0) / span, Y = v => T + (100 - v) / 100 * (H - T - B);
  const xs = d => rtl ? W - R - f(d) * (W - L - R) : L + f(d) * (W - L - R);               // time runs right → left in Arabic
  let g = '';
  [0, 25, 50, 75, 100].forEach(v => { g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" class="pg"/><text x="${rtl ? W - R + 6 : L - 6}" y="${Y(v) + 4}" text-anchor="${rtl ? 'start' : 'end'}" class="pt">${v}%</text>`; });
  const ticks = 5; for (let i = 0; i <= ticks; i++) { const d = new Date(+d0 + span * i / ticks), iso = d.toISOString().slice(0, 10); g += `<text x="${xs(iso)}" y="${H - 8}" text-anchor="middle" class="pt">${iso.slice(8, 10)}/${iso.slice(5, 7)}</text>`; }
  ser.forEach(s => { if (!s.pts.length) return;
    g += `<polyline fill="none" stroke="${s.col}" stroke-width="${s.bold ? 3 : 2}" stroke-linejoin="round" stroke-linecap="round" points="${s.pts.map(p => xs(p.d).toFixed(1) + ',' + Y(p.v).toFixed(1)).join(' ')}"/>`;
    g += s.pts.map(p => `<circle cx="${xs(p.d).toFixed(1)}" cy="${Y(p.v).toFixed(1)}" r="${p.est ? 3 : 3.5}" fill="${p.est ? 'var(--card,#fff)' : s.col}" stroke="${s.col}" stroke-width="1.6"><title>${esc(s.name)} — ${p.d}: ${p.v}%${p.est ? ' (تقدير)' : ''}</title></circle>`).join(''); });
  const legend = ser.filter(s => s.pts.length).map(s => `<span class="lg"><i style="background:${s.col}"></i>${esc(s.name)} <b>${s.pts[s.pts.length - 1].v}%</b></span>`).join('');
  $('progChart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="direction:ltr" role="img" aria-label="${esc(t('progTitle'))}">${g}</svg><div class="plg">${legend}</div>`;
}
const _renderDashL = renderDash;
renderDash = function () { _renderDashL(); if (S.me && S.boot) drawProgress(false); };

// ------------------------------------------------------------------ activity log
const LOG = { rows: [], off: 0, more: false, total: 0 };
async function loadLog(reset) {
  if (reset) { LOG.rows = []; LOG.off = 0; }
  const box = $('logList'); if (reset) box.innerHTML = `<p class="mini">${esc(t('xLoading'))}</p>`;
  try {
    const r = await api('actLog', { q: $('logQ').value.trim(), from: $('logFrom').value, to: $('logTo').value, offset: LOG.off, limit: 100 });
    LOG.rows = LOG.rows.concat(r.rows); LOG.off += r.rows.length; LOG.more = r.more; LOG.total = r.total;
    box.innerHTML = (LOG.rows.length ? `<p class="mini">${esc(t('logCount', { n: LOG.total }))}</p><div class="logl">${LOG.rows.map(x => `<div class="lr"><div class="lrh"><b>${esc(x[1].replace(/\s*\(التطبيق\)$/, ''))}</b><span class="mini">${fmtDT(x[0])}</span></div><div>${esc(x[6])}${x[2] ? ` · <span class="meta">${esc(x[2])}</span>` : ''}</div><div class="mini">${esc(x[3])}</div>${x[4] || x[5] ? `<div class="hchg"><s>${esc(x[4] || '—')}</s> ${EN() ? '→' : '←'} <b>${esc(x[5] || '—')}</b></div>` : ''}</div>`).join('')}</div>` : `<p class="meta">${esc(t('logNone'))}</p>`) +
      (LOG.more ? `<button class="btn wide" style="margin-top:10px" onclick="loadLog(false)">${esc(t('logMore'))}</button>` : '');
  } catch (e) { box.innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; }
}
async function exportLog() {
  try {
    toast(t('exporting'), 20000); await loadXlsx();
    const H = EN() ? ['Date', 'By', 'Sheet', 'Item', 'Old', 'New', 'Action', 'Note'] : ['التاريخ', 'بواسطة', 'الورقة', 'العنصر', 'القيمة السابقة', 'القيمة الجديدة', 'الإجراء', 'ملاحظة'];
    const ws = XLSX.utils.aoa_to_sheet([H].concat(LOG.rows.map(r => [new Date(r[0])].concat(r.slice(1)))), { cellDates: true });
    ws['!cols'] = [18, 22, 14, 44, 18, 18, 22, 16].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new(); wb.Workbook = { Views: [{ RTL: !EN() }] }; XLSX.utils.book_append_sheet(wb, ws, EN() ? 'Log' : 'السجل');
    XLSX.writeFile(wb, (EN() ? 'Andalus-activity-log-' : 'منصة-الأندلس-سجل-النشاط-') + new Date().toISOString().slice(0, 10) + '.xlsx'); toast(t('exported', { n: LOG.rows.length }), 4000);
  } catch (e) { toast('❌ ' + e.message, 6000); }
}

// ------------------------------------------------------------------ weekly report + daily job + backups
async function repPreview() {
  const box = $('repBox'); box.hidden = false; box.innerHTML = `<p class="mini">${esc(t('xLoading'))}</p>`;
  try { box.innerHTML = (await api('repPreview', {}, { timeout: 120000 })).html; } catch (e) { box.innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; }
}
async function repSend() {
  if (!confirm(t('repConfirm'))) return;
  toast(t('sending'), 60000);
  try { const r = await api('repSend', {}, { timeout: 180000 }); toast(t('repSent', { n: (r.to || []).join('، ') || r.sent }), 6000); } catch (e) { toast('❌ ' + e.message, 6000); }
}
async function renderAuto() {
  const box = $('autoBox'); box.innerHTML = `<p class="mini">${esc(t('xLoading'))}</p>`;
  try {
    const r = await api('autoState');
    const row = (what, icon, on, time, last) => `<div class="sch">
      <div class="sch-h"><span class="sch-ic">${ic(icon)}</span><div class="grow"><b>${esc(t(what === 'alerts' ? 'schAlerts' : 'schDaily'))}</b><div class="mini">${esc(t(what === 'alerts' ? 'schAlertsD' : 'schDailyD'))}</div></div><span class="pill ${on ? 'on' : ''}">${esc(t(on ? 'autoOn' : 'autoOff'))}</span></div>
      <div class="sch-c">${r.canTime ? `<label class="f" for="t-${what}">${esc(t('schAt'))}</label><select id="t-${what}" onchange="$('s-${what}').disabled=this.value==='${time}'">${timeOpts(time)}</select><button class="btn p sm" id="s-${what}" disabled onclick="saveTime('${what}')">${esc(t('schSave'))}</button>`
        : `<span class="sch-t">${ic('clock')} ${esc(fmtTime(time))}</span>`}
        ${r.canToggle ? `<button class="btn sm" onclick="autoSet(${!on},'${what}')">${esc(t(on ? 'autoDisable' : 'autoEnable'))}</button>` : ''}
        <span class="mini">${esc(last)}</span></div></div>`;
    box.innerHTML = `<h3>${esc(t('autoTitle'))}</h3><p class="mini">${esc(t('autoIntro'))}</p>` +
      row('alerts', 'mail', r.alerts, r.alertTime, r.lastCheck ? t('schLastMail', { d: fmtDT(r.lastCheck) }) : t('schNever')) +
      row('daily', 'bell-ring', r.daily, r.dailyTime, r.last ? t('autoLast', { d: fmtDT(r.last.at) }) : t('schNever')) +
      `<p class="mini">${esc(t(r.canTime ? 'autoOwner' : 'schView'))}</p>
      ${r.canBackup === false ? '' : `<h3 style="margin-top:16px">${ic('database-backup')} ${esc(t('bkTitle'))}</h3>
      <button class="btn sm" onclick="backupNow()">${esc(t('bkNow'))}</button>
      ${(r.backups || []).length ? `<div class="bkl">${r.backups.map(b => `<a class="bkr" href="${esc(b.url)}" target="_blank" rel="noopener">${ic('file-spreadsheet')}<span class="grow">${esc(b.name)}</span><span class="mini">${fmtDT(b.at)}</span></a>`).join('')}</div>` : `<p class="meta">${esc(t('bkNone'))}</p>`}`}`;
  } catch (e) { box.innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; }
}
async function autoSet(on, what) { try { await api('autoSet', { on, what: what || 'daily' }); renderAuto(); } catch (e) { toast('❌ ' + e.message, 6000); } }
/** «07:00» → «7:00 ص» / «7:00 am» */
function fmtTime(hm) { const [h, m] = String(hm || '').split(':').map(Number); if (isNaN(h)) return '—'; const h12 = h % 12 || 12; return h12 + ':' + String(m || 0).padStart(2, '0') + ' ' + (EN() ? (h < 12 ? 'am' : 'pm') : (h < 12 ? 'ص' : 'م')); }
function timeOpts(cur) {
  const list = []; for (let h = 0; h < 24; h++) for (let m = 0; m < 60; m += 15) list.push(String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'));
  if (cur && list.indexOf(cur) < 0) { list.push(cur); list.sort(); }
  return list.map(v => `<option value="${v}" ${v === cur ? 'selected' : ''}>${fmtTime(v)}</option>`).join('');
}
async function saveTime(what) {
  const v = $('t-' + what).value, b = $('s-' + what); b.disabled = true;
  try { await api('autoTime', { which: what, time: v }); toast(t('schSaved', { w: t(what === 'alerts' ? 'schAlerts' : 'schDaily'), t: fmtTime(v) }), 4000); renderAuto(); }
  catch (e) { b.disabled = false; toast('❌ ' + e.message, 6000); }
}
async function backupNow() { toast(t('bkWorking'), 120000); try { await api('backupNow', {}, { timeout: 240000 }); toast(t('bkDone'), 3500); renderAuto(); } catch (e) { toast('❌ ' + e.message, 6000); } }

// ------------------------------------------------------------------ recognition + certificate
const ST = { month: '' }; let CERT = null;
const monthName = m => new Date(m + '-15T12:00:00').toLocaleDateString(EN() ? 'en-GB' : 'ar-SA-u-ca-gregory-nu-latn', { month: 'long', year: 'numeric' });
async function renderStars() {
  if (!ST.month) ST.month = todayISO().slice(0, 7);
  const months = []; const n = new Date(); for (let i = 0; i < 8; i++) { const d = new Date(n.getFullYear(), n.getMonth() - i, 15); months.push(d.toISOString().slice(0, 7)); }
  $('starsHead').innerHTML = `<div class="row between" style="align-items:center;gap:8px"><h2 style="margin:0">${esc(t('starsTitle'))}</h2><select id="starsMonth" style="max-width:200px" onchange="ST.month=this.value;renderStars()">${months.map(m => `<option value="${m}" ${m === ST.month ? 'selected' : ''}>${esc(monthName(m))}</option>`).join('')}</select></div><p class="mini">${esc(t('starsIntro'))}</p>`;
  const box = $('starsList'); box.innerHTML = `<p class="mini">${esc(t('xLoading'))}</p>`;
  try {
    const r = await api('recog', { month: ST.month }), med = ['medal g1', 'medal g2', 'medal g3'];
    box.innerHTML = r.list.length ? `<p class="meta">${esc(t('starsTotal', { n: r.total }))}</p><div class="stars">${r.list.map((x, i) => `<div class="star ${i < 3 ? 'top' : ''}"><span class="rk ${med[i] || ''}">${i < 3 ? ic('medal') : i + 1}</span>${avatar(x.name, 'sm')}<div class="grow"><b>${esc(x.name)}</b><div class="mini">${esc(t('starsDone', { n: x.done }))} · ${esc(t('starsOnTime', { n: x.onTime }))}</div></div>${isAdmin() ? `<button class="btn sm" onclick="openCert(${jsq(x.name)},${x.done},${x.onTime})">${esc(t('starsCert'))}</button>` : ''}</div>`).join('')}</div>` : `<p class="meta">${esc(t('starsNone'))}</p>`;
  } catch (e) { box.innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; }
}
function openCert(name, done, onTime) { CERT = { name, done, onTime, month: ST.month }; go('cert'); }
function renderCert() {
  if (!CERT) return go('stars');
  const ppl = (S.boot && S.boot.people) || [], who = role => (ppl.find(p => p.role === role) || {}).name || '';
  const today = new Date(), g = today.toLocaleDateString(EN() ? 'en-GB' : 'ar-SA-u-ca-gregory-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' });
  let h = ''; try { h = today.toLocaleDateString(EN() ? 'en-u-ca-islamic-umalqura' : 'ar-SA-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) {}
  const k = CERT.onTime ? t('certOnTime', { n: CERT.onTime }) : '';
  $('certBox').innerHTML = `<div class="cert" dir="${EN() ? 'ltr' : 'rtl'}"><div class="cert-in">
    <div class="cert-logos"><img src="icons/school-logo-ahliyya.png" alt="" width="130" height="100"><img src="icons/school-logo.png" alt="" width="200" height="75"></div>
    <h1>${esc(t('certTitle'))}</h1><p class="ct">${esc(t('certTo'))}</p><div class="cn">${esc(t('certMr'))} / ${esc(CERT.name)}</div>
    <p class="cb">${esc(t('certBody', { m: monthName(CERT.month), n: CERT.done, k }))}</p>
    <div class="cdate">${esc(h)}${h ? ' — ' : ''}${esc(g)}</div>
    <div class="csign"><div><span>${esc(t('certSign2'))}</span><b>${esc(who('وكيل الشؤون الأكاديمية'))}</b><i></i></div><div><span>${esc(t('certSign1'))}</span><b>${esc(who('مدير المدرسة'))}</b><i></i></div></div>
  </div></div>`;
}

// ------------------------------------------------------------------ navigation + Home tiles
const _goL = go;
go = function (v) {
  if (v === 'log' && !isAdmin()) v = 'home';
  _goL(v);
  if (!S.me) return;
  if (v === 'log' && !LOG.rows.length) loadLog(true);
  if (v === 'report') {
    const head = document.querySelector('#v-report > .card'); if (head) head.hidden = !isCtrl();          // preview / send / print: the report's readers only
    if (!isCtrl()) { $('repBox').hidden = false; $('repBox').innerHTML = `<p class="meta">${esc(t(isAdmin() ? 'repTimesOnly' : 'repOnlyCtrl'))}</p>`; if (isAdmin()) renderAuto(); else $('autoBox').innerHTML = ''; }   // app admins: the send times
    else { renderAuto(); if ($('repBox').hidden) repPreview(); }
  }
  if (v === 'stars') renderStars();
  if (v === 'cert') renderCert();
};
const _setStageL = typeof setStage === 'function' ? setStage : null;
if (_setStageL) setStage = function () { const r = _setStageL.apply(this, arguments); if ((document.querySelector('.view.on') || {}).id === 'v-dash') drawProgress(false); return r; };
TILES.splice(TILES.findIndex(x => x[0] === 'dash') + 1, 0, ['stars', 'trophy', 'tStars', 'tStarsD']);
TILES.splice(TILES.findIndex(x => x[0] === 'send') + 1, 0, ['report', 'file-text', 'tReport', 'tReportD', 3], ['log', 'scroll-text', 'tLog', 'tLogD', 1]);
