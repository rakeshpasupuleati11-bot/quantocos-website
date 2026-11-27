/* ============================================================
   Quantocos conversion layer
   - Event bus: window.qcTrack / window.__qcEvents / dataLayer
   - Intent carry-over: capability page or pod selection -> enquiry form
   - Activation from window.QC_CONFIG (set before this file loads):
       QC_CONFIG = { endpoint:"https://…", booking:"https://…",
                     ga4:"G-XXXXXXX", plausibleDomain:"quantocos.com",
                     consent:true }
   Nothing here sends personal data. Analytics and endpoint stay off
   until an approved value is configured and consent is granted.
   ============================================================ */
(function () {
  "use strict";
  var C = window.QC_CONFIG || {};
  var Q = (window.__qcEvents = window.__qcEvents || []);
  var PAGE = location.pathname.split("/").pop() || "index.html";
  var KEY = "qc_intent";
  var qs = new URLSearchParams(location.search);

  function safe(v) {
    return typeof v === "string" && v.length <= 64 && !/[<>]/.test(v) ? v : "";
  }

  function track(event, props) {
    var e = { event: event, page: PAGE }, k;
    if (props) { for (k in props) { var v = safe(props[k]); if (v) e[k] = v; } }
    Q.push(e); if (Q.length > 200) Q.shift();
    (window.dataLayer = window.dataLayer || []).push(e);
    if (typeof window.gtag === "function") window.gtag("event", event, props || {});
    if (typeof window.plausible === "function") window.plausible(event, { props: props || {} });
  }
  window.qcTrack = track;

  /* ---- intent: what the visitor is interested in ---- */
  function capabilityOf(path) {
    var m = (path || "").match(/capabilities\/([a-z0-9-]+)\.html/);
    return m ? m[1] : "";
  }
  function getIntent() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (e) { return null; }
  }
  function setIntent(plan, capability, source) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({
        plan: safe(plan), capability: safe(capability), source: source || "", page: PAGE, ts: Date.now()
      }));
    } catch (e) { /* private mode: query string still works */ }
  }

  var HERE_CAP = capabilityOf(location.pathname);
  if (HERE_CAP) { var prev = getIntent(); setIntent(prev && prev.plan, HERE_CAP, "capability"); }
  if (qs.get("plan") || qs.get("cap")) setIntent(qs.get("plan"), qs.get("cap"), "query");

  /* ---- analytics: loaded only with an approved ID and consent ---- */
  function analytics() {
    if (C.consent !== true) return;
    var ga = safe(C.ga4);
    if (/^G-[A-Z0-9]{6,}$/.test(ga) && !document.querySelector("script[data-qc-ga4]")) {
      var s = document.createElement("script");
      s.async = true; s.dataset.qcGa4 = "1";
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", ga, { anonymize_ip: true });
    }
    var pd = safe(C.plausibleDomain);
    if (pd && !document.querySelector("script[data-qc-plausible]")) {
      var p = document.createElement("script");
      p.defer = true; p.dataset.qcPlausible = "1"; p.src = "https://plausible.io/js/script.js";
      p.setAttribute("data-domain", pd);
      document.head.appendChild(p);
    }
  }

  /* ---- clicks: CTA engagement and pod selection ---- */
  var calcTracked = false;
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (!t.closest) return;
    var a = t.closest("a.btn, button.btn, [data-cta]");
    if (a) {
      track("cta_click", {
        label: (a.innerText || "").trim().replace(/\s+/g, " "),
        to: (a.getAttribute("href") || "").split("?")[0].split("/").pop()
      });
    }
    var pod = t.closest(".podsel, [data-pod]");
    if (pod) {
      var name = safe(pod.getAttribute("data-pod")) || (pod.innerText || "").trim().replace(/\s+/g, " ").slice(0, 64);
      setIntent(name, "", "pod_select");
      track("pod_select", { plan: name });
    }
    if (!calcTracked && t.closest("[data-calc-set]")) { calcTracked = true; track("calc_use", {}); }
  }, true);
  document.addEventListener("input", function (ev) {
    if (!calcTracked && ev.target.matches && ev.target.matches("[data-calc-input]")) {
      calcTracked = true; track("calc_use", {});
    }
  }, true);

  /* ---- forms: endpoint activation, intent carry-over, events ---- */
  function forms() {
    var endpoint = safe(C.endpoint);
    document.querySelectorAll("form[data-form]").forEach(function (form) {
      if (endpoint && !form.getAttribute("data-endpoint")) form.setAttribute("data-endpoint", endpoint);
      var wired = !!form.getAttribute("data-endpoint");
      var subj = form.getAttribute("data-subject") || "Website enquiry";

      if (wired) {
        /* The "no endpoint" copy is only true until a service is connected. */
        document.querySelectorAll("[data-no-endpoint]").forEach(function (n) { n.hidden = true; });
        document.querySelectorAll("[data-when-wired]").forEach(function (n) { n.hidden = false; });
        var note = form.querySelector(".pform__note"); if (note) note.hidden = true;
        var btn = form.querySelector('[type="submit"]');
        if (btn) btn.textContent = btn.getAttribute("data-send-label") || "Send enquiry";
      }

      var intent = getIntent();
      var plan = safe(qs.get("plan")) || (intent && intent.plan) || "";
      var capability = safe(qs.get("cap")) || (intent && intent.capability) || capabilityOf(document.referrer);
      if (plan || capability) {
        if (plan) {
          var hp = form.querySelector('input[name="plan"]');
          if (!hp) { hp = document.createElement("input"); hp.type = "hidden"; hp.name = "plan"; form.appendChild(hp); }
          hp.value = plan;
        }
        if (capability) {
          var hc = form.querySelector('input[name="capability"]');
          if (!hc) { hc = document.createElement("input"); hc.type = "hidden"; hc.name = "capability"; form.appendChild(hc); }
          hc.value = capability;
        }
        var topic = form.querySelector('select[name="topic"]');
        if (topic && capability) {
          for (var i = 0; i < topic.options.length; i++) {
            if (/capability/i.test(topic.options[i].value)) { topic.selectedIndex = i; break; }
          }
        }
        var ctx = form.querySelector(".pform__context");
        if (!ctx) {
          ctx = document.createElement("p");
          ctx.className = "pform__context";
          var first = form.querySelector(".pform__row, .pform__field, .pform__check");
          form.insertBefore(ctx, first);
        }
        var label = [capability.replace(/-/g, " "), plan.replace(/-/g, " ")].filter(Boolean).join(" — ");
        ctx.textContent = "Enquiry about: " + label + ".";
        if (form.getAttribute("data-subject") === subj) {
          form.setAttribute("data-subject", subj + " — " + label);
        }
      }

      var started = false;
      form.addEventListener("input", function () {
        if (!started) { started = true; track("form_start", { form: subj }); }
      }, true);
      /* One field check fires one invalid event per field; report the failed attempt once. */
      var lastErr = 0;
      function err() {
        var now = Date.now();
        if (now - lastErr < 1000) return;
        lastErr = now;
        track("form_error", { kind: "invalid" });
      }
      form.addEventListener("invalid", err, true);
      form.addEventListener("qc:invalid", err);
      form.addEventListener("qc:lead", function () { track("generate_lead", { form: subj }); });
      form.addEventListener("qc:error", function () { track("form_error", { kind: "network" }); });
    });
  }

  /* ---- booking: a configured scheduler replaces the interim page ---- */
  function booking() {
    var url = safe(C.booking);
    if (!/^https:\/\//i.test(url)) return;
    document.querySelectorAll("a").forEach(function (a) {
      if ((a.textContent || "").trim() === "Book a Discovery Call") {
        a.href = url; a.target = "_blank"; a.rel = "noopener";
      }
    });
  }

  /* ---- sticky mobile action: one primary CTA in the thumb zone ---- */
  function sticky() {
    if (window.innerWidth > 768) return;
    if (/contact\.html|talk-to-an-expert\.html/.test(location.pathname)) return;
    var src = document.querySelector("a.btn.btn--primary");
    if (!src) return;
    var bar = document.createElement("div");
    bar.className = "qc-sticky";
    /* a fixed, labelled landmark so the repeated CTA is not loose body content */
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Book a discovery call");
    var a = document.createElement("a");
    a.className = "btn btn--primary";
    a.href = src.getAttribute("href") || "contact.html";
    a.textContent = (src.textContent || "Book a Discovery Call").trim().replace(/\s+/g, " ");
    bar.appendChild(a);
    document.body.appendChild(bar);
    function update() {
      var y = window.scrollY || 0;
      var doc = document.documentElement;
      var nearFoot = y + window.innerHeight > doc.scrollHeight - 280;
      var typing = document.activeElement &&
        /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      bar.classList.toggle("is-on", y > 420 && !nearFoot && !typing);
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    update();
  }

  function init() {
    analytics();
    booking();
    forms();
    sticky();
    if (PAGE === "pricing.html") track("pricing_view", {});
    else if (HERE_CAP) track("capability_view", { capability: HERE_CAP });
    track("page_view", {});
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
