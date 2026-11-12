/* =============================================================================
 *  home.js — منصة الأندلس ١٤٤٨: home screen, one search, first-time guide, security screens,
 *  dashboard chart, Excel / PDF export, local caches. Loaded after app.js and plat.js.
 * ========================================================================== */
'use strict';

// ------------------------------------------------------------------ texts
Object.assign(I18N.ar, {
  navHome: 'الرئيسية', homeHello: 'مرحباً، {n}', homeSub: 'العام الدراسي {y}',
  gSearchPh: 'ابحث في البرامج والمؤشرات وأوراق المنصة…', gProgs: 'البرامج', gInds: 'المؤشرات', gSheets: 'أوراق المنصة', gNone: 'لا نتائج مطابقة', gMore: 'و{n} أخرى…',
  stMine: 'برامجي', stAllProgs: 'كل البرامج', stLate: 'متأخرة', stSoon: 'قريبة', stDone: 'مكتملة',
  tInd: 'المؤشرات', tIndD: 'تعريف كل مؤشر ومستهدفاته وتقدّم برامجه', tMine: 'برامجي', tMineD: 'البرامج التي تنفّذها أو تتابعها', tQuick: 'إدخال سريع', tQuickD: 'تواريخ وحالات عدة برامج دفعة واحدة',
  tAll: 'كل البرامج', tAllD: 'بحث وتصفية وتصدير إلى Excel', tDash: 'لوحة المتابعة', tDashD: 'المؤشرات الرئيسة والمتأخر والقادم', tPlat: 'المنصة الشاملة', tPlatD: 'أوراق المنصة كما هي، بالأيقونات',
  tPeople: 'جهات الاتصال والصلاحيات', tPeopleD: 'البريد والواتساب وكلمات المرور والتعديل', tSend: 'مركز الإرسال', tSendD: 'إرسال البرامج وبيانات الدخول', tMe: 'حسابي', tMeD: 'بياناتي واللغة وكلمة المرور والأمان',
  guideTitle: 'جولة سريعة', guide1: 'البلاطات في الرئيسية تفتح كل أقسام المنصة بضغطة واحدة.', guide2: 'السهم ↗ بجانب أي برنامج أو مؤشر يفتح مكانه بالضبط في المنصة الشاملة.',
  guide3: 'من «برامجي» حدّث حالة برنامجك بزر ▶ ابدأ أو ✅ اكتمل، وأضف رابط الشواهد.', guideOk: 'فهمت',
  pfTitle: 'اختر كلمة مرور جديدة', pfIntro: 'لحماية حسابك، استبدل كلمة المرور التي استلمتها من المدرسة بكلمة مرور خاصة بك لا يعرفها غيرك.',
  pfBtn: 'حفظ والمتابعة', pfDone: '✅ تم حفظ كلمة المرور الجديدة',
  rLen: '8 خانات على الأقل', rLet: 'حرف إنجليزي', rDig: 'رقم', rSym: 'رمز مثل @ # $ !', rSpace: 'بدون مسافات', pwWeak: 'ضعيفة', pwOkay: 'مقبولة', pwStrong: 'قوية',
  secTitle: '🛡 الأمان', secSession: 'تنتهي الجلسة تلقائياً بعد 7 أيام دون استخدام. تغيير كلمة المرور يُخرج حسابك من كل الأجهزة الأخرى.',
  logoutAllBtn: '🚪 تسجيل الخروج من كل الأجهزة الأخرى', confirmLogoutAll: 'تسجيل الخروج من كل الأجهزة الأخرى؟ يبقى هذا الجهاز متصلاً.', loggedOutAll: '✅ خرج حسابك من كل الأجهزة الأخرى',
  donutTitle: 'توزيع البرامج حسب الحالة', exportXlsx: '⬇️ تصدير Excel', printPdf: '🖨 طباعة / PDF', exporting: 'جارٍ تجهيز ملف Excel…', exported: '✅ نُزّل ملف Excel ({n} برنامجاً)',
  xId: 'الرمز', xStage: 'المرحلة', xCode: 'رمز المؤشر', xInd: 'المؤشر', xProg: 'البرنامج', xExec: 'المنفّذ', xFollow: 'المتابع', xStart: 'البداية', xEnd: 'النهاية', xStatus: 'الحالة', xPct: 'نسبة الإنجاز', xAlert: 'التنبيه', xEvid: 'الشواهد', xNotes: 'ملاحظات',
  printedOn: 'طُبع في {d}'
});
Object.assign(I18N.en, {
  navHome: 'Home', homeHello: 'Hello, {n}', homeSub: 'School year {y}',
  gSearchPh: 'Search programs, indicators and platform sheets…', gProgs: 'Programs', gInds: 'Indicators', gSheets: 'Platform sheets', gNone: 'No matches', gMore: 'and {n} more…',
  stMine: 'My programs', stAllProgs: 'All programs', stLate: 'Overdue', stSoon: 'Coming up', stDone: 'Completed',
  tInd: 'Indicators', tIndD: 'Definitions, targets and program progress', tMine: 'My programs', tMineD: 'Programs you implement or follow', tQuick: 'Quick entry', tQuickD: 'Dates and status for many programs at once',
  tAll: 'All programs', tAllD: 'Search, filter and export to Excel', tDash: 'Dashboard', tDashD: 'Key figures, overdue and upcoming', tPlat: 'The platform', tPlatD: 'The platform sheets, by icons',
  tPeople: 'Contacts & permissions', tPeopleD: 'E-mail, WhatsApp, passwords and editing', tSend: 'Send centre', tSendD: 'Send programs and sign-in details', tMe: 'My account', tMeD: 'My details, language, password and security',
  guideTitle: 'Quick tour', guide1: 'The tiles on Home open every part of the platform in one tap.', guide2: 'The ↗ arrow next to any program or indicator opens its exact place in the platform.',
  guide3: 'In “My programs”, update a program with ▶ Start or ✅ Done and add the evidence link.', guideOk: 'Got it',
  pfTitle: 'Choose a new password', pfIntro: 'To protect your account, replace the password you received from the school with your own password that nobody else knows.',
  pfBtn: 'Save and continue', pfDone: '✅ Your new password is saved',
  rLen: 'at least 8 characters', rLet: 'an English letter', rDig: 'a digit', rSym: 'a symbol like @ # $ !', rSpace: 'no spaces', pwWeak: 'weak', pwOkay: 'fair', pwStrong: 'strong',
  secTitle: '🛡 Security', secSession: 'Your session ends automatically after 7 days without use. Changing your password signs you out on every other device.',
  logoutAllBtn: '🚪 Sign out on all other devices', confirmLogoutAll: 'Sign out on all other devices? This device stays signed in.', loggedOutAll: '✅ Signed out on all other devices',
  donutTitle: 'Programs by status', exportXlsx: '⬇️ Export to Excel', printPdf: '🖨 Print / PDF', exporting: 'Preparing the Excel file…', exported: '✅ Excel file downloaded ({n} programs)',
  xId: 'ID', xStage: 'Stage', xCode: 'Indicator code', xInd: 'Indicator', xProg: 'Program', xExec: 'Implementer', xFollow: 'Follower', xStart: 'Start', xEnd: 'End', xStatus: 'Status', xPct: 'Progress %', xAlert: 'Alert', xEvid: 'Evidence', xNotes: 'Notes',
  printedOn: 'Printed on {d}'
});
Object.assign(I18N.ar, {
  schoolA: 'مدرسة الأندلس الأهلية الابتدائية', schoolB: 'مدرسة الأندلس العالمية (الابتدائية والمتوسطة)',
  welcomeTitle: 'أهلاً وسهلاً بكم في منصة الأندلس ١٤٤٨',
  welcomeMsg: 'المساحة الموحّدة لمتابعة مؤشرات الأداء وبرامج الخطة التشغيلية للعام الدراسي 2026 / 2027، نعمل فيها معاً بروح الفريق الواحد نحو التميّز والريادة.'
});
Object.assign(I18N.en, {
  schoolA: 'Al-Andalus Private Elementary School', schoolB: 'Al-Andalus International School (Elementary & Intermediate)',
  welcomeTitle: 'Welcome to Andalus Platform 1448',
  welcomeMsg: 'One shared place to follow our performance indicators and operational-plan programs for the 2026/2027 school year — working together as one team towards excellence.'
});
Object.assign(I18N.ar.err, { MUST_CHANGE_PW: 'اختر كلمة مرور جديدة أولاً', PIN_SAME: 'كلمة المرور الجديدة يجب أن تختلف عن الحالية' });
Object.assign(I18N.en.err, { MUST_CHANGE_PW: 'Please choose a new password first', PIN_SAME: 'The new password must be different from the current one' });

// ------------------------------------------------------------------ navigation: home first, forced password change blocks the rest
const _goHome = go;
go = function (v) {
  if (S.me && S.mustChange && !['login', 'loading', 'pwforce'].includes(v)) v = 'pwforce';
  _goHome(v);
  const nav = $('nav'); if (nav) nav.hidden = !S.me || v === 'pwforce';            // nothing else is reachable until the new password is saved
  if (v === 'home') renderHome();
  if (v === 'pwforce') renderPwForce();
};
const TILES = [
  ['ind', 'target', 'tInd', 'tIndD'], ['mine', 'clipboard-list', 'tMine', 'tMineD'], ['quick', 'zap', 'tQuick', 'tQuickD'], ['all', 'search', 'tAll', 'tAllD'],
  ['dash', 'chart-column', 'tDash', 'tDashD'], ['emp', 'user-check', 'tEmp', 'tEmpD', 1], ['plat', 'table-2', 'tPlat', 'tPlatD'], ['people', 'users', 'tPeople', 'tPeopleD', 1], ['send', 'send', 'tSend', 'tSendD', 1], ['me', 'user-round', 'tMe', 'tMeD']
];
function renderHome() {
  if (!S.me || !S.boot) return;
  $('homeHello').textContent = t('homeHello', { n: myName() });
  $('homeSub').textContent = t('homeSub', { s: S.boot.school || '', y: S.boot.year || '' });
  // leadership sees the whole school; everyone else sees their own programs
  const n = myName(), whole = isAdmin(), mine = whole ? S.programs : S.programs.filter(p => isExec(n, p) || isFollow(n, p)), scope = whole ? 'all' : 'mine';
  const st = [['all', 'clipboard-list', t(whole ? 'stAllProgs' : 'stMine'), mine.length, ''], ['late', 'octagon-x', t('stLate'), applyFilter(mine, 'late').length, 'late'],
    ['soon', 'alarm-clock', t('stSoon'), applyFilter(mine, 'soon').length, 'soon'], ['done', 'circle-check', t('stDone'), applyFilter(mine, 'done').length, 'ok']];
  $('homeStats').innerHTML = st.map(x => `<button class="hstat ${x[4]}" onclick="S.scope='${scope}';S.role='all';S.filter='${x[0]}';go('mine')">${ic(x[1])}<b>${x[3]}</b><span>${esc(x[2])}</span></button>`).join('');
  const adm = isAdmin();
  $('homeTiles').innerHTML = TILES.filter(x => !x[4] || (x[4] === 2 ? isCtrl() : x[4] === 3 ? (isCtrl() || adm) : adm)).map(x => `<button class="htile" onclick="go('${x[0]}')"><span class="hic">${ic(x[1])}</span><span class="ht">${esc(t(x[2]))}</span><span class="hd">${esc(t(x[3]))}</span></button>`).join('');
  renderGuide();
}
function dismissGuide() { store.set('guideDone|' + nkey(myName()), true); renderGuide(); }
function renderGuide() {
  const g = $('guide'), k = 'guideDone|' + nkey(myName());
  if (store.get(k, false)) { g.hidden = true; return; }
  g.hidden = false;
  g.innerHTML = `<div class="row between"><b>${ic('sparkles')} ${esc(t('guideTitle'))}</b><button class="btn sm" onclick="dismissGuide()">${esc(t('guideOk'))}</button></div>
    <ol class="steps"><li>${esc(t('guide1'))}</li><li>${esc(t('guide2'))}</li><li>${esc(t('guide3'))}</li></ol>`;
}

// ------------------------------------------------------------------ one search: programs · indicators · platform sheets
function gSearch() {
  const box = $('gResults'), raw = ($('gq').value || '').trim(), q = nkey(raw);
  if (q.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
  const has = s => nkey(s).indexOf(q) >= 0;
  const progs = S.programs.filter(p => has([p.program, p.id, p.icode, p.ind, DATA_EN.ind[p.icode] || '', p.presp, p.iresp].join(' ')));
  const indMap = {}; (S.boot.indicators || []).forEach(i => { if (!indMap[i.code]) indMap[i.code] = i; });
  ((P.model && P.model.indicators) || []).forEach(i => { if (!indMap[i.code]) indMap[i.code] = i; });
  const inds = Object.values(indMap).filter(i => has(i.code + ' ' + i.name + ' ' + (DATA_EN.ind[i.code] || '')));
  const tabs = (P.tabs || store.get('ptabs', { tabs: [] }).tabs || []).filter(x => has(x.title));
  const sec = (title, items, more) => items.length ? `<div class="gsec"><div class="gh">${esc(title)}</div>${items.join('')}${more > 0 ? `<div class="mini gmore">${esc(t('gMore', { n: more }))}</div>` : ''}</div>` : '';
  const progBtn = p => `<button class="gitem" onclick="gOpenProg('${esc(p.id)}')">${ic('clipboard-list')}<span><b>${esc(p.program)}</b><small>${esc(p.id)} · ${esc(p.icode)} · ${esc(tStage(p.stage))}</small></span></button>`;
  const indBtn = i => `<button class="gitem" onclick="gOpenInd('${esc(i.code)}')">${ic('target')}<span><b>${esc(tInd(i.code, i.name))}</b><small>${esc(i.code)}</small></span></button>`;
  const tabBtn = x => `<button class="gitem" onclick="gOpenTab(${+x.gid})">${ic('table-2')}<span><b>${esc(x.title)}</b></span></button>`;
  const html = sec(t('gInds'), inds.slice(0, 5).map(indBtn), inds.length - 5) + sec(t('gProgs'), progs.slice(0, 8).map(progBtn), progs.length - 8) + sec(t('gSheets'), tabs.slice(0, 4).map(tabBtn), tabs.length - 4);
  box.innerHTML = html || `<div class="empty">${esc(t('gNone'))}</div>`; box.hidden = false;
}
function gClear() { $('gq').value = ''; $('gResults').hidden = true; }
function gOpenProg(id) { gClear(); go('all'); $('q').value = id; $('fStage').value = ''; $('fStatus').value = ''; renderAll(); }
function gOpenInd(code) { gClear(); go('ind'); $('indQ').value = code; P.indStage = ''; renderInd(); }
function gOpenTab(gid) { gClear(); openPlat(gid, 1); }

// ------------------------------------------------------------------ forced password change (first sign-in / after an admin reset)
const PW_RULES = [['rLen', s => s.length >= 8], ['rLet', s => /[A-Za-z]/.test(s)], ['rDig', s => /\d/.test(s)], ['rSym', s => /[^A-Za-z0-9\s]/.test(s)], ['rSpace', s => s.length > 0 && !/\s/.test(s)]];
function pwMeter(inputId, barId, rulesId) {
  const s = $(inputId).value, ok = PW_RULES.map(r => r[1](s)), n = ok.filter(Boolean).length + (s.length >= 12 ? 1 : 0);
  $(rulesId).innerHTML = PW_RULES.map((r, i) => `<li class="${ok[i] ? 'ok' : ''}">${ic(ok[i] ? 'circle-check' : 'circle-x')}${esc(t(r[0]))}</li>`).join('');
  const lvl = !s ? 0 : !ok.every(Boolean) ? 1 : n >= 6 ? 3 : 2, bar = $(barId);
  bar.style.width = [0, 34, 67, 100][lvl] + '%'; bar.className = ['', 'weak', 'okay', 'strong'][lvl]; bar.title = lvl ? t(['', 'pwWeak', 'pwOkay', 'pwStrong'][lvl]) : '';
}
function renderPwForce() { $('pfOld').value = S._typedPw || ''; $('pfNew').value = $('pfNew2').value = ''; pwMeter('pfNew', 'pfBar', 'pfRules'); setTimeout(() => $('pfNew').focus(), 50); }
async function forceChange() {
  const o = $('pfOld').value.trim(), n = $('pfNew').value.trim(), n2 = $('pfNew2').value.trim();
  if (!o) return toast(t('needPw'));
  if (!pwOk(n)) return toast(errText('PIN_FORMAT'), 6000);
  if (n !== n2) return toast(t('pwMismatch'));
  if (n === o) return toast(errText('PIN_SAME'), 6000);
  try {
    const r = await api('setPin', { oldPin: o, newPin: n });
    S.token = r.token; store.set('tr_token', S.token); S.mustChange = false; S._typedPw = ''; store.del('mustChange');
    document.querySelectorAll('.view').forEach(x => x.classList.toggle('on', x.id === 'v-loading'));
    await refresh(true); toast(t('pfDone'), 4000);
  } catch (e) { toast('❌ ' + e.message, 6000); }
}
// the api() wrapper in app.js throws coded errors → a forced change can also be discovered on any call
window.addEventListener('unhandledrejection', ev => { if (ev.reason && ev.reason.code === 'MUST_CHANGE_PW') { S.mustChange = true; store.set('mustChange', true); go('pwforce'); } });

// ------------------------------------------------------------------ security card in «My account»
async function logoutAll() {
  if (!confirm(t('confirmLogoutAll'))) return;
  try { const r = await api('logoutAll'); S.token = r.token; store.set('tr_token', S.token); toast(t('loggedOutAll'), 4000); } catch (e) { toast('❌ ' + e.message, 6000); }
}

// ------------------------------------------------------------------ dashboard: KPI icons + status donut + print
const _renderDash = renderDash;
renderDash = function () {
  _renderDash();
  const icons = ['layers', 'circle-check', 'play', 'clock', 'octagon-x', 'calendar', 'calendar-days', 'gauge'];
  document.querySelectorAll('#kpis .kpi').forEach((k, i) => { if (!k.querySelector('.kic')) k.insertAdjacentHTML('afterbegin', `<span class="kic">${ic(icons[i] || 'layers')}</span>`); });
  drawDonut();
};
let dashProgs = () => S.programs;                                       // dashemp.js narrows it to one employee
function drawDonut() {
  const box = $('donut'); if (!box) return;
  const L = dashProgs(), counts = {}; L.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
  const order = (S.boot.statuses || Object.keys(counts)).filter(s => counts[s]), total = L.length || 1;
  const R = 54, C = 2 * Math.PI * R; let acc = 0;
  const arcs = order.map(s => { const v = counts[s], len = C * v / total, seg = `<circle r="${R}" cx="70" cy="70" fill="none" stroke="${STATUS_COLOR[s] || '#94a3b8'}" stroke-width="22" stroke-dasharray="${len} ${C - len}" stroke-dashoffset="${-acc}"><title>${esc(tStatus(s))}: ${v}</title></circle>`; acc += len; return seg; }).join('');
  const done = counts['مكتمل'] || 0;
  box.innerHTML = `<div class="donut"><svg viewBox="0 0 140 140" role="img" aria-label="${esc(t('donutTitle'))}"><g transform="rotate(-90 70 70)"><circle r="${R}" cx="70" cy="70" fill="none" stroke="#eef1f6" stroke-width="22"/>${arcs}</g>
      <text x="70" y="66" text-anchor="middle" class="dn-big">${Math.round(100 * done / total)}%</text><text x="70" y="86" text-anchor="middle" class="dn-sm">${esc(tStatus('مكتمل'))}</text></svg>
    <ul class="legend">${order.map(s => `<li><i style="background:${STATUS_COLOR[s] || '#94a3b8'}"></i>${esc(tStatus(s))}<b>${counts[s]}</b></li>`).join('')}</ul></div>`;
}
function printPage() { document.body.dataset.printed = t('printedOn', { d: new Date().toLocaleString(EN() ? 'en-GB' : 'ar-SA') }); window.print(); }

// ------------------------------------------------------------------ Excel export (SheetJS, loaded only when needed, from this site)
let xlsxReady = null;
const loadXlsx = () => xlsxReady || (xlsxReady = new Promise((ok, bad) => { const s = document.createElement('script'); s.src = 'vendor/xlsx.mini.min.js'; s.onload = ok; s.onerror = () => { xlsxReady = null; bad(new Error(t('netFail'))); }; document.head.appendChild(s); }));
function currentAllList() {
  const q = ($('q').value || '').trim().toLowerCase(), st = $('fStage').value, fs = $('fStatus').value;
  let list = S.programs.filter(p => (!st || p.stage === st));
  if (fs === '__nodate') list = list.filter(p => !p.start && !p.end); else if (fs === '__late') list = list.filter(p => (p.alert || '').startsWith('⛔')); else if (fs) list = list.filter(p => p.status === fs);
  if (q) list = list.filter(p => [p.program, p.ind, DATA_EN.ind[p.icode] || '', p.icode, p.presp, p.iresp, p.id].join(' ').toLowerCase().includes(q));
  return list;
}
async function exportXlsx(which) {
  const list = Array.isArray(which) ? which : which === 'mine' ? applyFilter(mineSet(), S.filter) : currentAllList();
  toast(t('exporting'), 20000);
  try {
    await loadXlsx();
    const H = ['xId', 'xStage', 'xCode', 'xInd', 'xProg', 'xExec', 'xFollow', 'xStart', 'xEnd', 'xStatus', 'xPct', 'xAlert', 'xEvid', 'xNotes'].map(k => t(k));
    const rows = list.map(p => [p.id, tStage(p.stage), p.icode, tInd(p.icode, p.ind), p.program, p.presp || '', p.iresp || '', p.start ? new Date(p.start + 'T12:00:00') : '', p.end ? new Date(p.end + 'T12:00:00') : '',
      tStatus(p.status), (p.status === 'مكتمل' ? 100 : +p.pct || 0) / 100, String(tAlert(p.alert) || '').replace(/^[^\p{L}\p{N}]+/u, ''), p.evid || '', p.notes || '']);
    const ws = XLSX.utils.aoa_to_sheet([H].concat(rows), { cellDates: true, dateNF: 'dd/mm/yyyy' });
    ws['!cols'] = [10, 18, 11, 30, 34, 22, 22, 12, 12, 13, 11, 22, 30, 30].map(w => ({ wch: w }));
    ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: H.length - 1 } }) };
    for (let r = 1; r <= rows.length; r++) { const c = ws[XLSX.utils.encode_cell({ r, c: 10 })]; if (c) c.z = '0%'; [7, 8].forEach(k => { const d = ws[XLSX.utils.encode_cell({ r, c: k })]; if (d && d.t === 'd') d.z = 'dd/mm/yyyy'; }); }
    const wb = XLSX.utils.book_new(); wb.Workbook = { Views: [{ RTL: !EN() }] };
    XLSX.utils.book_append_sheet(wb, ws, EN() ? 'Programs' : 'البرامج');
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, (EN() ? 'Andalus-Platform-programs-' : 'منصة-الأندلس-البرامج-') + stamp + '.xlsx');
    toast(t('exported', { n: rows.length }), 4000);
  } catch (e) { toast('❌ ' + e.message, 6000); }
}

// ------------------------------------------------------------------ local caches (instant screens; refreshed in the background)
const _loadModel = loadModel;
loadModel = async function (force) {
  if (P.model && !force) return P.model;
  const c = store.get('pmodel', null);
  if (c && c.model && !force) {
    P.model = c.model;
    if (Date.now() - (c.at || 0) > 30 * 60000) _loadModel(true).then(m => { store.set('pmodel', { at: Date.now(), model: m }); if ($('v-ind').classList.contains('on')) renderInd(); }).catch(() => {});
    return P.model;
  }
  const m = await _loadModel(true); store.set('pmodel', { at: Date.now(), model: m }); return m;
};
const _logout = logout;
logout = function (silent) { ['pmodel', 'ptabs', 'mustChange'].forEach(store.del); P.model = null; P.tabs = null; P.sheet = null; P.gid = null; S.mustChange = false; _logout(silent); };

// sliding session: every bootstrap returns a fresh 7-day token
const _refresh = refresh;
refresh = async function (silent) {
  await _refresh(silent);
  if (S.boot && S.boot.token) { S.token = S.boot.token; store.set('tr_token', S.token); delete S.boot.token; }
};
S.mustChange = !!store.get('mustChange', false);
