/* US vs THEM — model switch. Only the right column rolls; the paired
   rows keep their height so the panel never jumps. */
(function () {
  'use strict';

  var root = document.getElementById('compare');
  if (!root) return;

  var switchEl = root.querySelector('.versus__switch');
  var glider = root.querySelector('.versus-glider');
  var nameEls = Array.prototype.slice.call(root.querySelectorAll('[data-them-name]'));
  var valEls = Array.prototype.slice.call(root.querySelectorAll('.versus-val'));
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.versus-tab'));

  var DATA = {
    agency: {
      label: 'Agency',
      values: [
        'Scoped retainer or project pricing.',
        'Agency-managed resources.',
        'Agreed service scope.',
        'Agency approval process.',
        'Contract-dependent terms.'
      ]
    },
    freelancer: {
      label: 'Freelancer',
      values: [
        'Project, hourly or day rate.',
        'Independent specialists.',
        'Individual expertise or agreed scope.',
        'Agreed review process.',
        'Project-dependent terms.'
      ]
    },
    inhouse: {
      label: 'In-house',
      values: [
        'Salary, benefits and operating costs.',
        'Internally managed employees.',
        'Available internal expertise.',
        'Internal management and approval processes.',
        'Employment arrangements.'
      ]
    }
  };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var anims = new WeakMap();
  var current = 'agency';

  function currentY(el) {
    var t = getComputedStyle(el).transform;
    if (!t || t === 'none') return 0;
    try { return new DOMMatrixReadOnly(t).m42; } catch (e) { return 0; }
  }

  /* vertical roll: out upward, swap, in from below; newest change wins */
  function swap(el, text) {
    if (!el) return;
    var prev = anims.get(el);
    if (reduced || (!prev && el.textContent.trim() === text)) {
      el.textContent = text;
      return;
    }
    var y0 = prev ? currentY(el) : 0;
    var o0 = prev ? parseFloat(getComputedStyle(el).opacity) || 1 : 1;
    if (prev) prev.cancel();

    var out = el.animate(
      [{ opacity: o0, transform: 'translateY(' + y0 + 'px)' },
       { opacity: 0, transform: 'translateY(-9px)' }],
      { duration: 170, easing: 'cubic-bezier(.55,0,.9,.4)', fill: 'forwards' }
    );
    anims.set(el, out);

    out.finished.then(function () {
      if (anims.get(el) !== out) return;
      anims.delete(el);
      out.cancel();
      el.textContent = text;
      var inn = el.animate(
        [{ opacity: 0, transform: 'translateY(10px)' },
         { opacity: 1, transform: 'translateY(0)' }],
        { duration: 300, easing: 'cubic-bezier(.16,1,.3,1)' }
      );
      anims.set(el, inn);
      inn.finished.then(function () {
        if (anims.get(el) === inn) anims.delete(el);
      }).catch(function () {});
    }).catch(function () {});
  }

  function place(tab) {
    if (!glider || !tab) return;
    glider.style.transform = 'none';
    glider.style.left = tab.offsetLeft + 'px';
    glider.style.width = tab.offsetWidth + 'px';
  }

  function select(key, focus) {
    var data = DATA[key];
    if (!data || key === current) return;
    current = key;

    tabs.forEach(function (t) {
      var on = t.getAttribute('data-model') === key;
      t.classList.toggle('is-on', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on) {
        place(t);
        if (switchEl) switchEl.style.setProperty('--model-i', tabs.indexOf(t));
        if (focus) t.focus();
      }
    });

    nameEls.forEach(function (el) { swap(el, data.label); });
    valEls.forEach(function (el, i) {
      if (data.values[i] != null) swap(el, data.values[i]);
    });
  }

  tabs.forEach(function (t) {
    var key = t.getAttribute('data-model');
    t.setAttribute('role', 'tab');
    t.tabIndex = t.classList.contains('is-on') ? 0 : -1;
    t.addEventListener('click', function () { select(key, false); });
  });

  if (switchEl) {
    switchEl.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      select(tabs[next].getAttribute('data-model'), true);
    });
  }

  /* keep the glider on its tab when the labels reflow */
  function refit() {
    tabs.forEach(function (t) {
      if (t.getAttribute('data-model') === current) place(t);
    });
  }
  window.addEventListener('resize', refit, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refit).catch(function () {});
  }
  place(tabs[0]);
})();
