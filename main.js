// ── Lenis smooth scroll ───────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ── GSAP setup ────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ── Projects: horizontal parallax rows ───────────────────────────────
gsap.fromTo('.projects-row-1',
  { x: 90 },
  {
    x: -90,
    ease: 'none',
    scrollTrigger: {
      trigger: '#projects',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.8,
    }
  }
);

gsap.fromTo('.projects-row-2',
  { x: -90 },
  {
    x: 90,
    ease: 'none',
    scrollTrigger: {
      trigger: '#projects',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.8,
    }
  }
);

// ── Projects title: word reveal ───────────────────────────────────────
gsap.from('.projects-title .title-word', {
  y: '110%',
  opacity: 0,
  stagger: 0.12,
  duration: 0.85,
  ease: 'power3.out',
  scrollTrigger: {
    trigger: '.projects-title',
    start: 'top 88%',
  }
});

// ── Typing animation ──────────────────────────────────────────────────
const roles = [
  'Android Applications',
  'Data Pipelines',
  'Web Applications',
  'ML Models',
  'Dashboards & Insights',
];
let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = roles[rIdx];
  if (deleting) {
    typedEl.textContent = current.slice(0, cIdx--);
    if (cIdx < 0) {
      deleting = false;
      cIdx = 0;
      rIdx = (rIdx + 1) % roles.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 40);
  } else {
    typedEl.textContent = current.slice(0, cIdx++);
    if (cIdx > current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 68);
  }
}
type();

// ── Navbar scroll effect ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');
lenis.on('scroll', ({ scroll }) => {
  navbar.classList.toggle('scrolled', scroll > 40);
  updateActiveLink(scroll);
});

// ── Mobile burger ─────────────────────────────────────────────────────
document.getElementById('burger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// ── Active nav link ───────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
function updateActiveLink(scrollY = window.scrollY) {
  const y = scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop, bottom = top + sec.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', y >= top && y < bottom);
  });
}

// ── Scroll reveal (IntersectionObserver) ─────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated counters ─────────────────────────────────────────────────
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stats-section').forEach(el => counterObserver.observe(el));

// ── Smooth scroll for anchor links (via Lenis) ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    }
  });
});
