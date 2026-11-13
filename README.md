# 🌈 Myra Learns

One app for **Myra (Class 1)** — Hindi, English, Maths and Computers in a single, mobile-friendly
place. Everything is spoken aloud, everything is tappable, and it works offline after
the first load.

**One app that grows with her.** Each year, edit the three `content-*.js` files and bump
`klass` in `config.js` — the engine, screens and games stay exactly the same.

---

## What's inside

### 📕 Hindi — मात्रा, शब्द और वाक्य
| | |
|---|---|
| **All 14 maatras** | बिना मात्रा, ा, ि, ी, ु, ू, े, ै, ो, ौ, ं, ँ, ृ, ः |
| **10 shabd each** | 140 picture-words with emoji, roman spelling and meaning |
| **Sound ladder** | क + ा = का — tap any syllable to hear it |
| **Reading room** | 3 sentence levels (30 sentences) + 3 short stories |
| **Games** | Listen & Tap · Picture Match · Mixed Quiz · Finger-trace writing |
| **Numbers 1–100** | Hindi names, Roman reading aids, and both numeral scripts; ten-number groups with tap-to-hear, repeat, slow mode, and stop |
| **Weekdays & months** | All seven days (Monday–Sunday) and twelve Gregorian months (January–December) in Hindi, with English meanings and the same pronunciation controls |

Every maatra tile shows the sign **riding on क** (का, कि, की…) so she sees its real shape,
not a lone dotted circle.

### 📘 English — Spelling & Reading
| | |
|---|---|
| **96 dictation words** | 6 themed sets of 16, pitched at *building · post office · florist · watchman* level |
| **How dictation works** | The app **says the word** → Myra **spells it** with letter tiles |
| **Gentle hints** | Syllables (`po-lice-man`) → first letter → the word used in a sentence |
| **Reading room** | 2 sentence levels + 3 little stories |
| **Games** | Listen & Pick · Spell-athon (all 96 words) |

Wrong letters never fill the slot — she simply tries again, and a hint appears
automatically after two misses.

### 📗 Maths — Tables, Sums & Brain Speed
| | |
|---|---|
| **Tables 1–20** | Multipliers 1–10, tap-to-hear rows, chant-along, a memory trick for every table, quizzes |
| **🚀 Table Quest** | Ten-fact learning missions, missed-fact rescue, missing multipliers, swapped factors, and accuracy-first speed flights across tables 1–20 |
| **Addition** | 2-digit + 2-digit, **always with a carry**, shown in proper column form |
| **Subtraction** | 2-digit − 2-digit, **always with a borrow**, never negative |
| **Multiplication** | 2-digit × 1-digit |
| **Division** | 2-digit ÷ 1-digit — **guaranteed exact, never a remainder** |
| **⚡ Brain Speed** | 60-second mental-addition sprint with a personal record |
| **✖️ RapidFire Tables** | 20 shuffled multiplication questions: tables 1–13 × 1–9, no repeated pair in a round. Count-up timer, retry until correct, table-trick hint after two misses, first-try count, and a separate best-time record (also in Grown-ups). No time limit. |
| **5 mental tricks** | Make a Ten · Split the Tens · Near Doubles · The +9 Trick · Count On |

Sums are **generated**, never a fixed list — she can practise forever and never
memorise the answers. "💡 Show me how" walks through the carry/borrow step by step,
out loud.

---

### 🚀 Table Quest

Choose a single table or a band (including 15–20 or all 1–20). Learn & play
prioritises up to four previously missed/hinted facts, then unseen facts, without
duplicates in a ten-question mission. Answers, missing multipliers and swapped
factors practise the same underlying facts. Shortcuts explain the current numbers;
read-aloud, fuel stars and first-try streaks encourage understanding.

Speed flight uses typed answers with an explicit Check button. Its count-up clock
measures answering time (including retries and hints), excluding feedback/Next time.
There is no deadline. Only a completed ten-fact round with every answer correct
first try and no hints can set a best time. Records are separate per selected range.
Reset best times clears these records too. Earlier RapidFire Tables remains
1–13 × 1–9 and retains its separate record.

Latest independent-correct status for all 200 facts saves at mission completion;
leaving early discards that mission. Rescue revisits incorrect or hinted facts.
The constellation and Grown-ups page show latest results, not guaranteed mastery.
Reset progress clears these results; Reset best times does not.

Content checks: `node --test tests/table-quest.test.cjs` (Node.js built-ins only).

### 🌱 Maths Skill Builders

Maths → Skill Builders contains three untimed explore-and-check activities:

- Balance Detectives: add/remove identical blocks on an equal-arm balance; practise heavier/lighter, level pans, two-balance comparisons and equalising weights.
- Tens & Ones: build 0–99 on labelled abacus rods; distinguish the tens digit, its value and the whole number, including zero ones and swapped digits.
- Calendar Explorers: explore all 12 month lengths and ordinary/leap February using seven-day rows; practise 30/31-day months, February, weeks/year facts and checking both statements.

Checks have 6, 6 and 8 questions respectively, with first-choice scoring, explicit Next,
explanations and missed-question review. Fresh checks vary number/month examples.
Two consecutive perfect checks earn a Ready practice badge (not a guarantee of mastery).
Per-skill latest/best scores and streaks persist on-device; Grown-ups shows latest scores.
Abandoned checks do not change scores. Reset best times preserves these records;
Reset progress clears them. No exam results or personal assessment details are included.

### 💻 Computers — Grade 1 Olympiad

Exactly 50 original four-option questions with explanations: 8 computer basics/parts,
9 keyboard/mouse, 6 uses/operations/habits, 5 Paint, 8 everyday IT, 7 reasoning,
and 7 application challenges. Includes original device/shape drawings, spoken questions
and options, slow speech, manual Next, and missed-question revision.

- Practise 10, practise all 50, or pick a topic. The first choice counts; explanations appear immediately.
- The untimed SOF-style mock draws 35 distinct questions: 5 reasoning, 20 computer science,
  5 IT (1 mark each), and 5 challenges (2 marks each): 40 marks, no negative marking.
  Choices can change before Next; no answer feedback appears until completion.
- Latest per-question answers and mock best marks are stored on this device and appear in Grown-ups.
  Incomplete practice saves answered questions; incomplete mocks do not save answers.
  Leaving a round starts it over. Reset best times preserves this progress; Reset progress clears it.
- Sources consulted on 25 October 2026:
  [SOF ICSO Class 1 syllabus/pattern](https://sofworld.org/icso/class-1/icso-syllabus/icso-syllabus-class-1)
  and [CREST CCO Class 1 syllabus](https://www.crestolympiads.com/cyber-olympiad-cco/class-1).
  Windows topics follow Windows 11 concepts. The exam organiser is not confirmed.
  These are independently written practice questions, not copied, official, or predicted exam questions.
  CREST has a different paper structure; the mock follows SOF, not CREST.

## Built for a 6-year-old on a phone
- **Big touch targets** — every button is at least 52 px.
- **Everything speaks** — Hindi (`hi-IN`) and Indian English (`en-IN`) text-to-speech.
- **Tap any word** in any sentence to hear just that word.
- **🎤 Say it** — optional microphone practice; always encouraging, never blocks her.
- **Rewards** — stars, confetti, day streaks, and a record to beat.
- **Reset best times** — home-page button clears RapidFire100, RapidFire0, and RapidFire Tables time records on this device after confirmation. Stars, learning progress, streaks, and high scores (including Brain Speed) stay unchanged.
- **🏠 button** so she is never lost deep inside an activity.
- **Offline** after first load. No accounts, no ads, no trackers, no data leaves the phone.

## Files
| File | Purpose |
|------|---------|
| `index.html` | App shell |
| `config.js` | **Child name, class, voices, subject list** |
| `content-hindi.js` | Maatras, words, sentences, stories |
| `content-english.js` | Dictation sets, reading levels, passages |
| `content-maths.js` | Tables, sum generators, mental-maths strategies |
| `screens-table-quest.js` | Tables 1–20 learning, rescue and scoped speed-flight records |
| `content-computers.js` | 50 original computer olympiad questions, topic groups, source references |
| `screens-computers.js` | Topic practice, mock, spoken feedback, original figures, revision and progress |
| `engine.js` | Speech, sounds, router, tracing, stars, UI helpers |
| `screens-hindi.js` / `screens-english.js` / `screens-maths.js` | Subject screens |
| `app.js` | Home screen, grown-ups page, boot |
| `style.css` | Mobile-first styles + per-subject theming |

Zero dependencies. No build step. Plain HTML/CSS/JS.

---

## Updating for the next class
1. Edit `content-hindi.js`, `content-english.js`, `content-maths.js`.
2. Change `klass: 1` → `klass: 2` in `config.js`.
3. Bump the `?v=1` query strings in `index.html` so her phone picks up the new version.

To **add a new subject** (e.g. EVS):
1. Add an entry to `subjects` in `config.js`.
2. Create `content-evs.js` and `screens-evs.js` (copy an existing screens file).
3. Add both `<script>` tags to `index.html` and one line to `SCREENS` in `app.js`.

---

## Hosting on GitHub Pages
```bash
cd Personal_MyraLearns
git init
git add .
git commit -m "Myra Learns — Hindi, English & Maths in one app"
git branch -M main
git remote add origin https://github.com/<username>/Personal_MyraLearns.git
git push -u origin main
```
Then **Settings → Pages → Source: `main` / `(root)` → Save**.

The app goes live at `https://<username>.github.io/Personal_MyraLearns/`.

**On her phone:** open that link → *Add to Home Screen* (Share icon on iOS, ⋮ menu on
Android). It then opens full-screen like a real app.

> **Tip for the clearest Hindi:** install a Hindi voice on the phone —
> Settings → Language → Text-to-speech → Hindi. The *Grown-ups* page has test buttons
> for both voices.

Made with ❤️ for Myra.
