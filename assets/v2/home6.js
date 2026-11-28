/* home6.js — capability explorer tabs and team selector. No dependencies. */
(function () {
  "use strict";

  /* ── capability explorer ───────────────────────────────── */
  var list = document.querySelector("[data-h6-tabs]");
  if (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll("[role='tab']"));
    var panels = tabs.map(function (t) {
      return document.getElementById(t.getAttribute("aria-controls"));
    });

    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", on ? "true" : "false");
        tab.tabIndex = on ? 0 : -1;
        if (panels[i]) panels[i].hidden = !on;
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % tabs.length;
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); }
      });
    });

    select(0);
  }

  /* ── team selector → matching pod ──────────────────────── */
  var chooser = document.querySelector("[data-h6-choose]");
  if (chooser) {
    var intents = Array.prototype.slice.call(chooser.querySelectorAll("[data-intent]"));
    var plans = Array.prototype.slice.call(chooser.querySelectorAll("[data-pod]"));

    intents.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-intent");
        intents.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        plans.forEach(function (plan) {
          plan.classList.toggle("is-match", plan.getAttribute("data-pod") === target);
        });
      });
    });
  }
})();
