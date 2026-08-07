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
  menuButton?.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('is-open');
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
  }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  revealElements.forEach((element) => observer.observe(element));
}

if (!reduceMotion) {
  document.querySelectorAll('[data-light-card]').forEach((card) => card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${event.clientX - rect.left}px`);
    card.style.setProperty('--y', `${event.clientY - rect.top}px`);
  }));

  const tilt = document.querySelector('[data-tilt]');
  tilt?.addEventListener('pointermove', (event) => {
    const rect = tilt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tilt.style.transform = `perspective(1400px) rotateX(${-y * 1.8}deg) rotateY(${x * 1.8}deg)`;
  });
  tilt?.addEventListener('pointerleave', () => { tilt.style.transform = ''; });
}

const flowSteps = [
  { label: 'Capture', title: 'Start with a better request.', description: 'Prompt for the goal, owner, timing and supporting context before the work enters the queue.', window: 'New request', first: 'Request type', firstValue: 'Product launch', second: 'Primary goal', secondValue: 'Create a clearer conversion path' },
  { label: 'Shape', title: 'Route work with intention.', description: 'Choose the relevant flow, clarify responsibility and make the next handoff visible.', window: 'Flow builder', first: 'Workflow', firstValue: 'Launch sequence', second: 'Next owner', secondValue: 'Creative review' },
  { label: 'Review', title: 'Keep decisions beside the work.', description: 'Gather feedback in a focused stage and record what changed before approval.', window: 'Review step', first: 'Review focus', firstValue: 'Narrative + responsive UI', second: 'Decision', secondValue: 'Ready for final pass' },
  { label: 'Move', title: 'Close the loop cleanly.', description: 'Confirm approval, notify the next owner and keep a visible record of the completed handoff.', window: 'Approved handoff', first: 'Status', firstValue: 'Approved', second: 'Next action', secondValue: 'Prepare launch package' },
];
let flowIndex = 0;

const renderFlow = () => {
  const step = flowSteps[flowIndex];
  const number = String(flowIndex + 1).padStart(2, '0');
  document.querySelector('[data-flow-current]').textContent = number;
  document.querySelector('[data-flow-number]').textContent = number;
  document.querySelector('[data-flow-label]').textContent = step.label;
  document.querySelector('[data-flow-title]').textContent = step.title;
  document.querySelector('[data-flow-description]').textContent = step.description;
  document.querySelector('[data-flow-window]').textContent = step.window;
  document.querySelector('[data-flow-fields]').innerHTML = `<label>${step.first}<span>${step.firstValue}</span></label><label>${step.second}<span>${step.secondValue}</span></label><div><label>Owner<span>Concept team</span></label><label>Timing<span>Current cycle</span></label></div><button>Continue →</button>`;
};

document.querySelector('[data-flow-prev]')?.addEventListener('click', () => { flowIndex = (flowIndex + flowSteps.length - 1) % flowSteps.length; renderFlow(); });
document.querySelector('[data-flow-next]')?.addEventListener('click', () => { flowIndex = (flowIndex + 1) % flowSteps.length; renderFlow(); });

document.querySelectorAll('[data-billing]').forEach((button) => button.addEventListener('click', () => {
  document.querySelectorAll('[data-billing]').forEach((item) => item.classList.toggle('active', item === button));
  document.querySelectorAll('[data-price]').forEach((price) => { price.textContent = button.dataset.billing === 'annual' ? 'Annual demo' : 'Demo price'; });
}));
