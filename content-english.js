/* ============================================================================
   Myra Learns — ENGLISH content  (Class 1)
   ----------------------------------------------------------------------------
   Dictation words are pitched at the level Myra is working on:
   building, post office, tiny, busy, people, everyday, collects, parcels,
   letters, giant, papers, small, florist, policeman, postal worker, watchman.

   Word shape: { w: word, syl: "syl-la-ble hint", s: sentence, e: emoji }
   The app SPEAKS the word and Myra spells it — syl/s/e power the hints.
   ========================================================================== */
const ENGLISH = {

  /* ------------------------------------------------- 6 sets x 16 = 96 words */
  sets: [
    {
      id: "town", title: "Around My Town", emoji: "🏙️",
      blurb: "The words from your Post Office lesson",
      words: [
        { w: "building",      syl: "build-ing",       e: "🏢", s: "The post office is a tall building." },
        { w: "post office",   syl: "post of-fice",    e: "📮", s: "We buy stamps at the post office." },
        { w: "tiny",          syl: "ti-ny",           e: "🐜", s: "A tiny ant walked on my hand." },
        { w: "busy",          syl: "bu-sy",           e: "🐝", s: "The market is very busy today." },
        { w: "people",        syl: "peo-ple",         e: "👨‍👩‍👧", s: "Many people stand in the line." },
        { w: "everyday",      syl: "ev-ery-day",      e: "📅", s: "I drink milk everyday." },
        { w: "collects",      syl: "col-lects",       e: "📥", s: "He collects the letters at nine." },
        { w: "parcels",       syl: "par-cels",        e: "📦", s: "The van is full of parcels." },
        { w: "letters",       syl: "let-ters",        e: "✉️", s: "I write letters to my grandmother." },
        { w: "giant",         syl: "gi-ant",          e: "🦕", s: "A giant tree stands near my school." },
        { w: "papers",        syl: "pa-pers",         e: "📄", s: "The papers are on the table." },
        { w: "small",         syl: "small",           e: "🐭", s: "My puppy is still very small." },
        { w: "florist",       syl: "flo-rist",        e: "💐", s: "The florist sells pretty roses." },
        { w: "policeman",     syl: "po-lice-man",     e: "👮", s: "The policeman helps us cross the road." },
        { w: "postal worker", syl: "pos-tal work-er", e: "📬", s: "The postal worker brings our post." },
        { w: "watchman",      syl: "watch-man",       e: "💂", s: "The watchman opens the big gate." }
      ]
    },
    {
      id: "helpers", title: "Helping Hands", emoji: "🧑‍⚕️",
      blurb: "People who help us every day",
      words: [
        { w: "doctor",    syl: "doc-tor",     e: "🩺", s: "The doctor checks my throat." },
        { w: "teacher",   syl: "teach-er",    e: "👩‍🏫", s: "My teacher tells lovely stories." },
        { w: "farmer",    syl: "farm-er",     e: "👨‍🌾", s: "The farmer grows wheat and rice." },
        { w: "driver",    syl: "driv-er",     e: "🚌", s: "Our bus driver waves at me." },
        { w: "gardener",  syl: "gar-den-er",  e: "🌷", s: "The gardener waters the plants." },
        { w: "cleaner",   syl: "clean-er",    e: "🧹", s: "The cleaner keeps our school neat." },
        { w: "painter",   syl: "paint-er",    e: "🎨", s: "The painter painted our wall blue." },
        { w: "baker",     syl: "bak-er",      e: "🍞", s: "The baker makes warm bread." },
        { w: "barber",    syl: "bar-ber",     e: "💇", s: "The barber cut my brother's hair." },
        { w: "tailor",    syl: "tai-lor",     e: "🧵", s: "The tailor stitched my new dress." },
        { w: "carpenter", syl: "car-pen-ter", e: "🪚", s: "The carpenter made a wooden chair." },
        { w: "plumber",   syl: "plumb-er",    e: "🔧", s: "The plumber fixed our leaking tap." },
        { w: "nurse",     syl: "nurse",       e: "💉", s: "The nurse gave me a bandage." },
        { w: "dentist",   syl: "den-tist",    e: "🦷", s: "The dentist counted my teeth." },
        { w: "soldier",   syl: "sol-dier",    e: "🎖️", s: "The soldier keeps our country safe." },
        { w: "fireman",   syl: "fire-man",    e: "🚒", s: "The fireman put out the fire." }
      ]
    },
    {
      id: "places", title: "Places We Go", emoji: "🗺️",
      blurb: "Places around my city",
      words: [
        { w: "market",     syl: "mar-ket",       e: "🛒", s: "We buy fruit at the market." },
        { w: "hospital",   syl: "hos-pi-tal",    e: "🏥", s: "The hospital is near my house." },
        { w: "station",    syl: "sta-tion",      e: "🚉", s: "The train waits at the station." },
        { w: "library",    syl: "li-bra-ry",     e: "📚", s: "I borrow books from the library." },
        { w: "garden",     syl: "gar-den",       e: "🌳", s: "We play in the garden after school." },
        { w: "temple",     syl: "tem-ple",       e: "🛕", s: "The temple bell rings every morning." },
        { w: "factory",    syl: "fac-to-ry",     e: "🏭", s: "The factory makes paper boxes." },
        { w: "bakery",     syl: "bak-er-y",      e: "🧁", s: "The bakery smells so sweet." },
        { w: "school",     syl: "school",        e: "🏫", s: "My school has a big playground." },
        { w: "bridge",     syl: "bridge",        e: "🌉", s: "The bridge goes over the river." },
        { w: "street",     syl: "street",        e: "🛣️", s: "Our street is clean and quiet." },
        { w: "village",    syl: "vil-lage",      e: "🏘️", s: "My grandmother lives in a village." },
        { w: "museum",     syl: "mu-se-um",      e: "🏛️", s: "We saw old coins at the museum." },
        { w: "playground", syl: "play-ground",   e: "🛝", s: "The playground has a red slide." },
        { w: "chemist",    syl: "chem-ist",      e: "💊", s: "Mother bought medicine at the chemist." },
        { w: "restaurant", syl: "res-tau-rant",  e: "🍽️", s: "We ate dosa at the restaurant." }
      ]
    },
    {
      id: "describe", title: "Describing Words", emoji: "🌈",
      blurb: "Words that tell us how something is",
      words: [
        { w: "little",  syl: "lit-tle",   e: "🐣", s: "A little chick followed the hen." },
        { w: "quiet",   syl: "qui-et",    e: "🤫", s: "The library is very quiet." },
        { w: "noisy",   syl: "nois-y",    e: "📢", s: "The busy street is noisy." },
        { w: "happy",   syl: "hap-py",    e: "😀", s: "I feel happy on my birthday." },
        { w: "angry",   syl: "an-gry",    e: "😠", s: "The angry dog barked loudly." },
        { w: "hungry",  syl: "hun-gry",   e: "🍽️", s: "I am hungry after playing." },
        { w: "thirsty", syl: "thirst-y",  e: "💧", s: "The thirsty bird drank water." },
        { w: "careful", syl: "care-ful",  e: "⚠️", s: "Be careful near the hot pan." },
        { w: "gentle",  syl: "gen-tle",   e: "🕊️", s: "She has a gentle voice." },
        { w: "brave",   syl: "brave",     e: "🦁", s: "The brave boy helped the puppy." },
        { w: "clever",  syl: "clev-er",   e: "🦊", s: "The clever crow found water." },
        { w: "lazy",    syl: "la-zy",     e: "🦥", s: "The lazy cat slept all day." },
        { w: "quick",   syl: "quick",     e: "⚡", s: "The quick rabbit won the race." },
        { w: "heavy",   syl: "heav-y",    e: "🪨", s: "This box is too heavy for me." },
        { w: "empty",   syl: "emp-ty",    e: "🫙", s: "My water bottle is empty." },
        { w: "sleepy",  syl: "sleep-y",   e: "😴", s: "I feel sleepy at night." }
      ]
    },
    {
      id: "doing", title: "Doing Words", emoji: "🏃",
      blurb: "Action words we use every day",
      words: [
        { w: "carries",  syl: "car-ries",   e: "🎒", s: "She carries her bag to school." },
        { w: "delivers", syl: "de-liv-ers", e: "🛵", s: "He delivers parcels on a scooter." },
        { w: "washes",   syl: "wash-es",    e: "🧼", s: "Mother washes the clothes." },
        { w: "cleans",   syl: "cleans",     e: "🧽", s: "He cleans the window everyday." },
        { w: "watches",  syl: "watch-es",   e: "👀", s: "The watchman watches the gate." },
        { w: "helps",    syl: "helps",      e: "🤝", s: "My sister helps me with homework." },
        { w: "plants",   syl: "plants",     e: "🌱", s: "The gardener plants new seeds." },
        { w: "paints",   syl: "paints",     e: "🖌️", s: "She paints a giant rainbow." },
        { w: "brings",   syl: "brings",     e: "🎁", s: "Papa brings sweets for us." },
        { w: "sends",    syl: "sends",      e: "📤", s: "She sends letters to her friend." },
        { w: "opens",    syl: "o-pens",     e: "🔓", s: "The shopkeeper opens at eight." },
        { w: "closes",   syl: "clos-es",    e: "🔒", s: "The post office closes at five." },
        { w: "writes",   syl: "writes",     e: "✍️", s: "He writes on the small paper." },
        { w: "reads",    syl: "reads",      e: "📖", s: "She reads a story everyday." },
        { w: "sweeps",   syl: "sweeps",     e: "🧹", s: "The cleaner sweeps the floor." },
        { w: "waits",    syl: "waits",      e: "⏳", s: "He waits for the yellow bus." }
      ]
    },
    {
      id: "things", title: "Everyday Things", emoji: "🧺",
      blurb: "Things I see at home",
      words: [
        { w: "basket",   syl: "bas-ket",     e: "🧺", s: "The basket is full of mangoes." },
        { w: "bottle",   syl: "bot-tle",     e: "🍼", s: "My bottle keeps water cold." },
        { w: "ticket",   syl: "tick-et",     e: "🎫", s: "Papa bought a train ticket." },
        { w: "packet",   syl: "pack-et",     e: "📦", s: "I opened a packet of biscuits." },
        { w: "pencil",   syl: "pen-cil",     e: "✏️", s: "My pencil is red and long." },
        { w: "bucket",   syl: "buck-et",     e: "🪣", s: "The bucket is full of water." },
        { w: "blanket",  syl: "blan-ket",    e: "🛏️", s: "My blanket is soft and warm." },
        { w: "window",   syl: "win-dow",     e: "🪟", s: "A tiny bird sat on my window." },
        { w: "kitchen",  syl: "kitch-en",    e: "🍳", s: "Mother is busy in the kitchen." },
        { w: "cupboard", syl: "cup-board",   e: "🚪", s: "My books are in the cupboard." },
        { w: "umbrella", syl: "um-brel-la",  e: "☂️", s: "I take an umbrella in the rain." },
        { w: "jacket",   syl: "jack-et",     e: "🧥", s: "My jacket has a big pocket." },
        { w: "sandals",  syl: "san-dals",    e: "👡", s: "My sandals are near the door." },
        { w: "mirror",   syl: "mir-ror",     e: "🪞", s: "I comb my hair at the mirror." },
        { w: "candle",   syl: "can-dle",     e: "🕯️", s: "We lit a candle in the dark." },
        { w: "notebook", syl: "note-book",   e: "📓", s: "I write neatly in my notebook." }
      ]
    }
  ],

  /* -------------------------------------------------------- READING LEVELS */
  reading: [
    {
      id: "e1", title: "Level 1 · Short & Easy", emoji: "🌱",
      items: [
        { s: "The tiny bird sat on my window.",        e: "🐦" },
        { s: "My school is a big building.",           e: "🏫" },
        { s: "The busy bee flies from flower to flower.", e: "🐝" },
        { s: "Many people wait at the bus stop.",      e: "🚏" },
        { s: "I read a story everyday.",               e: "📖" },
        { s: "The small puppy has a soft blanket.",    e: "🐶" },
        { s: "A giant tree grows in our garden.",      e: "🌳" },
        { s: "The watchman opens the gate for us.",    e: "💂" },
        { s: "My pencil is inside the packet.",        e: "✏️" },
        { s: "The gardener plants tiny green seeds.",  e: "🌱" }
      ]
    },
    {
      id: "e2", title: "Level 2 · A Bit Longer", emoji: "🌿",
      items: [
        { s: "The postal worker collects letters from the red box.", e: "📮" },
        { s: "Every morning the baker makes warm, soft bread.",      e: "🍞" },
        { s: "The florist sells bright flowers near the station.",   e: "💐" },
        { s: "A policeman helps the children cross the busy street.", e: "👮" },
        { s: "My mother carries a basket full of fresh fruit.",      e: "🧺" },
        { s: "The van delivers parcels to every house on our street.", e: "🚚" },
        { s: "I keep my notebook and papers inside my school bag.",  e: "🎒" },
        { s: "The clever crow dropped stones into the water pot.",   e: "🐦‍⬛" },
        { s: "We saw a giant elephant at the village fair.",         e: "🐘" },
        { s: "The quiet library has hundreds of lovely books.",      e: "📚" }
      ]
    }
  ],

  /* ------------------------------------------------------------- PASSAGES */
  passages: [
    {
      id: "p1", title: "The Busy Post Office", emoji: "📮",
      lines: [
        "The post office is a busy building.",
        "Every day the postal worker collects letters and parcels.",
        "He puts the small papers into a big brown bag.",
        "A tiny van takes the parcels to every street.",
        "The watchman opens the giant gate for the van.",
        "Many people come here to send letters to their friends."
      ]
    },
    {
      id: "p2", title: "Helpers in My Town", emoji: "🧑‍🚒",
      lines: [
        "My town is full of kind helpers.",
        "The doctor helps us when we are not well.",
        "The florist gives us flowers for every happy day.",
        "The policeman keeps our busy street safe.",
        "The gardener plants little seeds in the park.",
        "I say thank you to all of them everyday."
      ]
    },
    {
      id: "p3", title: "My Little Garden", emoji: "🌻",
      lines: [
        "We have a small garden behind our house.",
        "A giant sunflower grows near the wall.",
        "Tiny birds come and sit on the branches.",
        "I fill my bucket and water the plants.",
        "My mother says I am a careful gardener.",
        "The garden makes everyone in my home happy."
      ]
    }
  ]
};

ENGLISH.allWords = function () {
  return ENGLISH.sets.reduce((a, s) => a.concat(s.words.map(w =>
    Object.assign({ set: s.id }, w))), []);
};
if (typeof window !== "undefined") window.ENGLISH = ENGLISH;
