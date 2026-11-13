/* Table Quest: ten-fact missions, gentle correction, and accuracy-first speed. */
(function () {
  "use strict";
  const allFacts = () => MATHS.questPool(1, MATHS.tablesUpTo);
  const history = () => E.state.tableQuestFacts || {};
  const timeKey = (lo, hi) => "m-tablequest-" + lo + "-" + hi + "-10-time";

  function summary() {
    const facts = allFacts(), saved = history();
    return {
      tried: facts.filter(q => typeof saved[q.id] === "boolean").length,
      confident: facts.filter(q => saved[q.id] === true).length,
      missed: facts.filter(q => saved[q.id] === false).length
    };
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) { E.toast("Audio is unavailable here. A grown-up can read with you."); return; }
    E.speakEn(text, { slow: true });
  }

  function home(table) {
    const m = E.page({ title: "🚀 Table Quest", subtitle: "Tables 1–20 · multipliers 1–10", subject: "maths" });
    m.classList.add("table-quest");
    const intro = E.el("div", "card");
    intro.append(E.el("h2", null, "Fuel your maths rocket!"),
      E.el("p", null, "Collect ten fuel stars by solving facts. Learn a shortcut, find a missing number, and swap the numbers!"),
      E.el("p", "note", "First learn accurately; speed comes with practice. There is no countdown and no lost stars."));
    m.appendChild(intro);
    const config = E.el("div", "card");
    const label = E.el("label", "hintline", "Choose your tables");
    const select = E.el("select", "btn wide");
    select.id = "quest-range"; label.htmlFor = select.id;
    const ranges = [[1, 5], [6, 10], [11, 15], [16, 20], [15, 20], [1, 20]];
    ranges.forEach(([lo, hi]) => {
      const opt = E.el("option", null, "Tables " + lo + "–" + hi);
      opt.value = lo + ":" + hi; select.appendChild(opt);
    });
    for (let n = 1; n <= MATHS.tablesUpTo; n++) {
      const opt = E.el("option", null, "Table of " + n);
      opt.value = n + ":" + n; select.appendChild(opt);
    }
    select.value = table ? table + ":" + table : "1:5";
    const progress = E.el("p", "hintline");
    const best = E.el("p", "note");
    const controls = E.el("div", "row");
    const range = () => select.value.split(":").map(Number);
    function launch(mode) {
      const [lo, hi] = range();
      const pool = MATHS.questPool(lo, hi), saved = history();
      let chosen;
      if (mode === "rescue") chosen = E.shuffle(pool.filter(q => saved[q.id] === false)).slice(0, 10);
      else if (mode === "learn") {
        const missed = E.shuffle(pool.filter(q => saved[q.id] === false)).slice(0, 4);
        const rest = E.shuffle(pool.filter(q => !missed.some(m => m.id === q.id)));
        // Prefer unseen facts, then revisit known facts; no duplicates in a mission.
        rest.sort((a, b) => Number(saved[a.id] != null) - Number(saved[b.id] != null));
        chosen = E.shuffle(missed.concat(rest.slice(0, 10 - missed.length)));
      } else chosen = E.shuffle(pool).slice(0, 10);
      if (!chosen.length) { E.toast("No facts need rescuing in these tables!"); return; }
      E.go(() => run(mode, chosen, lo, hi));
    }
    controls.append(E.btn("🌟 Learn & play", "btn primary", () => launch("learn")),
      E.btn("⚡ Speed flight", "btn", () => launch("speed")));
    const rescue = E.btn("💛 Rescue tricky facts", "btn", () => launch("rescue"));
    controls.appendChild(rescue);
    config.append(label, select, progress, best, controls,
      E.el("p", "note", "Learn & play mixes answers, missing multipliers and swapped facts. Rescue revisits missed or hinted facts. " +
        "Speed flight uses a number pad: type, then Check. It times answering only, not reading feedback. " +
        "Only ten first-try answers without hints set a time record. Each table selection has its own record."));
    m.appendChild(config);
    const map = E.el("div", "card");
    map.append(E.el("h2", null, "Your table constellation"),
      E.el("p", "note", "Each table has 10 facts. Counts show latest unassisted first-try answers, not permanent mastery. Tap a table to select it."));
    const grid = E.el("div", "tablegrid");
    for (let n = 1; n <= MATHS.tablesUpTo; n++) {
      const count = MATHS.questPool(n, n).filter(q => history()[q.id] === true).length;
      const b = E.btn("", "btn quest-star", () => {
        select.value = n + ":" + n; update(); select.focus(); select.scrollIntoView({ block: "center" });
      });
      b.append(E.el("b", null, String(n)), E.el("small", null, count + "/10" + (count === 10 ? " ⭐" : "")));
      b.setAttribute("aria-label", "Table " + n + ", " + count + " of 10 facts");
      grid.appendChild(b);
    }
    map.appendChild(grid); m.appendChild(map);
    m.appendChild(E.el("p", "footnote", "Progress saves when a mission finishes. Leaving early discards that mission. Existing table ticks and RapidFire records stay separate."));
    function update() {
      const [lo, hi] = range(), pool = MATHS.questPool(lo, hi);
      const saved = history(), missed = pool.filter(q => saved[q.id] === false).length;
      progress.textContent = pool.filter(q => saved[q.id] === true).length + "/" + pool.length +
        " facts correct lately · " + missed + " to revisit";
      rescue.disabled = missed === 0;
      const record = E.state.best[timeKey(lo, hi)];
      best.textContent = record == null ? "Speed flight: your first clean record awaits!" :
        "Best clean flight: " + record.toFixed(1) + "s answering time.";
    }
    select.addEventListener("change", update);
    update();
  }

  function run(mode, facts, lo, hi) {
    const speed = mode === "speed";
    const m = E.page({ title: "🚀 " + (speed ? "Speed flight" : mode === "rescue" ? "Rescue mission" : "Learn & play"),
      subtitle: "Tables " + lo + "–" + hi, subject: "maths" });
    m.classList.add("table-quest");
    const bar = E.progressBar(); m.appendChild(bar.node);
    const status = E.el("p", "hintline");
    status.setAttribute("role", "status"); m.appendChild(status);
    const host = E.el("div"); m.appendChild(host);
    const results = [];
    let index = 0, streak = 0, topStreak = 0, elapsed = 0, finished = false;
    let answering = false, started = 0;
    const clock = E.el("p", "note");
    if (speed) m.insertBefore(clock, host);
    let timer = null;
    function tick() {
      if (!m.isConnected || finished) { clearInterval(timer); return; }
      clock.textContent = "⏱ " + ((elapsed + (answering ? performance.now() - started : 0)) / 1000).toFixed(1) +
        "s answering time · no time limit";
    }
    function step() {
      E.stopSpeak(); host.replaceChildren();
      const fact = facts[index];
      const kind = speed ? "product" : ["product", "missing", "swap"][index % 3];
      const q = MATHS.questQuestion(fact, kind);
      let solved = false, helped = false, mistakes = 0, advanced = false, typed = "";
      status.textContent = "🚀 Fuel " + index + "/" + facts.length + " · First-try streak: " + streak;
      bar.set(index, facts.length);
      const card = E.el("div", "card qbox");
      card.dataset.fact = fact.id; card.dataset.kind = kind;
      const heading = E.el("h2", "qprompt", kind === "missing" ? "Find the missing multiplier!" :
        kind === "swap" ? "Flip it! Same pair, same answer." : "Power your rocket!");
      heading.tabIndex = -1;
      card.append(heading, E.el("div", "qbig en", q.prompt));
      const buttons = E.el("div", "row");
      buttons.appendChild(E.btn("🔊 Hear question", "btn", () => speak(q.speech)));
      const feedback = E.el("div"); feedback.setAttribute("role", "status");
      const hint = E.btn("💡 Show a shortcut", "btn", () => {
        if (solved || !m.isConnected) return;
        helped = true;
        feedback.textContent = MATHS.questHint(fact) + (kind === "swap" ? " Swapping the two factors gives the same product." : "");
        speak(feedback.textContent);
      });
      buttons.appendChild(hint); card.appendChild(buttons);
      const answerArea = E.el("div", speed ? "numpad" : "opts");
      const box = E.el("div", "answerbox");
      box.setAttribute("aria-label", "Your answer"); box.setAttribute("role", "status");
      const next = E.btn(index === facts.length - 1 ? "Land & see results" : "Next planet →", "btn primary wide", () => {
        if (!solved || advanced || !m.isConnected) return;
        advanced = true; index++;
        if (index === facts.length) finish(); else step();
      });
      next.disabled = true;
      function submit(value, selected) {
        if (solved || !m.isConnected) return;
        const correct = value === q.answer;
        if (speed && !correct) {
          mistakes++; box.className = "answerbox bad";
          feedback.textContent = "Not quite. Try again, or ask for a shortcut. This flight can still be finished!";
          typed = ""; E.sfx.wrong(); return;
        }
        solved = true; answering = false; elapsed += performance.now() - started; tick();
        const independent = correct && !helped && mistakes === 0;
        results.push({ fact, independent });
        streak = independent ? streak + 1 : 0; topStreak = Math.max(topStreak, streak);
        [...answerArea.children].forEach(b => {
          b.disabled = true;
          if (!speed && Number(b.textContent) === q.answer) b.classList.add("right");
        });
        hint.disabled = true; next.disabled = false;
        if (correct) { E.sfx.correct(); if (streak && streak % 3 === 0) E.confetti(8); }
        else { selected.classList.add("wrong"); E.sfx.wrong(); }
        if (speed) box.className = "answerbox ok";
        const explanation = (correct ? "Yes! " : "Let's learn it! Answer: " + q.answer + ". ") +
          MATHS.chant(fact.a, fact.b) + ". " + MATHS.questHint(fact) +
          (kind === "missing" ? " The missing multiplier is " + q.answer + "." : "") +
          (kind === "swap" ? " The order of the factors can change; the product stays the same." : "");
        feedback.replaceChildren(E.el("p", "hintline", explanation),
          E.btn("🔊 Hear why", "btn", () => speak(explanation)));
        status.textContent = "⭐ Fuel " + (index + 1) + "/" + facts.length + " · First-try streak: " + streak;
        bar.set(index + 1, facts.length);
      }
      if (speed) {
        card.appendChild(box);
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].forEach(key => {
          const button = E.btn(key, "key" + (key === "✓" ? " act" : ""), () => {
            if (solved || !m.isConnected) return;
            if (key === "✓") {
              if (!typed.length) { feedback.textContent = "Type an answer first."; return; }
              submit(Number(typed)); return;
            }
            if (key === "⌫") typed = typed.slice(0, -1);
            else if (typed.length < 3) typed += key;
            box.textContent = typed; box.className = "answerbox";
          });
          if (key === "✓") button.setAttribute("aria-label", "Check answer");
          if (key === "⌫") button.setAttribute("aria-label", "Erase last digit");
          answerArea.appendChild(button);
        });
      } else E.shuffle(q.choices).forEach(value => {
        const button = E.btn(String(value), "opt", () => submit(value, button));
        answerArea.appendChild(button);
      });
      card.append(answerArea, feedback, next); host.appendChild(card);
      started = performance.now(); answering = true;
      if (index) { window.scrollTo(0, 0); heading.focus({ preventScroll: true }); }
    }
    function finish() {
      if (finished || !m.isConnected) return;
      finished = true; clearInterval(timer); E.stopSpeak();
      const score = results.filter(r => r.independent).length;
      const saved = Object.assign({}, history());
      results.forEach(r => { saved[r.fact.id] = r.independent; });
      E.state.tableQuestFacts = saved;
      let note = score + " first-try answers without hints. Best streak: " + topStreak + ".";
      if (speed) {
        const seconds = elapsed / 1000;
        note += " Answering time: " + seconds.toFixed(1) + "s.";
        if (score === 10 && facts.length === 10) {
          const key = timeKey(lo, hi), previous = E.state.best[key];
          if (previous == null || seconds < previous) {
            E.state.best[key] = seconds; note += " 🏆 New clean-flight record!";
          } else note += " Best clean flight: " + previous.toFixed(1) + "s.";
        } else note += " Finish 10 first-try answers without hints to set a speed record.";
      }
      E.save();
      host.replaceChildren();
      E.finishCard(host, { score, total: facts.length, note,
        again() { E.replace(() => run(mode, E.shuffle(facts), lo, hi)); } });
      const missed = results.filter(r => !r.independent).map(r => r.fact);
      if (missed.length) host.appendChild(E.btn("💛 Rescue these " + missed.length + " facts", "btn primary wide",
        () => E.replace(() => run("rescue", E.shuffle(missed), lo, hi))));
      host.appendChild(E.btn("Choose another mission", "btn wide", () => E.back()));
      status.textContent = "🌍 Landed! " + facts.length + " facts practised.";
      window.scrollTo(0, 0);
    }
    step();
    if (speed) { tick(); timer = setInterval(tick, 100); }
  }
  window.TableQuest = { home, summary };
})();
