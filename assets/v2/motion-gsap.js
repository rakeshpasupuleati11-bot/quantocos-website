/* Quantocos V2 — scroll layer.
   Lenis 1.3.28 + GSAP 3.15.1 / ScrollTrigger, both vendored in assets/vendor/.
   Loaded only on pages that link it. Everything here is additive: no page depends on this
   file for content, navigation, or accessibility. Reduced motion exits before touching the DOM. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var Lenis = window.Lenis;
  var lenis = null;

  /* ---------- smooth scroll ---------- */
  if (Lenis) {
    lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6
    });

    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function tick(time) {
        lenis.raf(time);
        window.requestAnimationFrame(tick);
      })(0);
    }

    /* in-page anchors keep the header offset, routed through Lenis.
       The skip link is excluded: it must keep its native focus move. */
    document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href.length < 2) return;
        var target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -96 });
      });
    });

    /* the drawer locks body scroll; Lenis has its own lock */
    var syncLock = function () {
      if (document.body.classList.contains('is-locked')) lenis.stop();
      else lenis.start();
    };
    new MutationObserver(syncLock).observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- the sample account page scrolls through its own frame ---------- */
  gsap.utils.toArray('[data-ws]').forEach(function (frame) {
    var page = frame.querySelector('[data-ws-page]');
    var viewport = frame.querySelector('.ws-viewport');
    if (!page || !viewport) return;
    gsap.fromTo(page, { y: 0 }, {
      y: function () { return -Math.max(0, page.offsetHeight - viewport.clientHeight); },
      ease: 'none',
      scrollTrigger: {
        trigger: frame,
        start: 'top 78%',
        end: 'bottom 30%',
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });
  });

  /* Only refresh triggers that are on screen; the rest measure on entry. */
  ScrollTrigger.config({ limitCallbacks: true });

  /* keep scrubbed values correct after fonts and images settle — off the critical path,
     so the refresh never lands inside the load task. */
  window.addEventListener('load', function () {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(function () { ScrollTrigger.refresh(); }, { timeout: 2500 });
    } else {
      window.setTimeout(function () { ScrollTrigger.refresh(); }, 300);
    }
  });
})();
