/* Speech and microphone turns never overlap. Every async callback belongs to one generation. */
(function () {
  "use strict";
  function mount(n, main) {
    const audio = !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voice = audio && !!Recognition && window.isSecureContext;
    let generation = 0, mode = "idle", index = 0, phase = "idle", completed = 0;
    let disposed = false, utterance = null, recognition = null, typed = "";
    const timers = new Set();
    const card = E.el("section", "card table-speaking");
    card.append(E.el("h2", null, "🎵 Listen, then say it!"),
      E.el("p", null, "I say “" + TABLE_SPEAKING.prompt(n, 1) +
        "…” You say “" + TABLE_SPEAKING.words(n) + "”. Get it right and the next line starts!"));
    const privacy = E.el("p", "note",
      "For a grown-up: microphone audio may be processed online by your browser's speech provider. " +
      "This app saves no audio or transcripts. Recognition varies; silent number-pad practice is always available.");
    const consentLabel = E.el("label", "table-voice-consent");
    const consent = E.el("input");
    consent.type = "checkbox"; consent.disabled = !voice;
    consentLabel.append(consent, document.createTextNode("Allow microphone-based answer practice"));
    card.append(privacy, consentLabel);
    if (!voice) card.appendChild(E.el("p", "hintline",
      "Voice answers are unavailable in this browser. Try a supported browser such as Chrome on HTTPS, or use the number pad below."));
    if (!audio) card.appendChild(E.el("p", "hintline",
      "Spoken playback is unavailable here. The table and number-pad practice still work."));
    const actions = E.el("div", "row");
    const play = E.btn("▶ Play full table", "btn primary", () => start("full"));
    const talk = E.btn("🎤 Say the answers", "btn primary", () => start("voice"));
    const manual = E.btn("⌨ Use number pad", "btn", () => {
      const keep = practicing() && phase !== "complete";
      start("manual", keep ? index : 0, keep ? completed : 0);
    });
    play.disabled = !audio; talk.disabled = true;
    actions.append(play, talk, manual); card.appendChild(actions);
    const transport = E.el("div", "row");
    const pause = E.btn("⏸ Pause", "btn", () => pauseNow("Paused. Resume repeats the current line."));
    const resume = E.btn("▶ Resume / Try again", "btn", () => {
      if (!["paused", "error"].includes(phase)) return;
      if (mode === "voice" && !consent.checked) { setStatus("Allow microphone practice first, or use the number pad."); return; }
      cancelTurn(); turn();
    });
    const stop = E.btn("⏹ Stop", "btn", () => {
      cancelTurn(); mode = "idle"; phase = "idle"; index = 0; completed = 0; typed = "";
      setStatus("Stopped. Choose Play full table or Say the answers to start again."); paint();
    });
    transport.append(pause, resume, stop); card.appendChild(transport);
    const slowLabel = E.el("label", "table-voice-consent");
    const slow = E.el("input"); slow.type = "checkbox"; slow.checked = true;
    slowLabel.append(slow, document.createTextNode("Slow voice (applies to the next spoken line)")); card.appendChild(slowLabel);
    const status = E.el("p", "hintline"); status.setAttribute("role", "status");
    const bar = E.progressBar();
    const prompt = E.el("div", "qprompt");
    card.insertBefore(status, privacy);
    card.insertBefore(bar.node, privacy);
    card.insertBefore(prompt, privacy);
    card.insertBefore(transport, privacy);
    const display = E.el("div", "answerbox"); display.setAttribute("aria-label", "Typed answer");
    const pad = E.el("div", "numpad");
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"].forEach(key => {
      const b = E.btn(key, "key" + (key === "✓" ? " act" : ""), () => {
        if (mode !== "manual" || phase !== "ready") return;
        if (key === "✓") {
          if (!typed.length) { setStatus("Type your answer first."); return; }
          accept(Number(typed), typed); return;
        }
        typed = key === "⌫" ? typed.slice(0, -1) : typed.length < 3 ? typed + key : typed;
        display.textContent = typed;
      });
      if (key === "⌫") b.setAttribute("aria-label", "Erase last digit");
      if (key === "✓") b.setAttribute("aria-label", "Check answer");
      pad.appendChild(b);
    });
    card.append(display, pad);
    const reveal = E.btn("💡 Show this answer", "btn", () => {
      if (!practicing() || phase === "complete") return;
      cancelTurn(); phase = "paused";
      setStatus("The answer is " + n * (index + 1) + ". Resume to try this same line. No line has been skipped."); paint();
    });
    card.appendChild(reveal);
    main.appendChild(card);
    const listCard = E.el("div", "card");
    listCard.appendChild(E.el("p", "note", "Tap any row to hear that line. Full playback highlights each row as it is spoken."));
    const list = E.el("div", "tablelist");
    const rows = MATHS.tableRows(n, 10).map((q, i) => {
      const b = E.btn("", "trow", () => start("single", i));
      b.append(E.el("span", null, q.a + " × " + q.b), E.el("span", null, "= " + q.ans));
      b.setAttribute("aria-label", TABLE_SPEAKING.line(n, i + 1));
      b.disabled = !audio; list.appendChild(b); return b;
    });
    listCard.appendChild(list); main.appendChild(listCard);

    function practicing() { return mode === "voice" || mode === "manual"; }
    function setStatus(text) { status.textContent = text; }
    function paint() {
      const active = !["idle", "paused", "error", "complete"].includes(phase);
      pause.disabled = !active;
      resume.disabled = !["paused", "error"].includes(phase);
      stop.disabled = mode === "idle";
      reveal.hidden = !practicing() || phase === "complete";
      pad.hidden = display.hidden = mode !== "manual" || phase === "complete";
      [...pad.children].forEach(b => { b.disabled = phase !== "ready"; });
      listCard.hidden = practicing() && phase !== "complete";
      rows.forEach((row, i) => {
        row.classList.toggle("lit", i === index && phase === "speaking");
        if (i === index && phase === "speaking") row.setAttribute("aria-current", "step"); else row.removeAttribute("aria-current");
      });
      bar.set(completed, 10);
      prompt.textContent = phase === "complete" ? (practicing() ? "10 answers solved!" : "Playback complete!") :
        mode === "idle" ? "Table of " + n + " · ones through tens" :
          "Line " + (index + 1) + " / 10: " + TABLE_SPEAKING.prompt(n, index + 1) + "…";
      display.textContent = typed;
    }
    function later(fn, ms) {
      const token = generation;
      const id = setTimeout(() => {
        timers.delete(id);
        if (valid(token)) fn();
      }, ms);
      timers.add(id); return id;
    }
    function clearTimer(id) { clearTimeout(id); timers.delete(id); }
    function valid(token) { return token === generation && !disposed && main.isConnected && !document.hidden; }
    function cancelTurn() {
      generation++;
      timers.forEach(clearTimeout); timers.clear();
      if (recognition) {
        const old = recognition; recognition = null;
        old.onstart = old.onresult = old.onerror = old.onend = null;
        try { old.abort(); } catch (error) { console.warn("Table microphone could not be aborted", error); }
      }
      if (utterance) {
        utterance.onend = utterance.onerror = null;
        utterance = null;
        window.speechSynthesis.cancel();
      }
    }
    function pauseNow(message) {
      if (mode === "idle" || phase === "complete") return;
      cancelTurn(); phase = "paused"; setStatus(message); paint();
    }
    function fail(message) {
      cancelTurn(); phase = "error"; setStatus(message); paint();
    }
    function start(nextMode, row = 0, done = 0) {
      if (disposed || !main.isConnected) return;
      if (nextMode === "voice" && (!voice || !consent.checked)) {
        setStatus("Allow microphone practice first, or use the number pad."); return;
      }
      if (nextMode !== "manual" && !audio) { setStatus("Audio is unavailable. Use the number pad."); return; }
      cancelTurn(); E.stopSpeak(); mode = nextMode; index = row; completed = done; typed = "";
      if (document.hidden) { phase = "paused"; setStatus("Return to this page, then Resume."); paint(); return; }
      card.scrollIntoView({ block: "start" });
      turn();
    }
    function speakLine(text, then) {
      phase = "speaking"; paint();
      const token = generation;
      const u = new SpeechSynthesisUtterance(text); utterance = u;
      u.lang = E.cfg.langEnglish;
      const chosen = E.pickVoice(E.cfg.langEnglish);
      if (chosen) u.voice = chosen;
      u.rate = slow.checked ? E.cfg.speech.slowRate : E.cfg.speech.normalRate;
      u.pitch = E.cfg.speech.pitch;
      const timeout = later(() => fail("Playback did not finish. Tap Resume to try again, or use the number pad."), 20000);
      u.onend = () => {
        if (!valid(token) || utterance !== u) return;
        clearTimer(timeout); utterance = null; u.onend = u.onerror = null; then();
      };
      u.onerror = () => {
        if (valid(token) && utterance === u) fail("Audio could not play. Tap Resume to retry. Check sound settings, or use the number pad.");
      };
      try { window.speechSynthesis.speak(u); }
      catch (error) { fail("Audio could not start. Tap Resume to retry, or use the number pad."); }
    }
    function turn() {
      typed = ""; phase = "ready";
      if (!practicing()) {
        setStatus("Listen: " + TABLE_SPEAKING.line(n, index + 1));
        speakLine(TABLE_SPEAKING.line(n, index + 1), () => {
          completed = mode === "single" ? 0 : index + 1;
          if (mode === "single" || index === 9) {
            phase = "complete"; setStatus(mode === "single" ? "Line finished. Play the full table to hear all ten." : "All ten lines played. Ready to say the answers?"); paint();
          } else {
            index++; phase = "gap"; paint(); later(turn, 500);
          }
        });
      } else {
        const ready = () => {
          if (mode === "voice") {
            phase = "gap"; setStatus("Get ready… wait for “Listening” before answering."); paint();
            later(listen, 300);
          } else { phase = "ready"; setStatus("Type the answer, then tap ✓. The next line follows a correct answer."); paint(); }
        };
        setStatus("My turn: " + TABLE_SPEAKING.prompt(n, index + 1) + "…");
        if (mode === "voice") speakLine(TABLE_SPEAKING.prompt(n, index + 1) + "…", ready);
        else ready();
      }
    }
    function listen() {
      const token = generation;
      let rec;
      try { rec = new Recognition(); } catch (error) {
        fail("Voice recognition could not start. Use the number pad or try another browser."); return;
      }
      recognition = rec;
      rec.lang = E.cfg.langEnglish; rec.continuous = false; rec.interimResults = false; rec.maxAlternatives = 1;
      phase = "starting"; setStatus("Starting microphone… allow access if your browser asks."); paint();
      const startup = later(() => fail("Microphone did not start. Check permission, then Resume, or use the number pad."), 10000);
      rec.onstart = () => {
        if (!valid(token) || recognition !== rec) return;
        clearTimer(startup);
        phase = "listening"; setStatus("🎤 Listening — say only the answer in English."); paint();
        later(() => fail("I did not hear an answer in time. Tap Resume to try the same line."), 12000);
      };
      rec.onresult = event => {
        if (!valid(token) || recognition !== rec) return;
        const result = event.results[event.resultIndex || 0];
        if (!result || !result.isFinal || !result[0]) return;
        const transcript = result[0].transcript;
        const value = TABLE_SPEAKING.parseAnswer(transcript);
        accept(value, transcript);
      };
      rec.onerror = event => {
        if (!valid(token) || recognition !== rec) return;
        const messages = {
          "not-allowed": "Microphone permission was denied. Allow it in your browser settings, then Resume, or use the number pad.",
          "service-not-allowed": "The browser's speech service is unavailable. Use the number pad or another supported browser.",
          "audio-capture": "No microphone was found. Check your microphone or use the number pad.",
          "network": "The speech service could not connect. Check internet access, then Resume, or use the number pad.",
          "no-speech": "I did not hear an answer. Tap Resume to try the same line.",
          "language-not-supported": "English speech recognition is unavailable here. Use the number pad or another browser."
        };
        fail(messages[event.error] || "Listening stopped. Tap Resume to try the same line, or use the number pad.");
      };
      rec.onend = () => {
        if (valid(token) && recognition === rec) fail("Listening ended without a clear answer. Tap Resume to try the same line.");
      };
      try { rec.start(); } catch (error) { fail("Microphone could not start. Tap Resume or use the number pad."); }
    }
    function accept(value, heard) {
      if (!practicing() || !["listening", "starting", "ready"].includes(phase)) return;
      cancelTurn();
      if (value !== n * (index + 1)) {
        phase = mode === "manual" ? "ready" : "paused"; typed = "";
        setStatus((mode === "voice" ? "I heard “" + String(heard).slice(0, 100) + "”. " : "") +
          (value == null ? "Please say just one number. " : "Not quite. ") +
          (mode === "voice" ? "Tap Resume to repeat this line, or use the number pad." : "Try this answer again."));
        paint(); return;
      }
      completed = index + 1; phase = "feedback"; typed = String(value);
      setStatus("Correct — " + value + "!"); paint();
      if (completed === 10) {
        phase = "complete"; setStatus("You answered all ten lines! Play the full table or start again to practise."); paint();
        E.celebrate("Table of " + n + " completed! ⭐", 3); E.touchStreak();
      } else {
        // Move the cursor now so pausing between turns cannot credit the same answer twice.
        index++; later(turn, 650);
      }
    }
    consent.addEventListener("change", () => {
      talk.disabled = !voice || !consent.checked;
      if (!consent.checked && mode === "voice") pauseNow("Microphone practice switched off. Use the number pad, or allow it again before Resume.");
    });
    const onVisibility = () => {
      if (document.hidden) pauseNow("Paused while this page is hidden. Resume repeats the current line.");
    };
    const onPageHide = () => pauseNow("Paused. Resume when you return.");
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    E.onLeave(() => {
      disposed = true; cancelTurn();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    });
    setStatus("Choose a mode. The microphone stays off until you allow it and tap Say the answers.");
    paint();
  }
  window.TableSpeaking = { mount };
})();
