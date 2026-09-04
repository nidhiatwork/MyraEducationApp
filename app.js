/* ============================================================================
   Myra Learns — home screen + boot
   ========================================================================== */
(function () {
  "use strict";

  const SCREENS = {
    hindi:   () => HindiScreens.home(),
    english: () => EnglishScreens.home(),
    maths:   () => MathsScreens.home()
  };

  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }

  function home() {
    const app = document.getElementById("app");
    const page = E.el("div", "page");

    /* Hero */
    const hero = E.el("div", "hero");
    hero.appendChild(E.el("div", "wave", "🌈"));
    hero.appendChild(E.el("h1", null, greeting() + ", " + E.cfg.child.name + "!"));
    hero.appendChild(E.el("p", null, "What shall we learn today?"));

    const badges = E.el("div", "badges");
    badges.appendChild(E.el("span", "badge", "⭐ " + (E.state.stars || 0) + " stars"));
    badges.appendChild(E.el("span", "badge", "🎒 Class " + E.cfg.klass));
    if (E.state.streak > 1) badges.appendChild(E.el("span", "badge", "🔥 " + E.state.streak + " days"));
    hero.appendChild(badges);
    page.appendChild(hero);

    /* Subject cards */
    const list = E.el("div", "subjects");
    E.cfg.subjects.forEach(s => {
      const c = E.btn("", "subjcard", () => {
        if (SCREENS[s.id]) E.go(SCREENS[s.id]);
      });
      c.style.setProperty("--c", s.colour);
      c.innerHTML = "";
      c.appendChild(E.el("span", "ic", s.emoji));
      const tx = E.el("div", "tx");
      tx.appendChild(E.el("b", null, s.name + (s.hindi ? "  " + s.hindi : "")));
      tx.appendChild(E.el("small", null, s.tagline));
      c.appendChild(tx);
      c.appendChild(E.el("span", "go", "›"));
      list.appendChild(c);
    });

    /* Grown-ups corner */
    const parent = E.btn("👩‍👧 For Mamma & Papa", "btn ghost wide", () => E.go(parentsPage));
    list.appendChild(parent);
    list.appendChild(E.el("p", "footnote", "Made with ❤️ for " + E.cfg.child.name));

    page.appendChild(list);
    app.appendChild(page);
  }

  function parentsPage() {
    const m = E.page({ title: "👩‍👧 Grown-ups", subtitle: "Progress & settings" });

    const p = E.el("div", "card");
    p.appendChild(E.el("h2", null, "📊 Progress"));
    const doneKeys = Object.keys(E.state.done || {});
    const hi = doneKeys.filter(k => k.startsWith("hi-")).length;
    const en = doneKeys.filter(k => k.startsWith("en-")).length;
    const tab = doneKeys.filter(k => k.startsWith("m-tab-")).length;
    const str = doneKeys.filter(k => k.startsWith("m-str-")).length;
    const rows = [
      ["⭐ Total stars", E.state.stars || 0],
      ["🔥 Day streak", E.state.streak || 0],
      ["📕 Maatras finished", hi + " / " + HINDI.maatras.length],
      ["📘 Word sets finished", en + " / " + ENGLISH.sets.length],
      ["✖️ Tables learnt", tab + " / " + MATHS.tablesUpTo],
      ["🪄 Mental tricks learnt", str + " / " + MATHS.strategies.length],
      ["⚡ Brain Speed record", (E.best("m-speed") || 0) + " in 60s"],
      ["🔥 RapidFire100 best time", MathsScreens.fmtRfTime(E.state.best["m-rapidfire100-time"])],
      ["🧊 RapidFire0 best time", MathsScreens.fmtRfTime(E.state.best["m-rapidfire0-time"])]
    ];
    const list = E.el("div", "tablelist");
    rows.forEach(r => {
      const row = E.el("div", "trow");
      row.innerHTML = "<span style='font-size:16px'>" + r[0] + "</span><b>" + r[1] + "</b>";
      list.appendChild(row);
    });
    p.appendChild(list);
    m.appendChild(p);

    const c = E.el("div", "card");
    c.appendChild(E.el("h2", null, "📚 What's inside"));
    c.appendChild(E.el("p", null,
      "<b>Hindi:</b> " + HINDI.maatras.length + " maatras · " + HINDI.allWords().length +
      " words · " + HINDI.reading.length + " reading levels · " + HINDI.stories.length + " stories.<br>" +
      "<b>English:</b> " + ENGLISH.allWords().length + " dictation words · " +
      ENGLISH.reading.length + " reading levels · " + ENGLISH.passages.length + " stories.<br>" +
      "<b>Maths:</b> tables 1–" + MATHS.tablesUpTo +
      " · carry addition · borrow subtraction · 2-digit × 1-digit · exact division · " +
      MATHS.strategies.length + " mental-maths tricks."));
    c.appendChild(E.el("p", null,
      "<b>To update for the next class:</b> edit <code>content-hindi.js</code>, " +
      "<code>content-english.js</code>, <code>content-maths.js</code> and bump " +
      "<code>klass</code> in <code>config.js</code>. Nothing else needs to change."));
    m.appendChild(c);

    const a = E.el("div", "card");
    a.appendChild(E.el("h2", null, "🔈 Sound"));
    a.appendChild(E.el("p", null,
      "Audio uses your phone's built-in voices. For the clearest Hindi, install a Hindi " +
      "voice in your phone settings (Settings → Language → Text-to-speech → Hindi)."));
    a.appendChild(E.btn("🔊 Test Hindi voice", "btn wide", () =>
      E.speakHi("नमस्ते मायरा, आओ हिंदी सीखें।", { slow: true })));
    a.appendChild(E.btn("🔊 Test English voice", "btn wide", () =>
      E.speakEn("Hello Myra, let us learn together.")));
    m.appendChild(a);

    const r = E.el("div", "card");
    r.appendChild(E.el("h2", null, "♻️ Reset"));
    r.appendChild(E.el("p", null, "Clear all stars and progress. Cannot be undone."));
    r.appendChild(E.btn("🗑️ Reset progress", "btn wide", () => {
      if (confirm("Reset all of Myra's stars and progress?")) {
        localStorage.removeItem("myra-learns-v1");
        location.reload();
      }
    }));
    m.appendChild(r);
  }

  /* -------------------------------------------------------------- boot */
  function boot() {
    window.MyraHome = home;      // lets the 🏠 button jump straight here
    E.reset(home);
    E.touchStreak();

    /* Browsers need a user gesture before audio works — warm both up on first tap. */
    const warm = () => {
      try { E.tone(1, 0.01, "sine", 0, 0.0001); } catch (e) {}
      try {
        if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(" ");
          u.volume = 0;
          window.speechSynthesis.speak(u);
        }
      } catch (e) {}
      document.removeEventListener("pointerdown", warm);
    };
    document.addEventListener("pointerdown", warm);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
