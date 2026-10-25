(function () {
  "use strict";
  const topics = MATH_SKILLS.topics;
  function record(id) { return (E.state.mathSkills || {})[id] || { rounds: 0, best: 0, last: 0, total: 0, streak: 0 }; }
  function say(text) {
    if (!("speechSynthesis" in window)) { E.toast("A grown-up can read this with you. Speech is unavailable in this browser."); return; }
    E.speakEn(text, { slow: true });
  }
  function home() {
    const m = E.page({ title: "🌱 Skill Builders", subtitle: "Explore · Understand · Practise", subject: "maths" });
    const intro = E.el("div", "card");
    intro.append(E.el("h2", null, "Grow your maths confidence!"),
      E.el("p", null, "Play with each idea first, then try a fresh check. No timer. Mistakes are clues for learning."),
      E.el("p", "note", "Two perfect checks in a row earn a Ready badge. That is a practice milestone, not a promise of no future mistakes."));
    m.appendChild(intro);
    topics.forEach(topic => {
      const r = record(topic.id);
      const card = E.el("div", "card");
      card.append(E.el("h2", null, topic.emoji + " " + topic.name),
        E.el("p", null, r.rounds ? "Last: " + r.last + "/" + r.total + " · Best: " + r.best + "/" + r.total +
          " · Perfect checks in a row: " + r.streak + (r.streak >= 2 ? " · 🌟 Ready!" : "") : "Ready to explore?"),
        E.btn("Explore " + topic.name, "btn primary wide", () => E.go(() => lesson(topic))));
      m.appendChild(card);
    });
  }
  function svg(content, label) {
    const box = E.el("div", "skill-visual");
    box.innerHTML = '<svg viewBox="0 0 300 240" role="img" aria-label="' + label +
      '" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">' + content + "</svg>";
    return box;
  }
  function scale(p) {
    const tilt = Math.sign(p.lw - p.rw) * 25;
    const ly = 65 + tilt, ry = 65 - tilt;
    const label = p.lw === p.rw ? "The pans are level." : (tilt > 0 ? p.left : p.right) + " pan is lower.";
    const pan = (x, y, name) => '<path d="M' + x + " " + y + "v55m-35 0h70l-10 18h-50z" +
      '"/><text x="' + x + '" y="' + (y + 102) + '" text-anchor="middle" stroke="none" fill="currentColor" font-size="15">' + name + "</text>";
    return svg('<path d="M150 65v145m-45 0h90M65 ' + ly + "L235 " + ry + '"/><circle cx="150" cy="65" r="5"/>' +
      pan(65, ly, p.left) + pan(235, ry, p.right), label);
  }
  function abacus(tens, ones) {
    let content = '<path d="M60 205h180M100 45v160m100-160v160"/>';
    [[100, tens, "Tens"], [200, ones, "Ones"]].forEach(([x, count, label]) => {
      content += '<text x="' + x + '" y="28" text-anchor="middle" stroke="none" fill="currentColor" font-size="20">' + label + "</text>";
      for (let i = 0; i < count; i++) content += '<rect x="' + (x - 23) + '" y="' + (185 - i * 16) +
        '" width="46" height="12" rx="6" fill="currentColor"/>';
      content += '<text x="' + x + '" y="230" text-anchor="middle" stroke="none" fill="currentColor" font-size="18">' + count + " beads</text>";
    });
    return svg(content, tens + " beads on Tens, " + ones + " beads on Ones.");
  }
  function picture(p) {
    if (p.kind === "scale") return scale(p);
    if (p.kind === "abacus") return abacus(p.tens, p.ones);
    const box = E.el("div");
    if (p.kind === "chain") p.scenes.forEach(s => box.appendChild(scale(s)));
    else p.lines.forEach(line => box.appendChild(E.el("p", "qprompt", line)));
    return box;
  }
  function lesson(topic) {
    const m = E.page({ title: topic.emoji + " " + topic.name, subtitle: "Learn by doing", subject: "maths" });
    const rule = E.el("div", "card strategy");
    rule.append(E.el("p", null, topic.rule), E.btn("🔊 Hear the idea", "btn", () => say(topic.rule)));
    m.appendChild(rule);
    const lab = E.el("div", "card skill-lab"); m.appendChild(lab);
    if (topic.id === "balance") balanceLab(lab);
    else if (topic.id === "abacus") abacusLab(lab);
    else calendarLab(lab);
    m.appendChild(E.btn("🎯 Try a fresh check", "btn primary wide", () => E.go(() => check(topic))));
  }
  function counter(parent, name, initial, max, update) {
    let value = initial;
    const group = E.el("div", "card qbox");
    const label = E.el("h3", null, name);
    const display = E.el("div", "qprompt", String(value));
    const row = E.el("div", "row");
    const minus = E.btn("−", "btn", () => change(-1));
    const plus = E.btn("+", "btn", () => change(1));
    minus.setAttribute("aria-label", "Remove one " + name);
    plus.setAttribute("aria-label", "Add one " + name);
    display.setAttribute("aria-live", "polite");
    function change(delta) { value += delta; paint(); update(value); }
    function paint() { display.textContent = value; minus.disabled = value === 0; plus.disabled = value === max; }
    row.append(minus, plus); group.append(label, display, row); parent.appendChild(group); paint();
  }
  function balanceLab(lab) {
    let left = 2, right = 4;
    lab.appendChild(E.el("h2", null, "Make the pans level"));
    lab.appendChild(E.el("p", null, "Every block weighs the same. Add or remove blocks and watch the pans."));
    const visual = E.el("div"); const result = E.el("p", "hintline"); result.setAttribute("role", "status");
    lab.append(visual, result);
    function draw() {
      visual.replaceChildren(scale({ left: left + " blocks", right: right + " blocks", lw: left, rw: right }));
      result.textContent = left === right ? "Balanced! Equal blocks, equal weight." :
        (left > right ? "Left" : "Right") + " is heavier and lower. " + (left > right ? "Right" : "Left") + " is lighter and higher.";
    }
    const controls = E.el("div", "skill-counters"); lab.appendChild(controls);
    counter(controls, "left block", left, 9, v => { left = v; draw(); });
    counter(controls, "right block", right, 9, v => { right = v; draw(); });
    draw();
  }
  function abacusLab(lab) {
    let tens = 4, ones = 7;
    lab.appendChild(E.el("h2", null, "Build a number"));
    lab.appendChild(E.el("p", null, "Add a bead to Tens: the number grows by 10. Add one to Ones: it grows by 1. Each rod holds 0–9 beads."));
    const visual = E.el("div"); const result = E.el("p", "hintline"); result.setAttribute("role", "status");
    lab.append(visual, result);
    function draw() {
      visual.replaceChildren(abacus(tens, ones));
      result.textContent = "Whole number: " + (tens * 10 + ones) + ". Tens digit: " + tens +
        ". Tens value: " + tens * 10 + ". Ones value: " + ones + ". " + tens * 10 + " + " + ones + " = " + (tens * 10 + ones) + ".";
    }
    const controls = E.el("div", "skill-counters"); lab.appendChild(controls);
    counter(controls, "tens bead", tens, 9, v => { tens = v; draw(); });
    counter(controls, "ones bead", ones, 9, v => { ones = v; draw(); });
    draw();
  }
  function calendarLab(lab) {
    let month = 0, leap = false;
    lab.appendChild(E.el("h2", null, "Explore every month"));
    const toggle = E.btn("Year: ordinary", "btn wide", () => {
      leap = !leap; toggle.textContent = "Year: " + (leap ? "leap" : "ordinary");
      toggle.setAttribute("aria-pressed", String(leap)); draw();
    });
    toggle.setAttribute("aria-pressed", "false");
    lab.appendChild(toggle);
    const picker = E.el("div", "skill-months");
    MATH_SKILLS.months.forEach(([name], i) => picker.appendChild(E.btn(name, "btn", () => { month = i; draw(); })));
    lab.appendChild(picker);
    const result = E.el("p", "hintline"); result.setAttribute("role", "status");
    const days = E.el("div", "skill-days"); days.setAttribute("aria-hidden", "true");
    lab.append(result, days, E.el("p", "note", "These are day counters, not a dated calendar. Each full row groups 7 days."));
    function draw() {
      const [name, normal] = MATH_SKILLS.months[month];
      const count = month === 1 && leap ? 29 : normal;
      result.textContent = name + " has " + count + " days" + (month === 1 ? " in " + (leap ? "a leap" : "an ordinary") + " year" : "") +
        ". That is 4 weeks" + (count > 28 ? " and " + (count - 28) + " extra " + (count === 29 ? "day." : "days.") : " exactly.");
      days.replaceChildren(...Array.from({ length: count }, (_, i) => E.el("span", null, String(i + 1))));
      [...picker.children].forEach((button, i) => {
        button.classList.toggle("primary", i === month); button.setAttribute("aria-pressed", String(i === month));
      });
    }
    draw();
  }
  function check(topic) {
    const questions = MATH_SKILLS.make[topic.id]();
    const m = E.page({ title: "🎯 " + topic.name, subtitle: "Take your time", subject: "maths" });
    const bar = E.progressBar(); m.appendChild(bar.node);
    const host = E.el("div"); m.appendChild(host);
    let index = 0, score = 0, finished = false;
    const missed = [];
    function step() {
      E.stopSpeak(); host.innerHTML = ""; bar.set(index, questions.length);
      if (index === questions.length) { finish(); return; }
      const q = questions[index];
      const card = E.el("div", "card skill-question");
      card.appendChild(E.el("p", "hintline", "Question " + (index + 1) + " of " + questions.length));
      const heading = E.el("h2", "qprompt", q.prompt); heading.tabIndex = -1; card.appendChild(heading);
      if (q.picture) card.appendChild(picture(q.picture));
      const options = E.shuffle(q.options);
      card.appendChild(E.btn("🔊 Read question", "btn", () => say(q.prompt + " " + options.join(". ") +
        (q.picture && q.picture.kind === "statements" ? ". " + q.picture.lines.join(" ") : ""))));
      const opts = E.el("div", "opts one"); const feedback = E.el("div"); feedback.setAttribute("role", "status");
      let answered = false, advanced = false;
      const next = E.btn(index === questions.length - 1 ? "See results →" : "Next →", "btn primary wide", () => {
        if (!answered || advanced || !m.isConnected) return;
        advanced = true; index++; step();
      });
      next.disabled = true;
      options.forEach(option => {
        const button = E.btn(option, "opt", () => {
          if (answered || !m.isConnected) return;
          answered = true; next.disabled = false; E.stopSpeak();
          const correct = option === q.answer;
          if (correct) { score++; E.sfx.correct(); } else { missed.push(q); E.sfx.wrong(); button.classList.add("wrong"); }
          [...opts.children].forEach(b => { b.disabled = true; if (b.textContent === q.answer) b.classList.add("right"); });
          const message = (correct ? "Correct! " : "Good try! Answer: " + q.answer + ". ") + q.why;
          feedback.append(E.el("p", "hintline", message), E.btn("🔊 Hear why", "btn", () => say(message)));
        });
        opts.appendChild(button);
      });
      card.append(opts, feedback, next); host.appendChild(card);
      if (index) { window.scrollTo(0, 0); heading.focus({ preventScroll: true }); }
    }
    function finish() {
      if (finished || !m.isConnected) return;
      finished = true;
      const old = record(topic.id);
      const current = { rounds: old.rounds + 1, last: score, best: Math.max(old.best, score),
        total: questions.length, streak: score === questions.length ? old.streak + 1 : 0 };
      if (!E.state.mathSkills) E.state.mathSkills = {};
      E.state.mathSkills[topic.id] = current; E.save();
      E.finishCard(host, { score, total: questions.length,
        note: current.streak >= 2 ? "🌟 Ready badge! Keep revisiting this skill." :
          "Perfect checks in a row: " + current.streak + " / 2. Understand the idea, then try a fresh check.",
        again() { E.replace(() => check(topic)); } });
      if (missed.length) {
        const review = E.el("div", "card");
        review.appendChild(E.el("h2", null, "Let's learn from these"));
        missed.forEach(q => {
          review.appendChild(E.el("h3", null, q.prompt));
          if (q.picture) review.appendChild(picture(q.picture));
          review.appendChild(E.el("p", null, "Answer: " + q.answer + ". " + q.why));
        });
        host.appendChild(review);
      }
      host.appendChild(E.btn("Explore the idea again", "btn wide", () => E.replace(() => lesson(topic))));
      window.scrollTo(0, 0);
    }
    step();
  }
  window.MathSkillScreens = { home, record };
})();
