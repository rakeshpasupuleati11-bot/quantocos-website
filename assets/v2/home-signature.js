/* home-signature.js — six signature experiences, one motion language.
   Pairs with home-signature.css. No new libraries: GSAP + ScrollTrigger only.
   Every animation degrades to static, legible content. */
(function () {
  'use strict';

  /* ── 05 · expanding subscription panels (works with motion off) ── */
  var plans = [].slice.call(document.querySelectorAll('[data-sub]'));
  plans.forEach(function (plan) {
    var btn = plan.querySelector('.h6-plan__toggle');
    var panel = plan.querySelector('.h6-plan__more');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      plan.classList.toggle('is-open', !open);
    });
  });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  var html = document.documentElement;

  /* ── 01 · liquid gold hero: masked word reveal ───────────────── */
  try {
    var title = document.querySelector('.h6-hero__title');
    if (title) {
      var walk = function (node) {
        [].slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              var mask = document.createElement('span');
              mask.className = 'sig-mask';
              var word = document.createElement('span');
              word.className = 'sig-w';
              word.textContent = part;
              mask.appendChild(word);
              frag.appendChild(mask);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1 && child.tagName !== 'BR') {
            walk(child);
          }
        });
      };
      walk(title);
      var words = title.querySelectorAll('.sig-w');
      gsap.set(words, { yPercent: 112 });
      html.classList.add('sig-armed');
      gsap.to(words,
        { yPercent: 0, duration: 1.05, stagger: 0.055, ease: 'power4.out', delay: 0.1,
          onComplete: function () { words.forEach(function (w) { w.style.willChange = 'auto'; }); } });
      var soft = document.querySelectorAll('.h6-hero__eyebrow, .h6-hero__sub, .h6-hero__cta, .h6-hero__note');
      gsap.fromTo(soft,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, ease: 'power2.out', delay: 0.45 });
    }
  } catch (err) {
    html.classList.remove('sig-armed');
  }

  /* ── 02 · chaos to order: fragmented inputs assemble ─────────── */
  var chaos = document.querySelector('[data-chaos]');
  if (chaos) {
    var chips = [].slice.call(chaos.querySelectorAll('.c-chip'));
    var scatter = [[-172, -34, -8], [-118, 62, 6], [-24, -62, 9], [112, 58, -6], [176, -26, 7]];
    gsap.set(chips, {
      x: function (i) { return scatter[i] ? scatter[i][0] : 0; },
      y: function (i) { return scatter[i] ? scatter[i][1] : 0; },
      rotation: function (i) { return scatter[i] ? scatter[i][2] : 0; },
      transformOrigin: '50% 50%'
    });
    var ctl = gsap.timeline({
      scrollTrigger: { trigger: chaos, start: 'top 82%', end: 'bottom 58%', scrub: 0.5 }
    });
    ctl.to(chips, { x: 0, y: 0, rotation: 0, duration: 1, stagger: 0.09, ease: 'power2.inOut' }, 0.2);
    var frame = chaos.querySelector('.c-frame');
    if (frame) {
      var flen = frame.getTotalLength();
      gsap.set(frame, { strokeDasharray: flen, strokeDashoffset: flen });
      ctl.to(frame, { strokeDashoffset: 0, duration: 0.8, ease: 'none' }, 0.55);
    }
    var ctext = chaos.querySelectorAll('.c-frame-label, .c-frame-sub, .c-rule');
    ctl.fromTo(ctext, { opacity: 0.15 }, { opacity: 1, duration: 0.5, stagger: 0.12 }, 1.05);
  }

  /* ── 03 · sticky capability deck: active step + covered cards ── */
  var cards = [].slice.call(document.querySelectorAll('[data-deck-card]'));
  if (cards.length) {
    var links = [].slice.call(document.querySelectorAll('.h6-deck__nav a'));
    var count = document.querySelector('[data-deck-count]');
    var setActive = function (i) {
      links.forEach(function (a, k) { a.classList.toggle('is-active', k === i); });
      if (count) count.textContent = ('0' + (i + 1)).slice(-2);
    };
    setActive(0);
    cards.forEach(function (card, i) {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 68%',
        end: 'bottom 12%',
        onEnter: function () { setActive(i); },
        onEnterBack: function () { setActive(i); }
      });
      var next = cards[i + 1];
      if (next) {
        gsap.to(card, {
          scale: 0.965,
          ease: 'none',
          scrollTrigger: { trigger: next, start: 'top 70%', end: 'top 20%', scrub: 0.4 }
        });
      }
    });
  }

  /* ── 04 · connected architecture: sequential activation ─────── */
  var arch = document.querySelector('[data-arch]');
  if (arch) {
    var atl = gsap.timeline({
      scrollTrigger: { trigger: arch, start: 'top 78%', end: 'bottom 48%', scrub: 0.6 }
    });
    [].slice.call(arch.querySelectorAll('.a-trace')).forEach(function (p) {
      var len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      atl.to(p, { strokeDashoffset: 0, duration: 0.7, ease: 'none' }, 0.35);
    });
    atl.to(arch.querySelectorAll('.a-need .a-box'), { stroke: '#C9A44C', duration: 0.4 }, 0.1)
      .to(arch.querySelectorAll('.a-pod .a-box--pod, .a-pod .a-label'), { stroke: '#C9A44C', duration: 0.4 }, 0.55)
      .to(arch.querySelectorAll('.a-mod'), { stroke: '#C9A44C', duration: 0.35, stagger: 0.22 }, 0.85)
      .to(arch.querySelectorAll('.a-mod-label'), { fill: '#F7F7F5', duration: 0.3, stagger: 0.22 }, 0.9)
      .to(arch.querySelectorAll('.a-gate circle'), { stroke: '#C9A44C', fill: '#161616', duration: 0.3, stagger: 0.16 }, 2.15)
      .to(arch.querySelectorAll('.a-gate text'), { fill: '#F2D582', duration: 0.3, stagger: 0.16 }, 2.2)
      .to(arch.querySelectorAll('.a-plate'), { stroke: '#C9A44C', duration: 0.35, stagger: 0.2 }, 2.7)
      .to(arch.querySelectorAll('.a-plate-label'), { fill: '#F7F7F5', duration: 0.3, stagger: 0.2 }, 2.75);
  }

  /* ── 06 · cinematic masked editorial reveal ─────────────────── */
  var proof = document.querySelector('[data-proof]');
  if (proof) {
    var figures = [].slice.call(proof.querySelectorAll('figure'));
    var played = false;
    var reveal = function () {
      if (played) return;
      played = true;
      gsap.to(figures, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.95,
        stagger: 0.13,
        ease: 'power3.inOut'
      });
    };
    try {
      gsap.set(figures, { clipPath: 'inset(0% 0% 100% 0%)' });
      ScrollTrigger.create({ trigger: proof, start: 'top 88%', once: true, onEnter: reveal });
      window.setTimeout(reveal, 3200);
    } catch (err) {
      gsap.set(figures, { clipPath: 'none' });
    }
  }
})();
