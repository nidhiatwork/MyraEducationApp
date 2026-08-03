/* ============================================================================
   Myra Learns — ENGLISH screens
   Dictation (app speaks → Myra spells with letter keys) is the main activity.
   Plus reading levels, passages and a listen-and-choose warm-up.
   ========================================================================== */
(function () {
  "use strict";
  const S = "english";

  function tile(ic, title, sub, fn, done) {
    const b = E.btn("", "tile" + (done ? " done" : ""), fn);
    b.innerHTML = "";
    b.appendChild(E.el("span", "ic", ic));
    b.appendChild(E.el("b", null, title));
    if (sub) b.appendChild(E.el("small", null, sub));
    return b;
  }

  /* ---------------------------------------------------------- ENGLISH HOME */
  function home() {
    const m = E.page({ title: "English", subtitle: "Spelling & Reading", subject: S });

    const intro = E.el("div", "card");
    intro.appendChild(E.el("h2", null, "✏️ Ready for dictation?"));
    intro.appendChild(E.el("p", null, "I say a word — you spell it. Tap a set to begin."));
    m.appendChild(intro);

    const t = E.el("div", "tiles");
    t.appendChild(tile("✏️", "Dictation", "Spell the word", () => E.go(setList)));
    t.appendChild(tile("📖", "Reading", "Sentences", () => E.go(readingRoom)));
    t.appendChild(tile("🎧", "Listen", "Pick the word", () => E.go(() => listenGame())));
    t.appendChild(tile("🏆", "Spell-athon", "All 96 words", () => E.go(() => dictation(
      { id: "all", title: "Spell-athon", emoji: "🏆", words: ENGLISH.allWords() }, 12))));
    m.appendChild(t);
    return m;
  }

  /* ------------------------------------------------------------- SET LIST */
  function setList() {
    const m = E.page({ title: "✏️ Dictation", subtitle: "Choose a word set", subject: S });
    ENGLISH.sets.forEach(set => {
      const done = E.isDone("en-" + set.id);
      const c = E.btn("", "subjcard", () => E.go(() => dictation(set)));
      c.style.setProperty("--c", "#3d8bfd");
      c.innerHTML = "";
      c.appendChild(E.el("span", "ic", set.emoji));
      const tx = E.el("div", "tx");
      tx.appendChild(E.el("b", null, set.title + (done ? " ✅" : "")));
      tx.appendChild(E.el("small", null, set.blurb + " · " + set.words.length + " words"));
      c.appendChild(tx);
      c.appendChild(E.el("span", "go", "›"));
      m.appendChild(c);
    });
    m.appendChild(E.el("p", "footnote", ENGLISH.allWords().length + " dictation words in total"));
  }

  /* --------------------------------------------------------- DICTATION */
  /* The app speaks the word; Myra taps letters to spell it.
     Hints escalate gently: syllables → first letter → the word in a sentence. */
  function dictation(set, count) {
    const words = E.shuffle(set.words).slice(0, count || Math.min(10, set.words.length));
    let i = 0, score = 0, firstTry = 0;

    const m = E.page({ title: set.emoji + " " + set.title, subtitle: "Listen & spell", subject: S });
    const bar = E.progressBar();
    m.appendChild(bar.node);
    const host = E.el("div");
    m.appendChild(host);

    function step() {
      bar.set(i, words.length);
      if (i >= words.length) {
        host.innerHTML = "";
        if (score === words.length) E.markDone("en-" + set.id);
        E.finishCard(host, {
          score, total: words.length,
          note: firstTry + " spelt right on the very first try! ✨",
          again() { i = 0; score = 0; firstTry = 0; step(); }
        });
        return;
      }
      renderWord(words[i]);
    }

    function renderWord(word) {
      host.innerHTML = "";
      const target = word.w.toLowerCase();
      const letters = target.split("");
      let typed = [];
      let mistakes = 0;
      let hintLevel = 0;

      const card = E.el("div", "card spellbox");
      card.appendChild(E.el("div", "bigemoji", word.e || "🔤"));
      card.appendChild(E.el("p", "qprompt", "Spell the word you hear"));

      /* speak buttons */
      const hearRow = E.el("div", "row");
      hearRow.appendChild(E.btn("🔊 Say it", "btn primary", () => E.speakEn(word.w)));
      hearRow.appendChild(E.btn("🐢 Slowly", "btn", () => E.speakEn(word.w, { slow: true })));
      hearRow.appendChild(E.btn("🔤 Spell it", "btn", () =>
        E.speakSeq(letters.filter(c => c !== " ").map(c => c.toUpperCase()),
          { lang: E.cfg.langEnglish, rate: 0.75, gap: 130 },
          () => setTimeout(() => E.speakEn(word.w), 380))));
      card.appendChild(hearRow);

      /* the answer slots */
      const slots = E.el("div", "slots");
      const slotEls = letters.map(ch => {
        const s = E.el("div", "slot" + (ch === " " ? " space" : ""));
        slots.appendChild(s);
        return s;
      });
      card.appendChild(slots);

      const hint = E.el("p", "hintline", "");
      card.appendChild(hint);

      /* keyboard — the word's own letters plus a few distractors, sorted */
      const need = target.replace(/ /g, "").split("");
      const extraPool = "abcdefghijklmnopqrstuvwxyz".split("")
        .filter(c => need.indexOf(c) === -1);
      const keyLetters = E.shuffle(
        need.concat(E.shuffle(extraPool).slice(0, Math.max(3, 10 - need.length)))
      ).sort();

      const keys = E.el("div", "keys");
      keyLetters.forEach(ch => {
        const k = E.btn(ch, "key", () => press(ch, k));
        keys.appendChild(k);
      });
      card.appendChild(keys);

      const ctrl = E.el("div", "row");
      ctrl.appendChild(E.btn("⌫ Undo", "btn", () => undo()));
      ctrl.appendChild(E.btn("💡 Hint", "btn", () => showHint()));
      ctrl.appendChild(E.btn("🙈 Show me", "btn ghost", () => reveal()));
      card.appendChild(ctrl);
      host.appendChild(card);

      /* fill the next non-space slot */
      function nextIdx() {
        for (let k = 0; k < letters.length; k++) {
          if (letters[k] === " ") continue;
          if (typed[k] == null) return k;
        }
        return -1;
      }
      function press(ch) {
        const idx = nextIdx();
        if (idx < 0) return;
        if (letters[idx] === ch) {
          typed[idx] = ch;
          slotEls[idx].textContent = ch;
          slotEls[idx].className = "slot filled ok";
          E.sfx.tick();
          if (nextIdx() < 0) win();
        } else {
          mistakes++;
          E.sfx.wrong();
          slotEls[idx].className = "slot bad";
          setTimeout(() => {
            slotEls[idx].className = "slot" + (letters[idx] === " " ? " space" : "");
          }, 400);
          if (mistakes === 2) showHint();
        }
      }
      function undo() {
        for (let k = letters.length - 1; k >= 0; k--) {
          if (typed[k] != null) {
            typed[k] = null;
            slotEls[k].textContent = "";
            slotEls[k].className = "slot";
            E.sfx.tick();
            return;
          }
        }
      }
      function showHint() {
        hintLevel++;
        if (hintLevel === 1 && word.syl) {
          hint.textContent = "🧩 " + word.syl;
          E.speakEn(word.syl.replace(/-/g, " "), { slow: true });
        } else if (hintLevel === 2) {
          hint.textContent = "🔤 It starts with “" + target[0].toUpperCase() + "”";
          E.speakEn("It starts with " + target[0].toUpperCase());
        } else if (word.s) {
          hint.textContent = "💬 " + word.s;
          E.speakEn(word.s);
        }
      }
      function reveal() {
        letters.forEach((ch, k) => {
          typed[k] = ch;
          if (ch !== " ") { slotEls[k].textContent = ch; slotEls[k].className = "slot filled"; }
        });
        hint.textContent = "The word is “" + word.w + "”";
        E.speakEn(word.w, { slow: true });
        setTimeout(() => { i++; step(); }, 2000);
      }
      function win() {
        score++;
        if (mistakes === 0) firstTry++;
        E.sfx.correct();
        E.confetti(14);
        E.toast(mistakes === 0 ? "Perfect spelling! 🌟" : "You got it! 👏", "ok");
        if (word.s) {
          E.speakEn(word.w, { then: () => E.speakEn(word.s) });
          hint.textContent = "💬 " + word.s;
        } else E.speakEn(word.w);
        setTimeout(() => { i++; step(); }, 2300);
      }

      /* say it as soon as the card appears */
      setTimeout(() => E.speakEn(word.w), 260);
    }
    step();
  }

  /* -------------------------------------------------------- LISTEN GAME */
  function listenGame() {
    const pool = ENGLISH.allWords();
    let i = 0, score = 0;
    const total = 10;
    const m = E.page({ title: "🎧 Listen & Pick", subtitle: "Which word is it?", subject: S });
    const bar = E.progressBar();
    m.appendChild(bar.node);
    const host = E.el("div");
    m.appendChild(host);

    function step() {
      bar.set(i, total);
      if (i >= total) {
        host.innerHTML = "";
        E.finishCard(host, {
          score, total, note: "Great listening! 👂",
          again() { i = 0; score = 0; step(); }
        });
        return;
      }
      const right = E.shuffle(pool)[0];
      const opts = E.shuffle([right].concat(E.sample(pool, 3, right)));
      host.innerHTML = "";
      const card = E.el("div", "card qbox");
      card.appendChild(E.el("p", "qprompt", "Tap the word you hear"));
      card.appendChild(E.el("div", "qbig en", "🔊"));
      const hr = E.el("div", "row");
      hr.appendChild(E.btn("🔊 Hear again", "btn", () => E.speakEn(right.w, { slow: true })));
      card.appendChild(hr);

      const o = E.el("div", "opts");
      let answered = false;
      opts.forEach(w => {
        const b = E.btn("", "opt", (ev, btn) => {
          if (answered) return;
          answered = true;
          if (w === right) { btn.classList.add("right"); E.sfx.correct(); score++; E.toast(E.praise(), "ok"); }
          else {
            btn.classList.add("wrong"); E.sfx.wrong();
            [...o.children].forEach((c, idx) => { if (opts[idx] === right) c.classList.add("right"); });
          }
          E.speakEn(right.w);
          setTimeout(() => { i++; step(); }, 1200);
        });
        b.innerHTML = "";
        b.style.fontSize = "20px";
        b.appendChild(document.createTextNode(w.w));
        b.appendChild(E.el("small", null, w.e || ""));
        o.appendChild(b);
      });
      card.appendChild(o);
      host.appendChild(card);
      E.speakEn(right.w, { slow: true });
    }
    step();
  }

  /* ------------------------------------------------------- READING ROOM */
  function readingRoom() {
    const m = E.page({ title: "📖 Reading", subtitle: "Read out loud", subject: S });

    const c1 = E.el("div", "card");
    c1.appendChild(E.el("h2", null, "Sentences"));
    const t1 = E.el("div", "tiles");
    ENGLISH.reading.forEach(lv => {
      t1.appendChild(tile(lv.emoji, lv.title.split("·")[0].trim(),
        lv.title.split("·")[1] ? lv.title.split("·")[1].trim() : "",
        () => E.go(() => sentenceReader(lv))));
    });
    c1.appendChild(t1);
    m.appendChild(c1);

    const c2 = E.el("div", "card");
    c2.appendChild(E.el("h2", null, "Little Stories"));
    const t2 = E.el("div", "tiles");
    ENGLISH.passages.forEach(p => {
      t2.appendChild(tile(p.emoji, p.title, p.lines.length + " lines",
        () => E.go(() => passageReader(p))));
    });
    c2.appendChild(t2);
    m.appendChild(c2);
  }

  function sentenceNode(sentence) {
    const p = E.el("p", "sentence en");
    sentence.split(/(\s+)/).forEach(tok => {
      if (!tok.trim()) { p.appendChild(document.createTextNode(tok)); return; }
      const w = document.createElement("w");
      w.textContent = tok;
      w.addEventListener("click", () => {
        E.sfx.tick();
        E.speakEn(tok.replace(/[.,!?]/g, ""), { slow: true });
        w.classList.add("lit"); setTimeout(() => w.classList.remove("lit"), 500);
      });
      p.appendChild(w);
    });
    return p;
  }

  function sentenceReader(lv) {
    let i = 0;
    const m = E.page({ title: lv.title, subtitle: "Tap any word to hear it", subject: S });
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
          note: "You read them all! 📖",
          again() { i = 0; step(); }
        });
        return;
      }
      const it = lv.items[i];
      host.innerHTML = "";
      const card = E.el("div", "card sentcard");
      card.appendChild(E.el("div", "bigemoji", it.e || "📖"));
      card.appendChild(sentenceNode(it.s));
      const row = E.el("div", "row");
      row.appendChild(E.btn("🔊 Read to me", "btn primary", () => E.speakEn(it.s, { slow: true })));
      row.appendChild(E.micBtn(it.s, E.cfg.langEnglish));
      card.appendChild(row);
      const nav = E.el("div", "row");
      nav.appendChild(E.btn("➡️ Next", "btn wide", () => { i++; step(); }));
      card.appendChild(nav);
      host.appendChild(card);
    }
    step();
  }

  function passageReader(p) {
    const m = E.page({ title: p.emoji + " " + p.title, subtitle: "Read the story", subject: S });
    const card = E.el("div", "card sentcard");
    card.appendChild(E.el("div", "bigemoji", p.emoji));
    p.lines.forEach(l => card.appendChild(sentenceNode(l)));
    m.appendChild(card);
    const row = E.el("div", "row");
    row.appendChild(E.btn("▶️ Read the whole story", "btn primary wide", () =>
      E.speakSeq(p.lines, { lang: E.cfg.langEnglish, slow: true, gap: 420 })));
    m.appendChild(row);
    m.appendChild(E.btn("⭐ I read it!", "btn wide", () => E.celebrate("Beautiful reading! 📖", 3)));
  }

  window.EnglishScreens = { home };
})();
