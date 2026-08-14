/* ============================================================================
   Myra Learns — MATHS screens
   Tables 1–15 · column +, −, ×, ÷ (carry & borrow shown) · mental-maths speed
   ========================================================================== */
(function () {
  "use strict";
  const S = "maths";

  function tile(ic, title, sub, fn, done) {
    const b = E.btn("", "tile" + (done ? " done" : ""), fn);
    b.innerHTML = "";
    b.appendChild(E.el("span", "ic", ic));
    b.appendChild(E.el("b", null, title));
    if (sub) b.appendChild(E.el("small", null, sub));
    return b;
  }

  /* ------------------------------------------------------------ MATHS HOME */
  function home() {
    const m = E.page({ title: "Maths", subtitle: "Tables · Sums · Brain Speed", subject: S });

    const bestSpeed = E.best("m-speed");
    const intro = E.el("div", "card");
    intro.appendChild(E.el("h2", null, "🔢 What shall we practise?"));
    intro.appendChild(E.el("p", null, bestSpeed
      ? "Your Brain Speed record is " + bestSpeed + " correct in 60 seconds. Can you beat it?"
      : "Try Brain Speed — how many sums can you do in 60 seconds?"));
    m.appendChild(intro);

    const t = E.el("div", "tiles");
    t.appendChild(tile("✖️", "Tables", "1 to 15", () => E.go(tableList)));
    t.appendChild(tile("➕", "Addition", "with carry", () => E.go(() => columnPractice("add"))));
    t.appendChild(tile("➖", "Subtraction", "with borrow", () => E.go(() => columnPractice("sub"))));
    t.appendChild(tile("✳️", "Multiply", "2-digit × 1", () => E.go(() => columnPractice("mul"))));
    t.appendChild(tile("➗", "Divide", "no remainder", () => E.go(() => columnPractice("div"))));
    t.appendChild(tile("⚡", "Brain Speed", "60 seconds", () => E.go(speedHome)));
    t.appendChild(tile("🔥", "RapidFire100", "Race to 100!", () => E.go(rapidFireHome)));
    m.appendChild(t);
    return m;
  }

  /* --------------------------------------------------------------- TABLES */
  function tableList() {
    const m = E.page({ title: "✖️ Tables", subtitle: "Tap a table to learn", subject: S });
    const grid = E.el("div", "tablegrid");
    for (let n = 1; n <= MATHS.tablesUpTo; n++) {
      const done = E.isDone("m-tab-" + n);
      const b = E.btn(String(n), "tbtn" + (done ? " done" : ""), () => E.go(() => tableView(n)));
      grid.appendChild(b);
    }
    m.appendChild(grid);
    m.appendChild(E.btn("🎯 Mixed Table Quiz", "btn primary wide", () => E.go(() => tableQuiz(null))));
  }

  function tableView(n) {
    const m = E.page({ title: "Table of " + n, subtitle: "Tap a line to hear it", subject: S });

    const trick = E.el("div", "card strategy");
    trick.appendChild(E.el("h3", null, "💡 Trick for " + n));
    trick.appendChild(E.el("p", null, MATHS.tricks[n] || ""));
    m.appendChild(trick);

    const rows = MATHS.tableRows(n, MATHS.rowsPerTable);
    const list = E.el("div", "tablelist");
    rows.forEach(r => {
      const row = E.el("div", "trow");
      row.innerHTML = "<span>" + r.a + " × " + r.b + "</span><span>= <b>" + r.ans + "</b></span>";
      row.addEventListener("click", () => {
        E.sfx.tick();
        E.speakEn(MATHS.chant(r.a, r.b));
        row.classList.add("lit"); setTimeout(() => row.classList.remove("lit"), 600);
      });
      list.appendChild(row);
    });
    const card = E.el("div", "card");
    card.appendChild(list);
    m.appendChild(card);

    const row = E.el("div", "row");
    row.appendChild(E.btn("▶️ Chant the table", "btn primary", () => {
      const items = rows.map(r => MATHS.chant(r.a, r.b));
      let k = 0;
      const nodes = list.children;
      E.speakSeq(items.map((tx, idx) => ({
        text: tx,
        gap: 200
      })), { lang: E.cfg.langEnglish, rate: 0.88 });
      // highlight along with the chant
      const timer = setInterval(() => {
        [...nodes].forEach(nd => nd.classList.remove("lit"));
        if (k < nodes.length) nodes[k].classList.add("lit");
        k++;
        if (k > nodes.length) { clearInterval(timer); [...nodes].forEach(nd => nd.classList.remove("lit")); }
      }, 1450);
    }));
    row.appendChild(E.btn("🎯 Quiz me", "btn", () => E.go(() => tableQuiz(n))));
    m.appendChild(row);

    m.appendChild(E.btn("✅ I know this table!", "btn wide", () => {
      E.markDone("m-tab-" + n);
      E.celebrate("Table of " + n + " done! ⭐", 3);
      setTimeout(() => E.back(), 900);
    }));
  }

  /* Quiz on one table, or mixed across all 15 */
  function tableQuiz(n) {
    const total = 10;
    let i = 0, score = 0;
    const m = E.page({
      title: n ? "🎯 Table of " + n : "🎯 Mixed Tables",
      subtitle: "Pick the right answer", subject: S
    });
    const bar = E.progressBar();
    m.appendChild(bar.node);
    const host = E.el("div");
    m.appendChild(host);

    function step() {
      bar.set(i, total);
      if (i >= total) {
        host.innerHTML = "";
        E.finishCard(host, {
          score, total, note: score === total ? "Every one correct! 🏆" : "Practice makes perfect!",
          again() { i = 0; score = 0; step(); }
        });
        return;
      }
      const a = n || MATHS.ri(2, MATHS.tablesUpTo);
      const b = MATHS.ri(1, 10);
      const ans = a * b;
      const wrongs = new Set();
      while (wrongs.size < 3) {
        const cand = ans + MATHS.pick([-a, a, -1, 1, 2 * a, -2 * a, a + 1]);
        if (cand > 0 && cand !== ans) wrongs.add(cand);
      }
      const opts = E.shuffle([ans].concat([...wrongs]));

      host.innerHTML = "";
      const card = E.el("div", "card qbox");
      card.appendChild(E.el("p", "qprompt", "What is"));
      card.appendChild(E.el("div", "qbig en", a + " × " + b));
      const o = E.el("div", "opts");
      let answered = false;
      opts.forEach(v => {
        const btn = E.btn(String(v), "opt", (ev, bt) => {
          if (answered) return;
          answered = true;
          if (v === ans) { bt.classList.add("right"); E.sfx.correct(); score++; E.toast(E.praise(), "ok"); }
          else {
            bt.classList.add("wrong"); E.sfx.wrong();
            [...o.children].forEach((c, idx) => { if (opts[idx] === ans) c.classList.add("right"); });
          }
          E.speakEn(MATHS.chant(a, b));
          setTimeout(() => { i++; step(); }, 1250);
        });
        o.appendChild(btn);
      });
      card.appendChild(o);
      host.appendChild(card);
      E.speakEn(a + " times " + b);
    }
    step();
  }

  /* ------------------------------------------------- COLUMN ARITHMETIC */
  const MODES = {
    add: { title: "➕ Addition", sub: "2-digit + 2-digit (with carry)", make: () => MATHS.gen.add({ carry: true }) },
    sub: { title: "➖ Subtraction", sub: "2-digit − 2-digit (with borrow)", make: () => MATHS.gen.sub({ borrow: true }) },
    mul: { title: "✳️ Multiplication", sub: "2-digit × 1-digit", make: () => MATHS.gen.mul() },
    div: { title: "➗ Division", sub: "2-digit ÷ 1-digit, no remainder", make: () => MATHS.gen.div() }
  };

  function columnPractice(mode) {
    const cfg = MODES[mode];
    const total = 10;
    let i = 0, score = 0;
    const m = E.page({ title: cfg.title, subtitle: cfg.sub, subject: S });
    const bar = E.progressBar();
    m.appendChild(bar.node);
    const host = E.el("div");
    m.appendChild(host);

    function step() {
      bar.set(i, total);
      if (i >= total) {
        host.innerHTML = "";
        E.finishCard(host, {
          score, total, note: "You solved " + score + " sums! 🧮",
          again() { i = 0; score = 0; step(); }
        });
        return;
      }
      renderSum(cfg.make());
    }

    function renderSum(q) {
      host.innerHTML = "";
      let typed = "";
      let tries = 0;
      const card = E.el("div", "card qbox");

      /* The sum written in a proper column, like in her notebook */
      const sum = E.el("div", "sum");
      const carryLine = E.el("span", "carry", "");
      sum.appendChild(carryLine);
      sum.appendChild(document.createTextNode(String(q.a)));
      sum.appendChild(E.el("br"));
      const opLine = E.el("div");
      opLine.innerHTML = "<span class='op'>" + q.op + "</span>" + q.b;
      sum.appendChild(opLine);
      sum.appendChild(E.el("hr"));
      const ansLine = E.el("div", "ansrow", "?");
      sum.appendChild(ansLine);
      card.appendChild(sum);

      /* answer box + number pad */
      const box = E.el("div", "answerbox", "");
      card.appendChild(box);

      const pad = E.el("div", "numpad");
      ["1","2","3","4","5","6","7","8","9","⌫","0","✓"].forEach(k => {
        const b = E.btn(k, "key" + (k === "✓" ? " act" : ""), () => {
          if (k === "⌫") { typed = typed.slice(0, -1); }
          else if (k === "✓") { check(); return; }
          else if (typed.length < 4) { typed += k; }
          box.textContent = typed;
          box.className = "answerbox";
          if (typed.length && Number(typed) === q.ans) check();
        });
        pad.appendChild(b);
      });
      card.appendChild(pad);

      const help = E.el("div", "row");
      help.appendChild(E.btn("🔊 Read it", "btn", () =>
        E.speakEn(q.a + " " + opWord(q.op) + " " + q.b)));
      help.appendChild(E.btn("💡 Show me how", "btn", () => showSteps(q, card)));
      card.appendChild(help);
      host.appendChild(card);

      function check() {
        if (!typed.length) return;
        if (Number(typed) === q.ans) {
          box.className = "answerbox ok";
          ansLine.textContent = q.ans;
          if (q.carry) carryLine.textContent = "1";
          E.sfx.correct(); E.confetti(12);
          if (tries === 0) score++; else score += 0.5;
          E.toast(tries === 0 ? "Correct! 🌟" : "Got it! 👏", "ok");
          E.speakEn(String(q.ans));
          setTimeout(() => { i++; step(); }, 1200);
        } else {
          tries++;
          box.className = "answerbox bad";
          E.sfx.wrong();
          if (tries >= 2) showSteps(q, card);
          else E.toast("Not quite — try once more 💛");
          setTimeout(() => { typed = ""; box.textContent = ""; box.className = "answerbox"; }, 700);
        }
      }
    }

    function opWord(op) {
      return op === "+" ? "plus" : op === "−" ? "minus" : op === "×" ? "times" : "divided by";
    }

    function showSteps(q, card) {
      if (card.querySelector(".strategy")) return;
      const box = E.el("div", "card strategy");
      box.appendChild(E.el("h3", null, "💡 Step by step"));
      const steps = MATHS.explain(q);
      steps.forEach(s => box.appendChild(E.el("p", "step", s)));
      card.appendChild(box);
      E.speakSeq(steps, { lang: E.cfg.langEnglish, rate: 0.86, gap: 320 });
    }

    step();
  }

  /* ---------------------------------------------------------- BRAIN SPEED */
  function speedHome() {
    const m = E.page({ title: "⚡ Brain Speed", subtitle: "Adding in your head", subject: S });

    const c = E.el("div", "card");
    c.appendChild(E.el("h2", null, "🧠 Learn the tricks first"));
    c.appendChild(E.el("p", null, "Each trick makes adding in your head much faster."));
    const t = E.el("div", "tiles");
    MATHS.strategies.forEach(st => {
      t.appendChild(tile(st.emoji, st.name, "", () => E.go(() => strategyLesson(st)),
        E.isDone("m-str-" + st.id)));
    });
    c.appendChild(t);
    m.appendChild(c);

    const g = E.el("div", "card qbox");
    g.appendChild(E.el("h2", null, "⏱️ 60-Second Challenge"));
    const bestN = E.best("m-speed");
    g.appendChild(E.el("p", null, bestN ? "Your record: " + bestN + " correct 🏆" : "How many can you do?"));
    g.appendChild(E.btn("🚀 Easy (small numbers)", "btn wide", () => E.go(() => speedRun(1))));
    g.appendChild(E.btn("🔥 Challenge (bigger)", "btn primary wide", () => E.go(() => speedRun(2))));
    m.appendChild(g);
  }

  function strategyLesson(st) {
    let ex = st.make();
    const m = E.page({ title: st.emoji + " " + st.name, subtitle: "A quick trick", subject: S });

    const idea = E.el("div", "card strategy");
    idea.appendChild(E.el("h3", null, "The idea"));
    idea.appendChild(E.el("p", null, st.idea));
    m.appendChild(idea);

    const host = E.el("div");
    m.appendChild(host);

    function show() {
      host.innerHTML = "";
      const card = E.el("div", "card qbox");
      card.appendChild(E.el("div", "qbig en", ex.a + " + " + ex.b));
      const stepBox = E.el("div");
      card.appendChild(stepBox);

      let revealed = 0;
      const revealBtn = E.btn("👀 Show me step 1", "btn primary wide", (ev, b) => {
        if (revealed >= ex.steps.length) return;
        const line = ex.steps[revealed];
        stepBox.appendChild(E.el("p", "step", line));
        E.speakEn(line.replace(/🎉/g, ""), { rate: 0.88 });
        revealed++;
        b.textContent = revealed < ex.steps.length
          ? "👀 Show me step " + (revealed + 1) : "🎉 That's the answer!";
        if (revealed === ex.steps.length) { E.sfx.win(); E.confetti(12); }
      });
      card.appendChild(revealBtn);

      const row = E.el("div", "row");
      row.appendChild(E.btn("🔁 Another example", "btn", () => { ex = st.make(); show(); }));
      row.appendChild(E.btn("✅ Got it!", "btn primary", () => {
        E.markDone("m-str-" + st.id);
        E.celebrate("Nice trick learnt! 🪄", 2);
        setTimeout(() => E.back(), 800);
      }));
      card.appendChild(row);
      host.appendChild(card);
    }
    show();
  }

  /* 60-second head-addition sprint */
  function speedRun(level) {
    const SECONDS = 60;
    let score = 0, attempts = 0, streak = 0, bestStreak = 0;
    let left = SECONDS, timer = null, q = null, typed = "";

    const m = E.page({ title: "⚡ 60 Seconds", subtitle: level === 1 ? "Easy" : "Challenge", subject: S });

    const tb = E.el("div", "timerbar");
    const tfill = E.el("i");
    tb.appendChild(tfill);
    m.appendChild(tb);

    const stats = E.el("div", "stat");
    const sScore = E.el("span", null, "✅ 0");
    const sTime = E.el("span", null, "⏱️ " + SECONDS);
    const sStreak = E.el("span", null, "🔥 0");
    stats.appendChild(sScore); stats.appendChild(sTime); stats.appendChild(sStreak);
    m.appendChild(stats);

    const host = E.el("div");
    m.appendChild(host);

    const card = E.el("div", "card qbox");
    const big = E.el("div", "qbig en", "");
    const box = E.el("div", "answerbox", "");
    card.appendChild(big);
    card.appendChild(box);
    const pad = E.el("div", "numpad");
    ["1","2","3","4","5","6","7","8","9","⌫","0","✓"].forEach(k => {
      pad.appendChild(E.btn(k, "key" + (k === "✓" ? " act" : ""), () => {
        if (!q) return;
        if (k === "⌫") typed = typed.slice(0, -1);
        else if (k === "✓") { submit(); return; }
        else if (typed.length < 4) typed += k;
        box.textContent = typed;
        box.className = "answerbox";
        /* auto-submit as soon as the digits can only be the answer */
        if (typed.length >= String(q.ans).length) submit();
      }));
    });
    card.appendChild(pad);
    host.appendChild(card);

    function next() {
      q = MATHS.quickSum(level);
      typed = "";
      box.textContent = "";
      box.className = "answerbox";
      big.textContent = q.a + " + " + q.b;
    }
    function submit() {
      if (!typed.length || !q) return;
      attempts++;
      if (Number(typed) === q.ans) {
        score++; streak++; bestStreak = Math.max(bestStreak, streak);
        E.sfx.correct();
        box.className = "answerbox ok";
        if (streak && streak % 5 === 0) { E.confetti(10); E.toast(streak + " in a row! 🔥", "ok"); }
      } else {
        streak = 0;
        E.sfx.wrong();
        box.className = "answerbox bad";
        box.textContent = typed + " → " + q.ans;
      }
      sScore.textContent = "✅ " + score;
      sStreak.textContent = "🔥 " + streak;
      setTimeout(next, 380);
    }
    function tick() {
      left--;
      sTime.textContent = "⏱️ " + left;
      tfill.style.width = (left / SECONDS * 100) + "%";
      if (left <= 0) finish();
    }
    function finish() {
      clearInterval(timer);
      q = null;
      host.innerHTML = "";
      const prev = E.best("m-speed");
      E.best("m-speed", score);
      const beat = score > prev;
      E.finishCard(host, {
        score, total: attempts || score,
        note: (beat ? "🏆 NEW RECORD! " : "Best streak: " + bestStreak + " 🔥 ") +
              "You did " + score + " sums in 60 seconds.",
        again() { E.replace(() => speedRun(level)); }
      });
    }

    tfill.style.width = "100%";
    next();
    timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------ RAPIDFIRE100 */
  /* Chain-addition sprint: each answer becomes the next problem's first number
     (1+3=4, then 4+6=10, then 10+7=17…) until the running total hits exactly 100.
     A wrong answer never advances — she must get it right to keep going.
     Best time (lower is better) is tracked separately from the "higher wins" best(). */
  function fmtRfTime(sec) {
    if (sec == null) return "—";
    if (sec < 60) return sec.toFixed(1) + "s";
    const mm = Math.floor(sec / 60);
    return mm + "m " + (sec - mm * 60).toFixed(1) + "s";
  }
  function rfBestTime(newSeconds) {
    const KEY = "m-rapidfire100-time";
    const cur = E.state.best[KEY];
    if (newSeconds != null && (cur == null || newSeconds < cur)) {
      E.state.best[KEY] = newSeconds;
      E.save();
      return { value: newSeconds, isNew: true };
    }
    return { value: cur, isNew: false };
  }
  function pickNextAddend(total) {
    return Math.min(MATHS.ri(1, 9), 100 - total);
  }

  function rapidFireHome() {
    const m = E.page({ title: "🔥 RapidFire100", subtitle: "Add your way to 100!", subject: S });

    const c = E.el("div", "card qbox");
    c.appendChild(E.el("h2", null, "🎯 How to play"));
    c.appendChild(E.el("p", null,
      "I'll show two numbers, like <b>1 + 3</b>. Type the answer — <b>4</b>. " +
      "Then I add a new number to YOUR answer — <b>4 + 6</b> — and you type that answer too. " +
      "Keep going until you reach exactly <b>100</b>! If an answer is wrong, it won't move on — " +
      "just try again. How fast can you reach 100?"));
    const best = rfBestTime();
    c.appendChild(E.el("p", null, best.value != null
      ? "🏆 Your best time: <b>" + fmtRfTime(best.value) + "</b>. Can you beat it?"
      : "This is your first try — go for it!"));
    m.appendChild(c);

    m.appendChild(E.btn("🔥 Start!", "btn primary wide", () => E.go(rapidFireRun)));
  }

  function rapidFireRun() {
    let total = 0, a = 0, b = 0, typed = "", tries = 0;
    let timer = null;
    const startedAt = Date.now();

    const m = E.page({ title: "🔥 RapidFire100", subtitle: "Keep adding — don't stop!", subject: S });

    const bar = E.progressBar();
    m.appendChild(bar.node);

    const stats = E.el("div", "stat");
    const sTime = E.el("span", null, "⏱️ 0.0s");
    const sGoal = E.el("span", null, "🎯 0 / 100");
    stats.appendChild(sTime); stats.appendChild(sGoal);
    m.appendChild(stats);

    const host = E.el("div");
    m.appendChild(host);

    function nextProblem() {
      if (total === 0) { a = MATHS.ri(1, 5); b = MATHS.ri(1, 5); }
      else { a = total; b = pickNextAddend(total); }
      typed = ""; tries = 0;
      render();
    }

    function render() {
      host.innerHTML = "";
      const card = E.el("div", "card qbox");
      card.appendChild(E.el("div", "qbig en", a + " + " + b));
      const box = E.el("div", "answerbox", "");
      card.appendChild(box);

      const pad = E.el("div", "numpad");
      ["1","2","3","4","5","6","7","8","9","⌫","0","✓"].forEach(k => {
        pad.appendChild(E.btn(k, "key" + (k === "✓" ? " act" : ""), () => {
          if (k === "⌫") typed = typed.slice(0, -1);
          else if (k === "✓") { submit(box); return; }
          else if (typed.length < 3) typed += k;
          box.textContent = typed;
          box.className = "answerbox";
          if (typed.length && typed.length >= String(a + b).length) submit(box);
        }));
      });
      card.appendChild(pad);
      host.appendChild(card);
    }

    function submit(box) {
      if (!typed.length) return;
      const ans = a + b;
      if (Number(typed) === ans) {
        box.className = "answerbox ok";
        E.sfx.correct();
        total = ans;
        sGoal.textContent = "🎯 " + total + " / 100";
        bar.set(total, 100);
        if (total >= 100) setTimeout(finish, 500);
        else setTimeout(nextProblem, 450);
      } else {
        tries++;
        box.className = "answerbox bad";
        E.sfx.wrong();
        E.toast(tries >= 2 ? "🤔 Hint: count on from " + a + "!" : "Not quite — try again! 💪");
        setTimeout(() => { typed = ""; box.textContent = ""; box.className = "answerbox"; }, 700);
      }
    }

    function tick() {
      if (!document.body.contains(m)) { clearInterval(timer); return; }
      const elapsed = (Date.now() - startedAt) / 1000;
      sTime.textContent = "⏱️ " + elapsed.toFixed(1) + "s";
    }

    function finish() {
      clearInterval(timer);
      host.innerHTML = "";
      const seconds = (Date.now() - startedAt) / 1000;
      const rec = rfBestTime(seconds);

      let emoji, msg;
      if (seconds < 30)      { emoji = "🚀"; msg = "Lightning fast!"; }
      else if (seconds < 60) { emoji = "🔥"; msg = "Super speedy!"; }
      else if (seconds < 120){ emoji = "🌟"; msg = "Great job!"; }
      else                   { emoji = "💪"; msg = "You did it!"; }

      const card = E.el("div", "card finish");
      card.appendChild(E.el("div", "bigemoji", emoji));
      card.appendChild(E.el("h2", null, msg));
      card.appendChild(E.el("p", "score", fmtRfTime(seconds)));
      card.appendChild(E.el("p", "note", rec.isNew
        ? "🏆 New best time!"
        : "⭐ Best time: " + fmtRfTime(rec.value)));
      const row = E.el("div", "row");
      row.appendChild(E.btn("🔁 Play again", "btn primary", () => E.replace(rapidFireRun)));
      row.appendChild(E.btn("← Back", "btn", () => E.back()));
      card.appendChild(row);
      host.appendChild(card);

      E.celebrate(rec.isNew ? "New record, " + E.cfg.child.name + "! 🏆" : E.praise(), 5);
      E.touchStreak();
    }

    nextProblem();
    timer = setInterval(tick, 100);
  }

  window.MathsScreens = { home, fmtRfTime };
})();
