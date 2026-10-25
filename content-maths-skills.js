const MATH_SKILLS = (function () {
  "use strict";
  const months = [
    ["January", 31], ["February", 28], ["March", 31], ["April", 30],
    ["May", 31], ["June", 30], ["July", 31], ["August", 31],
    ["September", 30], ["October", 31], ["November", 30], ["December", 31]
  ];
  const topics = [
    { id: "balance", name: "Balance Detectives", emoji: "⚖️",
      rule: "On an equal-arm balance, the heavier side goes down and the lighter side goes up. Level pans mean equal weight. Compare the pans, not the size of the drawings." },
    { id: "abacus", name: "Tens & Ones", emoji: "🧮",
      rule: "The left rod is Tens: each bead is worth 10. The right rod is Ones: each bead is worth 1. In 47, the tens digit is 4, its value is 40, and the whole number is 47." },
    { id: "calendar", name: "Calendar Explorers", emoji: "📅",
      rule: "Thirty days have September, April, June and November. The other months have 31, except February: 28 days in an ordinary year and 29 in a leap year. A week has 7 days; a year has 12 months." }
  ];
  function q(prompt, answer, options, why, picture) {
    return { prompt, answer: String(answer), options: [...new Set(options.map(String))], why, picture };
  }
  function balanceQuestions() {
    const a = MATHS.ri(1, 3), b = a + MATHS.ri(1, 3);
    const scene = (left, right, lw, rw) => ({ kind: "scale", left, right, lw, rw });
    const chain = { kind: "chain", scenes: [
      scene("Kite box", "Toy box", 3, 6), scene("Toy box", "Book box", 6, 9)
    ] };
    return [
      q("Which side is heavier?", "Left", ["Left", "Right", "Equal weight"],
        "The left pan is lower. Lower means heavier.", scene("Left", "Right", b, a)),
      q("Which side is lighter?", "Left", ["Left", "Right", "Equal weight"],
        "The left pan is higher. Higher means lighter.", scene("Left", "Right", a, b)),
      q("What do these level pans tell us?", "Equal weight", ["Left is heavier", "Right is heavier", "Equal weight"],
        "Level pans mean the two sides have equal weight.", scene("Left", "Right", a, a)),
      q("Use BOTH balances. Which box is heaviest?", "Book box", ["Kite box", "Toy box", "Book box"],
        "Toy box is heavier than Kite box. Book box is heavier than Toy box, so Book box is heaviest.", chain),
      q("Use BOTH balances. Which box is lightest?", "Kite box", ["Kite box", "Toy box", "Book box"],
        "Kite box is lighter than Toy box, which is lighter than Book box. Kite box is lightest.", chain),
      q("Left has " + a + " identical blocks; right has " + b + ". How many blocks must you ADD to the LEFT to balance?",
        b - a, [b - a, b, b + a, 0], a + " + " + (b - a) + " = " + b + ". Equal numbers of identical blocks have equal weight.",
        scene(a + " blocks", b + " blocks", a, b))
    ];
  }
  function abacusQuestions() {
    const t = MATHS.ri(2, 8);
    let o = MATHS.ri(1, 9);
    if (o === t) o = t === 8 ? 9 : t + 1;
    const n = t * 10 + o;
    const picture = { kind: "abacus", tens: t, ones: o };
    return [
      q("What whole number is on the abacus?", n, [n, o * 10 + t, t + o, t * 10],
        t + " tens = " + t * 10 + ". Add " + o + " ones to make " + n + ".", picture),
      q("In " + n + ", which DIGIT is in the tens place?", t, [t, o, t * 10, n],
        "The tens digit is " + t + ". A digit is not the same as its place value.", picture),
      q("In " + n + ", what is the VALUE of the tens digit?", t * 10, [t * 10, t, o, n],
        t + " in the tens place means " + t + " groups of 10, which is " + t * 10 + ".", picture),
      q("What is the value of the ones digit?", o, [o, t, o * 10, n],
        o + " ones are worth " + o + ".", picture),
      q("The Ones rod is empty. What number is shown?", t * 10, [t * 10, t, t + 1, t * 10 + 1],
        "An empty Ones rod means zero ones. " + t + " tens and 0 ones make " + t * 10 + ".",
        { kind: "abacus", tens: t, ones: 0 }),
      q("If the tens and ones digits in " + n + " swap places, what is the new number?",
        o * 10 + t, [o * 10 + t, n, t + o, o * 10],
        "Now " + o + " is in Tens and " + t + " is in Ones: " + o * 10 + " + " + t + " = " + (o * 10 + t) + ".")
    ];
  }
  function calendarQuestions() {
    const chosen = [30, 31].flatMap(days => E.shuffle(months.filter(m => m[1] === days)).slice(0, 2));
    return chosen.map(([name, days]) => q("How many days are in " + name + "?", days, [28, 29, 30, 31],
      name + " has " + days + " days. " + (days === 30 ? "It is one of the four 30-day months." : "It is not February or a 30-day month.")))
      .concat([
        q("How many days does February have in an ORDINARY year?", 28, [28, 29, 30, 31],
          "February has 28 days in an ordinary year."),
        q("How many days does February have in a LEAP year?", 29, [28, 29, 30, 31],
          "A leap year gives February one extra day: 28 + 1 = 29."),
        q("Which statement is true?", "Both are true", ["Only the first", "Only the second", "Both are true", "Neither is true"],
          "Check each statement separately: a week has 7 days AND a year has 12 months. Both are true.",
          { kind: "statements", lines: ["First: A week has 7 days.", "Second: A year has 12 months."] }),
        q("Does EVERY month have exactly 4 weeks?", "No", ["Yes", "No"],
          "4 weeks are 28 days. Months with 30 or 31 days have extra days, so not every month is exactly 4 weeks.")
      ]);
  }
  return { topics, months, make: { balance: balanceQuestions, abacus: abacusQuestions, calendar: calendarQuestions } };
})();
if (typeof window !== "undefined") window.MATH_SKILLS = MATH_SKILLS;
