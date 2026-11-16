/* Run with an installed Playwright: node tests/table-speaking.browser.cjs
   Serve the repository at TABLE_TEST_URL (default http://127.0.0.1:8768).
   Isolated browser contexts; never requests a real microphone. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const path = require("node:path");
const base = process.env.TABLE_TEST_URL || "http://127.0.0.1:8768";

function fakeSpeech({ noRecognition = false, noAudio = false }) {
  const state = window.__speechTest = { lines: [], sessions: [], active: null, mic: null, error: null, startMode: "normal" };
  class Utterance { constructor(text) { this.text = text; } }
  const synth = {
    getVoices: () => [{ lang: "en-IN", name: "Test English" }],
    speak(u) {
      if (!u.text.trim()) { if (u.onend) u.onend(); return; }
      if (state.mic) throw Error("Speech overlapped microphone");
      if (state.active) throw Error("Overlapping speech");
      if (state.throwSpeech) throw Error("Speech failure");
      state.active = u; state.lines.push(u.text);
    },
    cancel() { state.active = null; }
  };
  class Recognition {
    constructor() { state.sessions.push(this); this.aborted = false; }
    start() {
      if (state.startMode === "throw") throw Error("Recognition start failure");
      if (state.active || state.mic) throw Error("Overlapping speech/listening");
      state.mic = this;
      if (state.startMode !== "hang" && this.onstart) this.onstart();
    }
    abort() { this.aborted = true; if (state.mic === this) state.mic = null; }
  }
  Object.defineProperty(window, "speechSynthesis", { configurable: true, value: noAudio ? undefined : synth });
  window.SpeechSynthesisUtterance = noAudio ? undefined : Utterance;
  window.SpeechRecognition = noRecognition ? undefined : Recognition;
  window.webkitSpeechRecognition = undefined;
  state.endSpeech = () => {
    const u = state.active;
    if (!u) throw Error("No speech to finish");
    state.active = null; if (u.onend) u.onend();
  };
  state.result = (text, final = true) => {
    const rec = state.mic;
    if (!rec) throw Error("No microphone session");
    const result = [{ transcript: text }]; result.isFinal = final;
    const callback = rec.onresult;
    const event = { resultIndex: 0, results: [result] };
    callback(event);
    // Providers can deliver duplicate or delayed result events.
    callback(event);
  };
  state.recError = code => {
    if (!state.mic) throw Error("No microphone session");
    state.mic.onerror({ error: code });
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const contexts = [];
  async function create(options = {}) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    contexts.push(context);
    await context.addInitScript(fakeSpeech, options);
    const page = await context.newPage();
    await page.clock.install();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      E.state.done["m-tab-15"] = true;
      E.state.best["m-rapidfire-tables-20-time"] = 17;
      E.save();
    });
    return { page, errors };
  }
  const btn = (page, name) => page.getByRole("button", { name, exact: true });
  async function table(page, n) {
    await page.evaluate(() => E.home());
    await page.getByRole("button", { name: /Maths गणित/ }).click();
    await page.getByRole("button", { name: /^✖️ Tables/ }).click();
    assert.equal(await page.locator(".tbtn").count(), 20);
    await btn(page, String(n)).click();
  }
  const status = page => page.locator(".table-speaking > [role=status]").innerText();
  const consent = page => page.getByLabel("Allow microphone-based answer practice", { exact: true });
  async function startVoice(page) {
    await consent(page).check();
    await btn(page, "🎤 Say the answers").click();
  }
  async function listen(page) {
    assert.equal(await page.evaluate(() => __speechTest.mic), null, "Mic must wait for prompt");
    await page.evaluate(() => __speechTest.endSpeech());
    await page.clock.runFor(301);
    assert.match(await status(page), /Listening — say only/);
  }
  async function nextPrompt(page) { await page.clock.runFor(651); }
  const checks = [];
  try {
    const { page, errors } = await create();
    // All twenty tables play ten correctly phrased complete lines, without a mic.
    for (let n = 1; n <= 20; n++) {
      await table(page, n);
      assert(await btn(page, "🎤 Say the answers").isDisabled());
      assert.equal(await page.evaluate(() => __speechTest.mic), null);
      await page.evaluate(() => { __speechTest.lines = []; });
      await btn(page, "▶ Play full table").click();
      for (let i = 1; i <= 10; i++) {
        assert.equal(await page.evaluate(() => __speechTest.active.text),
          await page.evaluate(({ n, i }) => TABLE_SPEAKING.line(n, i), { n, i }));
        assert.equal(await page.locator(".trow.lit").count(), 1);
        assert.equal(await page.locator(".trow.lit").getAttribute("aria-label"),
          await page.evaluate(({ n, i }) => TABLE_SPEAKING.line(n, i), { n, i }));
        await page.evaluate(() => __speechTest.endSpeech());
        if (i < 10) await page.clock.runFor(501);
      }
      assert.match(await status(page), /All ten lines played/);
      assert.equal(await page.evaluate(() => __speechTest.lines.length), 10);
      assert.equal(await page.evaluate(() => __speechTest.mic), null);
    }
    checks.push("all 200 full-table lines and speech-synchronised highlights");

    await table(page, 16);
    await startVoice(page);
    assert.equal(await page.evaluate(() => __speechTest.active.text), "sixteen ones are…");
    assert.equal(await page.locator(".tablelist").isVisible(), false, "Answers hidden in practice");
    const stars = await page.evaluate(() => E.state.stars);
    for (let i = 1; i <= 10; i++) {
      await listen(page);
      await page.evaluate(i => {
        const n = 16 * i;
        __speechTest.result(i % 2 ? TABLE_SPEAKING.words(n) : String(n));
      }, i);
      assert.equal(await page.evaluate(() => __speechTest.mic), null);
      if (i < 10) {
        await nextPrompt(page);
        assert.equal(await page.evaluate(() => __speechTest.active.text),
          await page.evaluate(i => TABLE_SPEAKING.prompt(16, i + 1) + "…", i));
      }
    }
    assert.match(await status(page), /answered all ten lines/);
    assert.equal(await page.evaluate(() => E.state.stars), stars + 3);
    await page.clock.runFor(15000);
    assert.equal(await page.evaluate(() => E.state.stars), stars + 3);
    checks.push("spoken 16 table auto-advances once per correct final answer and completes once");

    await btn(page, "🎤 Say the answers").click(); await listen(page);
    await page.evaluate(() => __speechTest.result("sixteen", false));
    assert.match(await status(page), /Listening/);
    await page.evaluate(() => __speechTest.result("sixty"));
    assert.match(await status(page), /Not quite/);
    assert.match(await page.locator(".table-speaking > .qprompt").innerText(), /Line 1/);
    assert.equal(await page.evaluate(() => __speechTest.mic), null);
    await btn(page, "▶ Resume / Try again").click(); await listen(page);
    await page.evaluate(() => __speechTest.result("sixteen or sixty"));
    assert.match(await status(page), /just one number/);
    await btn(page, "▶ Resume / Try again").click(); await listen(page);
    await page.evaluate(() => __speechTest.result("16"));
    // Pause during the feedback gap: resume must not credit/replay the answered fact.
    await btn(page, "⏸ Pause").click();
    await page.clock.runFor(1000);
    assert.equal(await page.evaluate(() => __speechTest.active), null);
    await btn(page, "▶ Resume / Try again").click();
    assert.equal(await page.evaluate(() => __speechTest.active.text), "sixteen twos are…");
    await listen(page);
    await btn(page, "💡 Show this answer").click();
    assert.match(await status(page), /answer is 32/);
    assert.equal(await page.evaluate(() => __speechTest.mic), null);
    await btn(page, "▶ Resume / Try again").click();
    assert.equal(await page.evaluate(() => __speechTest.active.text), "sixteen twos are…");
    checks.push("wrong/ambiguous/interim answers, helper and pause never skip facts");

    // Revoking consent closes an active microphone.
    await listen(page);
    await consent(page).uncheck();
    assert.equal(await page.evaluate(() => __speechTest.mic), null);
    assert(await btn(page, "🎤 Say the answers").isDisabled());
    await btn(page, "▶ Resume / Try again").click();
    assert.equal(await page.evaluate(() => __speechTest.mic), null);
    await btn(page, "⌨ Use number pad").click();
    assert.match(await page.locator(".table-speaking > .qprompt").innerText(), /Line 2/);
    assert.equal(await page.evaluate(() => __speechTest.active), null, "Manual fallback must work even when audio fails");
    await btn(page, "Check answer").click(); assert.match(await status(page), /Type your answer first/);
    await page.evaluate(() => {
      const keys = [...document.querySelectorAll(".table-speaking .key")];
      const press = s => keys.find(b => b.textContent === s).click();
      press("1"); press("⌫");
      if (document.querySelector(".table-speaking .answerbox").textContent) throw Error("Erase failed");
      press("0"); press("✓");
    });
    assert.match(await status(page), /Not quite/);
    await page.evaluate(() => {
      const keys = [...document.querySelectorAll(".table-speaking .key")];
      for (const s of ["3", "2", "✓", "✓"]) keys.find(b => b.textContent === s).click();
    });
    await nextPrompt(page);
    assert.match(await page.locator(".table-speaking > .qprompt").innerText(), /Line 3/);
    checks.push("revoked consent and silent number-pad fallback preserve incomplete row");

    // Error cases must neither advance nor claim success.
    for (const code of ["not-allowed", "audio-capture", "network", "no-speech", "service-not-allowed", "language-not-supported", "aborted"]) {
      await btn(page, "⏹ Stop").click();
      await startVoice(page); await listen(page);
      await page.evaluate(code => __speechTest.recError(code), code);
      assert.equal(await page.evaluate(() => __speechTest.mic), null);
      assert.match(await page.locator(".table-speaking > .qprompt").innerText(), /Line 1/);
      assert(!(await btn(page, "▶ Resume / Try again").isDisabled()));
      assert(!/Correct|answered all/.test(await status(page)));
    }
    await btn(page, "⏹ Stop").click(); await startVoice(page); await listen(page);
    await page.evaluate(() => __speechTest.mic.onend());
    assert.match(await status(page), /without a clear answer/);
    await btn(page, "▶ Resume / Try again").click(); await listen(page);
    await page.clock.runFor(12001);
    assert.match(await status(page), /did not hear/);
    await page.evaluate(() => { __speechTest.startMode = "hang"; });
    await btn(page, "▶ Resume / Try again").click();
    await page.evaluate(() => __speechTest.endSpeech());
    await page.clock.runFor(10301);
    assert.match(await status(page), /did not start/);
    await page.evaluate(() => { __speechTest.startMode = "throw"; });
    await btn(page, "▶ Resume / Try again").click();
    await page.evaluate(() => __speechTest.endSpeech()); await page.clock.runFor(301);
    assert.match(await status(page), /could not start/);
    await page.evaluate(() => { __speechTest.startMode = "normal"; });
    checks.push("permission/network/no-speech/end/start/listen timeouts and recognition exceptions");

    await btn(page, "▶ Play full table").click();
    await page.evaluate(() => __speechTest.active.onerror({ error: "synthesis-failed" }));
    assert.match(await status(page), /Audio could not play/);
    await btn(page, "▶ Resume / Try again").click();
    await page.clock.runFor(20001);
    assert.match(await status(page), /Playback did not finish/);
    await page.evaluate(() => { __speechTest.throwSpeech = true; });
    await btn(page, "▶ Resume / Try again").click();
    assert.match(await status(page), /Audio could not start/);
    await btn(page, "⌨ Use number pad").click();
    assert.match(await status(page), /Type the answer/);
    await page.evaluate(() => { __speechTest.throwSpeech = false; });
    checks.push("audio errors/timeouts do not silently advance; silent fallback works");

    await btn(page, "▶ Play full table").click();
    await page.evaluate(() => { window.__lateEnd = __speechTest.active.onend; });
    await btn(page, "⏸ Pause").click();
    await page.evaluate(() => window.__lateEnd());
    await page.clock.runFor(1000);
    assert.equal(await page.evaluate(() => __speechTest.active), null);
    await btn(page, "▶ Resume / Try again").click();
    assert.equal(await page.evaluate(() => __speechTest.active.text), "sixteen ones are sixteen.");
    await btn(page, "⏹ Stop").click();
    const count = await page.evaluate(() => __speechTest.lines.length);
    await page.clock.runFor(22000);
    assert.equal(await page.evaluate(() => __speechTest.lines.length), count);
    // Single rows now use the same owned player rather than an uncancellable sequence.
    await page.locator(".tablelist .trow").nth(9).click();
    assert.equal(await page.evaluate(() => __speechTest.active.text), "sixteen tens are one hundred and sixty.");
    await page.evaluate(() => __speechTest.endSpeech()); await page.clock.runFor(700);
    assert.equal(await page.evaluate(() => __speechTest.active), null);
    checks.push("full pause/resume/stop and single-row playback reject stale speech callbacks");

    await startVoice(page); await listen(page);
    await page.evaluate(() => { window.__oldResult = __speechTest.mic.onresult; });
    await btn(page, "▶ Play full table").click();
    assert.equal(await page.evaluate(() => __speechTest.mic), null);
    await page.evaluate(() => {
      const r = [{ transcript: "16" }]; r.isFinal = true;
      __oldResult({ resultIndex: 0, results: [r] });
    });
    assert.equal(await page.evaluate(() => __speechTest.active.text), "sixteen ones are sixteen.");
    await btn(page, "▶ Play full table").click();
    assert.equal(await page.evaluate(() => __speechTest.active.text), "sixteen ones are sixteen.");
    await page.goBack();
    assert.equal(await page.evaluate(() => __speechTest.active), null);
    assert.equal(await page.locator(".tbtn").count(), 20);
    await btn(page, "16").click();
    checks.push("mode switches, restarts and browser Back stop owned resources");

    await startVoice(page); await listen(page);
    await page.evaluate(() => { window.__lateResult = __speechTest.mic.onresult; E.home(); });
    assert.equal(await page.evaluate(() => __speechTest.mic), null, "Navigation must synchronously abort microphone");
    await page.evaluate(() => {
      const r = [{ transcript: "16" }]; r.isFinal = true;
      __lateResult({ resultIndex: 0, results: [r] });
    });
    await page.clock.runFor(2000);
    assert.equal(await page.evaluate(() => __speechTest.active), null);
    await table(page, 20); await startVoice(page);
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, value: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    assert.equal(await page.evaluate(() => __speechTest.active), null);
    await page.evaluate(() => {
      Object.defineProperty(document, "hidden", { configurable: true, value: false });
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await page.clock.runFor(1000);
    assert.equal(await page.evaluate(() => __speechTest.mic), null);
    await btn(page, "▶ Resume / Try again").click(); await listen(page);
    await page.evaluate(() => window.dispatchEvent(new Event("pagehide")));
    assert.equal(await page.evaluate(() => __speechTest.mic), null);
    checks.push("route exit, hidden tab and pagehide cancel audio/listening immediately");

    // Manual completion covers three-digit answers up to 200 without a microphone.
    await btn(page, "⌨ Use number pad").click();
    for (let i = 1; i <= 10; i++) {
      await page.evaluate(answer => {
        const keys = [...document.querySelectorAll(".table-speaking .key")];
        for (const k of String(answer)) keys.find(b => b.textContent === k).click();
        keys.find(b => b.textContent === "✓").click();
      }, 20 * i);
      if (i < 10) await nextPrompt(page);
    }
    assert.match(await status(page), /answered all ten/);
    assert.equal(await page.evaluate(() => E.state.best["m-rapidfire-tables-20-time"]), 17);
    assert(await page.evaluate(() => E.state.done["m-tab-15"]));
    assert(!(await page.evaluate(() => E.state.done["m-tab-20"])));
    checks.push("manual answers through 200; no automatic mastery tick or old-record changes");
    assert.deepEqual(errors, []);

    // Voice completion also works at the smallest and largest table boundaries.
    for (const n of [1, 20]) {
      await table(page, n); await startVoice(page);
      for (let i = 1; i <= 10; i++) {
        await listen(page);
        await page.evaluate(answer => __speechTest.result(TABLE_SPEAKING.words(answer)), n * i);
        if (i < 10) await nextPrompt(page);
      }
      assert.match(await status(page), /answered all ten/);
    }
    checks.push("spoken boundary tables 1 and 20, including two hundred");

    for (const config of [{ noRecognition: true }, { noAudio: true }]) {
      const { page: fallback, errors: fallbackErrors } = await create(config);
      await table(fallback, 16);
      assert(await btn(fallback, "🎤 Say the answers").isDisabled());
      if (config.noAudio) assert(await btn(fallback, "▶ Play full table").isDisabled());
      await btn(fallback, "⌨ Use number pad").click();
      assert.match(await status(fallback), /Type the answer/);
      assert.equal(await fallback.evaluate(() => __speechTest.mic), null);
      assert.deepEqual(fallbackErrors, []);
    }
    await page.clock.runFor(3000);
    await table(page, 16);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (process.env.TABLE_SCREENSHOT_DIR) {
      const { page: visual } = await create();
      await table(visual, 16);
      await visual.screenshot({ path: path.join(process.env.TABLE_SCREENSHOT_DIR, "spoken-tables-home.png"), fullPage: true });
      await startVoice(visual); await listen(visual);
      await visual.screenshot({ path: path.join(process.env.TABLE_SCREENSHOT_DIR, "spoken-tables-listening.png"), fullPage: true });
    }
    console.log(JSON.stringify({ passed: true, checks, unsupportedFallback: true, errors }, null, 2));
  } finally {
    for (const context of contexts) await context.close();
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
