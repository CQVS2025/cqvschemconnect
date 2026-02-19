/**
 * CQV ChemConnect - Loyalty Tracker JavaScript
 * Progress bar animation, discount code copy
 */

(function () {
  'use strict';

  /* -----------------------------------------------
   * 1. Progress Bar Animation
   * --------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    const loyaltyBars = document.querySelectorAll('.loyalty-bar');

    loyaltyBars.forEach(function (bar) {
      const current = parseFloat(bar.getAttribute('data-current')) || 0;
      const target = parseFloat(bar.getAttribute('data-target')) || 1;
      const percentage = Math.min((current / target) * 100, 100);

      const fill = bar.querySelector('.loyalty-bar__fill');
      if (!fill) return;

      fill.style.width = '0%';

      setTimeout(function () {
        requestAnimationFrame(function () {
          fill.style.width = percentage + '%';
        });
      }, 100);

      const percentLabel = bar.querySelector('.loyalty-bar__percent');
      if (percentLabel) {
        percentLabel.textContent = Math.round(percentage) + '%';
      }
    });
  });

  /* -----------------------------------------------
   * 2. Copy Discount Code
   * --------------------------------------------- */
  document.addEventListener('click', function (e) {
    const copyBtn = e.target.closest('.loyalty-bar__copy');
    if (!copyBtn) return;

    e.preventDefault();

    const loyaltyBar = copyBtn.closest('.loyalty-bar');
    let code = '';

    if (copyBtn.getAttribute('data-code')) {
      code = copyBtn.getAttribute('data-code');
    } else if (loyaltyBar) {
      const codeEl = loyaltyBar.querySelector('.loyalty-bar__code');
      if (codeEl) {
        code = codeEl.getAttribute('data-code') || codeEl.textContent.trim();
      }
    }

    if (!code) return;

    const originalText = copyBtn.textContent;

    function showFeedback() {
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('is-copied');

      setTimeout(function () {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('is-copied');
      }, 2000);
    }

    function showError() {
      copyBtn.textContent = 'Failed';
      copyBtn.classList.add('is-error');

      setTimeout(function () {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('is-error');
      }, 2000);
    }

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(code)
        .then(function () {
          showFeedback();
        })
        .catch(function () {
          fallbackCopy(code) ? showFeedback() : showError();
        });
    } else {
      fallbackCopy(code) ? showFeedback() : showError();
    }
  });

  /**
   * Fallback clipboard copy using a temporary textarea element.
   * Returns true if the copy command succeeded, false otherwise.
   */
  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      success = false;
    }

    document.body.removeChild(textarea);
    return success;
  }
})();
