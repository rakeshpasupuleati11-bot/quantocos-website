/* Homepage scroll storytelling.
   1. Five approval gates (#how): a clickable horizontal timeline drives one
      stationary image-and-copy panel through G1–G5.
   2. Work and deliverables: stack four story cards that enter from below.
   Both are progressive enhancements — without JS every gate and card stays
   in the normal document flow, fully readable. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- five gates: clickable horizontal timeline ---------- */
  var gateStage = document.querySelector('[data-gate-stage]');
  var gateSteps = Array.prototype.slice.call(document.querySelectorAll('[data-gate-step]'));
  var gatePanels = Array.prototype.slice.call(document.querySelectorAll('[data-gate-panel]'));
  var gateFill = document.querySelector('[data-gate-fill]');
  var gateLive = document.querySelector('[data-gate-live]');
  var gatePrev = Array.prototype.slice.call(document.querySelectorAll('[data-gate-prev]'));
  var gateNext = Array.prototype.slice.call(document.querySelectorAll('[data-gate-next]'));

  if (gateStage && gateSteps.length === 5 && gatePanels.length === 5) {
    var gateIndex = 0;

    function paintGate(index) {
      gateIndex = index;
      gateSteps.forEach(function (step, k) {
        step.classList.toggle('is-active', k === index);
        step.classList.toggle('is-done', k < index);
        step.setAttribute('aria-pressed', k === index ? 'true' : 'false');
      });
      gatePanels.forEach(function (panel, k) {
        panel.classList.toggle('is-on', k === index);
        panel.toggleAttribute('inert', k !== index);
      });
      if (gateFill) gateFill.style.width = (index / 4 * 100) + '%';
      if (gateLive) {
        var title = gatePanels[index].querySelector('.gate-panel__title');
        gateLive.textContent = 'Gate ' + (index + 1) + ' of 5: ' + (title ? title.textContent : '');
      }
      gatePrev.forEach(function (b) { b.disabled = index === 0; });
      gateNext.forEach(function (b) { b.disabled = index === 4; });
    }

    function goGate(index) {
      index = Math.max(0, Math.min(4, index));
      if (index !== gateIndex) paintGate(index);
    }

    gateStage.classList.add('is-live');
    paintGate(0);

    gateSteps.forEach(function (step, k) {
      step.addEventListener('click', function () { goGate(k); });
      step.addEventListener('keydown', function (e) {
        var next = -1;
        if (e.key === 'ArrowRight') next = (k + 1) % 5;
        else if (e.key === 'ArrowLeft') next = (k + 4) % 5;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = 4;
        if (next < 0) return;
        e.preventDefault();
        goGate(next);
        gateSteps[next].focus();
      });
    });

    gatePrev.forEach(function (b) { b.addEventListener('click', function () { goGate(gateIndex - 1); }); });
    gateNext.forEach(function (b) { b.addEventListener('click', function () { goGate(gateIndex + 1); }); });

    /* swipe on the panel: 44px horizontal threshold, vertical intent ignored */
    var panelList = document.querySelector('[data-gate-panels]');
    var touchX = null, touchY = null;
    if (panelList) {
      panelList.addEventListener('touchstart', function (e) {
        if (!e.touches.length) return;
        touchX = e.touches[0].clientX; touchY = e.touches[0].clientY;
      }, { passive: true });
      panelList.addEventListener('touchend', function (e) {
        if (touchX === null || !e.changedTouches.length) return;
        var dx = e.changedTouches[0].clientX - touchX;
        var dy = e.changedTouches[0].clientY - touchY;
        touchX = touchY = null;
        if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) {
          goGate(gateIndex + (dx < 0 ? 1 : -1));
        }
      }, { passive: true });
    }
  }

  if (reduce.matches) return;
  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  var gatesSection = document.getElementById('how');

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
