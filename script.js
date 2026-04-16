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

if (form && successMsg) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submission started');
    
    const btn = document.getElementById('form-submit-btn');
    if (!btn) return;

    const originalBtnText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    successMsg.classList.add('hidden');

    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      console.log('Sending request to /api/contact');
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });
      
      console.log('Response status:', response.status);
      
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        result = { message: "Server error or API route not found." };
        if (response.status === 404) {
          result.message = "API route not found. If testing locally, please note that /api/contact only works when deployed to Vercel or run with 'vercel dev'.";
        }
      }
      
      if (response.ok) {
        console.log('Submission successful');
        form.reset();
        successMsg.textContent = "✅ Message sent! We'll get back to you.";
        successMsg.style.color = "var(--green-dark)";
        successMsg.style.background = "var(--green-light)";
        successMsg.classList.remove('hidden');
      } else {
        console.log('Submission failed', result);
        successMsg.textContent = "❌ " + (result.message || "Something went wrong.");
        successMsg.style.color = "#b91c1c"; // red-700
        successMsg.style.background = "#fee2e2"; // red-100
        successMsg.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      successMsg.textContent = "❌ Could not send message. Please check your connection.";
      successMsg.style.color = "#b91c1c";
      successMsg.style.background = "#fee2e2";
      successMsg.classList.remove('hidden');
    } finally {
      btn.textContent = originalBtnText;
      btn.disabled = false;
      // Auto-hide success message after 8 seconds, but keep error messages visible longer
      if (successMsg.textContent.includes("✅")) {
        setTimeout(() => successMsg.classList.add('hidden'), 8000);
      }
    }
  });
}
