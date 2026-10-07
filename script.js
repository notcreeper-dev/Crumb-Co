(function () {
  'use strict';

  // Mobile navigation
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');

  function setNav(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  toggle.addEventListener('click', () => setNav(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 760) setNav(false); });

  // Highlight the current section in the nav (smooth scrolling itself is handled in CSS)
  const links = [...nav.querySelectorAll('a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href')));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => s && io.observe(s));
  }

  // Contact form validation
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter a valid email address, like name@example.com.',
    message: v => v.trim().length >= 10 ? '' : 'Write a message of at least 10 characters.'
  };

  function check(input) {
    const msg = rules[input.name](input.value);
    input.closest('.field').classList.toggle('invalid', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    document.getElementById(input.id + '-error').textContent = msg;
    return !msg;
  }

  const inputs = [...form.querySelectorAll('input, textarea')];
  inputs.forEach(i => {
    i.addEventListener('blur', () => check(i));
    i.addEventListener('input', () => { if (i.closest('.field').classList.contains('invalid')) check(i); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    success.hidden = true;
    const results = inputs.map(check);
    const firstBad = inputs[results.indexOf(false)];
    if (firstBad) { firstBad.focus(); return; }
    // No backend: a real site would send the data to a form service here.
    form.reset();
    success.hidden = false;
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
