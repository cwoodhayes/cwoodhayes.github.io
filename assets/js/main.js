(function() {
  'use strict';

  const CONFIG = {
    scrollOffset: 90,
    scrollThreshold: 0.3,
    debounceDelay: 120
  };

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function isHomePage() {
    const path = window.location.pathname;
    return path === '/' || path === '/index.html';
  }

  function smoothScrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const offsetTop = section.offsetTop - CONFIG.scrollOffset;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }

  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link[data-scroll-to]');
    if (!navLinks.length) return;

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const sectionId = link.getAttribute('data-scroll-to');
        if (!sectionId) return;

        if (isHomePage()) {
          e.preventDefault();
          smoothScrollToSection(sectionId);
          history.pushState(null, '', `#${sectionId}`);
        }
      });
    });
  }

  function getTrackableSections() {
    return ['projects', 'about', 'contact']
      .map(id => ({ id, element: document.getElementById(id) }))
      .filter(section => section.element !== null);
  }

  function getCurrentSection() {
    const sections = getTrackableSections();
    const scrollPos = window.scrollY + window.innerHeight * CONFIG.scrollThreshold;

    if (window.scrollY < 100) {
      return 'projects';
    }

    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (section.element.offsetTop <= scrollPos) {
        return section.id;
      }
    }

    return 'projects';
  }

  function updateURLForSection() {
    if (!isHomePage()) return;

    const currentSection = getCurrentSection();
    const currentHash = window.location.hash.slice(1);

    if (currentSection === 'projects') {
      if (currentHash) {
        history.replaceState(null, '', '/');
      }
    } else if (currentHash !== currentSection) {
      history.replaceState(null, '', `#${currentSection}`);
    }
  }

  function initSectionTracking() {
    if (!isHomePage()) return;
    const debouncedUpdate = debounce(updateURLForSection, CONFIG.debounceDelay);
    window.addEventListener('scroll', debouncedUpdate);
    updateURLForSection();
  }

  function copyEmailToClipboard() {
    const emailText = document.getElementById('email-text');
    const copyBtn = document.getElementById('copy-email-btn');
    if (!emailText || !copyBtn) return;

    const email = emailText.textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => showCopySuccess(copyBtn))
        .catch(() => fallbackCopyEmail(email, copyBtn));
    } else {
      fallbackCopyEmail(email, copyBtn);
    }
  }

  function fallbackCopyEmail(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      showCopySuccess(button);
    } catch (err) {
      console.error('Fallback: Failed to copy email:', err);
    }

    document.body.removeChild(textArea);
  }

  function showCopySuccess(button) {
    const label = button.querySelector('.copy-text');
    if (!label) return;

    const originalText = label.textContent;
    button.classList.add('copied');
    label.textContent = 'Copied';

    setTimeout(() => {
      button.classList.remove('copied');
      label.textContent = originalText;
    }, 2000);
  }

  function initEmailCopy() {
    const copyBtn = document.getElementById('copy-email-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      copyEmailToClipboard();
    });
  }

  function scrollToHashOnLoad() {
    const hash = window.location.hash;
    if (!hash || !isHomePage()) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const sectionId = hash.slice(1);
        smoothScrollToSection(sectionId);
      }, 120);
    });
  }

  function handleHashNavigation() {
    if (!isHomePage()) return;
    const hash = window.location.hash;
    if (!hash) return;

    setTimeout(() => {
      const sectionId = hash.slice(1);
      const section = document.getElementById(sectionId);
      if (section) {
        smoothScrollToSection(sectionId);
      }
    }, 300);
  }

  function initPopStateHandler() {
    window.addEventListener('popstate', () => {
      const hash = window.location.hash;
      if (isHomePage() && hash) {
        smoothScrollToSection(hash.slice(1));
      } else if (isHomePage() && !hash) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }

  function updateActiveNavLink() {
    if (!isHomePage()) return;
    const currentSection = getCurrentSection();
    const navLinks = document.querySelectorAll('.nav-link[data-scroll-to]');

    navLinks.forEach(link => {
      const linkSection = link.getAttribute('data-scroll-to');
      if (linkSection === currentSection) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function initActiveNavTracking() {
    if (!isHomePage()) return;
    const debouncedUpdate = debounce(updateActiveNavLink, CONFIG.debounceDelay);
    window.addEventListener('scroll', debouncedUpdate);
    updateActiveNavLink();
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initSmoothScroll();
    initSectionTracking();
    initEmailCopy();
    initPopStateHandler();
    initActiveNavTracking();
    scrollToHashOnLoad();
    handleHashNavigation();
  }

  init();
})();
