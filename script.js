document.addEventListener('DOMContentLoaded', () => {
  initTypingEffect();
  initMobileNav();
  initActiveNavLink();
  initThemeToggle();
  initScrollReveal();
  initContactForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- 1. Typing effect in the hero "terminal" ---------- */
function initTypingEffect() {
  const el = document.getElementById('typedRole');
  if (!el) return;

  const roles = [
    'a beginner web developer.',
    'a curious problem solver.',
    'still learning, every day.'
  ];

  // Respect users who've asked for less motion: just show the first role.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    el.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    el.textContent = currentRole.slice(0, charIndex);

    let delay = isDeleting ? 40 : 70;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1400; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* ---------- 2. Mobile nav toggle ---------- */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the menu after a link is tapped (mobile)
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 3. Highlight the nav link for the section in view ---------- */
function initActiveNavLink() {
  const links = document.querySelectorAll('[data-nav]');
  const sections = Array.from(links)
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          links.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' } // triggers around the middle of the viewport
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- 4. Light / dark theme toggle ---------- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (!toggle) return;

  const saved = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const startDark = saved ? saved === 'dark' : prefersDark;

  applyTheme(startDark);

  toggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
    localStorage.setItem('portfolio-theme', !isDark ? 'dark' : 'light');
  });

  function applyTheme(dark) {
    if (dark) {
      root.setAttribute('data-theme', 'dark');
      toggle.querySelector('.theme-icon').textContent = '☀';
      toggle.setAttribute('aria-label', 'Switch to light theme');
      toggle.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      toggle.querySelector('.theme-icon').textContent = '☾';
      toggle.setAttribute('aria-label', 'Switch to dark theme');
      toggle.setAttribute('aria-pressed', 'false');
    }
  }
}

/* ---------- 5. Fade sections in as they scroll into view ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------- 6. Contact form (front-end only, no backend yet) ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      status.textContent = 'Please fill in every field before sending.';
      return;
    }

    const name = form.name.value.trim();

    // This is a placeholder: hook this up to a real email service
    // (e.g. Formspree, EmailJS) or a backend endpoint when you're ready.
    status.textContent = `Thanks, ${name}! This form isn't wired up to an inbox yet — replace this in script.js once it is.`;
    form.reset();
  });
}
