/* Quantocos V2 — navigation, reveal and drawer behaviour.
   No second motion library: IntersectionObserver only, CSS does the animation. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header state */
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var onScroll = function () {
      hdr.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* drawer */
  var drawer = document.getElementById('drawer');
  var lastFocus = null;
  var openBtn = document.querySelector('[data-drawer-open]');

  function focusables(root) {
    return Array.prototype.filter.call(
      root.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null; }
    );
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    document.body.classList.add('is-locked');
    var first = drawer.querySelector('[data-drawer-close]');
    if (first) first.focus();
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    window.setTimeout(function () { drawer.hidden = true; }, reduce ? 0 : 240);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.querySelectorAll('[data-drawer-open]').forEach(function (btn) {
    btn.addEventListener('click', openDrawer);
  });
  document.querySelectorAll('[data-drawer-close]').forEach(function (btn) {
    btn.addEventListener('click', closeDrawer);
  });
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });
    document.addEventListener('keydown', function (e) {
      if (drawer.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      var items = focusables(drawer);
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* drawer sub-sections */
  document.querySelectorAll('[data-drawer-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sub = document.getElementById(btn.getAttribute('aria-controls'));
      if (!sub) return;
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      sub.classList.toggle('is-open', !isOpen);
    });
  });

  /* year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* close mega menus on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  });

  /* hero ecosystem — pointer depth, offscreen pause, manual pause */
  var stage = document.querySelector('.eco');
  var hero = document.querySelector('.hero');
  if (stage && !reduce && window.matchMedia('(pointer:fine)').matches) {
    var ticking = false;
    stage.addEventListener('pointermove', function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var r = stage.getBoundingClientRect();
        stage.style.setProperty('--mx', (((e.clientX - r.left) / r.width) - .5).toFixed(3));
        stage.style.setProperty('--my', (((e.clientY - r.top) / r.height) - .5).toFixed(3));
        ticking = false;
      });
    }, { passive: true });
    stage.addEventListener('pointerleave', function () {
      stage.style.setProperty('--mx', 0);
      stage.style.setProperty('--my', 0);
    });
  }
  if (hero) {
    var toggle = hero.querySelector('[data-motion-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var paused = hero.classList.toggle('is-paused');
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
      });
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        hero.classList.toggle('is-offscreen', !entries[0].isIntersecting);
      }, { rootMargin: '120px' }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      hero.classList.toggle('is-hidden-tab', document.hidden);
    });
  }
})();
