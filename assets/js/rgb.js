/* Quantocos · RGB light-edge system.
   Adds one decorative edge span to existing components and assigns an
   intensity tier. No layout is created or shifted: every span is absolute.
   No observer, no library: one pass on load, CSS does the rest. */
(function () {
  'use strict';

  var SELECTOR = [
    /* V2 homepage components */
    '.btn', '.cap', '.cap-btn', '.card', '.panel', '.pilot-card', '.storycard',
    '.hero__fact', '.fact', '.calc', '.faq__card', '.faq__item',
    '.tier', '.plan', '.price-card', '.compare-table', '.answerbox',
    '.acc__item', '.status-pill', '.statbar__item', '.panel2', '.o-box',
    '.feature-card', '.svc-card', '.team-card', '.contact-card', '.quote-card',
    '.field', '.notice', '.callout', '.hp-media', '.stats-section .stat',
    /* legacy diagrams and interactive tiles */
    '.catmap__item', '.cmap__node', '.ladder__row', '.calc-panel', '.cmp__out',
    '.pc__panel', '.tab', '.badge', '.chip', '.modal__panel', '.dialog__panel',
    '.pp-card',
    /* 2026 homepage: planner panel and comparison panel */
    '.planner__panel', '.versus-pane--us'
  ].join(',');

  var VOID = { INPUT: 1, SELECT: 1, TEXTAREA: 1, IMG: 1, BR: 1, HR: 1, SOURCE: 1 };

  function tier(el) {
    var c = ' ' + (el.getAttribute('class') || '') + ' ';
    if (c.indexOf(' btn--primary ') > -1 || c.indexOf(' btn--gold ') > -1) return 'prominent';
    if (c.indexOf(' pilot-card ') > -1 || c.indexOf(' tier ') > -1 ||
        c.indexOf(' plan ') > -1 || c.indexOf(' price-card ') > -1) return 'prominent';
    if (c.indexOf(' btn ') > -1 || c.indexOf(' cap-btn ') > -1) return 'medium';
    if (c.indexOf(' hero__fact ') > -1 || c.indexOf(' fact ') > -1 ||
        c.indexOf(' status-pill ') > -1 || c.indexOf(' field ') > -1) return 'minimal';
    if (c.indexOf(' tab ') > -1 || c.indexOf(' badge ') > -1 || c.indexOf(' chip ') > -1 ||
        c.indexOf(' catmap__item ') > -1 || c.indexOf(' cmap__node ') > -1 ||
        c.indexOf(' ladder__row ') > -1) return 'minimal';
    if (c.indexOf(' stat--rate ') > -1) return 'medium';
    if (c.indexOf(' modal__panel ') > -1 || c.indexOf(' dialog__panel ') > -1) return 'medium';
    return 'soft';
  }

  function decorate(el) {
    if (el.classList.contains('rgb-host')) return;
    if (VOID[el.tagName]) {
      el.classList.add('rgb-field');
      return;
    }
    if (el.querySelector(':scope > .rgb-ring')) return;

    el.classList.add('rgb-host');
    /* markup may pin a variant; otherwise the tier map decides */
    if (!el.hasAttribute('data-rgb')) el.setAttribute('data-rgb', tier(el));

    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

    var ring = document.createElement('span');
    ring.className = 'rgb-ring';
    ring.setAttribute('aria-hidden', 'true');
    /* independent phase per instance, negative delay keeps it seamless */
    ring.style.setProperty('--rgb-delay', (-Math.random() * 8).toFixed(2) + 's');
    el.appendChild(ring);
  }

  function run() {
    var list = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < list.length; i++) {
      try { decorate(list[i]); } catch (e) { /* never break a page for decoration */ }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  /* the existing hero pause control also holds the edge animation still */
  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document) {
      if (t.getAttribute && t.hasAttribute && t.hasAttribute('data-motion-toggle')) {
        document.documentElement.classList.toggle(
          'rgb-paused', t.getAttribute('aria-pressed') === 'true');
        return;
      }
      t = t.parentNode;
    }
  });
})();
