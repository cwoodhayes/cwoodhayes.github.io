(function() {
  'use strict';

  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  const hash = window.location.hash;

  if (!isHomePage || !hash) return;

  const sectionId = hash.substring(1);

  const scrollToSection = () => {
    const section = document.getElementById(sectionId);
    if (!section) return false;

    const navHeight = 80;
    const offsetTop = section.offsetTop - navHeight;

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });

    return true;
  };

  let attempts = 0;
  const maxAttempts = 10;

  const tryScroll = () => {
    attempts += 1;
    const success = scrollToSection();

    if (!success && attempts < maxAttempts) {
      setTimeout(tryScroll, 200);
    }
  };

  setTimeout(tryScroll, 100);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(scrollToSection, 200);
    });
  }

  window.addEventListener('load', () => {
    setTimeout(scrollToSection, 100);
  });
})();
