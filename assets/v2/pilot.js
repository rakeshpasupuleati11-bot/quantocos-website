/* Pilot band — cascading cards and rolling counters.
   Uses the page's GSAP + ScrollTrigger layer; without them the markup
   already shows final values, so nothing is hidden or lost. */
(function () {
  'use strict';

  var band = document.getElementById('pilot-band');
  if (!band) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  var cards = Array.prototype.slice.call(band.querySelectorAll('.pilot-card'));

  /* counters: final text is in the markup, including the sr-only copy */
  var recs = [];
  Array.prototype.forEach.call(band.querySelectorAll('.pilot-num'), function (el) {
    var vis = el.querySelector('[aria-hidden="true"]');
    var sr = el.querySelector('.sr-only');
    if (!vis || !sr) return;
    var raw = sr.textContent.trim();
    var target = parseInt(raw.replace(/[^\d]/g, ''), 10) || 0;
    var money = el.classList.contains('pilot-num--money') || raw.indexOf(',') > -1;
    vis.style.display = 'inline-block';
    vis.style.minWidth = Math.ceil(vis.getBoundingClientRect().width) + 'px';
    recs.push({ el: vis, raw: raw, target: target, money: money });
  });

  function fmt(rec, v) {
    return rec.money ? v.toLocaleString('en-US') : String(v);
  }

  function countAll() {
    recs.forEach(function (rec, i) {
      var proxy = { v: 0 };
      gsap.to(proxy, {
        v: rec.target,
        duration: 1.12,
        delay: i * 0.12,
        ease: 'power2.out',
        onUpdate: function () { rec.el.textContent = fmt(rec, Math.round(proxy.v)); },
        onComplete: function () { rec.el.textContent = rec.raw; }
      });
    });
  }

  var narrow = window.matchMedia('(max-width: 900px)').matches;

  var tl = gsap.timeline({
    scrollTrigger: { trigger: band, start: 'top 74%', once: true }
  });

  tl.from(cards, {
    x: narrow ? 0 : -40,
    y: 15,
    opacity: 0,
    duration: 0.86,
    ease: 'power3.out',
    stagger: 0.18
  });

  tl.add(countAll, 0.25);
})();
