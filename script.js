const body = document.body;
const header = document.querySelector('.header');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav a');
const yearEl = document.getElementById('year');
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');
const revealTargets = document.querySelectorAll('.reveal');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const closeNav = () => {
  if (!mainNav || !navToggle) {
    return;
  }

  mainNav.classList.remove('open');
  mainNav.setAttribute('aria-hidden', 'true');
  navToggle.setAttribute('aria-expanded', 'false');
  body.classList.remove('nav-open');
};

if (header) {
  const syncHeaderState = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };

  syncHeaderState();
  window.addEventListener('scroll', syncHeaderState, { passive: true });
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mainNav.setAttribute('aria-hidden', String(!isOpen));
    body.classList.toggle('nav-open', isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (link.matches('[href^="tel:"]')) {
      return;
    }

    closeNav();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNav();
  }
});

document.addEventListener('click', (event) => {
  if (!mainNav || !navToggle || !mainNav.classList.contains('open')) {
    return;
  }

  if (!mainNav.contains(event.target) && !navToggle.contains(event.target)) {
    closeNav();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 980) {
    closeNav();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });

    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');

    const activeFilter = button.dataset.filter;

    menuCards.forEach((card) => {
      const category = card.dataset.category;
      const isVisible = activeFilter === 'all' || category === activeFilter;
      card.classList.toggle('hidden', !isVisible);
    });
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  revealTargets.forEach((target) => {
    revealObserver.observe(target);
  });
} else {
  revealTargets.forEach((target) => {
    target.classList.add('visible');
  });
}
