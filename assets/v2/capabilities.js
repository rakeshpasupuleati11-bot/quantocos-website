/* Quantocos V2 — capability rail.
   Continuous right-to-left movement over a duplicated set, wrapped by measurement
   so the seam is never visible. Pauses on hover, focus, drag and when the section
   leaves the viewport. Reduced motion keeps a native horizontal scroll instead. */
(function () {
  'use strict';

  var rail = document.querySelector('[data-cap-rail]');
  if (!rail) return;

  var viewport = rail.querySelector('.cap-viewport');
  var track = rail.querySelector('[data-cap-track]');
  if (!viewport || !track || !track.children.length) return;

  var DURATION = 19000;            /* ms for one full set to pass */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var originals = Array.prototype.slice.call(track.children);

  if (reduce) {
    /* native horizontal scroll, no loop, no duplicate set */
    rail.classList.add('is-static');
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', 'Capability cards, scroll horizontally');
    return;
  }

  /* one duplicate set: enough for a seamless wrap at any viewport width */
  originals.forEach(function (card) {
    var clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    Array.prototype.forEach.call(clone.querySelectorAll('a,button'), function (el) {
      el.setAttribute('tabindex', '-1');
    });
    track.appendChild(clone);
  });

  rail.classList.add('is-live');

  var setWidth = 0, cardStep = 0, speed = 0;
  var pos = 0, target = 0, last = 0;
  var running = true, hovered = false, dragging = false, visible = true;

  function measure() {
    var a = track.children[0], b = track.children[1], half = track.children[originals.length];
    if (!a || !b || !half) return;
    cardStep = b.offsetLeft - a.offsetLeft;
    setWidth = half.offsetLeft - a.offsetLeft;
    speed = setWidth / DURATION;
  }

  function wrap() {
    if (setWidth <= 0) return;
    while (pos <= -setWidth) { pos += setWidth; target += setWidth; }
    while (pos > 0) { pos -= setWidth; target -= setWidth; }
  }

  function frame(t) {
    var dt = last ? Math.min(t - last, 48) : 16;
    last = t;
    var held = document.documentElement.classList.contains('rgb-paused');
    var moving = running && visible && !hovered && !dragging && !document.hidden && !held;
    if (moving) target -= speed * dt;
    pos += (target - pos) * 0.16;
    wrap();
    track.style.transform = 'translate3d(' + pos.toFixed(2) + 'px,0,0)';
    requestAnimationFrame(frame);
  }

  /* measured after fonts settle, and again on resize */
  measure();
  window.addEventListener('load', measure);
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { measure(); wrap(); }, 180);
  });

  /* hover and keyboard focus both hold the rail still.
     Only a real pointer hovers — on touch, pointerenter would latch the rail paused. */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    rail.addEventListener('pointerenter', function () { hovered = true; });
    rail.addEventListener('pointerleave', function () { hovered = false; });
  }
  rail.addEventListener('focusin', function () { hovered = true; });
  rail.addEventListener('focusout', function () { hovered = false; });

  /* drag, mouse or touch */
  viewport.addEventListener('pointerdown', function (e) {
    if (!rail.classList.contains('is-live')) return;
    dragging = true;
    rail.classList.add('is-dragging');
    var startX = e.clientX, startTarget = target;
    try { viewport.setPointerCapture(e.pointerId); } catch (err) {}

    function move(ev) {
      target = startTarget + (ev.clientX - startX);
      pos = target;
    }
    function end() {
      dragging = false;
      rail.classList.remove('is-dragging');
      viewport.removeEventListener('pointermove', move);
      viewport.removeEventListener('pointerup', end);
      viewport.removeEventListener('pointercancel', end);
      target = pos;
      last = 0;
    }
    viewport.addEventListener('pointermove', move);
    viewport.addEventListener('pointerup', end);
    viewport.addEventListener('pointercancel', end);
  });

  function stepBy(dir) { target += dir * cardStep; }

  rail.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { stepBy(1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { stepBy(-1); e.preventDefault(); }
  });

  /* stop drawing while the rail is off screen — ScrollTrigger is already on the page */
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.create({
      trigger: rail,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: function (self) { visible = self.isActive; }
    });
  }

  requestAnimationFrame(frame);
})();
