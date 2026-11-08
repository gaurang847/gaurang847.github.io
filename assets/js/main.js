/**
 * Gaurang Pansare - Personal Website Scripts
 * Features: Dark/Light Theme Switcher, Email Copy with Toast, Safe Analytics
 */

(function () {
  'use strict';

  // --- Theme Management ---
  const STORAGE_KEY = 'gaurang_theme_preference';
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  }

  // Initial Theme Application
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      const active = htmlRoot.getAttribute('data-theme') || 'dark';
      const next = active === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  }

  // Listen for system theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- Toast Notification ---
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    const msgEl = toast.querySelector('.toast-message');
    if (msgEl) msgEl.textContent = message;

    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2800);
  }

  // --- Copy Email to Clipboard ---
  const copyBtn = document.getElementById('copy-email-btn');
  const emailAddress = 'contact@gaurang.page';

  if (copyBtn) {
    copyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailAddress).then(
          function () {
            showToast('Email copied: contact@gaurang.page');
          },
          function () {
            fallbackCopy(emailAddress);
          }
        );
      } else {
        fallbackCopy(emailAddress);
      }
    });
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('Email copied: contact@gaurang.page');
    } catch (err) {
      window.location.href = `mailto:${text}`;
    }
    document.body.removeChild(tempInput);
  }

  // --- Dynamic Year in Footer ---
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Safe Outbound Analytics Tracking ---
  // Sends an event via gtag or dataLayer if available without hijacking navigation
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[data-track]');
    if (!link) return;

    const label = link.getAttribute('data-track');
    const href = link.getAttribute('href');

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'click', {
        event_category: 'outbound',
        event_label: label,
        transport_type: 'beacon'
      });
    }
  });
})();
