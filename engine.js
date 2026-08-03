/* ============================================================================
   Myra Learns — shared engine
   ----------------------------------------------------------------------------
   Everything reusable lives here so the three subject files stay small:
     • speech      : text-to-speech in Hindi + Indian English, with voice picking
     • sfx         : little WebAudio sounds (correct / wrong / win / pop)
     • listening   : optional microphone practice
     • router      : screen stack + Android hardware-back support
     • ui          : element helpers, cards, buttons, keypad
     • tracePad    : finger-tracing canvas with handwriting scoring
     • stars       : localStorage progress + confetti rewards
   No frameworks, no build step. Runs straight off GitHub Pages.
   ========================================================================== */
window.E = (function () {
  "use strict";

  const cfg = window.APP_CONFIG;
  const APPEL = document.getElementById("app");
  const FX = document.getElementById("fx");
  const TOASTEL = document.getElementById("toast");

  /* ---------------------------------------------------------------- storage */
  const STORE_KEY = "myra-learns-v1";
  let state = { stars: 0, done: {}, best: {}, streak: 0, lastDay: "" };

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) state = Object.assign(state, JSON.parse(raw));
    } catch (e) { /* private mode — just run without saving */ }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function addStars(n) {
    state.stars = (state.stars || 0) + (n || 1);
    save();
    paintStars();
  }
  function markDone(key) { state.done[key] = true; save(); }
  function isDone(key) { return !!state.done[key]; }
  function best(key, value) {
    if (value == null) return state.best[key] || 0;
    if (value > (state.best[key] || 0)) { state.best[key] = value; save(); }
    return state.best[key];
  }
  function touchStreak() {
    const today = new Date().toDateString();
    if (state.lastDay === today) return;
    const yday = new Date(Date.now() - 864e5).toDateString();
    state.streak = (state.lastDay === yday) ? (state.streak || 0) + 1 : 1;
    state.lastDay = today;
    save();
  }

  /* ----------------------------------------------------------------- speech */
  let voices = [];
  function refreshVoices() {
    try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { voices = []; }
  }
  if (window.speechSynthesis) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  // Pick the nicest available voice for a language, preferring female/natural ones.
  function pickVoice(lang) {
    if (!voices.length) refreshVoices();
    const base = (lang || "en-IN").split("-")[0];
    const exact = voices.filter(v => v.lang && v.lang.replace("_", "-") === lang);
    const loose = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith(base));
    const pool = exact.length ? exact : loose;
    if (!pool.length) return null;
    const nice = pool.find(v => /google|female|swara|heera|kalpana|neerja|natural/i.test(v.name));
    return nice || pool[0];
  }

  let speakLock = 0;
  function stopSpeak() {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  /* speak("आम", {lang:"hi-IN", slow:true, then:fn}) */
  function speak(text, opts) {
    opts = opts || {};
    if (!("speechSynthesis" in window)) { if (opts.then) opts.then(); return; }
    const lang = opts.lang || cfg.langEnglish;
    stopSpeak();
    const u = new SpeechSynthesisUtterance(String(text));
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.lang = lang;
    u.rate = opts.rate != null ? opts.rate
           : (opts.slow ? cfg.speech.slowRate : cfg.speech.normalRate);
    u.pitch = opts.pitch != null ? opts.pitch : cfg.speech.pitch;
    const id = ++speakLock;
    u.onend = () => { if (opts.then && id === speakLock) opts.then(); };
    u.onerror = () => { if (opts.then && id === speakLock) opts.then(); };
    try { window.speechSynthesis.speak(u); } catch (e) { if (opts.then) opts.then(); }
  }
  function speakHi(text, opts) { return speak(text, Object.assign({ lang: cfg.langHindi }, opts || {})); }
  function speakEn(text, opts) { return speak(text, Object.assign({ lang: cfg.langEnglish }, opts || {})); }

  // Speak a list one after another (used for chanting tables / spelling out letters).
  function speakSeq(items, opts, done) {
    opts = opts || {};
    let i = 0;
    (function next() {
      if (i >= items.length) { if (done) done(); return; }
      const it = items[i++];
      const txt = typeof it === "string" ? it : it.text;
      const o = Object.assign({}, opts, typeof it === "object" ? it : {});
      o.then = () => setTimeout(next, o.gap != null ? o.gap : 220);
      speak(txt, o);
    })();
  }

  /* ------------------------------------------------------------- microphone */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const canListen = !!SR;
  function listenOnce(lang, onDone) {
    if (!SR) { onDone(null); return null; }
    let rec;
    try { rec = new SR(); } catch (e) { onDone(null); return null; }
    rec.lang = lang || cfg.langEnglish;
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    let finished = false;
    const finish = (val) => { if (!finished) { finished = true; onDone(val); } };
    rec.onresult = (ev) => {
      const alts = [];
      for (let i = 0; i < ev.results[0].length; i++) alts.push(ev.results[0][i].transcript);
      finish(alts);
    };
    rec.onerror = () => finish(null);
    rec.onend = () => finish(null);
    try { rec.start(); } catch (e) { finish(null); }
    return rec;
  }
  function norm(s) {
    return String(s || "").toLowerCase()
      .replace(/[.,!?;:'"`|।॥\-_()]/g, "")
      .replace(/\s+/g, " ").trim();
  }
  function looseMatch(saidList, target) {
    if (!saidList) return false;
    const t = norm(target);
    return saidList.some(s => {
      const n = norm(s);
      return n === t || n.includes(t) || t.includes(n);
    });
  }

  /* ---------------------------------------------------------- sound effects */
  let actx = null;
  function ac() {
    if (!actx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) actx = new C();
    }
    if (actx && actx.state === "suspended") actx.resume();
    return actx;
  }
  function tone(freq, dur, type, when, vol) {
    const a = ac(); if (!a) return;
    const o = a.createOscillator(), g = a.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    const t0 = a.currentTime + (when || 0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (dur || 0.18));
    o.connect(g); g.connect(a.destination);
    o.start(t0); o.stop(t0 + (dur || 0.18) + 0.03);
  }
  const sfx = {
    pop()     { tone(660, 0.09, "triangle", 0, 0.14); },
    tick()    { tone(440, 0.05, "square", 0, 0.07); },
    correct() { tone(784, 0.12, "sine", 0);  tone(1047, 0.18, "sine", 0.1); },
    wrong()   { tone(230, 0.16, "sawtooth", 0, 0.10); tone(180, 0.20, "sawtooth", 0.12, 0.09); },
    win()     { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, "sine", i * 0.11, 0.16)); }
  };

  /* -------------------------------------------------------------- ui helpers */
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function btn(label, cls, onClick) {
    const b = el("button", cls || "btn", label);
    b.type = "button";
    b.addEventListener("click", (ev) => { sfx.pop(); onClick(ev, b); });
    return b;
  }
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function sample(arr, n, exclude) {
    return shuffle(arr.filter(x => x !== exclude)).slice(0, n);
  }
  function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }

  /* Split Devanagari into readable clusters so "कि" stays together, not "क"+"ि" */
  function graphemes(str) {
    const out = [];
    const marks = /[\u0900-\u0903\u093A-\u094F\u0951-\u0957\u0962\u0963\u200D]/;
    for (const ch of String(str)) {
      if (out.length && marks.test(ch)) out[out.length - 1] += ch;
      else if (out.length && out[out.length - 1].endsWith("\u094D")) out[out.length - 1] += ch;
      else out.push(ch);
    }
    return out;
  }

  const PRAISE = ["Shabaash! 🎉", "Wow Myra! 🌟", "Bahut badhiya! 👏", "Superstar! ✨",
                  "You did it! 🥳", "Perfect! 💯", "Kya baat hai! 🎊"];
  function praise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }

  let toastTimer = null;
  function toast(msg, kind) {
    TOASTEL.textContent = msg;
    TOASTEL.className = "toast show " + (kind || "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { TOASTEL.className = "toast"; }, 1900);
  }
  function confetti(n) {
    const bits = ["🎉", "⭐", "🌈", "✨", "🎈", "💖", "🦋", "🌟"];
    for (let i = 0; i < (n || 26); i++) {
      const s = el("span", "confetti", bits[Math.floor(Math.random() * bits.length)]);
      s.style.left = Math.random() * 100 + "vw";
      s.style.animationDelay = (Math.random() * 0.4) + "s";
      s.style.fontSize = (16 + Math.random() * 22) + "px";
      FX.appendChild(s);
      setTimeout(() => s.remove(), 2600);
    }
  }
  function celebrate(msg, stars) {
    confetti(30);
    sfx.win();
    if (stars) addStars(stars);
    toast(msg || praise(), "ok");
  }

  /* Big round "hear it" button */
  function speakBtn(text, lang, label, cls) {
    return btn(label || "🔊", "iconbtn " + (cls || ""), () => speak(text, { lang: lang, slow: false }));
  }
  function slowBtn(text, lang) {
    return btn("🐢", "iconbtn slow", () => speak(text, { lang: lang, slow: true }));
  }
  /* Microphone button — always encouraging, never blocks progress */
  function micBtn(target, lang, onResult) {
    const b = btn("🎤 Say it", "btn mic", () => {
      if (!canListen) { toast("Just say it out loud — I'm listening! 👂", "ok"); if (onResult) onResult(true); return; }
      b.classList.add("listening");
      b.innerHTML = "👂 Listening…";
      listenOnce(lang, (alts) => {
        b.classList.remove("listening");
        b.innerHTML = "🎤 Say it";
        const ok = looseMatch(alts, target);
        if (ok) { sfx.correct(); toast("Perfect! 🌟", "ok"); }
        else { toast("Good try! Listen once more 💛", ""); }
        if (onResult) onResult(ok);
      });
    });
    return b;
  }

  /* --------------------------------------------------------------- tracePad */
  /* Faint guide letter + finger drawing + a gentle handwriting score. */
  function tracePad(char, opts) {
    opts = opts || {};
    const wrap = el("div", "tracewrap");
    const size = 260;
    const guide = document.createElement("canvas");
    const ink = document.createElement("canvas");
    [guide, ink].forEach(c => {
      c.width = size; c.height = size;
      c.className = "tracecanvas";
      c.style.touchAction = "none";
    });
    guide.classList.add("guide");
    wrap.appendChild(guide); wrap.appendChild(ink);

    const gx = guide.getContext("2d"), ix = ink.getContext("2d");
    /* Trace pad guide letter — plain maatras render as a lone dotted circle,
       so we draw the maatra on क to give her a real shape to follow. */
    function drawGuide() {
      gx.clearRect(0, 0, size, size);
      gx.fillStyle = "#d8d2ff";
      gx.font = "190px 'Tiro Devanagari Hindi', 'Baloo 2', serif";
      gx.textAlign = "center"; gx.textBaseline = "middle";
      gx.fillText(char, size / 2, size / 2 + 8);
    }
    drawGuide();

    ix.lineWidth = 16; ix.lineCap = "round"; ix.lineJoin = "round";
    ix.strokeStyle = "#7c4dff";
    let drawing = false, drew = false;
    function pos(ev) {
      const r = ink.getBoundingClientRect();
      const p = ev.touches ? ev.touches[0] : ev;
      return { x: (p.clientX - r.left) * (size / r.width), y: (p.clientY - r.top) * (size / r.height) };
    }
    function start(ev) { ev.preventDefault(); drawing = true; drew = true; const p = pos(ev); ix.beginPath(); ix.moveTo(p.x, p.y); }
    function move(ev) { if (!drawing) return; ev.preventDefault(); const p = pos(ev); ix.lineTo(p.x, p.y); ix.stroke(); }
    function end() { drawing = false; }
    ink.addEventListener("pointerdown", start);
    ink.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);

    function clear() { ix.clearRect(0, 0, size, size); drew = false; }

    /* Score = how much of the letter she covered, and how much she stayed on it. */
    function score() {
      if (!drew) return 0;
      const g = gx.getImageData(0, 0, size, size).data;
      const k = ix.getImageData(0, 0, size, size).data;
      let gOn = 0, kOn = 0, hit = 0;
      const R = 9; // forgiveness radius in pixels
      const gmask = new Uint8Array(size * size);
      for (let i = 0, p = 0; i < g.length; i += 4, p++) if (g[i + 3] > 40) { gmask[p] = 1; gOn++; }
      // dilate the guide mask so near-misses still count
      const dil = new Uint8Array(size * size);
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        if (!gmask[y * size + x]) continue;
        for (let dy = -R; dy <= R; dy += 3) for (let dx = -R; dx <= R; dx += 3) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < size && ny < size) dil[ny * size + nx] = 1;
        }
      }
      const covered = new Uint8Array(size * size);
      for (let i = 0, p = 0; i < k.length; i += 4, p++) {
        if (k[i + 3] > 40) { kOn++; if (dil[p]) { hit++; covered[p] = 1; } }
      }
      if (!kOn || !gOn) return 0;
      const accuracy = hit / kOn;                 // did she stay on the letter?
      let touched = 0;
      for (let y = 0; y < size; y += 2) for (let x = 0; x < size; x += 2) {
        const p = y * size + x;
        if (!gmask[p]) continue;
        let near = false;
        for (let dy = -12; dy <= 12 && !near; dy += 4)
          for (let dx = -12; dx <= 12 && !near; dx += 4) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < size && ny < size && covered[ny * size + nx]) near = true;
          }
        if (near) touched++;
      }
      let total = 0;
      for (let y = 0; y < size; y += 2) for (let x = 0; x < size; x += 2) if (gmask[y * size + x]) total++;
      const coverage = total ? touched / total : 0;
      return Math.round(Math.min(1, accuracy * 0.45 + coverage * 0.75) * 100);
    }
    return { node: wrap, clear, score, hasInk: () => drew };
  }

  /* ----------------------------------------------------------------- router */
  const stack = [];          // stack of render functions; [0] is always Home
  let painting = false;

  function render(fn) {
    painting = true;
    stopSpeak();
    APPEL.innerHTML = "";
    fn();
    window.scrollTo(0, 0);
    painting = false;
  }
  function go(fn) {
    stack.push(fn);
    try { history.pushState({ depth: stack.length }, ""); } catch (e) {}
    render(fn);
  }
  function replace(fn) {
    if (stack.length) stack[stack.length - 1] = fn;
    else stack.push(fn);
    render(fn);
  }
  function back() {
    if (stack.length > 1) { try { history.back(); } catch (e) { popNow(); } }
  }
  function popNow() {
    if (stack.length > 1) { stack.pop(); render(stack[stack.length - 1]); }
  }
  window.addEventListener("popstate", () => { if (stack.length > 1) popNow(); });
  function reset(homeFn) { stack.length = 0; stack.push(homeFn); render(homeFn); }
  function refresh() { if (stack.length && !painting) render(stack[stack.length - 1]); }

  /* Standard page shell: back arrow, optional home, title, star counter */
  function page(opts) {
    const root = el("div", "page");
    if (opts.subject) root.dataset.subject = opts.subject;

    const bar = el("header", "topbar");
    const left = el("div", "navgrp");
    if (stack.length > 1) left.appendChild(btn("←", "iconbtn back", () => back()));
    else left.appendChild(el("span", "spacer"));
    /* Deep inside an activity, tapping back repeatedly is tedious for a child. */
    if (stack.length > 2) left.appendChild(btn("🏠", "iconbtn small", () => home()));
    bar.appendChild(left);

    const t = el("div", "ttl");
    t.appendChild(el("h1", null, opts.title || ""));
    if (opts.subtitle) t.appendChild(el("p", null, opts.subtitle));
    bar.appendChild(t);

    const st = el("span", "starcount", "⭐ <b>" + (state.stars || 0) + "</b>");
    st.title = "Your stars";
    bar.appendChild(st);

    root.appendChild(bar);
    const main = el("main", "content");
    root.appendChild(main);
    APPEL.appendChild(root);
    return main;
  }
  /* Jump straight back to the subject list */
  function home() {
    if (typeof window.MyraHome === "function") reset(window.MyraHome);
    else while (stack.length > 1) popNow();
  }
  function paintStars() {
    document.querySelectorAll(".starcount b").forEach(b => { b.textContent = state.stars || 0; });
    document.querySelectorAll(".starcount").forEach(s => {
      s.classList.remove("bump"); void s.offsetWidth; s.classList.add("bump");
    });
  }

  /* A progress bar used by every activity */
  function progressBar() {
    const wrap = el("div", "pbar");
    const fill = el("i");
    wrap.appendChild(fill);
    return {
      node: wrap,
      set(done, total) { fill.style.width = (total ? (done / total) * 100 : 0) + "%"; }
    };
  }

  /* Standard end-of-activity result card */
  function finishCard(main, opts) {
    const pct = opts.total ? Math.round((opts.score / opts.total) * 100) : 0;
    const card = el("div", "card finish");
    card.appendChild(el("div", "bigemoji", pct >= 80 ? "🏆" : pct >= 50 ? "🌟" : "💪"));
    card.appendChild(el("h2", null, pct >= 80 ? "Amazing work!" : pct >= 50 ? "Well done!" : "Good try!"));
    card.appendChild(el("p", "score", opts.score + " / " + opts.total));
    if (opts.note) card.appendChild(el("p", "note", opts.note));
    const row = el("div", "row");
    row.appendChild(btn("🔁 Play again", "btn primary", opts.again));
    row.appendChild(btn("← Back", "btn", () => back()));
    card.appendChild(row);
    main.appendChild(card);
    const earned = Math.max(1, Math.round(opts.score / 2));
    celebrate(pct >= 80 ? "Brilliant, " + cfg.child.name + "! 🏆" : praise(), earned);
    touchStreak();
  }

  load();

  return {
    cfg, state, save, addStars, markDone, isDone, best, touchStreak,
    speak, speakHi, speakEn, speakSeq, stopSpeak, pickVoice,
    listenOnce, looseMatch, canListen, norm,
    sfx, tone,
    el, btn, shuffle, sample, randInt, graphemes, praise,
    toast, confetti, celebrate,
    speakBtn, slowBtn, micBtn, tracePad,
    go, back, home, replace, reset, refresh, page, progressBar, finishCard, paintStars
  };
})();
