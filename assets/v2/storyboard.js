/* Homepage scroll storytelling.
   1. Five approval gates (#how): pins the two-column stage and steps the right-hand
      panel through G1–G5 while the left rail tracks progress.
   2. Work and deliverables: stack four story cards that enter from below.
   Both are progressive enhancements — without JS, on ≤900px and under reduced motion
   every panel and card stays in the normal document flow, fully readable. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- reserved gate images: only reveal when a real file loaded ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.gate-shot'), function (fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    function live() { if (img.naturalWidth > 0) fig.classList.add('is-live'); }
    if (img.complete) live();
    else img.addEventListener('load', live, { once: true });
  });

  if (reduce.matches) return;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  /* ---------- five gates ---------- */
  var gateStage = document.querySelector('[data-gate-stage]');
  var gateSteps = Array.prototype.slice.call(document.querySelectorAll('[data-gate-step]'));
  var gatePanels = Array.prototype.slice.call(document.querySelectorAll('[data-gate-panel]'));
  var gateFill = document.querySelector('[data-gate-fill]');
  var gatesSection = document.getElementById('how');

  function gateState(index) {
    gateSteps.forEach(function (step, k) {
      step.classList.toggle('is-active', k === index);
      step.classList.toggle('is-done', k < index);
    });
    gatePanels.forEach(function (panel, k) {
      panel.classList.toggle('is-on', k === index);
    });
  }

  if (gateStage && gateSteps.length === 5 && gatePanels.length === 5) {
    mm.add('(min-width: 901px)', function () {
      gateStage.classList.add('is-enhanced');
      gateState(0);
      if (gateFill) gateFill.style.height = '0%';

      /* the pinned stage must fit one viewport, or we keep the readable sequence */
      if (gateStage.offsetHeight > window.innerHeight - 100) {
        gateStage.classList.remove('is-enhanced');
        gateState(0);
        return function () {};
      }

      var current = 0;
      var trigger = ScrollTrigger.create({
        trigger: gateStage,
        start: 'top 88px',
        end: function () {
          return '+=' + Math.round(window.innerHeight * (window.innerWidth < 1200 ? 2.6 : 3.2));
        },
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          var p = self.progress;
          if (gateFill) gateFill.style.height = (p * 100).toFixed(2) + '%';
          var i = Math.min(4, Math.floor(p * 5 + 0.0001));
          if (i !== current) { current = i; gateState(i); }
        }
      });

      return function () {
        trigger.kill();
        gateStage.classList.remove('is-enhanced');
        gateSteps.forEach(function (step) { step.classList.remove('is-active', 'is-done'); });
        gatePanels.forEach(function (panel) { panel.classList.remove('is-on'); });
        if (gateFill) gateFill.style.height = '0%';
      };
    });
  }

  /* ---------- four story cards ---------- */
  var storyStage = document.querySelector('[data-story-stage]');
  var storyStack = document.querySelector('[data-story-stack]');
  var storyCards = Array.prototype.slice.call(document.querySelectorAll('[data-story-card]'));
  var storyCount = document.querySelector('[data-story-count]');
  var storyFill = document.querySelector('[data-story-fill]');
  var storySection = document.querySelector('.story-section');

  if (storyStage && storyStack && storyCards.length === 4) {
    mm.add('(min-width: 901px)', function () {
      storyStage.classList.add('is-live');
      if (storyCount) storyCount.textContent = '01';

      var active = 0;
      function paint(index) {
        active = index;
        if (storyCount) storyCount.textContent = '0' + (index + 1);
        if (storyFill) storyFill.style.width = ((index + 1) / 4 * 100) + '%';
        storyCards.forEach(function (card, k) {
          if (k <= index) card.classList.add('is-active');
          card.toggleAttribute('inert', k !== index);
        });
      }

      storyCards.forEach(function (card, k) {
        gsap.set(card, { zIndex: k + 1 });
        if (k > 0) gsap.set(card, { yPercent: 112, xPercent: 2.2, opacity: 0 });
      });
      paint(0);

      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: storyStage,
          start: 'center center',
          end: function () { return '+=' + Math.round(window.innerHeight * 2.8); },
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          scrub: 0.6,
          onUpdate: function (self) {
            var p = self.progress;
            var i = p < 0.143 ? 0 : p < 0.429 ? 1 : p < 0.714 ? 2 : 3;
            if (i !== active) paint(i);
          }
        }
      });

      /* first card holds, then each next card slides up while the earlier ones settle back */
      var HOLD = 0.5, STEP = 1, ENTER = 0.8;
      for (var j = 1; j < storyCards.length; j++) {
        var at = HOLD + (j - 1) * STEP;
        tl.to(storyCards[j], { yPercent: 0, xPercent: 0, opacity: 1, duration: ENTER, ease: 'power2.out' }, at);
        for (var k = 0; k < j; k++) {
          var depth = j - k;
          tl.to(storyCards[k], {
            yPercent: -2.3 * depth,
            xPercent: -1.8 * depth,
            scale: Math.pow(0.9869, depth),
            opacity: Math.max(0.55, 1 - 0.14 * depth),
            duration: ENTER
          }, at);
        }
      }
      tl.to({}, { duration: 0.2 });

      return function () {
        storyStage.classList.remove('is-live');
        storyCards.forEach(function (card) {
          card.classList.remove('is-active');
          card.removeAttribute('inert');
          card.style.zIndex = '';
        });
        if (storyCount) storyCount.textContent = '01';
        if (storyFill) storyFill.style.width = '25%';
      };
    });
  }

  /* ---------- pause the breathing atmosphere while a section is offscreen ---------- */
  [gatesSection, storySection].forEach(function (section) {
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: function (self) { section.classList.toggle('is-quiet', !self.isActive); }
    });
  });
})();
