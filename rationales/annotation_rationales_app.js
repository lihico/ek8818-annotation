// Annotation app for rationale themes.
// State model per rationale id:
//   state[id] = { hl: [{id, start, end, tag, theme}], unclear: bool }
// Highlights are stored as character offsets on the original rationale text.
// Per-rationale pending selection is stored in activeSel[id].

const STORAGE_KEY = 'rationale_themes_annotation_v1';
let state = {};
const activeSel = {}; // {ratId: {start, end}}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const d = JSON.parse(raw);
      state = d.state || {};
      if(d.name) document.getElementById('f-name').value = d.name;
      if(d.date) document.getElementById('f-date').value = d.date;
    }
  }catch(e){console.error('load', e);}
  RATIONALES.forEach(r => {
    if(!state[r.id]) state[r.id] = {hl: [], unclear: false};
  });
}

function saveState(){
  const payload = {
    name: document.getElementById('f-name').value,
    date: document.getElementById('f-date').value,
    state: state
  };
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    const ss = document.getElementById('ss');
    ss.textContent = '\u2713 Saved locally';
    ss.style.color = '';
  }catch(e){
    const ss = document.getElementById('ss');
    ss.textContent = 'Save failed';
    ss.style.color = '#dc2626';
  }
}

function esc(s){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderRatText(rat){
  const text = rat.rationale;
  const st = state[rat.id];
  const hls = [...st.hl].sort((a,b) => a.start - b.start);
  const cleaned = [];
  let lastEnd = 0;
  for(const h of hls){
    if(h.start < lastEnd) continue;
    cleaned.push(h);
    lastEnd = h.end;
  }
  let html = '';
  let cur = 0;
  for(const h of cleaned){
    if(h.start > cur) html += esc(text.substring(cur, h.start));
    const cls = 'class="' + h.tag + '"';
    const title = 'title="' + esc(h.theme || '(no theme yet)') + '"';
    html += '<mark ' + cls + ' ' + title + ' data-hlid="' + h.id + '">' + esc(text.substring(h.start, h.end)) + '</mark>';
    cur = h.end;
  }
  if(cur < text.length) html += esc(text.substring(cur));
  return html;
}

function renderHlList(rat){
  const st = state[rat.id];
  if(!st.hl.length) return '';
  const items = st.hl.map(h => {
    const tagLabel = h.tag === 'q' ? 'QUALITY' : (h.tag === 'f' ? 'CONTEXT-FIT' : 'OTHER');
    const span = RATIONALES.find(r => r.id === rat.id).rationale.substring(h.start, h.end);
    return '<div class="hl ' + h.tag + '">' +
      '<span class="hl-tag">' + tagLabel + '</span>' +
      '<span class="hl-span" title="' + esc(span) + '">"' + esc(span) + '"</span>' +
      '<input type="text" class="hl-theme" data-hl-input="' + rat.id + '_' + h.id + '" placeholder="Theme (few words)..." ' +
      'value="' + esc(h.theme || '') + '" ' +
      'oninput="updateTheme(' + rat.id + ',' + h.id + ',this.value)">' +
      '<button class="hl-del" onclick="deleteHl(' + rat.id + ',' + h.id + ')" title="Delete">\u00d7</button>' +
      '</div>';
  }).join('');
  return '<div class="hl-list">' + items + '</div>';
}

function renderTagBar(rat){
  const st = state[rat.id];
  if(st.unclear) return '';
  const sel = activeSel[rat.id];
  const ready = !!sel;
  const cls = 'tag-bar' + (ready ? ' ready' : '');
  const selectedLabel = ready
    ? '"' + esc(RATIONALES.find(r => r.id === rat.id).rationale.substring(sel.start, sel.end).slice(0, 60)) + '"'
    : 'Select a phrase above, then tag it';
  const hint = ready ? 'Tag this selection:' : 'Tip: drag to select';
  return '<div class="' + cls + '" data-tagbar="' + rat.id + '">' +
    '<span class="tb-hint">' + hint + '</span>' +
    '<button class="btn-q" ' + (ready ? '' : 'disabled') + ' onclick="applyTag(' + rat.id + ',\'q\')">Quality</button>' +
    '<button class="btn-f" ' + (ready ? '' : 'disabled') + ' onclick="applyTag(' + rat.id + ',\'f\')">Context-fit</button>' +
    '<button class="btn-o" ' + (ready ? '' : 'disabled') + ' onclick="applyTag(' + rat.id + ',\'o\')">Other</button>' +
    '<span class="tb-selected">' + selectedLabel + '</span>' +
    '</div>';
}

function rationaleClass(rat){
  const st = state[rat.id];
  if(st.unclear) return 'rat unclear';
  if(st.hl.length > 0) return 'rat done';
  return 'rat';
}

function renderRatInner(rat){
  const st = state[rat.id];
  return '<div class="rat-head">' +
    '<span class="rat-num">#' + rat.id + '</span>' +
    '<button class="rat-unclear-btn ' + (st.unclear ? 'active' : '') + '" ' +
    'onclick="toggleUnclear(' + rat.id + ')">' +
    (st.unclear ? '\u2713 marked unclear' : 'mark unclear') +
    '</button>' +
    '</div>' +
    '<div class="rat-text" data-rid="' + rat.id + '">' + renderRatText(rat) + '</div>' +
    renderTagBar(rat) +
    renderHlList(rat);
}

function renderAll(){
  const wrap = document.getElementById('rat-wrap');
  let html = '';
  for(const rat of RATIONALES){
    html += '<div class="' + rationaleClass(rat) + '" data-rid="' + rat.id + '">' + renderRatInner(rat) + '</div>';
  }
  wrap.innerHTML = html;
  updateCounts();
}

function renderOne(ratId){
  const el = document.querySelector('.rat[data-rid="' + ratId + '"]');
  if(!el) return renderAll();
  const rat = RATIONALES.find(r => r.id === ratId);
  el.className = rationaleClass(rat);
  el.innerHTML = renderRatInner(rat);
  updateCounts();
}

function updateCounts(){
  let q = 0, f = 0, o = 0, touched = 0, unclear = 0;
  for(const id in state){
    const s = state[id];
    if(s.unclear) unclear++;
    if(s.hl.length) touched++;
    for(const h of s.hl){
      if(h.tag === 'q') q++;
      else if(h.tag === 'f') f++;
      else if(h.tag === 'o') o++;
    }
  }
  const done = touched + unclear;
  document.getElementById('c-done').textContent = done;
  document.getElementById('c-q').textContent = q;
  document.getElementById('c-f').textContent = f;
  document.getElementById('c-o').textContent = o;
  document.getElementById('b-q').textContent = q;
  document.getElementById('b-f').textContent = f;
  document.getElementById('b-o').textContent = o;
  document.getElementById('b-u').textContent = unclear;
  const pct = Math.round(100 * done / RATIONALES.length);
  document.getElementById('pbf').style.width = pct + '%';
  document.getElementById('pbt').textContent = done + ' / ' + RATIONALES.length + ' rationales touched';
}

function handleSelection(){
  const sel = window.getSelection();
  if(!sel || sel.rangeCount === 0 || sel.isCollapsed){
    // Do not clear activeSel here: user may have blurred selection to click tag button.
    return;
  }
  const range = sel.getRangeAt(0);
  const textEl = findRatTextAncestor(range.commonAncestorContainer);
  if(!textEl) return;
  const ratId = parseInt(textEl.dataset.rid);
  const rat = RATIONALES.find(r => r.id === ratId);
  if(!rat) return;
  const selText = sel.toString();
  if(!selText || !selText.trim()) return;
  const offsets = computeOffsets(textEl, range, rat);
  if(offsets == null) return;
  // Clear any prior pending selection on other rationales; only one active at a time visually.
  for(const k in activeSel) delete activeSel[k];
  activeSel[ratId] = offsets;
  updateTagBar(ratId);
}

function findRatTextAncestor(node){
  while(node){
    if(node.nodeType === 1 && node.classList && node.classList.contains('rat-text')) return node;
    node = node.parentNode;
  }
  return null;
}

function computeOffsets(textEl, range, rat){
  const fullText = rat.rationale;
  let startOff = -1, endOff = -1;
  let pos = 0;
  const walker = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT, null);
  let node;
  while(node = walker.nextNode()){
    const len = node.nodeValue.length;
    if(node === range.startContainer) startOff = pos + range.startOffset;
    if(node === range.endContainer) endOff = pos + range.endOffset;
    pos += len;
  }
  if(startOff < 0 || endOff < 0 || startOff >= endOff) return null;
  if(pos !== fullText.length) return null;
  for(const h of state[rat.id].hl){
    if(startOff < h.end && endOff > h.start) return null;
  }
  return {start: startOff, end: endOff};
}

function updateTagBar(ratId){
  // Re-render only the tag-bar in-place to keep the user's text selection visible.
  const el = document.querySelector('.rat[data-rid="' + ratId + '"]');
  if(!el) return;
  const rat = RATIONALES.find(r => r.id === ratId);
  const oldBar = el.querySelector('.tag-bar');
  const newBarHtml = renderTagBar(rat);
  if(oldBar){
    const tmp = document.createElement('div');
    tmp.innerHTML = newBarHtml;
    const newBar = tmp.firstChild;
    if(newBar) oldBar.replaceWith(newBar);
    else oldBar.remove();
  }else{
    const txt = el.querySelector('.rat-text');
    if(txt && newBarHtml){
      txt.insertAdjacentHTML('afterend', newBarHtml);
    }
  }
}

function applyTag(ratId, tag){
  const sel = activeSel[ratId];
  if(!sel) return;
  const st = state[ratId];
  const nextId = (st.hl.reduce((m,h) => Math.max(m, h.id), 0)) + 1;
  st.hl.push({id: nextId, start: sel.start, end: sel.end, tag: tag, theme: ''});
  if(st.unclear) st.unclear = false;
  delete activeSel[ratId];
  try{window.getSelection().removeAllRanges();}catch(e){}
  saveState();
  renderOne(ratId);
  // Focus the theme input that was just created so the user can type immediately.
  requestAnimationFrame(() => {
    const input = document.querySelector('input[data-hl-input="' + ratId + '_' + nextId + '"]');
    if(input){
      input.focus();
      input.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }
  });
}

function deleteHl(ratId, hlId){
  const st = state[ratId];
  st.hl = st.hl.filter(h => h.id !== hlId);
  saveState();
  renderOne(ratId);
}

function updateTheme(ratId, hlId, val){
  const st = state[ratId];
  const h = st.hl.find(x => x.id === hlId);
  if(!h) return;
  h.theme = val;
  saveState();
}

function toggleUnclear(ratId){
  const st = state[ratId];
  st.unclear = !st.unclear;
  if(st.unclear){
    st.hl = [];
    delete activeSel[ratId];
  }
  saveState();
  renderOne(ratId);
}

function buildExport(){
  const payload = {
    annotator: document.getElementById('f-name').value,
    date: document.getElementById('f-date').value,
    n_rationales: RATIONALES.length,
    items: RATIONALES.map(r => {
      const st = state[r.id];
      return {
        id: r.id,
        rationale: r.rationale,
        unclear: !!st.unclear,
        highlights: st.hl.map(h => ({
          span: r.rationale.substring(h.start, h.end),
          start: h.start,
          end: h.end,
          category: h.tag === 'q' ? 'quality_in_isolation' : (h.tag === 'f' ? 'context_fit' : 'other'),
          theme: h.theme || ''
        }))
      };
    })
  };
  return JSON.stringify(payload, null, 2);
}

function exportJSON(){
  const name = (document.getElementById('f-name').value || 'anon').replace(/\s+/g, '_');
  const blob = new Blob([buildExport()], {type: 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'rationale_themes_' + name + '.json';
  a.click();
}

function copyJSON(){
  navigator.clipboard.writeText(buildExport()).then(() => {
    const b = document.getElementById('cpBtn');
    b.textContent = 'Copied!';
    b.style.background = '#16a34a';
    setTimeout(() => {
      b.textContent = 'Copy to clipboard';
      b.style.background = '';
    }, 1800);
  });
}

document.addEventListener('mouseup', () => setTimeout(handleSelection, 10));
document.addEventListener('keyup', (e) => {
  if(e.key === 'Escape'){
    for(const k in activeSel){
      const id = parseInt(k);
      delete activeSel[k];
      updateTagBar(id);
    }
  }
});
document.getElementById('f-name').addEventListener('input', saveState);
document.getElementById('f-date').addEventListener('input', saveState);

loadState();
renderAll();
