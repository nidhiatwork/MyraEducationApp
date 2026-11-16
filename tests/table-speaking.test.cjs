const { test } = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "content-table-speaking.js"), "utf8"), context);
const t = context.window.TABLE_SPEAKING;

test("exact answers in digits and English cover every table product, including 100-200", () => {
  for (let n = 0; n <= 200; n++) {
    assert.equal(t.parseAnswer(String(n)), n);
    assert.equal(t.parseAnswer(t.words(n)), n);
    assert.equal(t.parseAnswer(t.words(n).replace(" and ", " ")), n);
    assert.equal(t.parseAnswer("The answer is " + t.words(n) + "."), n);
  }
  for (const [spoken, number] of [["sixteen", 16], ["thirty-two", 32], ["ONE HUNDRED AND SIXTY!", 160],
    ["a hundred and forty four", 144], ["hundred sixty", 160], ["it's 200.", 200]]) {
    assert.equal(t.parseAnswer(spoken), number);
  }
});

test("ambiguous answers and partial matches are not credited", () => {
  for (const value of ["", "six", "sixteen"]) assert.notEqual(t.parseAnswer(value), 60);
  for (const value of ["sixteen or sixty", "16 32", "I think sixteen maybe sixty", "sixteen ones are",
    "16 times 2", "16.5", "-16", "201", "one thousand", "two hundred one", "four four", "and sixteen",
    "sixteen plus zero", "one sixty", "sixteen, thirty two", "one hundred and", "sixteen and"]) {
    assert.equal(t.parseAnswer(value), null, value);
  }
});

test("every table has ten ones-through-tens prompts without leaked answers", () => {
  const suffix = ["ones", "twos", "threes", "fours", "fives", "sixes", "sevens", "eights", "nines", "tens"];
  for (let n = 1; n <= 20; n++) {
    for (let i = 1; i <= 10; i++) {
      assert.equal(t.prompt(n, i), `${t.words(n)} ${suffix[i - 1]} are`);
      assert.equal(t.line(n, i), `${t.prompt(n, i)} ${t.words(n * i)}.`);
    }
  }
  assert.equal(t.line(16, 10), "sixteen tens are one hundred and sixty.");
  assert.equal(t.line(20, 10), "twenty tens are two hundred.");
  assert.throws(() => t.prompt(0, 1));
  assert.throws(() => t.prompt(21, 1));
  assert.throws(() => t.prompt(16, 11));
});
