/**
 * CQV ChemConnect - Variant Picker JavaScript
 * Variant selection, price update, image swap, thumbnail handling
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
   * 1. Variant Button Selection
   * --------------------------------------------- */
  document.addEventListener('click', function (e) {
    const variantBtn = e.target.closest('.variant-picker__btn');
    if (!variantBtn) return;

    e.preventDefault();

    const picker = variantBtn.closest('.variant-picker');
    if (!picker) return;

    const allButtons = picker.querySelectorAll('.variant-picker__btn');
    allButtons.forEach(function (btn) {
      btn.classList.remove('is-selected');
      btn.setAttribute('aria-pressed', 'false');
    });

    variantBtn.classList.add('is-selected');
    variantBtn.setAttribute('aria-pressed', 'true');

    const variantId = variantBtn.getAttribute('data-variant-id');

    /* -----------------------------------------------
     * 2. Update Hidden Input
     * --------------------------------------------- */
    const form = variantBtn.closest('form');
    if (form) {
      const hiddenInput = form.querySelector('input[name="id"]');
      if (hiddenInput && variantId) {
        hiddenInput.value = variantId;
      }
    }

    /* -----------------------------------------------
     * 3. Update Price Display
     * --------------------------------------------- */
    const variantPrice = variantBtn.getAttribute('data-variant-price');
    const variantUnitPrice = variantBtn.getAttribute('data-variant-unit-price');
    const variantUnitLabel = variantBtn.getAttribute('data-variant-unit-label');

    const priceTotal = document.getElementById('product-price-total');
    if (priceTotal && variantPrice) {
      priceTotal.textContent = formatMoney(parseInt(variantPrice, 10));
    }

    const priceUnit = document.getElementById('product-price-unit');
    if (priceUnit) {
      if (variantUnitPrice) {
        const formattedUnitPrice = formatMoney(parseInt(variantUnitPrice, 10));
        const unitLabel = variantUnitLabel || 'unit';
        priceUnit.textContent = formattedUnitPrice + '/' + unitLabel;
        priceUnit.style.display = '';
        priceUnit.removeAttribute('hidden');
      } else {
        priceUnit.style.display = 'none';
        priceUnit.setAttribute('hidden', '');
      }
    }

    /* -----------------------------------------------
     * 4. Update Main Product Image
     * --------------------------------------------- */
    const variantImage = variantBtn.getAttribute('data-variant-image');
    if (variantImage) {
      const mainImage = document.querySelector('.product-page__main-image');
      if (mainImage) {
        mainImage.setAttribute('src', variantImage);

        const variantImageAlt = variantBtn.getAttribute('data-variant-image-alt');
        if (variantImageAlt) {
          mainImage.setAttribute('alt', variantImageAlt);
        }
      }
    }

    /* -----------------------------------------------
     * 5. Update Add-to-Cart Button Variant ID
     * --------------------------------------------- */
    const productPage = variantBtn.closest('.product-page');
    if (productPage && variantId) {
      const addToCartBtn = productPage.querySelector('.product-page__add-to-cart');
      if (addToCartBtn) {
        addToCartBtn.setAttribute('data-variant-id', variantId);
      }
    }
  });

  /* -----------------------------------------------
   * 6. Thumbnail Click Handler
   * --------------------------------------------- */
  document.addEventListener('click', function (e) {
    const thumb = e.target.closest('.product-page__thumb');
    if (!thumb) return;

    e.preventDefault();

    const thumbImg = thumb.tagName === 'IMG' ? thumb : thumb.querySelector('img');
    if (!thumbImg) return;

    const fullSrc = thumbImg.getAttribute('data-full-src') || thumbImg.getAttribute('src');
    const fullAlt = thumbImg.getAttribute('alt') || '';

    const mainImage = document.querySelector('.product-page__main-image');
    if (mainImage && fullSrc) {
      mainImage.setAttribute('src', fullSrc);
      mainImage.setAttribute('alt', fullAlt);
    }

    const gallery = thumb.closest('.product-page__thumbs, .product-page__gallery');
    if (gallery) {
      gallery.querySelectorAll('.product-page__thumb').forEach(function (t) {
        t.classList.remove('is-active');
      });
      thumb.classList.add('is-active');
    }
  });
})();
