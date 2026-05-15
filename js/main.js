/* ELEVA MALTA — MAIN JS v2 (GSAP + ScrollTrigger) */
'use strict';

/* ─── GSAP REGISTRATION ─── */
gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── PAGE TRANSITION OVERLAY ─── */
const overlay = document.querySelector('.page-transition-overlay');
if (overlay && !prefersReduced) {
  // Reveal page on load
  gsap.set(overlay, { scaleY: 1, transformOrigin: 'top' });
  gsap.to(overlay, { scaleY: 0, duration: 0.7, ease: 'power3.inOut', delay: 0.1 });

  // Exit transition on nav clicks
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      gsap.set(overlay, { scaleY: 0, transformOrigin: 'bottom' });
      gsap.to(overlay, {
        scaleY: 1, duration: 0.5, ease: 'power3.inOut',
        onComplete: () => { window.location.href = href; }
      });
    });
  });
}

/* ─── NAV ─── */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobile');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navStartsTransparent = nav && nav.classList.contains('nav--transparent');

function updateNavState() {
  if (!nav) return;
  const s = window.scrollY;
  if (!navStartsTransparent || s > 60) {
    nav.classList.add('nav--scrolled');
    nav.classList.remove('nav--transparent');
  } else {
    nav.classList.remove('nav--scrolled');
    nav.classList.add('nav--transparent');
  }
}
window.addEventListener('scroll', updateNavState, { passive: true });

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─── ACTIVE NAV LINK ─── */
document.querySelectorAll('.nav__link').forEach(link => {
  if (link.getAttribute('href') === currentPage || (currentPage === '' && link.getAttribute('href') === 'index.html')) {
    link.style.color = 'var(--gold)';
  }
});

/* ─── HERO ENTRANCE (GSAP timeline) ─── */
if (!prefersReduced) {
  const heroTl = gsap.timeline({ delay: overlay ? 0.6 : 0.1 });

  heroTl
    .to('.hero__label',  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', from: { y: 30 } })
    .to('.hero__title',  { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '-=0.4')
    .to('.hero__sub',    { opacity: 1, y: 0, duration: 0.8,  ease: 'power3.out' }, '-=0.5')
    .to('.hero__ctas',   { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.5')
    .to('.hero__stats',  { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.45')
    .to('.hero__dashboard', { opacity: 1, duration: 0.9,    ease: 'power2.out' }, '-=0.55');

  // Set starting positions
  gsap.set('.hero__label', { y: 32 });
  gsap.set('.hero__title', { y: 40 });
  gsap.set('.hero__sub',   { y: 28 });
  gsap.set('.hero__ctas',  { y: 24 });
  gsap.set('.hero__stats', { y: 24 });

  /* ─── HERO PARALLAX ─── */
  const heroBgImg = document.querySelector('.hero__bg img');
  if (heroBgImg) {
    gsap.to(heroBgImg, {
      y: '15%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }
}

/* ─── SCROLL REVEAL (IntersectionObserver — CSS handles transition) ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      if (!e.target.dataset.repeat) revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger').forEach(el => {
  revealObserver.observe(el);
});

/* ─── COUNTER ANIMATION (GSAP) ─── */
function animateCounter(el, target, duration, prefix, suffix) {
  const isFloat = target % 1 !== 0;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: duration / 1000,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = prefix + (isFloat ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix;
    }
  });
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      animateCounter(
        el,
        parseFloat(el.dataset.target),
        2200,
        el.dataset.prefix || '',
        el.dataset.suffix || ''
      );
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ─── DASHBOARD BAR ANIMATION (GSAP) ─── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.dashboard-bar-fill').forEach((bar, i) => {
        gsap.to(bar, {
          width: bar.dataset.width || '0%',
          duration: 1.4,
          delay: i * 0.14,
          ease: 'power3.out'
        });
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.dashboard-bars').forEach(el => barObserver.observe(el));

/* ─── FAQ ACCORDION (smooth with GSAP) ─── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const inner  = item.querySelector('.faq-answer-inner');
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem === item) return;
      openItem.classList.remove('open');
      const a = openItem.querySelector('.faq-answer');
      gsap.to(a, { height: 0, duration: 0.35, ease: 'power2.inOut' });
    });

    if (isOpen) {
      item.classList.remove('open');
      gsap.to(answer, { height: 0, duration: 0.35, ease: 'power2.inOut' });
    } else {
      item.classList.add('open');
      const targetH = inner.scrollHeight + 24; // + bottom padding
      gsap.fromTo(answer, { height: 0 }, { height: targetH, duration: 0.42, ease: 'power3.out' });
    }
  });
});

// Remove CSS max-height from FAQ (GSAP handles height now)
document.querySelectorAll('.faq-answer').forEach(el => {
  el.style.overflow = 'hidden';
  el.style.height   = '0px';
  el.style.maxHeight = 'none';
});

/* ─── MAGNETIC BUTTONS ─── */
if (!prefersReduced) {
  document.querySelectorAll('.btn-gold, .btn-primary, .btn-white').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      // ripple position
      const mx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const my = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      btn.style.setProperty('--mx', mx);
      btn.style.setProperty('--my', my);
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out', overwrite: true });
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.removeProperty('--mx');
      btn.style.removeProperty('--my');
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)', overwrite: true });
    });
  });
}

/* ─── VALUE CARDS SCROLL REVEAL (GSAP stagger) ─── */
if (!prefersReduced) {
  const valueCards = document.querySelectorAll('.value-card');
  if (valueCards.length) {
    gsap.set(valueCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: valueCards[0].closest('section') || valueCards[0],
      start: 'top 80%',
      onEnter() {
        gsap.to(valueCards, {
          opacity: 1, y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out'
        });
      }
    });
  }

  /* ─── LOCATION CARDS SCROLL REVEAL ─── */
  const locationCards = document.querySelectorAll('.location-card');
  if (locationCards.length) {
    gsap.set(locationCards, { opacity: 0, y: 50, scale: 0.96 });
    ScrollTrigger.create({
      trigger: locationCards[0].closest('section') || locationCards[0],
      start: 'top 78%',
      onEnter() {
        gsap.to(locationCards, {
          opacity: 1, y: 0, scale: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    });
  }

  /* ─── STATS BAR NUMBERS ─── */
  ScrollTrigger.create({
    trigger: '.stats-bar',
    start: 'top 85%',
    onEnter() {
      document.querySelectorAll('.stats-bar [data-target]').forEach(el => {
        if (!el.dataset.triggered) {
          el.dataset.triggered = '1';
          animateCounter(
            el,
            parseFloat(el.dataset.target),
            2000,
            el.dataset.prefix || '',
            el.dataset.suffix || ''
          );
        }
      });
    }
  });

  /* ─── SECTION HEADING LINES ─── */
  document.querySelectorAll('.section-header').forEach(header => {
    const divider = header.querySelector('.divider');
    if (divider) {
      gsap.set(divider, { width: 0 });
      ScrollTrigger.create({
        trigger: header,
        start: 'top 85%',
        onEnter() {
          gsap.to(divider, { width: 60, duration: 0.8, ease: 'power3.out', delay: 0.3 });
        }
      });
    }
  });
}

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── TABS ─── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group;
    const tab   = btn.dataset.tab;
    document.querySelectorAll(`[data-group="${group}"].tab-btn`).forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`[data-group="${group}"].tab-panel`).forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.querySelector(`[data-group="${group}"][data-panel="${tab}"]`);
    if (panel) panel.classList.add('active');
  });
});

/* ─── WHATSAPP FLOAT ENTRANCE ─── */
if (!prefersReduced) {
  gsap.from('.whatsapp-float', {
    scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)', delay: 2
  });
}

/* ─── INIT ─── */
updateNavState();
