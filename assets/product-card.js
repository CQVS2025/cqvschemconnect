/**
 * CQV ChemConnect - Product Card JavaScript
 * Research panel toggle, AJAX add-to-cart
 */

(function () {
  'use strict';

  /* -----------------------------------------------
   * 1. Research Panel Toggle
   * --------------------------------------------- */
  document.addEventListener('click', function (e) {
    const toggleBtn = e.target.closest('.product-card__research-toggle');
    if (!toggleBtn) return;

    e.preventDefault();

    let panel = null;
    const controlsId = toggleBtn.getAttribute('aria-controls');
    if (controlsId) {
      panel = document.getElementById(controlsId);
    }

    if (!panel) {
      panel = toggleBtn.closest('.product-card').querySelector('.product-card__research-panel');
    }

    if (!panel) return;

    const isOpen = panel.classList.contains('is-open');

    if (isOpen) {
      panel.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = 'View Research';
    } else {
      panel.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.textContent = 'Hide Research';
    }
  });

  /* -----------------------------------------------
   * 2. AJAX Add to Cart
   * --------------------------------------------- */
  document.addEventListener('click', function (e) {
    const addBtn = e.target.closest('.product-card__add-to-cart');
    if (!addBtn) return;

    e.preventDefault();

    if (addBtn.classList.contains('is-loading')) return;

    const variantId = addBtn.getAttribute('data-variant-id');
    if (!variantId) return;

    const originalText = addBtn.textContent;
    addBtn.classList.add('is-loading');
    addBtn.textContent = 'Adding...';
    addBtn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        items: [
          {
            id: parseInt(variantId, 10),
            quantity: 1
          }
        ]
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Add to cart failed with status ' + response.status);
        }
        return response.json();
      })
      .then(function () {
        addBtn.classList.remove('is-loading');
        addBtn.textContent = 'Added!';
        addBtn.classList.add('is-success');

        return fetch('/cart.js', {
          headers: {
            'Accept': 'application/json'
          }
        });
      })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Cart fetch failed');
        }
        return response.json();
      })
      .then(function (cart) {
        if (typeof window.updateCartCount === 'function') {
          window.updateCartCount(cart.item_count);
        }

        setTimeout(function () {
          addBtn.textContent = originalText;
          addBtn.classList.remove('is-success');
          addBtn.disabled = false;
        }, 1500);
      })
      .catch(function (error) {
        console.error('Add to cart error:', error);
        addBtn.classList.remove('is-loading');
        addBtn.textContent = 'Error';
        addBtn.classList.add('is-error');

        setTimeout(function () {
          addBtn.textContent = originalText;
          addBtn.classList.remove('is-error');
          addBtn.disabled = false;
        }, 2000);
      });
  });
})();
