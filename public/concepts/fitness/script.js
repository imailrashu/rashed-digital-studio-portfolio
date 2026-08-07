const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav?.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
});

mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileNav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  revealElements.forEach((element) => observer.observe(element));
}

const scheduleSets = {
  mon: [['06:30', 'FORGE Strength', 'Technique + progressive strength'], ['08:00', 'Engine Room', 'Conditioning + aerobic capacity'], ['18:00', 'Cross Training', 'Strength + mixed-modal training'], ['19:30', 'Move Better', 'Mobility + controlled strength']],
  tue: [['06:30', 'Engine Room', 'Intervals + aerobic work'], ['07:45', 'FORGE Strength', 'Press + pull focus'], ['18:30', 'Personal Lab', 'Small-group technique'], ['19:30', 'Cross Training', 'Mixed-modal session']],
  wed: [['06:30', 'FORGE Strength', 'Hinge + carry focus'], ['08:00', 'Move Better', 'Mobility + control'], ['18:00', 'Engine Room', 'Long-form conditioning'], ['19:15', 'Open Training', 'Coach-guided practice']],
  thu: [['06:30', 'Cross Training', 'Strength + conditioning'], ['08:00', 'FORGE Strength', 'Squat + accessory work'], ['18:00', 'Move Better', 'Mobility + resilience'], ['19:15', 'Engine Room', 'Intervals + capacity']],
  fri: [['06:30', 'FORGE Strength', 'Full-body strength'], ['08:00', 'Engine Room', 'Short intervals'], ['17:30', 'Cross Training', 'End-of-week session'], ['18:45', 'Open Training', 'Technique practice']],
  sat: [['08:00', 'Community Session', 'Team-based training'], ['09:30', 'Strength Workshop', 'Technique focus'], ['11:00', 'Move Better', 'Mobility + recovery'], ['12:00', 'Open Gym', 'Independent practice']],
};

document.querySelectorAll('[data-day]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-day]').forEach((item) => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-selected', String(item === button));
  });
  const sessions = scheduleSets[button.dataset.day] || scheduleSets.mon;
  document.querySelector('[data-schedule]').innerHTML = sessions.map(([time, title, description]) => `<article><time>${time}</time><div><h3>${title}</h3><p>${description}</p></div><span>Demo class</span><a href="#trial">Book ↗</a></article>`).join('');
}));

document.querySelector('[data-demo-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = event.currentTarget.querySelector('.form-status');
  status.textContent = 'Demo request prepared — no information was sent.';
});
