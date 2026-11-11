/* =============================================================================
 *  prog.js — one sheet per program: evidence files and links (kept in Drive, one folder per indicator),
 *  comments, change history, completion approval and re-assignment. Cards get a small row of buttons.
 *  Also the «طلبات الاعتماد» screen. Loaded after pwshow.js.
 * ========================================================================== */
'use strict';
Object.assign(I18N.ar, {
  xEv: 'الشواهد', xEvPlat: 'شاهد المنصة', xCm: 'التعليقات', xHist: 'السجل', xApprove: 'اعتماد', xPending: 'بانتظار الاعتماد', xDetails: 'التفاصيل',
  xSentForApproval: '✅ حُفظ — أُرسل طلب اعتماد الإنجاز إلى المتابع ({n})', xNotFound: 'البرنامج غير موجود في القائمة الحالية',
  xUpload: 'رفع ملف', xAddLink: '🔗 إضافة رابط', xLinkUrl: 'الرابط (https://…)', xLinkName: 'اسم مختصر (اختياري)', xAdd: 'إضافة', xOpen: 'فتح',
  xEvHint: 'صور، PDF، Word، Excel، PowerPoint أو فيديو MP4 — حتى 8 ميغابايت للملف. الصور تُصغَّر تلقائياً. تُحفظ في مجلد المؤشر على Drive المدرسة.',
  xEvNone: 'لا توجد شواهد بعد.', xUploading: 'جارٍ رفع «{n}»…', xUploaded: '✅ رُفعت الشواهد', xBigFile: 'الملف «{n}» أكبر من 8 ميغابايت', xBadType: 'نوع الملف «{n}» غير مدعوم',
  xConfirmDel: 'حذف هذا الشاهد؟', xDeleted: 'حُذف', xLoading: 'جارٍ التحميل…', xCmNone: 'لا توجد تعليقات بعد.', xCmPh: 'اكتب تعليقاً…', xSend: 'إرسال',
  xConfirmCmDel: 'حذف التعليق؟', xHistNone: 'لا يوجد سجل لهذا البرنامج بعد.', xReadOnly: 'للاطلاع فقط',
  xApTitle: 'طلب اعتماد الإنجاز', xApFrom: 'أرسله {n} في {d}', xApWait: 'بانتظار قرار المتابع أو الإدارة.', xApNote: 'ملاحظة (مطلوبة عند عدم الاعتماد)',
  xApOk: '✔ اعتماد الإنجاز', xApNo: 'عدم الاعتماد', xNeedNote: 'اكتب سبب عدم الاعتماد', xApDone: '✅ اعتُمد الإنجاز', xApRejected: 'أُعيد البرنامج للمنفّذ مع ملاحظتك',
  xAssign: 'إسناد البرنامج إلى', xAssignBtn: 'إسناد', xAssigned: '✅ أُسند البرنامج إلى {n}', xExec: 'المنفّذ', xFollow: 'المتابع',
  apprTitle: 'طلبات اعتماد الإنجاز', apprIntro: 'عندما يُنهي المنفّذ برنامجاً يُرسَل للمتابع (أو للإدارة إذا كان المتابع هو المنفّذ) لاعتماده، ولا يُحسب «مكتملاً» قبل الاعتماد.',
  apprMine: 'بانتظار قرارك', apprSent: 'طلباتي', apprNone: 'لا توجد طلبات.', apStWait: 'بانتظار الاعتماد', apStOk: 'معتمد', apStNo: 'لم يُعتمد',
  navAppr: 'الاعتماد', tAppr: 'الاعتماد', tApprD: 'طلبات اعتماد الإنجاز'
});
Object.assign(I18N.en, {
  xEv: 'Evidence', xEvPlat: 'Platform evidence', xCm: 'Comments', xHist: 'History', xApprove: 'Approve', xPending: 'Awaiting approval', xDetails: 'Details',
  xSentForApproval: '✅ Saved — sent to the follower for approval ({n})', xNotFound: 'This program is not in the current list',
  xUpload: 'Upload a file', xAddLink: '🔗 Add a link', xLinkUrl: 'Link (https://…)', xLinkName: 'Short name (optional)', xAdd: 'Add', xOpen: 'Open',
  xEvHint: 'Photos, PDF, Word, Excel, PowerPoint or MP4 video — up to 8 MB each. Photos are shrunk automatically. Saved in the indicator’s folder in the school Drive.',
  xEvNone: 'No evidence yet.', xUploading: 'Uploading “{n}”…', xUploaded: '✅ Evidence uploaded', xBigFile: '“{n}” is larger than 8 MB', xBadType: '“{n}” is not a supported file type',
  xConfirmDel: 'Delete this evidence?', xDeleted: 'Deleted', xLoading: 'Loading…', xCmNone: 'No comments yet.', xCmPh: 'Write a comment…', xSend: 'Send',
  xConfirmCmDel: 'Delete the comment?', xHistNone: 'No history for this program yet.', xReadOnly: 'View only',
  xApTitle: 'Completion approval request', xApFrom: 'Sent by {n} on {d}', xApWait: 'Waiting for the follower or management.', xApNote: 'Note (required when not approving)',
  xApOk: '✔ Approve completion', xApNo: 'Do not approve', xNeedNote: 'Write the reason', xApDone: '✅ Completion approved', xApRejected: 'Returned to the person doing it with your note',
  xAssign: 'Assign the program to', xAssignBtn: 'Assign', xAssigned: '✅ Assigned to {n}', xExec: 'Carried out by', xFollow: 'Followed up by',
  apprTitle: 'Completion approvals', apprIntro: 'When a program is finished it goes to its follower (or to management when the follower is the same person) for approval; it counts as “Completed” only after approval.',
  apprMine: 'Waiting for you', apprSent: 'My requests', apprNone: 'No requests.', apStWait: 'Awaiting approval', apStOk: 'Approved', apStNo: 'Not approved',
  navAppr: 'Approvals', tAppr: 'Approvals', tApprD: 'Completion approval requests'
});
Object.assign(I18N.ar.err, { BAD_FILE: 'نوع الملف غير مدعوم أو الملف تالف', FILE_BIG: 'الملف أكبر من 8 ميغابايت', BAD_LINK: 'الرابط يجب أن يبدأ بـ https://', EMPTY: 'اكتب نصاً أولاً', ALREADY_DECIDED: 'سبق اتخاذ قرار في هذا الطلب', BAD_PUSH: 'تعذّر تفعيل التنبيهات على هذا المتصفح' });
Object.assign(I18N.en.err, { BAD_FILE: 'Unsupported or damaged file', FILE_BIG: 'The file is larger than 8 MB', BAD_LINK: 'The link must start with https://', EMPTY: 'Write something first', ALREADY_DECIDED: 'This request was already decided', BAD_PUSH: 'Notifications could not be enabled in this browser' });

const jsq = s => esc(JSON.stringify(String(s)));                        // a value inside onclick="…"
const fmtDT = iso => { if (!iso) return '—'; const d = new Date(iso); if (isNaN(d)) return '—'; return d.toLocaleString(EN() ? 'en-GB' : 'ar-SA-u-ca-gregory-nu-latn', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); };
const fmtSize = n => n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
S.x = store.get('xstate', null) || { ev: {}, cm: {}, pend: {}, apMine: 0, unread: 0, pk: 0, push: 0, vapid: '', ctrl: false };
const allProgs = () => { const a = S.stageActive; S.stageActive = false; const l = S.programs; S.stageActive = a; return l; };
const progOf = id => allProgs().find(p => String(p.id) === String(id));
const touch = p => !!p && (isAdmin() || owns(myName(), p.presp, p.iresp));
const approver = p => !!p && (isAdmin() || (isFollow(myName(), p) && !isExec(myName(), p)));

// ------------------------------------------------------------------ state (counts, approvals, unread) after every refresh
async function syncX() {
  if (!S.me || !S.online) return;
  try { const r = await api('xState'); delete r.ok; S.x = r; store.set('xstate', r); paintX(); } catch (e) {}
}
function paintX() {
  document.querySelectorAll('[data-x]').forEach(el => { const p = progOf(el.dataset.x); if (p) el.innerHTML = xRow(p); });
  if (typeof paintBell === 'function') paintBell();
  const on = (document.querySelector('.view.on') || {}).id;
  if (on === 'v-home') renderHome();
}
const _refreshX = refresh;
refresh = async function (silent) { await _refreshX(silent); syncX(); };
const _logoutX = logout;
logout = function (silent) { store.del('xstate'); S.x = { ev: {}, cm: {}, pend: {}, apMine: 0, unread: 0, pk: 0, push: 0, vapid: '', ctrl: false }; closeProg(true); _logoutX(silent); };

// ------------------------------------------------------------------ cards: evidence · comments · history · approval
function xRow(p) {
  const id = String(p.id), ev = S.x.ev[id] || 0, cm = S.x.cm[id] || 0, pd = S.x.pend[id];
  return (pd ? `<span class="xbadge wait">${ic('hourglass')} ${esc(t('xPending'))}</span>` : '') +
    `<button class="xb" onclick="openProg(${jsq(id)},'ev')">${ic('paperclip')}<span>${esc(t('xEv'))}</span>${ev ? `<b>${ev}</b>` : ''}</button>` +
    `<button class="xb" onclick="openProg(${jsq(id)},'cm')">${ic('message-circle')}<span>${esc(t('xCm'))}</span>${cm ? `<b>${cm}</b>` : ''}</button>` +
    `<button class="xb" onclick="openProg(${jsq(id)},'hist')">${ic('history')}<span>${esc(t('xHist'))}</span></button>` +
    (pd && approver(p) ? `<button class="xb ok" onclick="openProg(${jsq(id)},'ap')">${ic('badge-check')}<span>${esc(t('xApprove'))}</span></button>` : '');
}
const _cardX = card;
card = function (p) {
  const h = _cardX(p);
  if (!S.me || !touch(p)) return h;
  const anchor = `<div id="e-${esc(p.id)}"></div>`;
  let out = h;
  if (S.x.pend[String(p.id)]) out = out.replace(/<button class="btn sm ok" onclick="quickStatus\('[^']*','مكتمل'\)">[\s\S]*?<\/button>/, '');   // already waiting for approval
  out = out.replace(`rel="noopener">${t('evidence')}</a>`, `rel="noopener">${ic('external-link')} ${esc(t('xEvPlat'))}</a>`);
  return out.replace(anchor, `<div class="xrow" data-x="${esc(p.id)}">${xRow(p)}</div>` + anchor);
};

// ------------------------------------------------------------------ the program sheet
const PM = { id: null, tab: 'ev', ev: [], pushed: false };
function openProg(id, tab) {
  const p = progOf(id); if (!p) return toast(t('xNotFound'), 4000);
  PM.id = String(p.id); PM.tab = tab === 'ap' ? 'ev' : (tab || 'ev'); PM.focusAp = tab === 'ap';
  $('xModal').hidden = false; document.body.classList.add('xm-open');
  if (!PM.pushed) { try { history.pushState({ xm: 1 }, ''); PM.pushed = true; } catch (e) {} }
  renderProg();
}
function closeProg(silent) {
  const m = $('xModal'); if (!m || m.hidden) return;
  m.hidden = true; document.body.classList.remove('xm-open'); PM.id = null;
  if (PM.pushed && !silent) { PM.pushed = false; try { history.back(); } catch (e) {} } else PM.pushed = false;
}
window.addEventListener('popstate', () => { if (PM.pushed) { PM.pushed = false; closeProg(true); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && PM.id) closeProg(); });
function renderProg() {
  const p = progOf(PM.id); if (!p) return closeProg();
  const pd = S.x.pend[PM.id], pct = p.status === 'مكتمل' ? 100 : (+p.pct || 0);
  const names = (S.boot.people || []).map(x => x.name).filter(Boolean);
  let h = `<div class="xm-head"><div class="meta">${esc(tStage(p.stage))} · <span class="tag">${esc(p.icode)}</span> ${esc(tInd(p.icode, p.ind))}</div>
    <h2 id="xmTitle">${esc(p.program)}</h2>
    <div class="xm-who"><span>${avatar(p.presp || p.iresp, 'xs')} ${esc(t('xExec'))}: <b>${esc(p.presp || p.iresp || '—')}</b></span><span>${avatar(p.iresp, 'xs')} ${esc(t('xFollow'))}: <b>${esc(p.iresp || '—')}</b></span></div>
    <div class="row between" style="margin-top:8px"><span class="status s-${esc(p.status).replace(/ /g, '-')}">${esc(tStatus(p.status))}</span>${pd ? `<span class="xbadge wait">${ic('hourglass')} ${esc(t('xPending'))}</span>` : ''}<span class="meta">📅 ${fmtD(p.start)} ${EN() ? '→' : '←'} ${fmtD(p.end)}</span></div>
    <div class="bar"><i style="width:${pct}%"></i></div></div>`;
  if (pd) {
    h += `<div class="xm-ap" id="xmAp"><b>${ic('badge-check')} ${esc(t('xApTitle'))}</b><div class="mini">${esc(t('xApFrom', { n: pd.by, d: fmtDT(pd.at) }))}</div>` +
      (approver(p) && editOK() ? `<textarea id="apNote" rows="2" placeholder="${esc(t('xApNote'))}"></textarea><div class="row" style="gap:8px;margin-top:8px"><button class="btn ok" onclick="apDecide(${jsq(pd.rid)},true)">${esc(t('xApOk'))}</button><button class="btn danger" onclick="apDecide(${jsq(pd.rid)},false)">${esc(t('xApNo'))}</button></div>` : `<div class="mini" style="margin-top:6px">${esc(t('xApWait'))}</div>`) + '</div>';
  }
  if (isAdmin() && editOK()) {
    const cur = p.presp || p.iresp, opts = (names.includes(cur) ? names : [cur].concat(names));
    h += `<div class="xm-assign"><label class="f" for="xmResp">${ic('arrow-right-left')} ${esc(t('xAssign'))}</label><div class="row" style="gap:8px;flex-wrap:nowrap"><select id="xmResp">${opts.map(n => `<option ${n === cur ? 'selected' : ''}>${esc(n)}</option>`).join('')}</select><button class="btn sm" onclick="xAssign()">${esc(t('xAssignBtn'))}</button></div></div>`;
  }
  const tabs = [['ev', 'paperclip', 'xEv', S.x.ev[PM.id]], ['cm', 'message-circle', 'xCm', S.x.cm[PM.id]], ['hist', 'history', 'xHist', 0]];
  h += `<div class="xm-tabs" role="tablist">${tabs.map(x => `<button role="tab" aria-selected="${PM.tab === x[0]}" class="${PM.tab === x[0] ? 'on' : ''}" onclick="PM.tab='${x[0]}';renderProg()">${ic(x[1])} ${esc(t(x[2]))}${x[3] ? ` <b>${x[3]}</b>` : ''}</button>`).join('')}</div><div id="xmTab" class="xm-tab"><div class="mini">${esc(t('xLoading'))}</div></div>`;
  $('xmBody').innerHTML = h;
  if (PM.focusAp && $('xmAp')) { PM.focusAp = false; setTimeout(() => { $('xmAp').scrollIntoView({ block: 'center' }); const n = $('apNote'); if (n) n.focus({ preventScroll: true }); }, 60); }
  if (PM.tab === 'ev') loadEv(); else if (PM.tab === 'cm') loadCm(); else loadHist();
}
async function xAssign() {
  const p = progOf(PM.id), to = $('xmResp').value; if (!p || !to || to === (p.presp || p.iresp)) return;
  await persist([{ id: p.id, presp: to }]); toast(t('xAssigned', { n: to }), 4000); if (PM.id) renderProg();
}

// ------------------------------------------------------------------ evidence
const EV_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf', mp4: 'video/mp4',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
const EV_ICON = m => /^image\//.test(m) ? 'image' : m === 'application/pdf' ? 'file-text' : /^video\//.test(m) ? 'play' : /sheet/.test(m) ? 'file-spreadsheet' : /presentation/.test(m) ? 'presentation' : 'file';
async function loadEv() {
  const id = PM.id;
  try { const r = await api('evList', { id }); if (PM.id !== id || PM.tab !== 'ev') return; PM.ev = r.items; S.x.ev[id] = r.items.length; store.set('xstate', S.x); drawEv(); paintRowOf(id); }
  catch (e) { if ($('xmTab')) $('xmTab').innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; }
}
function drawEv() {
  const p = progOf(PM.id), ed = touch(p) && editOK();
  let h = ed ? `<div class="row" style="gap:8px"><label class="btn p sm" for="evFile">${ic('upload')} ${esc(t('xUpload'))}</label><button class="btn sm" onclick="$('evLink').hidden=!$('evLink').hidden">${esc(t('xAddLink'))}</button></div>
    <input type="file" id="evFile" hidden multiple accept="image/*,application/pdf,video/mp4,.pdf,.docx,.xlsx,.pptx,.mp4" onchange="evUpload(this)">
    <div id="evLink" class="ev-link" hidden><input type="url" id="evUrl" placeholder="${esc(t('xLinkUrl'))}" dir="ltr"><input type="text" id="evName" maxlength="80" placeholder="${esc(t('xLinkName'))}"><button class="btn p sm" onclick="evAddLink()">${esc(t('xAdd'))}</button></div>
    <p class="mini" style="margin:6px 0 10px">${esc(t('xEvHint'))}</p>` : `<p class="mini">${esc(t('xReadOnly'))}</p>`;
  h += PM.ev.length ? PM.ev.map(x => `<div class="evi" id="ev-${esc(x.eid)}"><span class="evic">${ic(x.kind === 'link' ? 'link' : EV_ICON(x.mime))}</span>
      <div class="grow"><b class="evn">${esc(x.name)}</b><div class="mini">${esc(x.by)} · ${fmtDT(x.at)}${x.size ? ' · ' + fmtSize(x.size) : ''}</div><div class="evprev"></div></div>
      <button class="btn sm" onclick="evOpen(${jsq(x.eid)})">${esc(t('xOpen'))}</button>${(x.by === myName() || isAdmin()) && editOK() ? `<button class="btn sm danger" aria-label="${esc(t('xConfirmDel'))}" onclick="evDel(${jsq(x.eid)})">${ic('trash-2')}</button>` : ''}</div>`).join('')
    : `<p class="meta">${esc(t('xEvNone'))}</p>`;
  $('xmTab').innerHTML = h;
}
const fileB64 = f => new Promise((ok, bad) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1] || ''); r.onerror = () => bad(new Error(t('netFail'))); r.readAsDataURL(f); });
async function evPrepare(f) {
  const ext = (f.name.split('.').pop() || '').toLowerCase();
  let mime = Object.values(EV_TYPES).includes(f.type) ? f.type : (EV_TYPES[ext] || '');
  if (/^image\//.test(f.type) && !mime) mime = 'image/jpeg';
  if (!mime) throw new Error(t('xBadType', { n: f.name }));
  if (/^image\//.test(mime)) {                                                    // photos → JPEG, longest side 1600 px
    try {
      const img = new Image(); img.src = 'data:' + (f.type || mime) + ';base64,' + await fileB64(f);
      await new Promise((ok, bad) => { if (img.complete && img.naturalWidth) return ok(); img.onload = ok; img.onerror = bad; });
      const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
      let q = 0.82, data = c.toDataURL('image/jpeg', q); while (data.length > 10.5e6 && q > 0.4) { q -= 0.1; data = c.toDataURL('image/jpeg', q); }
      return { mime: 'image/jpeg', data: data.split(',')[1], name: f.name.replace(/\.[^.]+$/, '') + '.jpg' };
    } catch (e) { if (f.type !== 'image/jpeg' && f.type !== 'image/png' && f.type !== 'image/webp') throw new Error(t('xBadType', { n: f.name })); }
  }
  if (f.size > 8 * 1048576) throw new Error(t('xBigFile', { n: f.name }));
  return { mime, data: await fileB64(f), name: f.name };
}
async function evUpload(inp) {
  const files = Array.from(inp.files || []); inp.value = ''; if (!files.length) return;
  const id = PM.id;
  for (const f of files) {
    try { toast(t('xUploading', { n: f.name }), 120000); const x = await evPrepare(f); await api('evAdd', { id, kind: 'file', name: x.name, mime: x.mime, data: x.data }, { timeout: 240000 }); }
    catch (e) { toast('❌ ' + e.message, 7000); if (PM.id === id) loadEv(); return; }
  }
  toast(t('xUploaded'), 3000); if (PM.id === id) loadEv();
}
async function evAddLink() {
  const url = $('evUrl').value.trim(), name = $('evName').value.trim(); if (!url) return;
  try { await api('evAdd', { id: PM.id, kind: 'link', url, name }); loadEv(); } catch (e) { toast('❌ ' + e.message, 6000); }
}
async function evOpen(eid) {
  const it = PM.ev.find(x => x.eid === eid); if (!it) return;
  if (it.kind === 'link') { window.open(it.url, '_blank', 'noopener'); return; }
  const prev = document.querySelector('#ev-' + CSS.escape(eid) + ' .evprev');
  try {
    toast(t('xLoading'), 30000);
    const r = await api('evGet', { eid }, { timeout: 120000 }); toast('', 1);
    if (/^image\//.test(r.mime)) { if (prev) prev.innerHTML = `<img src="data:${esc(r.mime)};base64,${r.data}" alt="${esc(r.name)}">`; return; }
    const bin = atob(r.data), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([u8], { type: r.mime }));
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; if (r.mime !== 'application/pdf') a.download = r.name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 120000);
  } catch (e) { toast('❌ ' + e.message, 6000); }
}
async function evDel(eid) {
  if (!confirm(t('xConfirmDel'))) return;
  try { await api('evDel', { eid }); toast(t('xDeleted')); loadEv(); } catch (e) { toast('❌ ' + e.message, 6000); }
}
function paintRowOf(id) { document.querySelectorAll('[data-x]').forEach(el => { if (el.dataset.x === String(id)) { const p = progOf(id); if (p) el.innerHTML = xRow(p); } }); }

// ------------------------------------------------------------------ comments
async function loadCm() {
  const id = PM.id;
  try { const r = await api('cmList', { id }); if (PM.id === id && PM.tab === 'cm') drawCm(r.items); } catch (e) { if ($('xmTab')) $('xmTab').innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; }
}
function drawCm(items) {
  S.x.cm[PM.id] = items.length; store.set('xstate', S.x); paintRowOf(PM.id);
  const p = progOf(PM.id);
  $('xmTab').innerHTML = (items.length ? `<div class="cms">${items.map(c => `<div class="cm ${c.name === myName() ? 'me' : ''}">${avatar(c.name, 'sm')}<div class="cmb"><div class="cmh"><b>${esc(c.name)}</b><span class="mini">${fmtDT(c.at)}</span>${c.name === myName() || isAdmin() ? `<button class="cmx" aria-label="${esc(t('xConfirmCmDel'))}" onclick="cmDel(${jsq(c.cid)})">${ic('x')}</button>` : ''}</div><div class="cmt">${esc(c.text)}</div></div></div>`).join('')}</div>` : `<p class="meta">${esc(t('xCmNone'))}</p>`) +
    (touch(p) ? `<div class="cm-new"><textarea id="cmText" rows="2" maxlength="1000" placeholder="${esc(t('xCmPh'))}"></textarea><button class="btn p" onclick="cmSend()">${ic('send')} ${esc(t('xSend'))}</button></div>` : '');
  const list = document.querySelector('#xmTab .cms'); if (list) list.scrollTop = list.scrollHeight;
}
async function cmSend() {
  const text = $('cmText').value.trim(); if (!text) return;
  try { const r = await api('cmAdd', { id: PM.id, text }); drawCm(r.items); } catch (e) { toast('❌ ' + e.message, 6000); }
}
async function cmDel(cid) {
  if (!confirm(t('xConfirmCmDel'))) return;
  try { const r = await api('cmDel', { cid }); drawCm(r.items); } catch (e) { toast('❌ ' + e.message, 6000); }
}

// ------------------------------------------------------------------ history
async function loadHist() {
  const id = PM.id;
  try {
    const r = await api('progHistory', { id }); if (PM.id !== id || PM.tab !== 'hist') return;
    $('xmTab').innerHTML = r.items.length ? `<ol class="hist">${r.items.map(x => `<li><div class="mini">${fmtDT(x.at)} · <b>${esc(x.who)}</b></div><div>${esc(x.what)}${x.field && x.field !== x.what ? ` — <span class="meta">${esc(x.field)}</span>` : ''}</div>${x.old || x.now ? `<div class="hchg"><s>${esc(x.old || '—')}</s> ${EN() ? '→' : '←'} <b>${esc(x.now || '—')}</b></div>` : ''}</li>`).join('')}</ol>` : `<p class="meta">${esc(t('xHistNone'))}</p>`;
  } catch (e) { if ($('xmTab')) $('xmTab').innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; }
}

// ------------------------------------------------------------------ approval
async function apDecide(rid, ok, noteOverride) {
  const note = noteOverride !== undefined ? noteOverride : (($('apNote') || {}).value || '').trim();
  if (!ok && !note) { toast(t('xNeedNote'), 4000); const n = $('apNote'); if (n) n.focus(); return; }
  try {
    await api('apDecide', { rid, ok, note });
    toast(ok ? t('xApDone') : t('xApRejected'), 4000);
    const fresh = await api('programs'); S.programs = fresh.programs; S.loadedAt = fresh.at; S.dash = null; store.set('tr_cache', { boot: S.boot, programs: S.programs, at: S.loadedAt });
    await syncX();
    if (PM.id) renderProg();
    const on = (document.querySelector('.view.on') || {}).id; if (on === 'v-appr') renderAppr(); else if (on && !PM.id) go(on.slice(2));
  } catch (e) { toast('❌ ' + e.message, 6000); }
}
async function renderAppr() {
  const box = $('apprList'); if (!box) return;
  $('apprList').previousElementSibling.textContent = t('apprIntro');
  box.innerHTML = `<p class="mini">${esc(t('xLoading'))}</p>`;
  try {
    const r = await api('apList'), mine = r.items.filter(x => x.canDecide), sent = r.items.filter(x => x.by === myName());
    const st = x => x.state === 'معتمد' ? `<span class="apst ok">${esc(t('apStOk'))}</span>` : x.state === 'لم يُعتمد' ? `<span class="apst no">${esc(t('apStNo'))}</span>` : `<span class="apst wait">${esc(t('apStWait'))}</span>`;
    const row = (x, dec) => `<div class="apr"><div class="grow"><b>${esc(x.program)}</b><div class="meta">${esc(tStage(x.stage))} · <span class="tag">${esc(x.icode)}</span> · ${esc(t('xExec'))}: ${esc(x.presp)}</div>
        <div class="mini">${esc(t('xApFrom', { n: x.by, d: fmtDT(x.at) }))}${x.decidedBy ? ' · ' + esc(x.decidedBy) + ' ' + fmtDT(x.decidedAt) : ''}${x.note ? ' — ' + esc(x.note) : ''}</div></div>
        <div class="apa">${st(x)}${dec ? `<button class="btn sm ok" onclick="apDecide(${jsq(x.rid)},true,'')">${esc(t('xApprove'))}</button>` : ''}<button class="btn sm" onclick="openProg(${jsq(x.id)},'ap')">${esc(t('xDetails'))}</button></div></div>`;
    box.innerHTML = `<h3>${ic('badge-check')} ${esc(t('apprMine'))} <span class="cnt">${mine.length}</span></h3>` + (mine.length ? mine.map(x => row(x, true)).join('') : `<p class="meta">${esc(t('apprNone'))}</p>`) +
      `<h3 style="margin-top:18px">${ic('send')} ${esc(t('apprSent'))} <span class="cnt">${sent.length}</span></h3>` + (sent.length ? sent.map(x => row(x, false)).join('') : `<p class="meta">${esc(t('apprNone'))}</p>`);
  } catch (e) { box.innerHTML = `<p class="mini">❌ ${esc(e.message)}</p>`; }
}
const _goProg = go;
go = function (v) { if (v !== 'inbox' && PM.id) closeProg(true); _goProg(v); if (v === 'appr' && S.me) renderAppr(); };

// Home: tiles + badges
TILES.splice(TILES.findIndex(x => x[0] === 'dash'), 0, ['appr', 'badge-check', 'tAppr', 'tApprD']);
const _renderHomeX = renderHome;
renderHome = function () {
  _renderHomeX();
  const b = document.querySelector(`#homeTiles .htile[onclick="go('appr')"]`);
  if (b && S.x.apMine) b.insertAdjacentHTML('beforeend', `<span class="tbdg">${S.x.apMine}</span>`);
};
