/* Sequential, line-aware underline for the Homepage hero title.
   Measures rendered glyphs on hover only; no scroll listeners or layout changes. */
const SELECTOR = '.news-hero__title-link';
let current = null;

function clear() {
  if (!current) return;
  current.lines.forEach(line => line.remove());
  current = null;
}

function draw(link) {
  clear();
  const title = link.closest('.news-hero__title');
  if (!title || !link.isConnected) return;
  const textNode = [...link.childNodes].find(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
  if (!textNode) return;
  const text = textNode.textContent;
  const titleRect = title.getBoundingClientRect();
  const range = document.createRange();
  const rows = [];
  // Measure actual text glyphs so wrapping follows the title instead of the box.
  for (let index = 0; index < text.length; index++) {
    if (/\s/.test(text[index])) continue;
    range.setStart(textNode, index);
    range.setEnd(textNode, index + 1);
    const rect = range.getBoundingClientRect();
    if (rect.width < 0.1) continue;
    let row = rows.find(line => Math.abs(line.top - rect.top) <= 2);
    if (!row) { row = {top:rect.top, bottom:rect.bottom, left:rect.left, right:rect.right}; rows.push(row); }
    else { row.left = Math.min(row.left, rect.left); row.right = Math.max(row.right, rect.right); row.bottom = Math.max(row.bottom, rect.bottom); }
  }
  range.detach?.();
  if (!rows.length) return;
  rows.sort((a,b) => a.top - b.top);
  const total = rows.reduce((sum, line) => sum + (line.right-line.left), 0);
  let elapsed = 0;
  const durationTotal = 660;
  const lines = rows.map(row => {
    const width = row.right - row.left;
    const duration = Math.max(50, Math.round(durationTotal * width / total));
    const el = document.createElement('span');
    el.className = 'idsc-sequential-underline-line';
    el.setAttribute('aria-hidden', 'true');
    el.style.left = `${row.left-titleRect.left}px`;
    el.style.top = `${row.bottom-titleRect.top + 1}px`;
    el.style.width = `${width}px`;
    el.style.setProperty('--line-delay', `${elapsed}ms`);
    el.style.setProperty('--line-duration', `${duration}ms`);
    title.appendChild(el);
    elapsed += duration;
    return el;
  });
  current = {link, lines};
  requestAnimationFrame(() => {
    if (current?.link !== link) return;
    if (link.matches(':hover') || document.activeElement === link) {
      lines.forEach(line => line.classList.add('is-drawing'));
    } else clear();
  });
}

function findLink(target) {
  return target instanceof Element ? target.closest(SELECTOR) : null;
}

document.addEventListener('mouseover', event => {
  const link = findLink(event.target);
  if (link && current?.link !== link) draw(link);
});
document.addEventListener('mouseout', event => {
  const link = findLink(event.target);
  if (link && !link.contains(event.relatedTarget) && current?.link === link && document.activeElement !== link) clear();
});
document.addEventListener('focusin', event => {
  const link = findLink(event.target);
  if (link && current?.link !== link) draw(link);
});
document.addEventListener('focusout', event => {
  const link = findLink(event.target);
  if (link && current?.link === link && !link.matches(':hover')) clear();
});
window.addEventListener('resize', () => {
  if (current?.link.isConnected) draw(current.link);
  else clear();
}, {passive:true});
