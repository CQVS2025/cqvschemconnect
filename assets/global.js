/**
 * CQV ChemConnect - Global JavaScript
 * Mobile menu, smooth scroll, sticky header, cart count, quantity inputs
 */

(function () {
  'use strict';

  /* -----------------------------------------------
   * 1. Mobile Menu Toggle
   * --------------------------------------------- */
  const menuToggle = document.querySelector('.header__menu-toggle');
  const menuDrawer = document.querySelector('.header__drawer');
  const menuOverlay = document.querySelector('.header__overlay');
  const menuClose = document.querySelector('.header__drawer-close');

  function openMenu() {
    if (!menuDrawer) return;
    menuDrawer.classList.add('is-open');
    if (menuOverlay) menuOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!menuDrawer) return;
    menuDrawer.classList.remove('is-open');
    if (menuOverlay) menuOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  function isMenuOpen() {
    return menuDrawer && menuDrawer.classList.contains('is-open');
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      if (isMenuOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', function () {
      closeMenu();
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', function (e) {
      e.preventDefault();
      closeMenu();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isMenuOpen()) {
      closeMenu();
    }
  });

  /* -----------------------------------------------
   * 2. Smooth Scroll for Anchor Links
   * --------------------------------------------- */
  document.addEventListener('click', function (e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#' || targetId.length < 2) return;

    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    e.preventDefault();

    if (isMenuOpen()) {
      closeMenu();
    }

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });

  /* -----------------------------------------------
   * 3. Sticky Header
   * --------------------------------------------- */
  const header = document.querySelector('.header');

  if (header) {
    const sentinel = document.createElement('div');
    sentinel.className = 'header-sentinel';
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.left = '0';
    sentinel.style.width = '1px';
    sentinel.style.height = '1px';
    sentinel.style.pointerEvents = 'none';
    document.body.insertBefore(sentinel, document.body.firstChild);

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              header.classList.add('is-sticky');
            } else {
              header.classList.remove('is-sticky');
            }
          });
        },
        {
          rootMargin: '-100px 0px 0px 0px',
          threshold: 0
        }
      );
      observer.observe(sentinel);
    } else {
      let ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            if (window.scrollY > 100) {
              header.classList.add('is-sticky');
            } else {
              header.classList.remove('is-sticky');
            }
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }

  /* -----------------------------------------------
   * 4. Cart Count Updater
   * --------------------------------------------- */
  window.updateCartCount = function (count) {
    const cartCountElements = document.querySelectorAll('.header__cart-count');
    cartCountElements.forEach(function (el) {
      el.textContent = count;
      if (count > 0) {
        el.style.display = '';
        el.removeAttribute('hidden');
      } else {
        el.style.display = 'none';
        el.setAttribute('hidden', '');
      }
    });
  };

  /* -----------------------------------------------
   * 5. Quantity Input Controls
   * --------------------------------------------- */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.quantity-input__btn');
    if (!btn) return;

    e.preventDefault();

    const wrapper = btn.closest('.quantity-input');
    if (!wrapper) return;

    const input = wrapper.querySelector('input[type="number"], .quantity-input__field');
    if (!input) return;

    const action = btn.getAttribute('data-action');
    const min = parseInt(input.getAttribute('min'), 10) || 1;
    const max = parseInt(input.getAttribute('max'), 10) || Infinity;
    const step = parseInt(input.getAttribute('step'), 10) || 1;
    let currentValue = parseInt(input.value, 10) || min;

    if (action === 'increase') {
      currentValue = Math.min(currentValue + step, max);
    } else if (action === 'decrease') {
      currentValue = Math.max(currentValue - step, min);
    }

    input.value = currentValue;

    const changeEvent = new Event('change', { bubbles: true });
    input.dispatchEvent(changeEvent);
  });
})();
