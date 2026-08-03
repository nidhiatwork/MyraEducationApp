# 🌈 Myra Learns

One app for **Myra (Class 1)** — Hindi, English and Maths in a single, mobile-friendly
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
| **Tables 1–15** | Tap-to-hear rows, chant-along, a memory trick for every table, quizzes |
| **Addition** | 2-digit + 2-digit, **always with a carry**, shown in proper column form |
| **Subtraction** | 2-digit − 2-digit, **always with a borrow**, never negative |
| **Multiplication** | 2-digit × 1-digit |
| **Division** | 2-digit ÷ 1-digit — **guaranteed exact, never a remainder** |
| **⚡ Brain Speed** | 60-second mental-addition sprint with a personal record |
| **5 mental tricks** | Make a Ten · Split the Tens · Near Doubles · The +9 Trick · Count On |

Sums are **generated**, never a fixed list — she can practise forever and never
memorise the answers. "💡 Show me how" walks through the carry/borrow step by step,
out loud.

---

## Built for a 6-year-old on a phone
- **Big touch targets** — every button is at least 52 px.
- **Everything speaks** — Hindi (`hi-IN`) and Indian English (`en-IN`) text-to-speech.
- **Tap any word** in any sentence to hear just that word.
- **🎤 Say it** — optional microphone practice; always encouraging, never blocks her.
- **Rewards** — stars, confetti, day streaks, and a record to beat.
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
