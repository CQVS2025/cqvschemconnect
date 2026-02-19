/**
 * CQV ChemConnect - Cart Page JavaScript
 * Quantity updates, item removal, live price recalculation
 */

(function () {
  'use strict';

  /* -----------------------------------------------
   * Helper: Format Money
   * --------------------------------------------- */
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  /* -----------------------------------------------
   * Helper: Fetch Fresh Cart and Update UI
   * --------------------------------------------- */
  function refreshCart() {
    return fetch('/cart.js', {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }
        return response.json();
      })
      .then(function (cart) {
        if (typeof window.updateCartCount === 'function') {
          window.updateCartCount(cart.item_count);
        }

        const subtotalEl = document.querySelector('.cart-page__subtotal-value');
        if (subtotalEl) {
          subtotalEl.textContent = formatMoney(cart.total_price);
        }

        cart.items.forEach(function (item, index) {
          const lineItem = document.querySelector(
            '[data-line-index="' + (index + 1) + '"]'
          );
          if (!lineItem) return;

          const lineTotalEl = lineItem.querySelector('.cart-item__total');
          if (lineTotalEl) {
            lineTotalEl.textContent = formatMoney(item.final_line_price);
          }

          const quantityInput = lineItem.querySelector(
            'input[type="number"], .quantity-input__field'
          );
          if (quantityInput) {
            quantityInput.value = item.quantity;
          }
        });

        if (cart.item_count === 0) {
          window.location.reload();
        }

        return cart;
      });
  }

  /* -----------------------------------------------
   * Helper: Update Cart Line
   * --------------------------------------------- */
  function updateCartLine(line, quantity, lineItemEl) {
    if (lineItemEl) {
      lineItemEl.classList.add('is-updating');
    }

    return fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        line: parseInt(line, 10),
        quantity: parseInt(quantity, 10)
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Cart update failed with status ' + response.status);
        }
        return response.json();
      })
      .then(function () {
        return refreshCart();
      })
      .then(function (cart) {
        if (lineItemEl) {
          lineItemEl.classList.remove('is-updating');
        }
        return cart;
      })
      .catch(function (error) {
        console.error('Cart update error:', error);
        if (lineItemEl) {
          lineItemEl.classList.remove('is-updating');
          lineItemEl.classList.add('is-error');

          setTimeout(function () {
            lineItemEl.classList.remove('is-error');
          }, 2000);
        }
      });
  }

  /* -----------------------------------------------
   * 1. Quantity Update via Buttons
   * --------------------------------------------- */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.cart-page .quantity-input__btn');
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

    const lineItemEl = btn.closest('[data-line-index]');
    if (!lineItemEl) return;

    const lineIndex = lineItemEl.getAttribute('data-line-index');

    updateCartLine(lineIndex, currentValue, lineItemEl);
  });

  /* -----------------------------------------------
   * 2. Quantity Update via Direct Input Change
   * --------------------------------------------- */
  document.addEventListener('change', function (e) {
    const input = e.target.closest('.cart-page .quantity-input__field, .cart-page .quantity-input input[type="number"]');
    if (!input) return;

    const lineItemEl = input.closest('[data-line-index]');
    if (!lineItemEl) return;

    const lineIndex = lineItemEl.getAttribute('data-line-index');
    const min = parseInt(input.getAttribute('min'), 10) || 1;
    let quantity = parseInt(input.value, 10);

    if (isNaN(quantity) || quantity < min) {
      quantity = min;
      input.value = quantity;
    }

    updateCartLine(lineIndex, quantity, lineItemEl);
  });

  /* -----------------------------------------------
   * 3. Remove Item
   * --------------------------------------------- */
  document.addEventListener('click', function (e) {
    const removeBtn = e.target.closest('.cart-item__remove');
    if (!removeBtn) return;

    e.preventDefault();

    const lineItemEl = removeBtn.closest('[data-line-index]');
    if (!lineItemEl) return;

    const lineIndex = lineItemEl.getAttribute('data-line-index');

    lineItemEl.style.opacity = '0.5';
    lineItemEl.style.pointerEvents = 'none';

    updateCartLine(lineIndex, 0, lineItemEl);
  });
})();
