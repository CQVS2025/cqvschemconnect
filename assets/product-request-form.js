/**
 * CQV ChemConnect - Product Request Form JavaScript
 * Client-side validation, loading state on submit
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.product-request-form');
    if (!form) return;

    const submitBtn = form.querySelector('[type="submit"], .product-request-form__submit');
    const originalButtonText = submitBtn ? submitBtn.textContent : 'Submit';

    /* -----------------------------------------------
     * 1. Remove Error Styling on Input
     * --------------------------------------------- */
    form.addEventListener('input', function (e) {
      const field = e.target;
      if (field.classList.contains('is-invalid')) {
        if (field.value.trim() !== '') {
          field.classList.remove('is-invalid');

          const errorMsg = field.parentElement.querySelector('.field-error');
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      }
    });

    /* -----------------------------------------------
     * 2. Validate and Submit
     * --------------------------------------------- */
    form.addEventListener('submit', function (e) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      let firstInvalidField = null;

      form.querySelectorAll('.field-error').forEach(function (el) {
        el.remove();
      });

      requiredFields.forEach(function (field) {
        field.classList.remove('is-invalid');

        let isEmpty = false;

        if (field.type === 'email') {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          isEmpty = !field.value.trim() || !emailPattern.test(field.value.trim());
        } else if (field.type === 'checkbox') {
          isEmpty = !field.checked;
        } else if (field.tagName === 'SELECT') {
          isEmpty = !field.value || field.value === '';
        } else {
          isEmpty = !field.value.trim();
        }

        if (isEmpty) {
          isValid = false;
          field.classList.add('is-invalid');

          const errorMsg = document.createElement('span');
          errorMsg.className = 'field-error';
          errorMsg.setAttribute('role', 'alert');

          if (field.type === 'email' && field.value.trim() !== '') {
            errorMsg.textContent = 'Please enter a valid email address.';
          } else {
            const fieldLabel = field.getAttribute('aria-label')
              || field.getAttribute('placeholder')
              || (field.labels && field.labels.length > 0 ? field.labels[0].textContent.trim() : '')
              || 'This field';
            errorMsg.textContent = fieldLabel + ' is required.';
          }

          field.parentElement.appendChild(errorMsg);

          if (!firstInvalidField) {
            firstInvalidField = field;
          }
        }
      });

      if (!isValid) {
        e.preventDefault();

        if (firstInvalidField) {
          firstInvalidField.focus();
        }

        return;
      }

      /* -----------------------------------------------
       * 3. Loading State on Submit
       * --------------------------------------------- */
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        if (submitBtn && submitBtn.classList.contains('is-loading')) {
          submitBtn.classList.remove('is-loading');
          submitBtn.textContent = originalButtonText;
          submitBtn.disabled = false;
        }
      }, 10000);
    });
  });
})();
