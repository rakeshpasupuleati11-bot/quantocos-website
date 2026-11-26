/* Homepage refinements — statistics counters and the interactive credit pool.
   Uses the page's existing GSAP/ScrollTrigger layer for the one-shot entrance
   (no second IntersectionObserver) and CSS transitions for the rest.
   Content is complete without this file: every final value is in the markup. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }

  /* one running count per element: a newer value cancels the older animation,
     so a fast switch can never be overwritten by the slower first run */
  var token = new WeakMap();

  function count(el, to, dur, prefix, done) {
    var id = (token.get(el) || 0) + 1;
    token.set(el, id);
    var from = parseFloat(String(el.textContent).replace(/[^\d.]/g, '')) || 0;
    if (reduced || !to) { el.textContent = prefix + to; if (done) done(); return; }
    var t0 = null;
    function frame(ts) {
      if (token.get(el) !== id) return;
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      el.textContent = prefix + Math.round(from + (to - from) * easeOut(p));
      if (p < 1) requestAnimationFrame(frame);
      else if (done) done();
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------ statistics */
  var statsRow = document.querySelector('.stats');
  var nums = statsRow ? [].slice.call(statsRow.querySelectorAll('[data-count]')) : [];

  function runStats() {
    nums.forEach(function (el, i) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var prefix = el.getAttribute('data-prefix') || '';
      var dur = parseInt(el.getAttribute('data-count-dur'), 10) || 1100;
      el.textContent = prefix + '0';
      setTimeout(function () { count(el, target, dur, prefix); }, reduced ? 0 : i * 90);
    });
  }

  /* --------------------------------------------------------- credit pool */
  var pool = document.querySelector('.pool');
  var creditsEl = pool && pool.querySelector('[data-pool-credits]');
  var priceEl = pool && pool.querySelector('[data-pool-price]');
  var fillEl = pool && pool.querySelector('[data-pool-fill]');
  var statusEl = pool && pool.querySelector('[data-pool-status]');
  var buttons = pool ? [].slice.call(pool.querySelectorAll('[data-pod]')) : [];
  var started = false;

  function setFill(credits) {
    if (fillEl) fillEl.style.width = (credits / 360 * 100).toFixed(3) + '%';
  }

  function select(btn, firstRun) {
    if (!btn || !creditsEl) return;
    var target = parseInt(btn.getAttribute('data-credits'), 10) || 0;
    var price = btn.getAttribute('data-price') || '';
    var pod = btn.getAttribute('data-pod') || '';
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
    if (priceEl) priceEl.textContent = price;
    setFill(target);
    var label = pod + ' Pod: ' + target + ' credits, ' + price + ' per month.';
    if (firstRun && !reduced) creditsEl.textContent = '0';
    count(creditsEl, target, firstRun ? 900 : 750, '', function () {
      if (statusEl) statusEl.textContent = label;
    });
    if (reduced && statusEl) statusEl.textContent = label;
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () { select(btn, false); });
  });

  function startPool() {
    if (started || !creditsEl) return;
    started = true;
    select(buttons[0] || null, true);
  }

  /* ----------------------------------------------------------- the trigger */
  var statsFired = false, poolFired = false;
  function statsOnce() { if (!statsFired) { statsFired = true; runStats(); } }
  function poolOnce() { if (!poolFired) { poolFired = true; startPool(); } }

  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    if (statsRow) window.ScrollTrigger.create({ trigger: statsRow, start: 'top 82%', once: true, onEnter: statsOnce });
    if (pool) window.ScrollTrigger.create({ trigger: pool, start: 'top 85%', once: true, onEnter: poolOnce });
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { statsOnce(); poolOnce(); });
  } else {
    statsOnce(); poolOnce();
  }

  /* connected pod: pause its continuous layers while the section is offscreen */
  var ws = document.querySelector('.cws');
  if (ws && window.gsap && window.ScrollTrigger) {
    var sync = function (self) { ws.classList.toggle('is-quiet', !self.isActive); };
    var st = window.ScrollTrigger.create({
      trigger: ws,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: sync
    });
    sync(st);
  }
})();
