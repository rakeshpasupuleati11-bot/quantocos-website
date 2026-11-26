/* Interactive Credit Planner — one state, one render function.
   The previous calculator failed because it never listened to its inputs:
   it ran once on load and the markup had no oninput/onchange handlers.
   This build owns the state, computes once per change, and writes every
   display from that single result. Rates and pools come from the markup. */
(function () {
  'use strict';

  var root = document.querySelector('.planner');
  if (!root) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var podBtns = Array.prototype.slice.call(root.querySelectorAll('.podsel'));
  var podsWrap = root.querySelector('.planner__pods');
  var ctrls = Array.prototype.slice.call(root.querySelectorAll('.dctrl'));
  var presets = Array.prototype.slice.call(root.querySelectorAll('.preset'));
  var panel = root.querySelector('.planner__panel');

  var out = {
    pod: root.querySelector('[data-res-pod]'),
    alloc: root.querySelector('[data-alloc]'),
    cap: root.querySelector('[data-cap]'),
    pct: root.querySelector('[data-gauge-pct]'),
    remain: root.querySelector('[data-remain]'),
    beyond: root.querySelector('[data-beyond]'),
    stateMsg: root.querySelector('[data-state-msg]'),
    price: root.querySelector('[data-price-roll]'),
    rec: root.querySelector('[data-rec]'),
    ring: root.querySelector('[data-ring]'),
    discuss: root.querySelector('[data-discuss]'),
    copy: root.querySelector('[data-copy]'),
    copyMsg: root.querySelector('[data-copy-msg]'),
    live: root.querySelector('[data-live]'),
    ticks: root.querySelector('[data-ticks]')
  };

  var ITEMS = ctrls.map(function (el) {
    return {
      el: el,
      key: el.getAttribute('data-item'),
      rate: parseFloat(el.getAttribute('data-rate')) || 0,
      num: el.querySelector('.stepper__num'),
      range: el.querySelector('.ruler__range'),
      ruler: el.querySelector('.ruler'),
      bubble: el.querySelector('[data-bubble]'),
      sub: el.querySelector('[data-sub]')
    };
  });

  var state = { pod: podsWrap.querySelector('.podsel.is-on') || podBtns[0], qty: {} };
  ITEMS.forEach(function (it) { state.qty[it.key] = parseInt(it.num.value, 10) || 0; });

  var C = 2 * Math.PI * 78;

  /* ---------- rolling digits: newest change always wins ---------- */
  var token = new WeakMap();
  function roll(el, to, fmt, dur) {
    if (!el) return;
    var id = (token.get(el) || 0) + 1;
    token.set(el, id);
    var from = parseFloat(String(el.textContent).replace(/[^\d.-]/g, '')) || 0;
    if (reduced || from === to || !dur) { el.textContent = fmt(to); return; }
    var t0 = null;
    function frame(ts) {
      if (token.get(el) !== id) return;
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / (dur || 480));
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function nf(n) { return Math.round(n).toLocaleString('en-GB'); }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-GB'); }

  /* gauge ticks: 48 marks, lit up to the used share */
  (function ticks() {
    if (!out.ticks) return;
    var svgNS = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < 48; i++) {
      var a = (i / 48) * Math.PI * 2;
      var l = document.createElementNS(svgNS, 'line');
      var r1 = i % 4 === 0 ? 84 : 86.5;
      l.setAttribute('x1', 110 + Math.cos(a) * r1);
      l.setAttribute('y1', 110 + Math.sin(a) * r1);
      l.setAttribute('x2', 110 + Math.cos(a) * 89);
      l.setAttribute('y2', 110 + Math.sin(a) * 89);
      out.ticks.appendChild(l);
    }
  })();

  function podData(btn) {
    return {
      name: btn.getAttribute('data-name'),
      price: parseInt(btn.getAttribute('data-price'), 10) || 0,
      credits: parseInt(btn.getAttribute('data-credits'), 10) || 0
    };
  }

  /* ---------- one calculation ---------- */
  function compute() {
    var allocated = 0;
    ITEMS.forEach(function (it) { allocated += state.qty[it.key] * it.rate; });
    var pod = podData(state.pod);
    var capacity = pod.credits;
    var remaining = Math.max(0, capacity - allocated);
    var beyond = Math.max(0, allocated - capacity);
    var pct = capacity ? (allocated / capacity) * 100 : 0;
    return { allocated: allocated, capacity: capacity, remaining: remaining, beyond: beyond, pct: pct, pod: pod };
  }

  function recommendation(allocated) {
    if (allocated === 0) return { pod: '', text: 'Add deliverables to see a recommended credit pool.' };
    if (allocated > 360) return { pod: '', text: 'Your workload exceeds 360 credits. A custom scope is the next step.' };
    if (allocated <= 120) return { pod: 'Creative Pod', text: 'Recommended: Creative Pod. The smallest credit pool that fits this workload.' };
    if (allocated <= 240) return { pod: 'Digital Pod', text: 'Recommended: Digital Pod. The smallest credit pool that fits this workload.' };
    return { pod: 'Strategy Pod', text: 'Recommended: Strategy Pod. The smallest credit pool that fits this workload.' };
  }

  var liveTimer = null;
  function announce(r) {
    if (!out.live) return;
    clearTimeout(liveTimer);
    liveTimer = setTimeout(function () {
      out.live.textContent = r.allocated + ' of ' + r.capacity + ' credits planned. ' +
        r.remaining + ' remaining' + (r.beyond ? ', ' + r.beyond + ' beyond the pool' : '') + '.';
    }, 550);
  }

  /* ---------- one render ---------- */
  function render(animate) {
    var r = compute();

    roll(out.alloc, r.allocated, nf, animate ? 520 : 0);
    roll(out.cap, r.capacity, nf, animate ? 520 : 0);
    roll(out.remain, r.remaining, nf, animate ? 480 : 0);
    roll(out.beyond, r.beyond, nf, animate ? 480 : 0);
    roll(out.pct, Math.round(r.pct), function (v) { return Math.round(v) + '%'; }, animate ? 420 : 0);
    roll(out.price, r.pod.price, money, animate ? 560 : 0);

    if (out.pod) out.pod.textContent = r.pod.name;

    /* gauge */
    if (out.ring) {
      var shown = Math.min(1, r.pct / 100);
      out.ring.style.strokeDasharray = C.toFixed(1);
      out.ring.style.strokeDashoffset = (C * (1 - shown)).toFixed(1);
      if (out.ticks) {
        var lit = Math.floor(shown * 48);
        Array.prototype.forEach.call(out.ticks.children, function (line, i) {
          line.classList.toggle('is-lit', i < lit);
        });
      }
    }

    /* capacity state */
    var stateName = 'ok';
    if (r.allocated === 0) stateName = 'ok';
    else if (r.beyond > 0) stateName = 'over';
    else if (r.allocated === r.capacity) stateName = 'full';
    else if (r.pct >= 80) stateName = 'warn';
    if (panel) panel.setAttribute('data-state', stateName);

    var msg;
    if (r.allocated === 0) msg = 'Add deliverables to see what your month uses.';
    else if (stateName === 'over') msg = r.beyond + ' credits beyond this pool. Consider a larger pod or a custom scope.';
    else if (stateName === 'full') msg = 'Exactly at capacity. All ' + r.capacity + ' credits are planned.';
    else if (stateName === 'warn') msg = 'Near capacity. ' + r.remaining + ' credits remain.';
    else msg = 'Within this pool. ' + r.remaining + ' credits remain.';
    if (out.stateMsg) out.stateMsg.textContent = msg;

    var rec = recommendation(r.allocated);
    if (out.rec) {
      out.rec.textContent = rec.text;
    }

    /* per-deliverable subtotal, ruler position, bubble */
    ITEMS.forEach(function (it) {
      var q = state.qty[it.key];
      var sub = q * it.rate;
      if (it.sub) it.sub.textContent = nf(sub);
      var max = parseInt(it.range.max, 10) || 1;
      var p = Math.max(0, Math.min(1, q / max));
      it.ruler.style.setProperty('--p', (p * 100).toFixed(2) + '%');
      if (it.bubble) it.bubble.textContent = q;
      it.range.value = q;
      if (document.activeElement !== it.num) it.num.value = q;
      it.range.setAttribute('aria-valuetext', q + ' ' + it.key + ', ' + sub + ' credits');
    });

    if (out.discuss) {
      out.discuss.href = 'contact.html?pod=' + encodeURIComponent(state.pod.getAttribute('data-pod')) +
        '&credits=' + r.allocated;
    }

    announce(r);
    return r;
  }

  /* ---------- interactions ---------- */
  function selectPod(btn) {
    if (!btn || btn === state.pod) return;
    state.pod = btn;
    podBtns.forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    if (podsWrap) podsWrap.style.setProperty('--pod-i', podBtns.indexOf(btn));
    markPreset('custom');
    render(true);
  }

  podBtns.forEach(function (b) {
    b.addEventListener('click', function () { selectPod(b); });
  });

  function setQty(item, value) {
    var max = parseInt(item.range.max, 10) || 999;
    var n = Math.floor(Number(value));
    if (!isFinite(n) || n < 0) n = 0;
    if (n > max) n = max;
    state.qty[item.key] = n;
    markPreset('custom');
    render(true);
  }

  function itemFor(el) {
    var ctrl = el.closest ? el.closest('.dctrl') : null;
    for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].el === ctrl) return ITEMS[i];
    return null;
  }

  root.addEventListener('click', function (e) {
    var t = e.target;
    var stepBtn = t.closest ? t.closest('.stepper__btn') : null;
    if (stepBtn && root.contains(stepBtn)) {
      var item = itemFor(stepBtn);
      if (!item) return;
      var dir = stepBtn.hasAttribute('data-plus') ? 1 : -1;
      setQty(item, state.qty[item.key] + dir);
      return;
    }
    var p = t.closest ? t.closest('.preset') : null;
    if (p && root.contains(p)) {
      applyPreset(p);
    }
  });

  root.addEventListener('input', function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains('stepper__num')) {
      var item = itemFor(t);
      if (item) setQty(item, t.value);
    } else if (t.classList && t.classList.contains('ruler__range')) {
      var it = itemFor(t);
      if (it) setQty(it, t.value);
    }
  });

  root.addEventListener('change', function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains('stepper__num')) {
      var item = itemFor(t);
      if (item) setQty(item, t.value);
    }
  });

  root.addEventListener('blur', function (e) {
    var t = e.target;
    if (t.classList && t.classList.contains('stepper__num')) {
      var item = itemFor(t);
      if (item) { state.qty[item.key] = state.qty[item.key]; t.value = state.qty[item.key]; }
    }
  }, true);

  /* presets */
  var PRESETS = {
    brand: { posts: 6, videos: 2, visuals: 4, assets: 6, decks: 2 },
    growth: { posts: 16, videos: 4, visuals: 2, assets: 4, decks: 1 },
    essentials: { posts: 8, videos: 1, visuals: 2, assets: 4, decks: 2 },
    custom: null
  };

  function markPreset(key) {
    presets.forEach(function (b) {
      var on = b.getAttribute('data-preset') === key;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function applyPreset(btn) {
    var key = btn.getAttribute('data-preset');
    markPreset(key);
    if (key === 'custom') return;
    var q = PRESETS[key];
    if (!q) return;
    ITEMS.forEach(function (it) {
      state.qty[it.key] = Math.min(q[it.key] || 0, parseInt(it.range.max, 10) || 999);
    });
    render(true);
  }

  /* copy estimate */
  function estimateText() {
    var r = compute();
    var lines = ['Quantocos GC³ — credit estimate', ''];
    lines.push('Pod: ' + r.pod.name + ' — ' + money(r.pod.price) + ' / month (' + r.capacity + ' credits)');
    lines.push('');
    ITEMS.forEach(function (it) {
      lines.push(it.num.getAttribute('aria-labelledby') && document.getElementById(it.num.getAttribute('aria-labelledby'))
        ? document.getElementById(it.num.getAttribute('aria-labelledby')).textContent + ': ' +
          state.qty[it.key] + ' × ' + it.rate + ' = ' + nf(state.qty[it.key] * it.rate) + ' credits'
        : it.key + ': ' + state.qty[it.key] + ' × ' + it.rate + ' = ' + nf(state.qty[it.key] * it.rate) + ' credits');
    });
    lines.push('');
    lines.push('Allocated: ' + nf(r.allocated) + ' of ' + r.capacity + ' credits (' + Math.round(r.pct) + '%)');
    lines.push('Remaining: ' + nf(r.remaining));
    lines.push('Beyond pool: ' + nf(r.beyond));
    lines.push(recommendation(r.allocated).text);
    lines.push('');
    lines.push('Estimate only, not a live balance. Subscription is the selected pod fee, not workload × $25.');
    return lines.join('\n');
  }

  function flashCopy(text) {
    if (!out.copyMsg) return;
    out.copyMsg.textContent = text;
    clearTimeout(flashCopy.t);
    flashCopy.t = setTimeout(function () { out.copyMsg.textContent = ''; }, 2600);
  }

  if (out.copy) {
    out.copy.addEventListener('click', function () {
      var text = estimateText();
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        flashCopy(ok ? 'Copied.' : 'Copy failed. Select the estimate and copy it manually.');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flashCopy('Copied.'); }, fallback);
      } else fallback();
    });
  }

  var resetBtn = root.querySelector('[data-reset]');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      ITEMS.forEach(function (it) { state.qty[it.key] = 0; });
      markPreset('custom');
      render(true);
    });
  }

  /* initial: markup already carries the correct values, then take over */
  render(false);
  if (podBtns.length) podsWrap.style.setProperty('--pod-i', podBtns.indexOf(state.pod));
})();
