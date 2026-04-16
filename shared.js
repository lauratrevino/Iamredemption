// ── FADE-IN ON SCROLL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
setTimeout(() => {
  document.querySelectorAll('.hero .fade-in, .page-hero .fade-in').forEach(el => el.classList.add('visible'));
}, 80);


// ── NAV SCROLL SHRINK ──
window.addEventListener('scroll', () => {
  const nav = document.getElementById('top-nav');
  if (nav) nav.style.padding = window.scrollY > 60 ? '0.6rem 2.5rem' : '1rem 2.5rem';
}, { passive: true });

// ── MOBILE MENU ──
function toggleMenu() {
  const links = document.querySelector('#top-nav .nav-links');
  if (!links) return;
  if (links.style.display === 'flex') {
    links.style.display = 'none';
  } else {
    links.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:58px;left:0;right:0;background:rgba(18,34,8,0.99);padding:1.5rem 2rem;gap:1.25rem;z-index:999;border-bottom:1px solid rgba(200,151,58,0.2);';
  }
}

// ── EMAIL SUBSCRIBE ──
function subscribeEmail() {
  const input = document.querySelector('.email-input');
  const btn = document.querySelector('.email-btn');
  if (!input || !input.value.includes('@')) {
    if (input) input.style.borderColor = '#b83232';
    return;
  }
  btn.textContent = 'Thanks!';
  btn.style.background = '#3b6d11';
  input.value = '';
  setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
}

// ── PHASES ──
let activePhase = null;
function togglePhase(num) {
  const details = document.querySelectorAll('.stand-detail');
  const cards = document.querySelectorAll('.stand-card');
  details.forEach(d => d.classList.remove('active'));
  cards.forEach(c => c.classList.remove('active'));
  if (activePhase === num) {
    activePhase = null;
    // Deselect phase map node and reset progress
    document.querySelectorAll('.phase-node').forEach(n => n.classList.remove('active'));
    const progress = document.getElementById('phase-progress');
    if (progress) progress.style.width = '0%';
    return;
  }
  activePhase = num;
  // Sync phase map node and progress bar
  document.querySelectorAll('.phase-node').forEach(n => n.classList.remove('active'));
  const node = document.querySelector('.phase-node[data-phase="' + num + '"]');
  if (node) node.classList.add('active');
  const progress = document.getElementById('phase-progress');
  if (progress) progress.style.width = ((num - 1) / 4 * 100) + '%';
  const target = document.getElementById('detail-' + num);
  const card = document.getElementById('card-' + num);
  if (card) card.classList.add('active');
  if (target && card) {
    card.parentNode.insertBefore(target, card.nextSibling);
    target.classList.add('active');
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 30);
  }
}

// ── PHASE MAP ──
function selectPhaseNode(num) {
  document.querySelectorAll('.phase-node').forEach(n => n.classList.remove('active'));
  const node = document.querySelector(`.phase-node[data-phase="${num}"]`);
  if (node) node.classList.add('active');
  const progress = document.getElementById('phase-progress');
  if (progress) progress.style.width = ((num - 1) / 4 * 100) + '%';
  togglePhase(num);
  const standSection = document.getElementById('phases');
  if (standSection) setTimeout(() => standSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
}

// ── PODCAST PLAYER ──
let isPlaying = false;
let progressInterval = null;
function togglePlay(btn) {
  isPlaying = !isPlaying;
  const fill = document.getElementById('progress-fill');
  const icon = document.getElementById('play-icon');
  if (!fill || !icon) return;
  if (isPlaying) {
    icon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    let pct = parseFloat(fill.style.width) || 0;
    progressInterval = setInterval(() => {
      pct = Math.min(pct + 0.06, 100);
      fill.style.width = pct + '%';
      if (pct >= 100) { clearInterval(progressInterval); isPlaying = false; icon.innerHTML = '<path d="M8 5v14l11-7z"/>'; }
    }, 200);
  } else {
    icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    clearInterval(progressInterval);
  }
}
function loadEpisode(title, guest, pct) {
  const t = document.getElementById('np-title');
  const g = document.getElementById('np-guest');
  const f = document.getElementById('progress-fill');
  if (t) t.textContent = title;
  if (g) g.textContent = guest;
  if (f) f.style.width = pct + '%';
  isPlaying = false; clearInterval(progressInterval);
  const icon = document.getElementById('play-icon');
  if (icon) icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
}

// ── TESTIMONIALS ──
let tCurrent = 0;
function initTestimonials() {
  const track = document.getElementById('t-track');
  const nav = document.getElementById('t-nav');
  if (!track || !nav) return;
  const cards = track.querySelectorAll('.t-card');
  const getVis = () => window.innerWidth < 960 ? 1 : 3;
  function buildDots() {
    nav.innerHTML = '';
    const vis = getVis();
    const count = Math.ceil(cards.length / vis);
    for (let i = 0; i < count; i++) {
      const d = document.createElement('div');
      d.className = 't-dot' + (i === 0 ? ' active' : '');
      d.onclick = () => goTo(i);
      nav.appendChild(d);
    }
  }
  function goTo(idx) {
    tCurrent = idx;
    const vis = getVis();
    const w = cards[0] ? cards[0].offsetWidth + 24 : 0;
    track.style.transform = `translateX(-${idx * vis * w}px)`;
    nav.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }
  buildDots();
  window.addEventListener('resize', () => { buildDots(); goTo(0); });
  setInterval(() => {
    const vis = getVis();
    goTo((tCurrent + 1) % Math.ceil(cards.length / vis));
  }, 5000);
}
initTestimonials();

// ── 60-DAY TRACKER ──
function initDayTracker() {
  const grid = document.getElementById('challenge-days');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 1; i <= 60; i++) {
    const d = document.createElement('div');
    d.className = 'day-block' + (i <= 14 ? ' filled' : '');
    d.textContent = i;
    d.onclick = () => d.classList.toggle('filled');
    grid.appendChild(d);
  }
}
initDayTracker();
