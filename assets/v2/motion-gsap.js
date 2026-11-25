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

  /* ---------- gate ladder: each card draws its own gold edge as it passes ---------- */
  gsap.utils.toArray('#how .gate').forEach(function (card) {
    var state = { v: 0 };
    gsap.to(state, {
      v: 1,
      ease: 'none',
      scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 46%', scrub: true },
      onUpdate: function () { card.style.setProperty('--lit', state.v.toFixed(3)); }
    });
  });

  /* keep scrubbed values correct after fonts and images settle */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
