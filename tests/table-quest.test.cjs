const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "..", "content-maths.js"), "utf8"), context);
const maths = context.window.MATHS;

test("all twenty learning tables have ten correct rows and a trick", () => {
  assert.equal(maths.tablesUpTo, 20);
  assert.equal(maths.rowsPerTable, 10);
  for (let a = 1; a <= 20; a++) {
    const rows = maths.tableRows(a, maths.rowsPerTable);
    assert.equal(rows.length, 10);
    assert(maths.tricks[a].length > 20);
    rows.forEach((q, i) => {
      assert.equal(q.a, a);
      assert.equal(q.b, i + 1);
      assert.equal(q.ans, a * (i + 1));
      assert.equal(maths.chant(a, i + 1), `${a} times ${i + 1} is ${a * (i + 1)}`);
    });
  }
});

test("quest covers all 200 facts and each configured band including 15-20", () => {
  for (const [lo, hi] of [[1, 20], [1, 5], [6, 10], [11, 15], [16, 20], [15, 20],
    ...Array.from({ length: 20 }, (_, i) => [i + 1, i + 1])]) {
    const pool = maths.questPool(lo, hi);
    assert.equal(pool.length, (hi - lo + 1) * 10);
    assert.equal(new Set(pool.map(q => q.id)).size, pool.length);
    pool.forEach(q => {
      assert(q.a >= lo && q.a <= hi);
      assert(q.b >= 1 && q.b <= 10);
      assert.equal(q.id, `${q.a}x${q.b}`);
      assert.equal(q.ans, q.a * q.b);
    });
  }
});

test("all 600 question variations have one correct choice and valid arithmetic", () => {
  maths.questPool(1, 20).forEach(fact => {
    for (const kind of ["product", "missing", "swap"]) {
      const q = maths.questQuestion(fact, kind);
      assert.equal(q.answer, kind === "missing" ? fact.b : fact.ans);
      assert.equal(q.choices.length, 4);
      assert.equal(new Set(q.choices).size, 4);
      assert.equal(q.choices.filter(c => c === q.answer).length, 1);
      assert(q.choices.every(c => Number.isInteger(c) && c > 0));
      assert.equal(q.prompt, kind === "missing" ? `${fact.a} × ? = ${fact.ans}` :
        kind === "swap" ? `${fact.b} × ${fact.a} = ?` : `${fact.a} × ${fact.b} = ?`);
      assert(q.speech.endsWith("?"));
    }
    const hint = maths.questHint(fact);
    assert(hint.endsWith(`= ${fact.ans}.`));
    // Verify every worked equality in the shortcut, not just its final answer.
    for (const match of hint.matchAll(/(\d+(?: [×+−] \d+)+) = (\d+)/g)) {
      const expression = match[1].replaceAll("×", "*").replaceAll("−", "-");
      assert.equal(vm.runInNewContext(expression), Number(match[2]), hint);
    }
  });
});
