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

  /* mega menus: intent-based open, close delay across the trigger-to-panel gap,
     click-to-open on touch, Escape and outside-click to close */
  (function () {
    var items = Array.prototype.slice.call(document.querySelectorAll('.nav > li')).filter(function (li) {
      return li.querySelector('.mega');
    });
    if (!items.length) return;
    var timer = null;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    var suppress = new WeakSet(); /* keep Escape from instantly reopening via focus */

    function closeItem(li) {
      li.classList.remove('is-open');
      var link = li.querySelector('.nav__link');
      if (link && link.hasAttribute('aria-expanded')) link.setAttribute('aria-expanded', 'false');
    }
    function openItem(li) {
      items.forEach(function (o) { if (o !== li) closeItem(o); });
      clearTimeout(timer);
      li.classList.add('is-open');
      var link = li.querySelector('.nav__link');
      if (link) link.setAttribute('aria-expanded', 'true');
    }
    function closeAll() { items.forEach(closeItem); }
    function scheduleClose(li) {
      clearTimeout(timer);
      timer = setTimeout(function () { closeItem(li); }, 320);
    }

    items.forEach(function (li) {
      var link = li.querySelector('.nav__link');
      var mega = li.querySelector('.mega');
      if (link) {
        link.setAttribute('aria-haspopup', 'true');
        link.setAttribute('aria-expanded', 'false');
      }
      li.addEventListener('pointerenter', function (e) {
        suppress.delete(li);
        if (finePointer.matches && e.pointerType === 'mouse') openItem(li);
      });
      li.addEventListener('pointerleave', function () { scheduleClose(li); });
      if (mega) {
        mega.addEventListener('pointerenter', function () { clearTimeout(timer); openItem(li); });
        mega.addEventListener('pointerleave', function () { scheduleClose(li); });
      }
      li.addEventListener('focusin', function () {
        if (!suppress.has(li)) openItem(li);
      });
      if (link) {
        link.addEventListener('keydown', function (e) {
          if (e.key !== 'ArrowDown') return;
          e.preventDefault();
          suppress.delete(li);
          openItem(li);
          var first = mega && mega.querySelector('.mega__col a');
          if (first) first.focus();
        });
        link.addEventListener('click', function (e) {
          if (finePointer.matches) return; /* pointer devices: hover already opened it, click navigates */
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          if (!li.classList.contains('is-open')) {
            e.preventDefault();
            openItem(li);
          }
        });
      }
      li.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !li.contains(document.activeElement)) return;
        e.preventDefault();
        closeItem(li);
        suppress.add(li);
        if (link) link.focus();
      });
      li.addEventListener('focusout', function (e) {
        if (!li.contains(e.relatedTarget)) { suppress.delete(li); scheduleClose(li); }
      });
    });

    document.addEventListener('pointerdown', function (e) {
      if (!items.some(function (li) { return li.contains(e.target); })) closeAll();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  })();

  /* hero motion — offscreen and manual pause for the background light layers */
  var hero = document.querySelector('.hero');
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
