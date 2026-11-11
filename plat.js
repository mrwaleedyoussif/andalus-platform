/* =============================================================================
 *  plat.js — منصة الأندلس ١٤٤٨: indicators screen + the copy of «المنصة الشاملة» (sheet view)
 *  Loaded after app.js. Program/indicator names (↗) open their exact place in the in-app sheet view.
 * ========================================================================== */
const P = { model: null, tabs: null, copyUrl: '', gid: null, from: 1, count: 120, hl: 0, sheet: null, busy: false };
const stNorm = s => nkey(String(s || '').replace(/[()]/g, ' '));            // «ابتدائي بنين (أهلي)» ≡ «ابتدائي بنين أهلي»
P.indStage = '';

// ---- icons: every sheet, stage and section is reached by an icon (no drop-down lists)
const BRANCH = 'التخطيط على مستوى الفرع';
const HIDDEN_TABS = /^DROPDOWN$/i;                                                    // helper tab, hidden in the original too
const SHEET_ICONS = [[/^INFO$/i, 'ℹ️'], [/KPIS/i, '🎯'], [/فرق العمل/, '👥'], [/PROJECTS/i, '🗂️'], [/النمو المستدام/, '📈'], [/تجربة العملاء/, '🤝'],
  [/اختبار/, '📝'], [/القرآن/, '📖'], [/القيم|الهوية/, '🏛️'], [/التعليم والتعلم|عمليات التعليم/, '🏫'], [/جودة حياة/, '🌱'], [/البرامج|الأنشطة/, '🧩'],
  [/الأمن|السلامة/, '🛡️'], [/البيئة/, '🏗️'], [/النمو المهني|الكوادر|القياد|الموارد البشرية|المعلم/, '👨‍🏫']];
const LETTER_ICON = { A: '📈', B: '🤝', C: '🎓', D: '🏢' };
const ST_ICON = { '': '🧭', 'ابتدائي بنين أهلي': '🏫', 'ابتدائي بنين عالمي': '🌍', 'متوسط بنين عالمي': '🎓', [BRANCH]: '🏢', 'إدارة الفرع': '🏢' };
function sheetIcon(title) { for (const [re, ic] of SHEET_ICONS) if (re.test(title)) return ic; const m = /([A-D])\d+$/.exec(title); return m ? LETTER_ICON[m[1]] : '📄'; }
function sheetParts(title) { const m = /^(.*?)\s*([A-D]\d+)$/.exec(String(title)); return m ? { name: m[1], code: m[2] } : { name: String(title), code: '' }; }
const stIcon = s => ST_ICON[s] || '📌';
const stShort = s => s === BRANCH || s === 'إدارة الفرع' ? t('secBranch') : EN() ? tStage(s).replace(' Boys', '') : String(s).replace(' بنين', '');

// ---- links: ↗ opens the place inside this app (no Google Sheets permission needed)
hasPlat = p => !!p && p.pg !== '' && p.pg !== undefined && p.pg !== null;
platUrl = (p, kind) => hasPlat(p) ? '#plat:' + p.pg + ':' + ((kind === 'ind' ? p.pi : p.pr) || 1) : '';
plink = (p, kind, html) => { const u = platUrl(p, kind); return u ? `<a class="plink" href="${u}" title="${t(kind === 'ind' ? 'openIndPlat' : 'openProgPlat')}">${html}<span class="ext" aria-hidden="true">↗</span></a>` : html; };
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[href^="#plat:"]'); if (!a) return;
  e.preventDefault(); const [, g, r] = a.getAttribute('href').split(':'); openPlat(+g, +r);
});
function openPlat(gid, row) { P.opening = true; go('plat'); P.opening = false; platLoad(gid, Math.max(1, (row || 1) - 8), row || 0); }

// ---- navigation hook: the two new views
const _go = go;
go = function (v) { _go(v); if (v === 'ind') renderInd(); if (v === 'plat' && !P.opening && !P.busy && !P.sheet) platLoad(null, 1, 0); };

// =============================================================================== indicators
async function loadModel(force) {
  if (P.model && !force) return P.model;
  const r = await api('platModel', {}, { timeout: 90000 }); P.model = r.model; return P.model;
}
async function renderInd() {
  const box = $('indList'); if (!box) return;
  if (!P.model) box.innerHTML = `<div class="card mini">${t('loading')}</div>`;
  let m; try { m = await loadModel(); } catch (e) { box.innerHTML = `<div class="card">❌ ${esc(e.message)}</div>`; return; }
  const chips = $('indStage');
  if (chips) chips.innerHTML = [''].concat(m.stages).map(s => `<button class="stc${P.indStage === s ? ' on' : ''}" onclick="P.indStage=${esc(JSON.stringify(s))};renderInd()" title="${esc(s ? tStage(s) : t('allStages'))}"><span class="pi">${stIcon(s)}</span><span>${esc(s ? stShort(s) : t('allStages'))}</span></button>`).join('');
  const st = P.indStage, q = nkey(($('indQ') || {}).value || '');
  const list = m.indicators.filter(i => !q || nkey(i.code + ' ' + i.name).indexOf(q) >= 0);
  $('indCount').textContent = t('indCount', { n: list.length });
  box.innerHTML = list.map(i => indCard(i, st)).join('') || `<div class="card mini">${t('noResults')}</div>`;
}
function progStats(code, stage) {
  const ps = S.programs.filter(p => p.icode === code && (!stage || stNorm(p.stage) === stNorm(stage)));
  const done = ps.filter(p => p.status === 'مكتمل').length, late = ps.filter(p => /متأخر/.test(p.alert || '')).length;
  const avg = ps.length ? Math.round(ps.reduce((s, p) => s + (p.status === 'مكتمل' ? 100 : (+p.pct || 0)), 0) / ps.length) : 0;
  return { n: ps.length, done, late, avg };
}
function kv(items) {
  const rows = items.filter(x => String(x[1] || '').trim());
  return rows.length ? `<table class="kv">${rows.map(x => `<tr><th>${esc(x[0])}</th><td>${esc(x[1])}</td></tr>`).join('')}</table>` : '';
}
function indCard(i, st) {
  const stages = (P.model.stages || []).filter(s => !st || s === st);
  const head = i.gid != null ? `<a class="plink" href="#plat:${i.gid}:${i.codeRow || 1}">${esc(tInd(i.code, i.name))}<span class="ext">↗</span></a>` : esc(tInd(i.code, i.name));
  const def = kv(i.common.filter(x => !/رمز المؤشر/.test(x[0])));
  const groups = (i.groups || []).filter(g => !st || g.label === st || g.label === 'إدارة الفرع');
  const gHtml = groups.map(g => { const k = kv(g.items); return k ? `<div class="ind-g"><div class="ind-gl">${esc(tStage(g.label))}</div>${k}</div>` : ''; }).join('');
  const sHtml = stages.map(s => {
    const br = s === 'التخطيط على مستوى الفرع', ps = br ? { n: 0 } : progStats(i.code, s), blocks = i.blocks.filter(b => b.label === s);
    if (!ps.n && !blocks.length) return '';
    const btns = blocks.slice(0, 1).map(b => `<a class="btn sm" href="#plat:${b.gid}:${b.row}">📑 ${t('openInPlat')}</a>`).join('') +
      blocks.filter(b => b.plan).slice(0, 1).map(b => `<a class="btn sm" href="#plat:${b.gid}:${b.plan}">🗂 ${t('actionPlan')}</a>`).join('');
    return `<div class="ind-s"><div class="row" style="justify-content:space-between"><b>${stIcon(s)} ${esc(tStage(s))}</b>
      ${br ? '' : `<span class="mini">${t('indProgs', { n: ps.n, d: ps.done, l: ps.late })}</span>`}</div>
      ${br ? '' : `<div class="bar"><span style="width:${ps.avg}%"></span></div>`}<div class="row" style="margin-top:6px">${btns}</div></div>`;
  }).join('');
  return `<div class="card ind"><div class="row" style="justify-content:space-between;align-items:flex-start">
      <h3><span class="tag">${esc(i.code)}</span> ${head}</h3></div>
    ${sHtml}
    <details><summary>${t('indDetails')}</summary>${def}${gHtml}</details></div>`;
}

// =============================================================================== sheet view
const loadingCard = () => `<div class="card mini">${t('loading')}</div>`;
async function platLoad(gid, from, hl) {
  if (P.busy) { P.next = [gid, from, hl]; return; }          // a newer request wins once the current one finishes
  P.busy = true; P.next = null;
  const grid = $('platGrid');
  try {
    if (!P.tabs) {
      const c = store.get('ptabs', null);                       // the sheet list rarely changes → instant from this device for 6 h
      if (c && c.tabs && Date.now() - (c.at || 0) < 6 * 3600000) { P.tabs = c.tabs; P.copyUrl = c.copyUrl || ''; }
      else {
        $('platTiles').innerHTML = loadingCard();
        const r = await api('platTabs'); P.tabs = r.tabs.filter(x => !HIDDEN_TABS.test(x.title)); P.copyUrl = r.copyUrl || '';
        store.set('ptabs', { at: Date.now(), tabs: P.tabs, copyUrl: P.copyUrl });
      }
      ['platOpen', 'platOpen2'].forEach(id => { const o = $(id); if (o) { o.hidden = !P.copyUrl; o.href = P.copyUrl; } });
    }
    if (gid == null) platHome();
    else {
      P.gid = +gid; P.from = Math.max(1, from || 1); P.hl = hl || 0;
      platTiles(); platCur(); $('platBar').hidden = false; grid.hidden = false; grid.innerHTML = loadingCard();
      const r = await api('platSheet', { gid: P.gid, from: P.from, count: P.count }, { timeout: 90000 });
      P.sheet = r.sheet; drawSheet(); platSecs();
      const tr = P.hl && grid.querySelector('tr[data-r="' + P.hl + '"]');   // scroll inside the sheet only, so the icon bar stays in view
      grid.scrollTop = tr ? Math.max(0, tr.offsetTop - grid.clientHeight / 3) : 0;
    }
  } catch (e) { (P.gid == null ? $('platTiles') : grid).innerHTML = `<div class="card">❌ ${esc(e.message)}</div>`; }
  P.busy = false;
  if (P.next) { const n = P.next; P.next = null; platLoad(n[0], n[1], n[2]); }
}
/** home: every sheet as a big icon tile */
function platHome() { P.gid = null; P.sheet = null; P.hl = 0; $('platBar').hidden = true; $('platGrid').hidden = true; $('platGrid').innerHTML = ''; platTiles(); }
function platTiles() {
  const box = $('platTiles'); if (!box || !P.tabs) return;
  const ind = P.tabs.filter(x => x.ind).sort((a, b) => sheetParts(a.title).code.localeCompare(sheetParts(b.title).code)), gen = P.tabs.filter(x => !x.ind);
  const tile = x => { const sp = sheetParts(x.title);
    return `<button class="ptile${x.gid === P.gid ? ' on' : ''}" data-g="${x.gid}" onclick="platLoad(${x.gid},1,0)" title="${esc(x.title)}"><span class="pi">${sheetIcon(x.title)}</span><span class="pn">${esc(sp.name)}</span>${sp.code ? `<span class="pc">${sp.code}</span>` : ''}</button>`; };
  const home = P.gid == null;
  document.getElementById('v-plat').classList.toggle('sheet-open', !home);
  box.innerHTML = home
    ? `<p class="mini" style="margin:6px 0 0">${t('platPick')}</p><div class="pgroup">${t('platIndSheets')}</div><div class="ptiles big">${ind.map(tile).join('')}</div>
       <div class="pgroup">${t('platGeneral')}</div><div class="ptiles big">${gen.map(tile).join('')}</div>`
    : `<div class="ptiles strip">${ind.concat(gen).map(tile).join('')}</div>`;
  if (!home) { const on = box.querySelector('.ptile.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' }); }
}
function platCur() { const x = (P.tabs || []).find(x => x.gid === P.gid); $('platCur').innerHTML = x ? `<span class="pi">${sheetIcon(x.title)}</span><span class="pt">${esc(x.title)}</span>` : ''; }
/** sections of the open sheet as icons: top, each indicator header, each stage block (+ its action plan) */
async function platSecs() {
  const box = $('platSecs'); if (!box || P.gid == null) return;
  const gid = P.gid, sec = (ic, label, row, title, cls) => `<button class="psec${cls ? ' ' + cls : ''}${P.hl === row ? ' on' : ''}" onclick="platLoad(${gid},${Math.max(1, row - 8)},${row})" title="${esc(title || label)}"><span class="pi">${ic}</span>${label ? `<span>${esc(label)}</span>` : ''}</button>`;
  const top = sec('⤒', '', 1, t('secTop'), 'ic');
  box.innerHTML = `<div class="psec-row">${top}</div>`;
  let m; try { m = await loadModel(); } catch (e) { return; }
  if (P.gid !== gid) return;
  let rows = [];
  if (gid === m.ktGid) rows = [top + m.indicators.filter(i => i.row).map(i => sec('🎯', i.code, i.row, tInd(i.code, i.name))).join('')];
  else m.indicators.filter(i => (i.locs || []).some(l => l.gid === gid) || i.blocks.some(b => b.gid === gid)).forEach(i => {
    const loc = (i.locs || []).find(l => l.gid === gid), seen = {}, items = [];
    if (loc) items.push(sec('🎯', i.code, loc.row, t('secInd') + ': ' + tInd(i.code, i.name)));
    else items.push(`<span class="tag">${esc(i.code)}</span>`);
    i.blocks.filter(b => b.gid === gid).sort((a, b) => a.row - b.row).forEach(b => {
      if (seen[b.label]) return; seen[b.label] = 1;
      items.push(`<span class="psec-pair">${sec(stIcon(b.label), stShort(b.label), b.row, tStage(b.label))}${b.plan ? sec('🗂', '', b.plan, t('secPlan') + ' — ' + tStage(b.label), 'ic') : ''}</span>`);
    });
    rows.push(items.join(''));
  });
  if (!rows.length) return;
  if (gid !== m.ktGid) rows[0] = top + rows[0];
  box.innerHTML = rows.map(r => `<div class="psec-row">${r}</div>`).join('');
}
function platPage(dir) { if (!P.sheet) return; const f = P.from + dir * P.count; if (f < 1 || f > P.sheet.rows) return; platLoad(P.gid, f, 0); }
function platAskRow() { const v = prompt(t('platRowAsk'), ''); const r = Math.floor(+v); if (r >= 1) platLoad(P.gid, Math.max(1, r - 8), r); }
// language switch → redraw the icon labels
const _applyI18n = applyI18n;
applyI18n = function () { _applyI18n(); document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle).replace(/^[▲▼]\s*/, ''); el.setAttribute('aria-label', el.title); });
  try { if (P.tabs) { platTiles(); if (P.gid != null) { platCur(); platSecs(); } } if (P.model && document.getElementById('v-ind').classList.contains('on')) renderInd(); } catch (e) {} };
function drawSheet() {
  const s = P.sheet, grid = $('platGrid'), cov = {}, span = {};
  s.merges.forEach(m => { span[m[0] + ':' + m[1]] = m; for (let r = m[0]; r < m[0] + m[2]; r++) for (let c = m[1]; c < m[1] + m[3]; c++) if (r !== m[0] || c !== m[1]) cov[r + ':' + c] = 1; });
  const hidden = new Set(s.hiddenR || []), cols = s.colW.length || s.cols, admin = isAdmin() && editOK();
  const ws = s.colW.map(w => w ? Math.max(28, Math.round(w * 0.85)) : 0), tw = 42 + ws.reduce((a, b) => a + b, 0);
  const colg = '<col style="width:42px">' + ws.map(w => `<col style="width:${w}px">`).join('');
  let html = '';
  s.data.forEach((cells, i) => {
    const r = s.from + i; if (hidden.has(r)) return;
    let tds = `<th class="rn">${r}</th>`;
    for (let c = 1; c <= cols; c++) {
      if (cov[r + ':' + c]) continue;
      const o = cells[c - 1] || {}, m = span[r + ':' + c];
      let rs = 1; if (m) { rs = 0; for (let k = r; k < r + m[2] && k <= s.to; k++) if (!hidden.has(k)) rs++; rs = Math.max(1, rs); }   // hidden rows don't count
      const cs = m ? m[3] : 1;
      const st = [o.bg ? 'background:' + o.bg : '', o.fc ? 'color:' + o.fc : '', o.b ? 'font-weight:700' : '', o.i ? 'font-style:italic' : '',
        o.fs ? 'font-size:' + Math.min(18, Math.max(10, o.fs + 2)) + 'px' : '', o.al ? 'text-align:' + ({ L: 'left', C: 'center', R: 'right' }[o.al] || 'start') : ''].filter(Boolean).join(';');
      let v = o.cb !== undefined ? (o.cb ? '☑' : '☐') : esc(o.v || '');
      if (o.l && /^https?:/.test(o.l)) v = `<a href="${esc(o.l)}" target="_blank" rel="noopener">${v || '🔗'}</a>`;
      tds += `<td${rs > 1 ? ' rowspan="' + rs + '"' : ''}${cs > 1 ? ' colspan="' + cs + '"' : ''}${st ? ' style="' + st + '"' : ''}${admin ? ` data-c="${c}" data-cb="${o.cb === undefined ? '' : o.cb ? 1 : 0}"` : ''}>${v}</td>`;
    }
    html += `<tr data-r="${r}"${r === P.hl ? ' class="hl"' : ''}>${tds}</tr>`;
  });
  grid.innerHTML = `<table class="sheet" dir="rtl" style="width:${tw}px"><colgroup>${colg}</colgroup><tbody>${html}</tbody></table>`;
  $('platInfo').textContent = t('platRange', { a: s.from, b: s.to, n: s.rows, tab: s.title }) + (admin ? ' · ' + t('platEditHint') : '');
  if (admin) grid.querySelector('table').addEventListener('click', platEdit);
}
async function platEdit(e) {
  const td = e.target.closest('td'); if (!td || e.target.closest('a')) return;
  const r = +td.parentNode.dataset.r, c = +td.dataset.c; if (!r || !c) return;
  let value;
  if (td.dataset.cb !== '') value = td.dataset.cb !== '1';
  else { const cur = td.textContent; const nv = prompt(t('platEditAsk', { cell: colName(c) + r }), cur); if (nv === null || nv === cur) return; value = nv; }
  td.classList.add('saving');
  try { const res = await api('platSetCell', { gid: P.gid, row: r, col: c, value }); td.textContent = value === true ? '☑' : value === false ? '☐' : (res.cell.value || ''); if (typeof value === 'boolean') td.dataset.cb = value ? 1 : 0; toast(t('savedOk')); P.model = null; }
  catch (x) { toast('❌ ' + x.message, 5000); }
  td.classList.remove('saving');
}
const colName = n => { let s = ''; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
applyI18n();
