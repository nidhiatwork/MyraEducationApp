/* ============================================================
   Myra Learns — configuration
   ------------------------------------------------------------
   THIS is the file to edit as Myra grows.
   Change `klass` to 2, 3... and swap the content-*.js files.
   Nothing in engine.js or screens-*.js needs to change.
   ============================================================ */
const APP_CONFIG = {
  child: { name: "Myra", hindi: "मायरा" },
  klass: 1,                     // her current class — shown on the home screen
  mascot: { name: "Mithu", hindi: "मिठू", emoji: "🦜" },

  langHindi: "hi-IN",
  langEnglish: "en-IN",         // Indian English voice reads her words naturally

  speech: {
    slowRate: 0.72,             // "say it slowly" button
    normalRate: 0.92,           // normal reading speed for a 6-year-old
    pitch: 1.12                 // slightly higher = friendlier
  },

  /* Subjects shown on the home screen.
     To add a subject later: add an entry here + a screens-*.js render function. */
  subjects: [
    { id: "hindi",   name: "Hindi",   hindi: "हिंदी", emoji: "📕", colour: "#ff7043",
      tagline: "मात्रा, शब्द और वाक्य" },
    { id: "english", name: "English", hindi: "",      emoji: "📘", colour: "#42a5f5",
      tagline: "Spelling &amp; Reading" },
    { id: "maths",   name: "Maths",   hindi: "गणित",  emoji: "📗", colour: "#66bb6a",
      tagline: "Tables, Sums &amp; Brain Speed" }
  ]
};
if (typeof window !== "undefined") window.APP_CONFIG = APP_CONFIG;
