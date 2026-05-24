const header = document.querySelector('.header');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav a');
const yearEl = document.getElementById('year');
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');
const revealTargets = document.querySelectorAll('.section, .menu-card, .gallery-item, .review-card');

// Setează anul curent în footer.
yearEl.textContent = new Date().getFullYear();

// Schimbă subtil headerul după scroll pentru contrast mai bun.
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 14);
});

// Toggle pentru navigația mobilă.
navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Închide meniul după click pe un link.
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Filtrare simplă pentru categoriile din meniu.
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    menuCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      card.classList.toggle('hidden', !shouldShow);
    });
  });
});

// Animații discrete la apariția secțiunilor în viewport.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((item) => {
  item.classList.add('reveal');
  revealObserver.observe(item);
});
