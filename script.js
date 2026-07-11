// Nav scroll state
const nav = document.getElementById('nav');
function updateNav() {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Mobile menu toggle
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');
if (burger) {
  burger.addEventListener('click', () => {
    navMobile.classList.toggle('open');
  });
}

// Hero parallax (subtle, restrained)
const heroBg = document.getElementById('heroBg');
if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroBg.style.transform = `translateY(${y * 0.35}px)`;
    }
  }, { passive: true });
}

// Before/After slider
const baSlider = document.getElementById('baSlider');
if (baSlider) {
  const baBefore = document.getElementById('baBefore');
  const baHandle = document.getElementById('baHandle');
  let dragging = false;

  function setSlider(clientX) {
    const rect = baSlider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    baBefore.style.width = pct + '%';
    baHandle.style.left = pct + '%';
  }

  baSlider.addEventListener('mousedown', (e) => { dragging = true; setSlider(e.clientX); });
  window.addEventListener('mousemove', (e) => { if (dragging) setSlider(e.clientX); });
  window.addEventListener('mouseup', () => dragging = false);

  baSlider.addEventListener('touchstart', (e) => { dragging = true; setSlider(e.touches[0].clientX); }, { passive: true });
  baSlider.addEventListener('touchmove', (e) => { if (dragging) setSlider(e.touches[0].clientX); }, { passive: true });
  baSlider.addEventListener('touchend', () => dragging = false);

  // gentle auto-demo on load: slide to 60% then settle back to 40% (better for mobile)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTimeout(() => {
      baBefore.style.transition = 'width 1.1s ease-in-out';
      baHandle.style.transition = 'left 1.1s ease-in-out';
      setSlider(baSlider.getBoundingClientRect().left + baSlider.getBoundingClientRect().width * 0.60);
      setTimeout(() => {
        setSlider(baSlider.getBoundingClientRect().left + baSlider.getBoundingClientRect().width * 0.40);
        setTimeout(() => {
          baBefore.style.transition = '';
          baHandle.style.transition = '';
        }, 1100);
      }, 900);
    }, 700);
  }
}

// Contact form (Formspree AJAX)
const leadForm = document.getElementById('leadForm');
if (leadForm) {
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = leadForm.querySelector('.form-submit');
    const successMsg = document.getElementById('formSuccess');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    try {
      const res = await fetch(leadForm.action, {
        method: 'POST',
        body: new FormData(leadForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        leadForm.reset();
        successMsg.classList.add('show');
        submitBtn.textContent = 'Send Request';
      } else {
        submitBtn.textContent = 'Try Again';
      }
    } catch (err) {
      submitBtn.textContent = 'Try Again';
    }
    submitBtn.disabled = false;
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));
