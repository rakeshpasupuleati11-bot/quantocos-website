/* Quantocos GC³ — inner-page interactions.
   Sticky section nav (scrollspy), tabs, filters, disclosure.
   No second IntersectionObserver — motion.js owns observation.
   Forms never fake a successful send: without a live endpoint they
   hand off to the user's mail client and say so. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- sticky section nav: scrollspy ---- */
  function spy() {
    var nav = document.querySelector(".pnav");
    if (!nav) return;
    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;
    var targets = [];
    links.forEach(function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) targets.push({ link: a, el: el });
    });
    if (!targets.length) return;
    var current = null;
    var queued = false;

    function render() {
      queued = false;
      var offset = 150;
      var active = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el.getBoundingClientRect().top - offset <= 0) active = targets[i];
      }
      if (active.link === current) return;
      if (current) {
        current.classList.remove("is-current");
        current.removeAttribute("aria-current");
      }
      current = active.link;
      current.classList.add("is-current");
      current.setAttribute("aria-current", "true");
      var box = current.getBoundingClientRect();
      var navBox = nav.getBoundingClientRect();
      if (box.left < navBox.left + 8 || box.right > navBox.right - 8) {
        var inner = nav.querySelector(".pnav__inner");
        if (inner) inner.scrollTo({ left: current.offsetLeft - 24, behavior: reduce ? "auto" : "smooth" });
      }
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(render);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    render();
  }

  /* ---- tabs ---- */
  function tabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      var btns = Array.prototype.slice.call(root.querySelectorAll("[role=tab]"));
      var panels = Array.prototype.slice.call(root.querySelectorAll("[role=tabpanel]"));
      if (!btns.length) return;
      function select(i, focus) {
        btns.forEach(function (b, j) {
          var on = j === i;
          b.setAttribute("aria-selected", on ? "true" : "false");
          b.tabIndex = on ? 0 : -1;
          if (panels[j]) panels[j].classList.toggle("is-active", on);
        });
        if (focus) btns[i].focus();
      }
      btns.forEach(function (b, i) {
        b.addEventListener("click", function () { select(i, false); });
        b.addEventListener("keydown", function (e) {
          var k = e.key, n = btns.length, t = -1;
          if (k === "ArrowRight" || k === "ArrowDown") t = (i + 1) % n;
          else if (k === "ArrowLeft" || k === "ArrowUp") t = (i - 1 + n) % n;
          else if (k === "Home") t = 0;
          else if (k === "End") t = n - 1;
          if (t > -1) { e.preventDefault(); select(t, true); }
        });
      });
      select(btns.findIndex(function (b) { return b.getAttribute("aria-selected") === "true"; }) || 0, false);
    });
  }

  /* ---- filters ---- */
  function filters() {
    document.querySelectorAll("[data-filter]").forEach(function (root) {
      var id = root.getAttribute("data-filter");
      var controls = document.querySelector('[data-filter-controls="' + id + '"]');
      var items = Array.prototype.slice.call(root.querySelectorAll("[data-kind]"));
      if (!controls || !items.length) return;
      var empty = document.querySelector('[data-filter-empty="' + id + '"]');
      var btns = Array.prototype.slice.call(controls.querySelectorAll("button"));
      function apply(kind) {
        var shown = 0;
        items.forEach(function (el) {
          var on = kind === "all" || el.getAttribute("data-kind").split(" ").indexOf(kind) > -1;
          el.hidden = !on;
          if (on) shown++;
        });
        btns.forEach(function (b) {
          b.setAttribute("aria-pressed", b.getAttribute("data-kind") === kind ? "true" : "false");
        });
        if (empty) empty.hidden = shown > 0;
        root.setAttribute("aria-live", "polite");
      }
      btns.forEach(function (b) {
        b.addEventListener("click", function () { apply(b.getAttribute("data-kind")); });
      });
    });
  }

  /* ---- FAQ disclosure: one open at a time within a group ---- */
  function disclosure() {
    document.querySelectorAll("[data-acc-group]").forEach(function (group) {
      var all = Array.prototype.slice.call(group.querySelectorAll("details"));
      all.forEach(function (d) {
        d.addEventListener("toggle", function () {
          if (!d.open) return;
          all.forEach(function (o) { if (o !== d) o.open = false; });
        });
      });
    });
  }

  /* ---- forms: honest handling, no simulated success ---- */
  function forms() {
    var UNWIRED = "This form is not connected to a server yet, so nothing was submitted. Use the link to send the same details from your own mail app, or write to hello@quantocos.com.";
    function say(status, state, text, linkText, linkHref) {
      if (!status) return null;
      status.hidden = false;
      status.setAttribute("data-state", state);
      status.textContent = "";
      status.appendChild(document.createTextNode(text));
      if (!linkText || !linkHref) return null;
      var a = document.createElement("a");
      a.href = linkHref;
      a.textContent = linkText;
      status.appendChild(document.createTextNode(" "));
      status.appendChild(a);
      status.appendChild(document.createTextNode("."));
      return a;
    }
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      var status = form.querySelector(".pform__status");
      var submit = form.querySelector('[type="submit"]');
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        var data = new FormData(form);
        var lines = [];
        data.forEach(function (v, k) {
          if (v && k !== "consent") lines.push(k + ": " + v);
        });
        var subject = (form.getAttribute("data-subject") || "Website enquiry") + " — " + (data.get("name") || "Quantocos");
        var href = "mailto:hello@quantocos.com?subject=" + encodeURIComponent(subject) +
                   "&body=" + encodeURIComponent(lines.join("\n") + "\n\nSent from " + location.href);
        var endpoint = form.getAttribute("data-endpoint");

        /* No endpoint configured: say so, and hand over the mailto. Nothing pretends to send. */
        if (!endpoint) {
          var mail = say(status, "ok", UNWIRED, "Open your email app", href);
          if (window.console && console.info) {
            console.info("[Quantocos] Form endpoint not configured — no submission occurred.");
          }
          if (mail) mail.focus();
          return;
        }

        /* Endpoint contract: set data-endpoint on the form once a service is chosen.
           POST application/json with every named field plus page and submittedAt;
           2xx means accepted, any other response or a network failure is an error. */
        var payload = { page: location.href, submittedAt: new Date().toISOString() };
        data.forEach(function (v, k) { if (k !== "consent") payload[k] = v; });
        if (submit) submit.disabled = true;
        say(status, "pending", "Sending your details…");
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        }).then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          say(status, "ok", "Received. Your details reached the team; a written reply comes from hello@quantocos.com.");
          form.reset();
        }).catch(function () {
          say(status, "error", "That did not send. Write to hello@quantocos.com, or", "send these details from your mail app", href);
        }).then(function () {
          if (submit) submit.disabled = false;
        });
      });
    });
  }

  /* ---- credit calculator: arithmetic at the published rate ---- */
  function calc() {
    document.querySelectorAll("[data-calc]").forEach(function (root) {
      var input = root.querySelector("[data-calc-input]");
      var out = root.querySelector("[data-calc-out]");
      var creditsOut = root.querySelector("[data-calc-credits]");
      var rate = parseFloat(root.getAttribute("data-rate")) || 25;
      if (!input || !out) return;
      function money(n) { return "$" + n.toLocaleString("en-US"); }
      var presetBtns = root.querySelectorAll("[data-calc-set]");
      function syncPresets() {
        presetBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", b.getAttribute("data-calc-set") === input.value ? "true" : "false");
        });
      }
      function update() {
        var credits = Math.max(0, parseInt(input.value, 10) || 0);
        var value = credits * rate;
        out.textContent = money(value);
        if (creditsOut) creditsOut.textContent = credits;
        input.setAttribute("aria-valuetext", credits + " credits, " + money(value) + " per month");
        syncPresets();
      }
      input.addEventListener("input", update);
      presetBtns.forEach(function (b) {
        b.addEventListener("click", function () {
          input.value = b.getAttribute("data-calc-set");
          update();
        });
      });
      update();
    });
  }

  function boot() {
    spy();
    tabs();
    filters();
    disclosure();
    forms();
    calc();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
