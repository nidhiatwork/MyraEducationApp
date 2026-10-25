(function () {
  "use strict";
  const BANK = COMPUTERS.questions;
  const TOPICS = COMPUTERS.topics;
  const FIGURES = {
    monitor: '<rect x="30" y="15" width="180" height="105" rx="6"/><rect x="40" y="25" width="160" height="82"/><path d="M120 120v20m-40 0h80"/>',
    keyboard: '<rect x="10" y="38" width="220" height="88" rx="8"/>' +
      [0, 1, 2].map(row => Array.from({ length: 10 }, (_, col) =>
        '<rect x="' + (20 + col * 20) + '" y="' + (48 + row * 18) + '" width="13" height="11" rx="2"/>').join("")).join("") +
      '<rect x="60" y="104" width="120" height="12" rx="2"/>',
    mouse: '<path d="M120 45V25q0-18 30-18"/><rect x="80" y="45" width="80" height="100" rx="38"/><path d="M80 88h80m-40-43v43"/><rect x="116" y="62" width="8" height="16" rx="4"/>',
    printer: '<path d="M65 55V15h110v40"/><rect x="35" y="55" width="170" height="65" rx="10"/><path d="M65 95h110v50H65zM80 111h80m-80 16h60"/><circle cx="185" cy="75" r="4"/>',
    keyrow: ["A", "B", "C", "D", "E"].map((key, i) =>
      '<rect x="' + (5 + i * 47) + '" y="50" width="42" height="50" rx="5"/><text x="' +
      (26 + i * 47) + '" y="83" text-anchor="middle" stroke="none" fill="currentColor" font-size="24">' + key + "</text>").join(""),
    pattern: '<rect x="5" y="60" width="25" height="25"/><circle cx="53" cy="73" r="14"/>' +
      '<path d="M93 56l16 30H77z"/><rect x="117" y="60" width="25" height="25"/>' +
      '<circle cx="165" cy="73" r="14"/><path d="M205 56l16 30h-32z"/>' +
      '<rect x="55" y="110" width="25" height="25"/><text x="110" y="133" stroke="none" fill="currentColor" font-size="28">?</text>'
  };

  function summary() {
    const saved = E.state.computerAnswers || {};
    return {
      attempted: BANK.filter(q => typeof saved[q.id] === "boolean").length,
      correct: BANK.filter(q => saved[q.id] === true).length,
      missed: BANK.filter(q => saved[q.id] === false)
    };
  }

  function home() {
    const m = E.page({ title: "💻 Computer Olympiad", subtitle: "Grade 1 · 50 questions", subject: "computers" });
    const intro = E.el("div", "card");
    intro.appendChild(E.el("h2", null, "Hello, computer explorer!"));
    intro.appendChild(E.el("p", null, "Learn a little, try a question, and discover why. All rounds are untimed."));
    const progress = summary();
    intro.appendChild(E.el("p", null, progress.attempted + " / 50 tried · " + progress.correct +
      " correct on the latest attempt. Progress is saved on this device."));
    m.appendChild(intro);
    const modes = E.el("div", "row");
    modes.appendChild(E.btn("🚀 Practise 10", "btn primary", () => launch("quick")));
    modes.appendChild(E.btn("📚 Practise all 50", "btn", () => launch("all")));
    modes.appendChild(E.btn("📝 Mock paper: 35", "btn", () => E.go(mockHome)));
    const retry = E.btn("💡 Revisit missed (" + progress.missed.length + ")", "btn", () =>
      launch("review", progress.missed));
    retry.disabled = progress.missed.length === 0;
    modes.appendChild(retry);
    m.appendChild(modes);
    m.appendChild(E.el("h2", null, "Pick a topic"));
    const tiles = E.el("div", "tiles");
    TOPICS.forEach(topic => {
      const questions = BANK.filter(q => q.topic === topic.id);
      const correct = questions.filter(q => (E.state.computerAnswers || {})[q.id] === true).length;
      const button = E.btn("", "tile", () => launch("topic", questions, topic.name));
      button.append(E.el("span", "ic", topic.emoji), E.el("b", null, topic.name),
        E.el("small", null, questions.length + " questions · " + correct + " correct lately"));
      tiles.appendChild(button);
    });
    m.appendChild(tiles);
    const note = E.el("details", "card");
    note.appendChild(E.el("summary", null, "For grown-ups: syllabus & practice plan"));
    note.appendChild(E.el("p", null,
      "These 50 original questions cover published Grade 1 SOF ICSO and CREST CCO topics: " +
      "computer parts, keyboard/mouse, uses, start/shut down, Paint, everyday IT, reasoning and application. " +
      "Researched 25 October 2026. The organiser of Myra's exam is not confirmed; actual papers and marks vary. " +
      "This is not an official paper or a prediction. Windows questions follow Windows 11 concepts."));
    note.appendChild(E.el("p", null,
      "Try 10 questions a day, discuss missed answers, and practise on a real keyboard and in Paint with a grown-up. " +
      "Practise all 50 is a learning round, not a timed exam. In the mock, answers appear only at the end. " +
      "Leaving a round starts it over; completed practice answers stay saved. Mock answers are saved only when finished."));
    COMPUTERS.sources.forEach(source => {
      const link = E.el("a");
      link.textContent = source.title;
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const p = E.el("p"); p.appendChild(link); note.appendChild(p);
    });
    m.appendChild(note);
  }

  function mockHome() {
    const m = E.page({ title: "📝 Mock paper", subtitle: "SOF-style · untimed practice", subject: "computers" });
    const card = E.el("div", "card");
    card.appendChild(E.el("h2", null, "35 questions · 40 marks"));
    card.appendChild(E.el("p", null,
      "5 reasoning + 20 computer science + 5 IT questions earn 1 mark each. " +
      "5 little challenges earn 2 marks each. No negative marks."));
    card.appendChild(E.el("p", null,
      "Choose an answer, then tap Next. You can change your choice before Next. " +
      "Answers and explanations appear only after all 35 questions. There is no countdown."));
    const best = E.state.best["c-mock40"];
    card.appendChild(E.el("p", null, best == null ? "Ready for your first mock?" : "Your best: " + best + " / 40 marks"));
    card.appendChild(E.btn("Start mock paper", "btn primary wide", () => launch("mock")));
    m.appendChild(card);
  }

  function launch(mode, pool, title) {
    let questions;
    if (mode === "mock") {
      questions = [["logic", 5], ["science", 20], ["it", 5], ["challenge", 5]]
        .flatMap(([section, count]) => E.shuffle(BANK.filter(q => q.section === section)).slice(0, count));
    } else {
      questions = E.shuffle(pool || BANK);
      if (mode === "quick") questions = questions.slice(0, 10);
    }
    if (!questions.length) { E.toast("No missed questions to revisit — well done!"); return; }
    E.go(() => run(mode, questions, title));
  }

  function figure(q) {
    if (!q.figure) return null;
    const wrapper = E.el("div", "computer-figure");
    const label = q.figure === "pattern" ? "Read across the top row, then the bottom row." :
      q.figure === "keyrow" ? "Keys arranged from left to right." : "Look at the device.";
    wrapper.innerHTML = '<svg viewBox="0 0 240 160" role="img" aria-label="' + label +
      '" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">' + FIGURES[q.figure] + "</svg>";
    if (q.figure === "pattern") wrapper.appendChild(E.el("p", "note", label));
    return wrapper;
  }

  function saveAnswer(q, correct) {
    if (!E.state.computerAnswers) E.state.computerAnswers = {};
    E.state.computerAnswers[q.id] = correct;
    E.save();
  }

  function read(text, slow) {
    if (!("speechSynthesis" in window)) {
      E.toast("Audio is not supported in this browser. A grown-up can read with you.");
      return;
    }
    E.speakEn(text, { slow });
  }

  function run(mode, questions, title) {
    const mock = mode === "mock";
    const m = E.page({ title: mock ? "📝 Mock paper" : "💻 " + (title || "Computer practice"),
      subtitle: mock ? "Answers at the end" : "Choose, learn, then tap Next", subject: "computers" });
    const bar = E.progressBar();
    m.appendChild(bar.node);
    const position = E.el("p", "hintline");
    m.appendChild(position);
    const host = E.el("div"); m.appendChild(host);
    const results = [];
    let index = 0, finished = false;

    function step() {
      E.stopSpeak();
      host.innerHTML = "";
      bar.set(index, questions.length);
      const q = questions[index];
      const choices = E.shuffle(q.choices.map((text, original) => ({ text, original })));
      const topic = TOPICS.find(t => t.id === q.topic);
      position.textContent = "Question " + (index + 1) + " of " + questions.length + " · " + topic.name +
        (mock && q.section === "challenge" ? " · 2 marks" : "");
      const card = E.el("div", "card qbox computer-question");
      card.dataset.questionId = q.id;
      const heading = E.el("h2", "qprompt", q.prompt);
      heading.tabIndex = -1;
      card.appendChild(heading);
      const image = figure(q);
      if (image) card.appendChild(image);
      const spoken = q.prompt + " " + choices.map((c, i) => "Option " + "ABCD"[i] + ". " + c.text + ".").join(" ");
      const hear = E.el("div", "row");
      hear.append(E.btn("🔊 Read question", "btn", () => read(spoken, false)),
        E.btn("🐢 Slowly", "btn", () => read(spoken, true)),
        E.btn("⏹ Stop", "btn", () => E.stopSpeak()));
      card.appendChild(hear);
      const options = E.el("div", "opts one");
      let selected = null, answered = false, advanced = false;
      const feedback = E.el("div");
      feedback.setAttribute("role", "status");
      const next = E.btn(index === questions.length - 1 ? "See results →" : "Next →", "btn primary wide", () => {
        if (advanced || selected == null || !m.isConnected) return;
        advanced = true;
        next.disabled = true;
        const correct = selected === q.answer;
        results.push({ q, selected, correct });
        index++;
        if (index === questions.length) finish();
        else step();
      });
      next.disabled = true;
      choices.forEach((choice, i) => {
        const button = E.btn("ABCD"[i] + ". " + choice.text, "opt", () => {
          if (answered || advanced || !m.isConnected) return;
          selected = choice.original;
          next.disabled = false;
          E.stopSpeak();
          [...options.children].forEach(b => {
            b.classList.remove("selected");
            b.setAttribute("aria-pressed", "false");
          });
          button.classList.add("selected");
          button.setAttribute("aria-pressed", "true");
          if (mock) return;
          answered = true;
          const correct = selected === q.answer;
          saveAnswer(q, correct);
          [...options.children].forEach((b, j) => {
            b.disabled = true;
            if (choices[j].original === q.answer) b.classList.add("right");
          });
          if (correct) E.sfx.correct();
          else { button.classList.add("wrong"); E.sfx.wrong(); }
          const message = (correct ? "Correct! " : "Good try! The answer is " + q.choices[q.answer] + ". ") + q.explanation;
          feedback.appendChild(E.el("p", "hintline", message));
          feedback.appendChild(E.btn("🔊 Hear why", "btn", () => read(message, true)));
        });
        button.setAttribute("aria-pressed", "false");
        options.appendChild(button);
      });
      card.append(options, feedback, next);
      host.appendChild(card);
      if (index > 0) {
        window.scrollTo(0, 0);
        heading.focus({ preventScroll: true });
      }
    }

    function finish() {
      if (finished || !m.isConnected) return;
      finished = true;
      E.stopSpeak();
      if (mock) results.forEach(r => saveAnswer(r.q, r.correct));
      const correct = results.filter(r => r.correct).length;
      const marks = results.reduce((sum, r) => sum + (r.correct ? (mock && r.q.section === "challenge" ? 2 : 1) : 0), 0);
      const totalMarks = mock ? 40 : questions.length;
      const recordKey = mock ? "c-mock40" : mode === "all" ? "c-all50" : null;
      if (recordKey) {
        // Keep a completed zero-score round distinct from "not tried yet".
        if (E.state.best[recordKey] == null) { E.state.best[recordKey] = marks; E.save(); }
        else E.best(recordKey, marks);
      }
      bar.set(questions.length, questions.length);
      position.textContent = "Round complete";
      host.innerHTML = "";
      E.finishCard(host, {
        score: correct, total: questions.length,
        note: mock ? marks + " / " + totalMarks + " marks. Best mock: " + E.best("c-mock40") + " / 40." :
          "Every explanation helps you learn. Your first choice on each question counts.",
        again() { E.replace(() => run(mode, mock ? questions : E.shuffle(questions), title)); }
      });
      const missed = results.filter(r => !r.correct);
      if (missed.length) host.appendChild(E.btn("💡 Practise these " + missed.length + " again", "btn primary wide",
        () => E.replace(() => run("review", E.shuffle(missed.map(r => r.q))))));
      host.appendChild(E.el("h2", null, "Your answers & explanations"));
      TOPICS.forEach(topic => {
        const items = results.filter(r => r.q.topic === topic.id);
        if (!items.length) return;
        host.appendChild(E.el("p", "hintline", topic.name + ": " +
          items.filter(r => r.correct).length + " / " + items.length + " correct"));
      });
      results.forEach((r, i) => {
        const detail = E.el("details", "card computer-review");
        if (!r.correct) detail.open = true;
        detail.appendChild(E.el("summary", null, (r.correct ? "✅ " : "💡 ") + (i + 1) + ". " + r.q.prompt));
        const image = figure(r.q);
        if (image) detail.appendChild(image);
        detail.appendChild(E.el("p", null, "Your answer: " + r.q.choices[r.selected]));
        const explanation = "Correct answer: " + r.q.choices[r.q.answer] + ". " + r.q.explanation;
        detail.appendChild(E.el("p", null, explanation));
        detail.appendChild(E.btn("🔊 Hear explanation", "btn", () => read(explanation, true)));
        host.appendChild(detail);
      });
      window.scrollTo(0, 0);
    }
    step();
  }

  window.ComputerScreens = { home, summary };
})();
