/* ═══════════════════════════════════════════
   MC DON TEE — script.js
═══════════════════════════════════════════ */

const navbar      = document.getElementById('navbar');
const navToggle   = document.getElementById('navToggle');
const navMenu     = document.getElementById('navLinks');
const navOverlay  = document.getElementById('navOverlay');
const navLinks    = document.querySelectorAll('.nav-link');
const sections    = document.querySelectorAll('section[id]');
const scrollTopBtn = document.getElementById('scrollTop');
const fabWhatsapp  = document.getElementById('fabWhatsapp');

/* ── Scroll handler (rAF debounced) ─────── */
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;

    // Navbar style
    navbar.classList.toggle('scrolled', y > 60);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Floating buttons visibility
    const show = y > 400;
    scrollTopBtn.classList.toggle('visible', show);
    fabWhatsapp.classList.toggle('visible', show);

    ticking = false;
  });
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ── Mobile nav ─────────────────────────── */
function openNav() {
  navToggle.classList.add('open');
  navMenu.classList.add('open');
  navOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  navToggle.classList.remove('open');
  navMenu.classList.remove('open');
  navOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeNav() : openNav();
});

// Close on overlay click (backdrop)
navOverlay.addEventListener('click', closeNav);

// Close on link click
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

/* ── Scroll fade-in (IntersectionObserver) ─ */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => fadeObserver.observe(el));

/* ── Hero headline — staggered word reveal ─ */
(function () {
  const reduced = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prefix  = document.querySelector('.hl-prefix');
  const mc      = document.querySelector('.hl-mc');
  const name    = document.querySelector('.hl-name');

  if (!mc || !name) return;

  if (reduced) {
    [prefix, mc, name].filter(Boolean).forEach(el => el.classList.add('revealed'));
    return;
  }

  // Staggered: prefix (optional) → mc → name → underline draws via CSS transition-delay
  if (prefix) setTimeout(() => prefix.classList.add('revealed'), 320);
  setTimeout(() => mc.classList.add('revealed'),   540);
  setTimeout(() => name.classList.add('revealed'), 700);
})();

/* ── Stat counter animation ─────────────── */
function animateCounter(el, target, suffix) {
  if (globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = target + suffix;
    return;
  }
  let start = 0;
  const step = Math.max(1, Math.ceil(target / 80));
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start + suffix;
    if (start >= target) clearInterval(timer);
  }, 20);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(num => {
        const raw    = num.textContent.trim();
        const value  = Number.parseInt(raw);
        const suffix = raw.replaceAll(/\d/g, '');
        animateCounter(num, value, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* ── Auto copyright year ───────────────── */
const yearEl = document.querySelector('.footer-copy p');
if (yearEl) yearEl.innerHTML = yearEl.innerHTML.replace(/\d{4}/, new Date().getFullYear());

/* ── Scroll to top ──────────────────────── */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Showreel — pause sibling video on play ─ */
const showreelVideos = document.querySelectorAll('.showreel-video');
showreelVideos.forEach(vid => {
  vid.addEventListener('play', () => {
    showreelVideos.forEach(other => {
      if (other !== vid && !other.paused) other.pause();
    });
  });
});

/* ── Booking form submission ─────────────── */
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = bookingForm.querySelector('.btn-submit');
    btn.textContent = 'Request Sent ✓';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #4ade80)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Send Booking Request';
      btn.style.background = '';
      btn.disabled = false;
      bookingForm.reset();
    }, 4000);
  });
}

/* ── Rate card → pre-fill booking form ────── */
document.querySelectorAll('.rate-btn[data-package]').forEach(btn => {
  btn.addEventListener('click', () => {
    const name   = btn.dataset.package;
    const detail = btn.dataset.packageDetail;
    const msg    = document.getElementById('message');
    if (!msg) return;

    msg.value = `Hi MC Don Tee,\n\nI am interested in the ${name} Package.\nInclusions: ${detail}\n\nPlease let me know your availability and we can discuss further.`;

    // Briefly highlight the message field so the user sees it was filled
    msg.classList.add('field-prefilled');
    setTimeout(() => msg.classList.remove('field-prefilled'), 2200);
  });
});

/* ── Smooth scroll (offset for fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop - navbar.offsetHeight - 12,
        behavior: 'smooth'
      });
    }
  });
});
