/* ── Scroll-shadow on header ── */
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Hamburger / mobile drawer ── */
const hamburger   = document.getElementById('hamburger-btn');
const mobileDrawer = document.getElementById('mobile-drawer');

hamburger.addEventListener('click', () => {
  const isOpen = mobileDrawer.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileDrawer.setAttribute('aria-hidden', !isOpen);
});

// Close drawer on mobile-link click
mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileDrawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    mobileDrawer.setAttribute('aria-hidden', true);
  });
});

/* ── Scroll-based active nav link ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('nav-link--active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
);
sections.forEach(s => sectionObserver.observe(s));

/* ── Fade-in on scroll ── */
const fadeEls = document.querySelectorAll(
  '.about-card, .plan-card, .news-card, .contact-item, .hero-stats .stat, .hero-content'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
fadeEls.forEach(el => fadeObserver.observe(el));

/* ── Contact form submit ── */
const form       = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    form.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    successMsg.classList.remove('hidden');
    setTimeout(() => successMsg.classList.add('hidden'), 4000);
  }, 1200);
});
