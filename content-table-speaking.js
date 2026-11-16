/* Exact English number matching for table answers. Never use substring matching. */
const TABLE_SPEAKING = (function () {
  "use strict";
  const small = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
    "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
    "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  function words(n) {
    if (!Number.isInteger(n) || n < 0 || n > 200) throw new RangeError("Expected a whole number from 0 to 200");
    if (n < 20) return small[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + small[n % 10] : "");
    return small[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + words(n % 100) : "");
  }
  const names = new Map();
  for (let n = 0; n <= 200; n++) {
    const name = words(n);
    names.set(name, n);
    names.set(name.replace(" and ", " "), n);
    if (n >= 100 && n < 200) {
      names.set(name.replace("one hundred", "a hundred"), n);
      names.set(name.replace("one hundred", "hundred"), n);
      names.set(name.replace("one hundred", "a hundred").replace(" and ", " "), n);
      names.set(name.replace("one hundred", "hundred").replace(" and ", " "), n);
    }
  }
  function parseAnswer(text) {
    let value = String(text || "").toLowerCase().trim().replace(/[.!?]+$/, "").trim();
    value = value.replace(/^(?:the answer is|answer is|it is|it's)\s+/, "");
    if (/^\d{1,3}$/.test(value)) return Number(value) <= 200 ? Number(value) : null;
    value = value.replace(/-/g, " ").replace(/\s+/g, " ").trim();
    return names.has(value) ? names.get(value) : null;
  }
  const multipliers = ["", "ones", "twos", "threes", "fours", "fives", "sixes", "sevens", "eights", "nines", "tens"];
  function prompt(n, multiplier) {
    if (!Number.isInteger(n) || n < 1 || n > 20 || !Number.isInteger(multiplier) || multiplier < 1 || multiplier > 10) {
      throw new RangeError("Expected table 1–20 and multiplier 1–10");
    }
    return words(n) + " " + multipliers[multiplier] + " are";
  }
  function line(n, multiplier) { return prompt(n, multiplier) + " " + words(n * multiplier) + "."; }
  return { words, parseAnswer, prompt, line };
})();
if (typeof window !== "undefined") window.TABLE_SPEAKING = TABLE_SPEAKING;
