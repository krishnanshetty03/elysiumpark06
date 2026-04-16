/* ── Scroll-shadow on header ── */
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

/* ── Hamburger / mobile drawer ── */
const hamburger = document.getElementById('hamburger-btn');
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
const navLinks = document.querySelectorAll('.nav-link');

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
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.getElementById('form-submit-btn');
  const originalBtnText = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    });

    const result = await response.json();

    if (response.status === 200) {
      form.reset();
      successMsg.textContent = "✅ Message sent! We'll get back to you.";
      successMsg.classList.remove('hidden');
    } else {
      console.log('Submission failed', result);
      // Show detailed error if available
      const errorDetail = result.error ? ` (Error: ${result.error})` : "";
      successMsg.textContent = "❌ " + (result.message || "Something went wrong.") + errorDetail;
      successMsg.style.color = "#b91c1c"; // red-700
      successMsg.style.background = "#fee2e2"; // red-100
      successMsg.classList.remove('hidden');
    }
  } catch (error) {
    console.log(error);
    successMsg.textContent = "❌ " + error.message;
    successMsg.classList.remove('hidden');
  } finally {
    btn.textContent = originalBtnText;
    btn.disabled = false;
    setTimeout(() => successMsg.classList.add('hidden'), 5000);
  }
});
