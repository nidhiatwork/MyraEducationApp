/* ============================================================================
   Myra Learns — HINDI screens
   Maatra list → learn a maatra (sound, syllables, 10 words, trace) → games
   Reading room → leveled sentences + stories
   ========================================================================== */
(function () {
  "use strict";
  const S = "hindi";

  /* ------------------------------------------------------------ HINDI HOME */
  function home() {
    const m = E.page({ title: "हिंदी", subtitle: "Maatra • Shabd • Vaakya", subject: S });

    const intro = E.el("div", "card");
    intro.appendChild(E.el("h2", null, "🦜 Mithu says namaste!"));
    intro.appendChild(E.el("p", null, "Pick a maatra to learn, or go to the Reading Room to read full sentences."));
    m.appendChild(intro);

    const t = E.el("div", "tiles");
    t.appendChild(tile("📚", "Maatra", "Learn all 14", () => E.go(maatraList)));
    t.appendChild(tile("📖", "Reading", "Words → sentences", () => E.go(readingRoom)));
    t.appendChild(tile("🎯", "Mixed Quiz", "All words", () => E.go(() => mixedQuiz())));
    t.appendChild(tile("✍️", "Write", "Trace letters", () => E.go(traceMenu)));
    m.appendChild(t);
    return m;
  }

  function tile(ic, title, sub, fn, done) {
    const b = E.btn("", "tile" + (done ? " done" : ""), fn);
    b.innerHTML = "";
    b.appendChild(E.el("span", "ic", ic));
    b.appendChild(E.el("b", null, title));
    b.appendChild(E.el("small", null, sub));
    return b;
  }

  /* ------------------------------------------------------- MAATRA LIST */
  function maatraList() {
    const m = E.page({ title: "मात्रा", subtitle: "Tap one to learn", subject: S });
    const grid = E.el("div", "tiles");
    HINDI.maatras.forEach(u => {
      const done = E.isDone("hi-" + u.id);
      const b = E.btn("", "tile" + (done ? " done" : ""), () => E.go(() => learnMaatra(u)));
      b.innerHTML = "";
      /* show the maatra riding on क — much clearer than the lone sign */
      b.appendChild(E.el("span", "ic dev", "क" + u.maatra));
      b.appendChild(E.el("b", "dev", u.vowel));
      b.appendChild(E.el("small", null, u.name + (done ? " ✅" : "")));
      grid.appendChild(b);
    });
    m.appendChild(grid);
    m.appendChild(E.el("p", "footnote", "10 words in every maatra • " + HINDI.allWords().length + " words in total"));
  }

  /* ------------------------------------------------------- LEARN A MAATRA */
  function learnMaatra(u) {
    const m = E.page({ title: u.nameHi, subtitle: u.name, subject: S });

    /* Hero — the maatra shown ON a letter, so she sees its real shape */
    const hero = E.el("div", "card maatrahero");
    hero.appendChild(E.el("div", "maatrabig dev", u.vowel));
    if (u.maatra) {
      hero.appendChild(E.el("div", "formula dev",
        "क <i>+</i> " + u.show + " <i>=</i> <b>क" + u.maatra + "</b>"));
    }
    hero.appendChild(E.el("p", "maatraname dev", u.vowel + "  ·  " + u.vRoman));
    hero.appendChild(E.el("p", null, u.tip));
    const hrow = E.el("div", "row");
    hrow.appendChild(E.btn("🔊 Hear it", "btn primary", () =>
      E.speakHi(u.vowel + "। " + u.sayAs, { slow: true })));
    hrow.appendChild(E.micBtn(u.vowel, E.cfg.langHindi));
    hero.appendChild(hrow);
    m.appendChild(hero);

    /* Syllable ladder */
    const syl = HINDI.syllablesFor(u);
    const sc = E.el("div", "card");
    sc.appendChild(E.el("h2", null, "🪜 Sound Ladder"));
    sc.appendChild(E.el("p", null, "Tap each one and say it with Mithu."));
    const chips = E.el("div", "chiprow");
    syl.forEach(s => {
      const c = E.btn("", "chip", (ev, b) => {
        E.speakHi(s.s, { slow: true });
        b.classList.add("lit"); setTimeout(() => b.classList.remove("lit"), 500);
      });
      c.innerHTML = "";
      c.appendChild(document.createTextNode(s.s));
      c.appendChild(E.el("small", null, s.r));
      chips.appendChild(c);
    });
    sc.appendChild(chips);
    sc.appendChild(E.btn("▶️ Play all", "btn wide", () =>
      E.speakSeq(syl.map(s => s.s), { lang: E.cfg.langHindi, slow: true, gap: 300 })));
    m.appendChild(sc);

    /* 10 words */
    const wc = E.el("div", "card");
    wc.appendChild(E.el("h2", null, "🔤 10 Shabd"));
    wc.appendChild(E.el("p", null, "Tap any word to hear it."));
    const grid = E.el("div", "wordgrid");
    u.words.forEach(w => grid.appendChild(wordCard(w)));
    wc.appendChild(grid);
    wc.appendChild(E.btn("▶️ Read all 10", "btn wide", () =>
      E.speakSeq(u.words.map(w => w.w), { lang: E.cfg.langHindi, slow: true, gap: 480 })));
    m.appendChild(wc);

    /* Practice buttons */
    const pc = E.el("div", "card");
    pc.appendChild(E.el("h2", null, "🎮 Practice"));
    const t = E.el("div", "tiles three");
    t.appendChild(tile("👂", "Listen", "& tap", () => E.go(() => listenGame(u))));
    t.appendChild(tile("🖼️", "Match", "picture", () => E.go(() => matchGame(u))));
    t.appendChild(tile("✍️", "Write", "trace it", () => E.go(() => traceGame(u))));
    pc.appendChild(t);
    m.appendChild(pc);

    m.appendChild(E.btn("✅ I know this maatra!", "btn primary wide", () => {
      E.markDone("hi-" + u.id);
      E.celebrate("Shabaash! " + u.name + " done! 🌟", 3);
      setTimeout(() => E.back(), 900);
    }));
  }

  function wordCard(w, en) {
    const c = E.btn("", "wordcard", (ev, b) => {
      E.speakHi(w.w, { slow: true });
      b.classList.add("lit"); setTimeout(() => b.classList.remove("lit"), 600);
    });
    c.innerHTML = "";
    c.appendChild(E.el("div", "e", w.e || "🔤"));
    c.appendChild(E.el("div", "w" + (en ? " en" : ""), w.w));
    c.appendChild(E.el("div", "r", w.r || ""));
    c.appendChild(E.el("div", "m", w.m || ""));
    return c;
  }

  /* ---------------------------------------------------------- LISTEN GAME */
  function listenGame(u) {
    const pool = u.words;
    runQuiz({
      title: "👂 सुनो और चुनो", subtitle: u.name, total: 8,
      make() {
        const right = E.shuffle(pool)[0];
        const opts = E.shuffle([right].concat(E.sample(pool, 3, right)));
        return {
          promptText: "Which word did you hear?",
          speak: right.w,
          bigText: "🔊",
          opts: opts.map(o => ({ label: o.w, sub: o.r, right: o === right, say: o.w })),
          hi: true
        };
      }
    });
  }

  /* ----------------------------------------------------------- MATCH GAME */
  function matchGame(u) {
    const pool = u.words;
    runQuiz({
      title: "🖼️ चित्र पहचानो", subtitle: u.name, total: 8,
      make() {
        const right = E.shuffle(pool)[0];
        const opts = E.shuffle([right].concat(E.sample(pool, 3, right)));
        return {
          promptText: "Which word is this picture?",
          speak: right.w,
          bigText: right.e || "❓",
          opts: opts.map(o => ({ label: o.w, sub: o.m, right: o === right, say: o.w })),
          hi: true
        };
      }
    });
  }

  /* ------------------------------------------------------------ MIXED QUIZ */
  function mixedQuiz() {
    const pool = HINDI.allWords();
    runQuiz({
      title: "🎯 Mixed Quiz", subtitle: "Words from every maatra", total: 10,
      make() {
        const right = E.shuffle(pool)[0];
        const opts = E.shuffle([right].concat(E.sample(pool, 3, right)));
        return {
          promptText: "Listen and pick the right word",
          speak: right.w,
          bigText: right.e || "🔊",
          opts: opts.map(o => ({ label: o.w, sub: o.r, right: o === right, say: o.w })),
          hi: true
        };
      }
    });
  }

  /* ------------------------------------------------ SHARED QUIZ RUNNER */
  /* cfg.make() returns { promptText, speak, bigText, opts:[{label,sub,right,say}], hi } */
  function runQuiz(cfg) {
    let i = 0, score = 0;
    const m = E.page({ title: cfg.title, subtitle: cfg.subtitle, subject: S });
    const bar = E.progressBar();
    m.appendChild(bar.node);
    const host = E.el("div");
    m.appendChild(host);

    function step() {
      bar.set(i, cfg.total);
      if (i >= cfg.total) {
        host.innerHTML = "";
        E.finishCard(host, {
          score, total: cfg.total,
          note: score === cfg.total ? "Perfect score! 🌟" : "Keep practising — you're getting better!",
          again() { i = 0; score = 0; step(); }
        });
        return;
      }
      const q = cfg.make();
      host.innerHTML = "";
      const card = E.el("div", "card qbox");
      card.appendChild(E.el("p", "qprompt", q.promptText));

      const big = E.el("div", "qbig" + (q.hi ? "" : " en"), q.bigText);
      card.appendChild(big);

      const hearRow = E.el("div", "row");
      hearRow.appendChild(E.btn("🔊 Hear again", "btn", () =>
        E.speakHi(q.speak, { slow: true })));
      card.appendChild(hearRow);

      const opts = E.el("div", "opts");
      let answered = false;
      q.opts.forEach(o => {
        const b = E.btn("", "opt" + (q.hi ? " hi" : ""), (ev, btn) => {
          if (answered) return;
          answered = true;
          if (o.right) {
            btn.classList.add("right"); E.sfx.correct(); score++;
            E.toast(E.praise(), "ok");
          } else {
            btn.classList.add("wrong"); E.sfx.wrong();
            [...opts.children].forEach((c, idx) => {
              if (q.opts[idx].right) c.classList.add("right");
            });
          }
          E.speakHi(o.say, { slow: true });
          setTimeout(() => { i++; step(); }, 1250);
        });
        b.innerHTML = "";
        b.appendChild(document.createTextNode(o.label));
        if (o.sub) b.appendChild(E.el("small", null, o.sub));
        opts.appendChild(b);
      });
      card.appendChild(opts);
      host.appendChild(card);
      E.speakHi(q.speak, { slow: true });
    }
    step();
  }

  /* ------------------------------------------------------------ TRACE */
  function traceMenu() {
    const m = E.page({ title: "✍️ लिखो", subtitle: "Pick a maatra to write", subject: S });
    const grid = E.el("div", "tiles");
    HINDI.maatras.forEach(u => {
      const b = E.btn("", "tile", () => E.go(() => traceGame(u)));
      b.innerHTML = "";
      b.appendChild(E.el("span", "ic dev", u.show || u.vowel));
      b.appendChild(E.el("b", null, u.name));
      grid.appendChild(b);
    });
    m.appendChild(grid);
  }

  function traceGame(u) {
    const syl = HINDI.syllablesFor(u).slice(0, 6);
    let i = 0, score = 0;
    const m = E.page({ title: "✍️ " + u.nameHi, subtitle: "Trace with your finger", subject: S });
    const bar = E.progressBar();
    m.appendChild(bar.node);
    const host = E.el("div");
    m.appendChild(host);

    function step() {
      bar.set(i, syl.length);
      if (i >= syl.length) {
        host.innerHTML = "";
        E.finishCard(host, {
          score, total: syl.length, note: "Lovely handwriting! ✏️",
          again() { i = 0; score = 0; step(); }
        });
        return;
      }
      const s = syl[i];
      host.innerHTML = "";
      const card = E.el("div", "card qbox");
      card.appendChild(E.el("p", "qprompt", "Trace  " + s.s + "  (" + s.r + ")"));
      const pad = E.tracePad(s.s);
      card.appendChild(pad.node);

      const row = E.el("div", "row");
      row.appendChild(E.btn("🔊 Hear", "btn", () => E.speakHi(s.s, { slow: true })));
      row.appendChild(E.btn("🧽 Clear", "btn", () => pad.clear()));
      row.appendChild(E.btn("✅ Check", "btn primary", () => {
        if (!pad.hasInk()) { E.toast("Trace the letter first! ✏️"); return; }
        const sc = pad.score();
        if (sc >= 55) {
          score++; E.sfx.correct();
          E.toast("Beautiful writing! " + sc + "% 🌟", "ok");
          setTimeout(() => { i++; step(); }, 950);
        } else {
          E.sfx.wrong();
          E.toast("Try again — stay on the grey letter 💛");
          pad.clear();
        }
      }));
      card.appendChild(row);
      host.appendChild(card);
      E.speakHi(s.s, { slow: true });
    }
    step();
  }

  /* ------------------------------------------------------- READING ROOM */
  function readingRoom() {
    const m = E.page({ title: "📖 पढ़ो", subtitle: "Read sentences aloud", subject: S });
    const g1 = E.el("div", "card");
    g1.appendChild(E.el("h2", null, "वाक्य · Sentences"));
    const t1 = E.el("div", "tiles");
    HINDI.reading.forEach(lv => {
      const b = E.btn("", "tile", () => E.go(() => sentenceReader(lv)));
      b.innerHTML = "";
      b.appendChild(E.el("span", "ic", lv.emoji));
      b.appendChild(E.el("b", null, lv.title));
      b.appendChild(E.el("small", null, lv.titleEn));
      t1.appendChild(b);
    });
    g1.appendChild(t1);
    m.appendChild(g1);

    const g2 = E.el("div", "card");
    g2.appendChild(E.el("h2", null, "कहानी · Stories"));
    const t2 = E.el("div", "tiles");
    HINDI.stories.forEach(st => {
      const b = E.btn("", "tile", () => E.go(() => storyReader(st)));
      b.innerHTML = "";
      b.appendChild(E.el("span", "ic", st.emoji));
      b.appendChild(E.el("b", "dev", st.title));
      b.appendChild(E.el("small", null, st.titleEn));
      t2.appendChild(b);
    });
    g2.appendChild(t2);
    m.appendChild(g2);
  }

  /* Tap-any-word sentence reader with mic read-aloud */
  function sentenceReader(lv) {
    let i = 0;
    const m = E.page({ title: lv.title, subtitle: lv.titleEn, subject: S });
    const bar = E.progressBar();
    m.appendChild(bar.node);
    const host = E.el("div");
    m.appendChild(host);

    function step() {
      bar.set(i, lv.items.length);
      if (i >= lv.items.length) {
        host.innerHTML = "";
        E.finishCard(host, {
          score: lv.items.length, total: lv.items.length,
          note: "You read every sentence! 📖",
          again() { i = 0; step(); }
        });
        return;
      }
      const it = lv.items[i];
      host.innerHTML = "";
      const card = E.el("div", "card sentcard");
      card.appendChild(E.el("div", "bigemoji", it.e || "📖"));
      card.appendChild(sentenceNode(it.s, true));
      card.appendChild(E.el("p", "roman", it.r || ""));
      card.appendChild(E.el("p", "mean", it.m || ""));

      const row = E.el("div", "row");
      row.appendChild(E.btn("🔊 Read to me", "btn primary", () => E.speakHi(it.s, { slow: true })));
      row.appendChild(E.micBtn(it.s, E.cfg.langHindi));
      card.appendChild(row);

      const nav = E.el("div", "row");
      nav.appendChild(E.btn("➡️ Next", "btn wide", () => { i++; step(); }));
      card.appendChild(nav);
      host.appendChild(card);
    }
    step();
  }

  /* Each word is tappable — she can hear any single word she's stuck on */
  function sentenceNode(sentence, hi) {
    const p = E.el("p", "sentence" + (hi ? "" : " en"));
    sentence.split(/(\s+)/).forEach(tok => {
      if (!tok.trim()) { p.appendChild(document.createTextNode(tok)); return; }
      const w = document.createElement("w");
      w.textContent = tok;
      w.addEventListener("click", () => {
        E.sfx.tick();
        const clean = tok.replace(/[।.,!?]/g, "");
        hi ? E.speakHi(clean, { slow: true }) : E.speakEn(clean, { slow: true });
        w.classList.add("lit"); setTimeout(() => w.classList.remove("lit"), 500);
      });
      p.appendChild(w);
    });
    return p;
  }

  function storyReader(st) {
    const m = E.page({ title: st.title, subtitle: st.titleEn, subject: S });
    const card = E.el("div", "card sentcard");
    card.appendChild(E.el("div", "bigemoji", st.emoji));
    st.lines.forEach(l => {
      card.appendChild(sentenceNode(l.s, true));
      card.appendChild(E.el("p", "mean", l.m));
      card.appendChild(E.el("hr"));
    });
    m.appendChild(card);
    const row = E.el("div", "row");
    row.appendChild(E.btn("▶️ Read the story", "btn primary wide", () =>
      E.speakSeq(st.lines.map(l => l.s), { lang: E.cfg.langHindi, slow: true, gap: 500 })));
    m.appendChild(row);
    m.appendChild(E.btn("⭐ I read it!", "btn wide", () => {
      E.celebrate("Wonderful reading! 📖", 3);
    }));
  }

  window.HindiScreens = { home };
})();
