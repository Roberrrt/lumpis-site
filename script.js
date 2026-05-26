const body = document.body;
const header = document.querySelector('.header');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const yearEl = document.getElementById('year');
const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');
const revealTargets = document.querySelectorAll('.reveal');
const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
const lightbox = document.getElementById('imageLightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxCloseTargets = lightbox?.querySelectorAll('[data-lightbox-close]');
let lastLightboxTrigger = null;

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
    closeNav();
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNav();

    if (lightbox?.classList.contains('is-open')) {
      closeLightbox();
    }
  }
});

document.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('a[href^="tel:"]')) {
    return;
  }

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

const openLightbox = (trigger) => {
  if (!lightbox || !lightboxImage || !trigger) {
    return;
  }

  const source = trigger.currentSrc || trigger.src;

  if (!source) {
    return;
  }

  lastLightboxTrigger = trigger;
  lightboxImage.src = source;
  lightboxImage.alt = trigger.alt || '';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  body.classList.add('lightbox-open');
  lightbox.querySelector('.lightbox-close')?.focus();
};

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  body.classList.remove('lightbox-open');
  lightboxImage.src = '';
  lightboxImage.alt = '';
  lastLightboxTrigger?.focus();
  lastLightboxTrigger = null;
}

lightboxTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => {
    openLightbox(trigger);
  });

  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox(trigger);
    }
  });
});

lightboxCloseTargets?.forEach((closeTarget) => {
  closeTarget.addEventListener('click', closeLightbox);
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
