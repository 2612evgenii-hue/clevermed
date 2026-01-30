// main.js
// ES6+ modular, mobile-first interactions for KleverMed portfolio

const SELECTORS = {
  burger: '#burger',
  nav: '#main-nav',
  navLinks: '.nav__link',
  sections: '[data-section]',
  buttonsScrollTo: '[data-scroll-to]',
  loader: '#loader',
  heroVideo: '.hero__video',
  counter: '[data-counter]',
  servicesTrack: '[data-carousel-track]',
  servicesCard: '[data-service]',
  servicesPrev: '[data-carousel-prev]',
  servicesNext: '[data-carousel-next]',
  contactForm: '#contact-form',
  contactInputs: '#contact-form .contact__input',
  contactErrors: '[data-error-for]',
  contactSuccess: '#form-success',
  photoCarousel: '[data-photo-carousel]',
  photoPrev: '.about__photo-control--prev',
  photoNext: '.about__photo-control--next',
  photos: '.about__photo',
  yandexMap: '#yandex-map',
};

const CLASSNAMES = {
  navOpen: 'nav--open',
  burgerOpen: 'header__burger--open',
  sectionHidden: 'is-hidden',
  sectionVisible: 'is-visible',
  servicesCardActive: 'services__card--active',
  servicesControlActive: 'services__control--active',
  loaderHidden: 'loader--hidden',
  inputInvalid: 'contact__input--invalid',
};

const STATE = {
  servicesIndex: 0,
  servicesCards: [],
  servicesControls: [],
  photoIndex: 0,
  photos: [],
  photoInterval: null,
  prefersReducedMotion: window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches,
};

/**
 * Helper: smooth scroll with fallback
 */
function smoothScrollTo(target) {
  const element =
    typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  try {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch {
    const top = element.getBoundingClientRect().top + window.pageYOffset - 64;
    window.scrollTo(0, top);
  }
}

/**
 * Loader handling
 */
function initLoader() {
  const loader = document.querySelector(SELECTORS.loader);
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add(CLASSNAMES.loaderHidden);
    }, 800);
  });
}

/**
 * Navigation (icons + mobile burger)
 */
function initNavigation() {
  const burger = document.querySelector(SELECTORS.burger);
  const nav = document.querySelector(SELECTORS.nav);
  const links = document.querySelectorAll(SELECTORS.navLinks);

  if (!nav || !links.length) return;

  // Smooth scroll on click
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      smoothScrollTo(target);
      // Close mobile nav
      if (burger && nav.classList.contains(CLASSNAMES.navOpen)) {
        nav.classList.remove(CLASSNAMES.navOpen);
        burger.classList.remove(CLASSNAMES.burgerOpen);
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Burger for mobile
  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle(CLASSNAMES.navOpen);
      burger.classList.toggle(CLASSNAMES.burgerOpen, isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Highlight active nav item on scroll
  const sections = document.querySelectorAll(SELECTORS.sections);
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        if (!id) return;
        links.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle(
            'nav__link--active',
            href === `#${id}`
          );
        });
      });
    },
    {
      threshold: 0.5,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Scroll-triggered animations for sections
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll(SELECTORS.sections);
  if (!sections.length) return;

  if (STATE.prefersReducedMotion) {
    sections.forEach((section) => {
      section.classList.remove(CLASSNAMES.sectionHidden);
      section.classList.add(CLASSNAMES.sectionVisible);
    });
    return;
  }

  sections.forEach((section) => {
    section.classList.add(CLASSNAMES.sectionHidden);
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(CLASSNAMES.sectionHidden);
          entry.target.classList.add(CLASSNAMES.sectionVisible);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Buttons with data-scroll-to attribute
 */
function initScrollButtons() {
  const buttons = document.querySelectorAll(SELECTORS.buttonsScrollTo);
  buttons.forEach((button) => {
    const targetId = button.getAttribute('data-scroll-to');
    if (!targetId) return;
    button.addEventListener('click', () => smoothScrollTo(targetId));
  });
}

/**
 * Counters animation for stats
 */
function initCounters() {
  const nodes = document.querySelectorAll(SELECTORS.counter);
  if (!nodes.length || STATE.prefersReducedMotion) return;

  const animateCounter = (node) => {
    const value = Number(node.dataset.counter);
    if (!value || Number.isNaN(value)) return;
    const isYear = value > 1900 && value < 2100;
    const isYears = node.textContent.includes('лет');
    const duration = 900;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.floor(value * progress);
      if (isYear) {
        node.textContent = String(current || value);
      } else if (isYears) {
        node.textContent = `${current} лет`;
      } else {
        node.textContent = `${current}+`;
      }
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (isYear) {
          node.textContent = String(value);
        } else if (isYears) {
          node.textContent = `${value} лет`;
        } else {
          node.textContent = `${value}+`;
        }
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  nodes.forEach((node) => observer.observe(node));
}

/**
 * Services carousel with swipe on mobile
 */
function initServicesCarousel() {
  const track = document.querySelector(SELECTORS.servicesTrack);
  const cards = document.querySelectorAll(SELECTORS.servicesCard);
  if (!track || !cards.length) return;

  STATE.servicesCards = Array.from(cards);
  const prevBtn = document.querySelector(SELECTORS.servicesPrev);
  const nextBtn = document.querySelector(SELECTORS.servicesNext);

  const updateControls = () => {
    // Обновляем состояние стрелочек (скрываем если первая/последняя карточка)
    if (prevBtn) {
      prevBtn.style.opacity = STATE.servicesIndex === 0 ? '0.3' : '1';
      prevBtn.style.pointerEvents = STATE.servicesIndex === 0 ? 'none' : 'auto';
    }
    if (nextBtn) {
      nextBtn.style.opacity = STATE.servicesIndex === STATE.servicesCards.length - 1 ? '0.3' : '1';
      nextBtn.style.pointerEvents = STATE.servicesIndex === STATE.servicesCards.length - 1 ? 'none' : 'auto';
    }
  };

  const scrollToIndex = (index) => {
    const safeIndex = Math.max(
      0,
      Math.min(index, STATE.servicesCards.length - 1)
    );
    STATE.servicesIndex = safeIndex;
    const card = STATE.servicesCards[safeIndex];
    track.scrollTo({
      left: card.offsetLeft - 16,
      behavior: 'smooth',
    });
    STATE.servicesCards.forEach((el, idx) =>
      el.classList.toggle(CLASSNAMES.servicesCardActive, idx === safeIndex)
    );
    updateControls();
  };

  // Используем стрелочки вместо точек
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollToIndex(STATE.servicesIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollToIndex(STATE.servicesIndex + 1);
    });
  }

  // Убрали свайпы - теперь только стрелочки
  // Click to focus card - оставляем для удобства
  STATE.servicesCards.forEach((card, index) => {
    card.addEventListener('click', () => scrollToIndex(index));
  });

  // Initial state
  scrollToIndex(0);
}

/**
 * Photo carousel for director section
 */
function initPhotoCarousel() {
  const carousel = document.querySelector(SELECTORS.photoCarousel);
  if (!carousel) return;

  const photos = carousel.querySelectorAll(SELECTORS.photos);
  if (photos.length < 2) return;

  STATE.photos = Array.from(photos);
  const prevBtn = carousel.querySelector(SELECTORS.photoPrev);
  const nextBtn = carousel.querySelector(SELECTORS.photoNext);

  const showPhoto = (index) => {
    const safeIndex = ((index % STATE.photos.length) + STATE.photos.length) % STATE.photos.length;
    STATE.photoIndex = safeIndex;
    
    // Плавное перелистывание с fade эффектом
    STATE.photos.forEach((photo, idx) => {
      if (idx === safeIndex) {
        // Сначала убираем активный класс у всех
        photo.classList.remove('about__photo--active');
        // Затем добавляем с небольшой задержкой для плавности
        requestAnimationFrame(() => {
          photo.classList.add('about__photo--active');
        });
      } else {
        // Плавно скрываем неактивные фото
        photo.classList.remove('about__photo--active');
      }
    });
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(STATE.photoInterval);
      showPhoto(STATE.photoIndex - 1);
      startPhotoAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(STATE.photoInterval);
      showPhoto(STATE.photoIndex + 1);
      startPhotoAutoPlay();
    });
  }

  const startPhotoAutoPlay = () => {
    clearInterval(STATE.photoInterval);
    STATE.photoInterval = setInterval(() => {
      showPhoto(STATE.photoIndex + 1);
    }, 4000);
  };

  // Initialize
  showPhoto(0);
  startPhotoAutoPlay();
}

/**
 * Contact form validation with EmailJS integration
 */
function initContactForm() {
  const form = document.querySelector(SELECTORS.contactForm);
  if (!form) return;

  const inputs = form.querySelectorAll(SELECTORS.contactInputs);
  const errors = form.querySelectorAll(SELECTORS.contactErrors);
  const successNode = document.querySelector(SELECTORS.contactSuccess);

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    // ВАЖНО: Замените эти значения на ваши ключи из EmailJS
    // Получите их на https://dashboard.emailjs.com/admin/integration
    emailjs.init('YOUR_PUBLIC_KEY'); // Замените на ваш Public Key
  }

  const setError = (name, message) => {
    const input = form.elements[name];
    const errorNode = form.querySelector(
      `[data-error-for="${CSS.escape(name)}"]`
    );
    if (!input || !errorNode) return;
    if (message) {
      input.classList.add(CLASSNAMES.inputInvalid);
      errorNode.textContent = message;
    } else {
      input.classList.remove(CLASSNAMES.inputInvalid);
      errorNode.textContent = '';
    }
  };

  const validate = () => {
    let isValid = true;
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || name.length < 2) {
      setError('name', 'Введите имя (минимум 2 символа).');
      isValid = false;
    } else {
      setError('name', '');
    }

    if (!phone) {
      setError('phone', 'Введите номер телефона.');
      isValid = false;
    } else {
      setError('phone', '');
    }

    if (!message || message.length < 5) {
      setError('message', 'Опишите ваш запрос (минимум 5 символов).');
      isValid = false;
    } else {
      setError('message', '');
    }

    return isValid;
  };

  // Live validation on blur
  inputs.forEach((input) => {
    input.addEventListener('blur', validate);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.textContent;
    
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
    }

    if (successNode) {
      successNode.textContent = '';
    }

    try {
      // EmailJS отправка
      if (typeof emailjs !== 'undefined') {
        // ВАЖНО: Замените 'YOUR_SERVICE_ID' и 'YOUR_TEMPLATE_ID' на ваши значения
        // Получите их на https://dashboard.emailjs.com/admin
        await emailjs.send(
          'YOUR_SERVICE_ID',    // Замените на ваш Service ID
          'YOUR_TEMPLATE_ID',   // Замените на ваш Template ID
          {
            from_name: form.elements.name.value.trim(),
            from_phone: form.elements.phone.value.trim(),
            message: form.elements.message.value.trim(),
            to_email: 'marina_pap@mail.ru', // Email получателя
          }
        );
      }

      if (successNode) {
        successNode.textContent =
          'Спасибо! Ваш запрос отправлен. Мы свяжемся с вами в ближайшее время.';
      }
      form.reset();
      inputs.forEach((input) =>
        input.classList.remove(CLASSNAMES.inputInvalid)
      );
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      if (successNode) {
        successNode.textContent =
          'Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.';
        successNode.style.color = 'var(--color-error)';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText || 'Отправить запрос';
      }
    }
  });
}

/**
 * Video & performance tweaks for mobile
 */
function initMediaOptimization() {
  const video = document.querySelector(SELECTORS.heroVideo);
  if (!video) return;

  // На мобильных устройствах видео остается, но с меньшей непрозрачностью оверлея
  const isSmallScreen = window.matchMedia('(max-width: 600px)').matches;
  if (isSmallScreen) {
    // Видео остается видимым на мобильных
    video.style.opacity = '0.85';
  }
}

/**
 * Service worker registration for offline cache
 */
function initServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch(() => {
        // Silent failure; offline mode is progressive enhancement
      });
  });
}

/**
 * Yandex Maps initialization
 */
function initYandexMap() {
  const mapContainer = document.querySelector(SELECTORS.yandexMap);
  if (!mapContainer || typeof ymaps === 'undefined') return;

  ymaps.ready(() => {
    const map = new ymaps.Map(SELECTORS.yandexMap.replace('#', ''), {
      center: [59.926066, 30.235586],
      zoom: 17,
      controls: ['zoomControl', 'fullscreenControl'],
    });

    const placemark = new ymaps.Placemark(
      [59.926066, 30.235586],
      {
        balloonContent: 'KleverMed<br>пл Морской Славы, д. 1, ЛИТЕР А, ПОМЕЩ. 3-Н',
        hintContent: 'KleverMed',
      },
      {
        iconLayout: 'default#image',
        iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMGM4NTMiIHN0cm9rZT0iIzAwZmY4OCIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjEyIiB5PSIxNiIgZm9udC1zaXplPSIxMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPks8L3RleHQ+Cjwvc3ZnPg==',
        iconImageSize: [40, 40],
        iconImageOffset: [-20, -20],
      }
    );

    map.geoObjects.add(placemark);
  });
}

/**
 * Dynamic year in footer
 */
function initCurrentYear() {
  const node = document.querySelector('#current-year');
  if (node) {
    node.textContent = String(new Date().getFullYear());
  }
}

/**
 * Init
 */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavigation();
  initScrollAnimations();
  initScrollButtons();
  initCounters();
  initServicesCarousel();
  initPhotoCarousel();
  initContactForm();
  initMediaOptimization();
  initYandexMap();
  initServiceWorker();
  initCurrentYear();
});


