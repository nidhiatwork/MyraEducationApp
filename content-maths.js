/* ============================================================================
   Myra Learns — MATHS content + question generators (Class 1)
   ----------------------------------------------------------------------------
   Sums are GENERATED so she never runs out of practice and never memorises
   the answer sheet. Every generator guarantees the difficulty she needs:
     • addition      — with a real carry in the ones column
     • subtraction   — with a real borrow from the tens column
     • multiplication— 2-digit x 1-digit
     • division      — always EXACT, never leaves a remainder
   ========================================================================== */
const MATHS = (function () {

  function ri(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* --------------------------------------------------------------- TABLES */
  const TABLE_TRICKS = {
    1:  "Anything times 1 stays exactly the same. 7 × 1 = 7!",
    2:  "Times 2 is just doubling — say the number twice and add!",
    3:  "Count in 3s: 3, 6, 9, 12… like hopping three steps.",
    4:  "Double it, then double again! 4 × 6 → 6+6=12 → 12+12=24.",
    5:  "Every answer ends in 5 or 0. Count in fives on your fingers!",
    6:  "6 × anything = 5 × it, plus one more. 6×7 → 35 + 7 = 42.",
    7:  "Tricky one! Learn 7×7=49 first, then walk up and down from it.",
    8:  "Double, double, double! 8 × 3 → 6 → 12 → 24.",
    9:  "Finger trick — fold the finger you are multiplying. 9×4 = 36.",
    10: "Just add a zero! 10 × 7 = 70. Easiest table ever.",
    11: "For 1–9 the digit repeats: 11 × 4 = 44, 11 × 7 = 77!",
    12: "12 = 10 + 2. So 12×6 → 60 + 12 = 72.",
    13: "13 = 10 + 3. So 13×5 → 50 + 15 = 65.",
    14: "14 = 10 + 4. So 14×6 → 60 + 24 = 84. Or double the 7 table!",
    15: "15 = 10 + 5. So 15×4 → 40 + 20 = 60. Answers end in 0 or 5."
  };

  function tableRows(n, upto) {
    const rows = [];
    for (let i = 1; i <= (upto || 10); i++) rows.push({ a: n, b: i, ans: n * i });
    return rows;
  }
  /* "7 times 2 is 14" — nicer to chant aloud */
  function chant(n, i) { return n + " times " + i + " is " + (n * i); }

  /* ----------------------------------------------------------- GENERATORS */
  const gen = {
    /* Two-digit + two-digit. carry:true forces a carry in the ones column. */
    add(opts) {
      opts = opts || {};
      const maxSum = opts.big ? 199 : 99;
      for (let t = 0; t < 400; t++) {
        const a = ri(10, opts.big ? 89 : 79);
        const b = ri(10, opts.big ? 89 : 79);
        const carry = (a % 10) + (b % 10) >= 10;
        if (opts.carry === true && !carry) continue;
        if (opts.carry === false && carry) continue;
        if (a + b > maxSum) continue;
        return { a, b, op: "+", ans: a + b, carry };
      }
      return { a: 47, b: 38, op: "+", ans: 85, carry: true };
    },

    /* Two-digit − two-digit. borrow:true forces a borrow. Never negative. */
    sub(opts) {
      opts = opts || {};
      for (let t = 0; t < 400; t++) {
        const a = ri(21, 99);
        const b = ri(10, a - 1);
        const borrow = (a % 10) < (b % 10);
        if (opts.borrow === true && !borrow) continue;
        if (opts.borrow === false && borrow) continue;
        return { a, b, op: "−", ans: a - b, borrow };
      }
      return { a: 52, b: 27, op: "−", ans: 25, borrow: true };
    },

    /* Two-digit x one-digit. */
    mul(opts) {
      opts = opts || {};
      const a = ri(11, opts.big ? 99 : 49);
      const b = ri(2, 9);
      return { a, b, op: "×", ans: a * b };
    },

    /* Two-digit ÷ one-digit — ALWAYS exact, no remainder ever. */
    div() {
      const d = ri(2, 9);
      const loQ = Math.ceil(10 / d);
      const hiQ = Math.floor(99 / d);
      const q = ri(loQ, hiQ);
      return { a: d * q, b: d, op: "÷", ans: q };
    }
  };

  /* ------------------------------------------------- MENTAL MATHS STRATEGIES */
  /* Each strategy teaches a trick, then drills it. `make()` returns a worked
     example with step-by-step lines she reads while the app reads aloud. */
  const strategies = [
    {
      id: "make10", name: "Make a Ten", emoji: "🔟",
      idea: "Push the first number up to 10, then add whatever is left.",
      make() {
        const a = ri(6, 9), b = ri(3, 9);
        const need = 10 - a, rest = b - need;
        return {
          a, b, ans: a + b,
          steps: [
            a + " needs " + need + " more to become 10.",
            "Take " + need + " from " + b + " — that leaves " + rest + ".",
            "10 + " + rest + " = " + (a + b) + " 🎉"
          ]
        };
      }
    },
    {
      id: "splitTens", name: "Split the Tens", emoji: "✂️",
      idea: "Add the tens first, then the ones, then put them together.",
      make() {
        const a = ri(21, 68), b = ri(21, 68);
        const at = Math.floor(a / 10) * 10, ao = a % 10;
        const bt = Math.floor(b / 10) * 10, bo = b % 10;
        return {
          a, b, ans: a + b,
          steps: [
            "Tens first: " + at + " + " + bt + " = " + (at + bt),
            "Now the ones: " + ao + " + " + bo + " = " + (ao + bo),
            "Put them together: " + (at + bt) + " + " + (ao + bo) + " = " + (a + b) + " 🎉"
          ]
        };
      }
    },
    {
      id: "nearDouble", name: "Near Doubles", emoji: "👯",
      idea: "If the numbers are almost twins, double one and fix it up.",
      make() {
        const a = ri(4, 19), extra = pick([1, 2]), b = a + extra;
        return {
          a, b, ans: a + b,
          steps: [
            "They are almost twins!",
            "Double " + a + " = " + (a * 2),
            (a * 2) + " + " + extra + " = " + (a + b) + " 🎉"
          ]
        };
      }
    },
    {
      id: "addNine", name: "The +9 Trick", emoji: "🪄",
      idea: "Adding 9? Add 10 and then take 1 back.",
      make() {
        const a = ri(12, 78), b = pick([9, 19]);
        const ten = b + 1;
        return {
          a, b, ans: a + b,
          steps: [
            "9 is nearly 10 — so add " + ten + " instead.",
            a + " + " + ten + " = " + (a + ten),
            "Now give 1 back: " + (a + ten) + " − 1 = " + (a + b) + " 🎉"
          ]
        };
      }
    },
    {
      id: "countOn", name: "Count On", emoji: "🐾",
      idea: "Start from the BIGGER number and hop forward.",
      make() {
        const small = ri(2, 5), big = ri(23, 88);
        const steps = ["Start at the bigger number: " + big + "."];
        let cur = big; const trail = [];
        for (let i = 0; i < small; i++) { cur++; trail.push(cur); }
        steps.push("Hop forward " + small + " times: " + trail.join(", ") + ".");
        steps.push("You landed on " + cur + " 🎉");
        return { a: big, b: small, ans: big + small, steps };
      }
    }
  ];

  /* A mixed bag of quick head-sums for the timed speed drill. */
  function quickSum(level) {
    const kinds = level === 1
      ? ["oneOne", "twoOne", "roundTen"]
      : ["oneOne", "twoOne", "roundTen", "twoTwoEasy", "plusNine", "doubles"];
    switch (pick(kinds)) {
      case "oneOne":   { const a = ri(3, 9),   b = ri(3, 9);  return { a, b, ans: a + b }; }
      case "twoOne":   { const a = ri(11, 89), b = ri(2, 9);  return { a, b, ans: a + b }; }
      case "roundTen": { const a = ri(11, 79), b = pick([10, 20, 30]); return { a, b, ans: a + b }; }
      case "doubles":  { const a = ri(6, 25); return { a, b: a, ans: a * 2 }; }
      case "plusNine": { const a = ri(11, 79), b = pick([9, 11, 19]); return { a, b, ans: a + b }; }
      default:         { const a = ri(11, 44), b = ri(11, 44); return { a, b, ans: a + b }; }
    }
  }

  /* Column-arithmetic worked steps — used by the "Show me how" helper. */
  function explain(q) {
    const ao = q.a % 10, at = Math.floor(q.a / 10);
    const bo = q.b % 10, bt = Math.floor(q.b / 10);
    if (q.op === "+") {
      const onesSum = ao + bo, carried = onesSum >= 10;
      return [
        "Ones column: " + ao + " + " + bo + " = " + onesSum +
          (carried ? " → write " + (onesSum % 10) + ", carry 1 ✋" : " → write " + onesSum),
        "Tens column: " + at + " + " + bt + (carried ? " + 1 (carried)" : "") +
          " = " + (at + bt + (carried ? 1 : 0)),
        "Answer: " + q.ans + " 🎉"
      ];
    }
    if (q.op === "−") {
      if (ao < bo) {
        return [
          "We cannot do " + ao + " − " + bo + ", so borrow 1 ten. 🤝",
          "Now the ones are " + (ao + 10) + " − " + bo + " = " + (ao + 10 - bo),
          "Tens: " + (at - 1) + " − " + bt + " = " + (at - 1 - bt),
          "Answer: " + q.ans + " 🎉"
        ];
      }
      return [
        "Ones: " + ao + " − " + bo + " = " + (ao - bo),
        "Tens: " + at + " − " + bt + " = " + (at - bt),
        "Answer: " + q.ans + " 🎉"
      ];
    }
    if (q.op === "×") {
      const onesP = ao * q.b, carry = Math.floor(onesP / 10);
      return [
        "Ones: " + ao + " × " + q.b + " = " + onesP +
          (carry ? " → write " + (onesP % 10) + ", carry " + carry + " ✋" : ""),
        "Tens: " + at + " × " + q.b + " = " + (at * q.b) +
          (carry ? ", plus the carried " + carry + " = " + (at * q.b + carry) : ""),
        "Answer: " + q.ans + " 🎉"
      ];
    }
    return [
      "How many " + q.b + "s fit into " + q.a + "?",
      "Use the " + q.b + " table: " + q.b + " × " + q.ans + " = " + q.a,
      "So the answer is " + q.ans + " 🎉"
    ];
  }

  return {
    tablesUpTo: 15, rowsPerTable: 10,
    tableRows, chant, tricks: TABLE_TRICKS,
    gen, strategies, quickSum, explain, ri, pick
  };
})();
if (typeof window !== "undefined") window.MATHS = MATHS;
