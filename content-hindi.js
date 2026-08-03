/* ============================================================================
   Myra Learns — HINDI content  (Class 1)
   ----------------------------------------------------------------------------
   To update for a new class: edit this file only.
   Word shape:  { w: शब्द, r: roman, m: english meaning, e: emoji }
   Syllable ladders are GENERATED from CONSONANTS + the unit's maatra,
   so adding a maatra needs no extra typing.
   ========================================================================== */

/* Consonants used to build the syllable ladder (क + ा = का) */
const HI_CONSONANTS = [
  { c: "क", r: "k" }, { c: "ख", r: "kh" }, { c: "ग", r: "g" }, { c: "घ", r: "gh" },
  { c: "च", r: "ch" }, { c: "ज", r: "j" }, { c: "ट", r: "t" }, { c: "ड", r: "d" },
  { c: "त", r: "t" }, { c: "थ", r: "th" }, { c: "द", r: "d" }, { c: "ध", r: "dh" },
  { c: "न", r: "n" }, { c: "प", r: "p" }, { c: "फ", r: "ph" }, { c: "ब", r: "b" },
  { c: "भ", r: "bh" }, { c: "म", r: "m" }, { c: "य", r: "y" }, { c: "र", r: "r" },
  { c: "ल", r: "l" }, { c: "व", r: "v" }, { c: "श", r: "sh" }, { c: "स", r: "s" },
  { c: "ह", r: "h" }
];

const HINDI = {
  /* ------------------------------------------------------------ 14 MAATRAS */
  maatras: [
    {
      id: "a", maatra: "", show: "अ",
      name: "Bina Maatra", nameHi: "बिना मात्रा",
      vowel: "अ", vRoman: "a",
      tip: "Every plain letter already says 'a'. क says ka, म says ma!",
      tipHi: "हर अक्षर में 'अ' छुपा होता है।",
      sayAs: "बिना मात्रा",
      words: [
        { w: "घर",  r: "ghar",  m: "home",      e: "🏠" },
        { w: "नल",  r: "nal",   m: "tap",       e: "🚰" },
        { w: "बस",  r: "bas",   m: "bus",       e: "🚌" },
        { w: "कलम", r: "kalam", m: "pen",       e: "🖊️" },
        { w: "कमल", r: "kamal", m: "lotus",     e: "🪷" },
        { w: "नमक", r: "namak", m: "salt",      e: "🧂" },
        { w: "वन",  r: "van",   m: "forest",    e: "🌳" },
        { w: "मगर", r: "magar", m: "crocodile", e: "🐊" },
        { w: "रथ",  r: "rath",  m: "chariot",   e: "🛕" },
        { w: "पवन", r: "pavan", m: "wind",      e: "🌬️" }
      ]
    },
    {
      id: "aa", maatra: "ा", show: "ा",
      name: "Aa ki Maatra", nameHi: "आ की मात्रा",
      vowel: "आ", vRoman: "aa",
      tip: "A tall standing stick AFTER the letter. क + ा = का",
      tipHi: "अक्षर के बाद खड़ी लकीर — आ!",
      sayAs: "आ की मात्रा",
      words: [
        { w: "आम",   r: "aam",    m: "mango",   e: "🥭" },
        { w: "नाव",  r: "naav",   m: "boat",    e: "⛵" },
        { w: "हाथ",  r: "haath",  m: "hand",    e: "✋" },
        { w: "माला", r: "maalaa", m: "garland", e: "📿" },
        { w: "राजा", r: "raajaa", m: "king",    e: "🤴" },
        { w: "काम",  r: "kaam",   m: "work",    e: "💼" },
        { w: "नाक",  r: "naak",   m: "nose",    e: "👃" },
        { w: "गाय",  r: "gaay",   m: "cow",     e: "🐄" },
        { w: "दाल",  r: "daal",   m: "lentils", e: "🍲" },
        { w: "बादल", r: "baadal", m: "cloud",   e: "☁️" }
      ]
    },
    {
      id: "i", maatra: "ि", show: "ि",
      name: "Chhoti Ee ki Maatra", nameHi: "इ की मात्रा",
      vowel: "इ", vRoman: "i",
      tip: "The little hook is written BEFORE the letter, but we say it after! क + ि = कि",
      tipHi: "छोटी 'इ' पहले लिखो, पर बोलो बाद में।",
      sayAs: "छोटी इ की मात्रा",
      words: [
        { w: "दिन",     r: "din",     m: "day",     e: "☀️" },
        { w: "किताब",   r: "kitaab",  m: "book",    e: "📖" },
        { w: "चिड़िया", r: "chidiyaa", m: "bird",   e: "🐦" },
        { w: "मिठाई",   r: "mithaai", m: "sweets",  e: "🍬" },
        { w: "सितारा",  r: "sitaaraa", m: "star",   e: "⭐" },
        { w: "विमान",   r: "vimaan",  m: "aeroplane", e: "✈️" },
        { w: "दिया",    r: "diyaa",   m: "lamp",    e: "🪔" },
        { w: "गिलास",   r: "gilaas",  m: "glass",   e: "🥛" },
        { w: "पिता",    r: "pitaa",   m: "father",  e: "👨" },
        { w: "हिरन",    r: "hiran",   m: "deer",    e: "🦌" }
      ]
    },
    {
      id: "ee", maatra: "ी", show: "ी",
      name: "Badi Ee ki Maatra", nameHi: "ई की मात्रा",
      vowel: "ई", vRoman: "ee",
      tip: "The big hook goes AFTER the letter. क + ी = की",
      tipHi: "बड़ी 'ई' अक्षर के बाद आती है।",
      sayAs: "बड़ी ई की मात्रा",
      words: [
        { w: "नदी",   r: "nadee",   m: "river",       e: "🏞️" },
        { w: "तीर",   r: "teer",    m: "arrow",       e: "🏹" },
        { w: "सीढ़ी", r: "seedhee", m: "ladder",      e: "🪜" },
        { w: "चाबी",  r: "chaabee", m: "key",         e: "🔑" },
        { w: "मछली",  r: "machhlee", m: "fish",       e: "🐟" },
        { w: "पनीर",  r: "paneer",  m: "cheese",      e: "🧀" },
        { w: "खीरा",  r: "kheeraa", m: "cucumber",    e: "🥒" },
        { w: "दीदी",  r: "deedee",  m: "elder sister", e: "👧" },
        { w: "हाथी",  r: "haathee", m: "elephant",    e: "🐘" },
        { w: "घड़ी",  r: "ghadee",  m: "watch",       e: "⌚" }
      ]
    },
    {
      id: "u", maatra: "ु", show: "ु",
      name: "Chhota U ki Maatra", nameHi: "उ की मात्रा",
      vowel: "उ", vRoman: "u",
      tip: "A tiny tail UNDER the letter. क + ु = कु",
      tipHi: "अक्षर के नीचे छोटी पूँछ — उ!",
      sayAs: "छोटी उ की मात्रा",
      words: [
        { w: "गुड़",   r: "gud",     m: "jaggery", e: "🍯" },
        { w: "सुबह",  r: "subah",   m: "morning", e: "🌅" },
        { w: "कुत्ता", r: "kuttaa",  m: "dog",     e: "🐕" },
        { w: "बुलबुल", r: "bulbul",  m: "songbird", e: "🐦" },
        { w: "मुर्गा", r: "murgaa",  m: "rooster", e: "🐓" },
        { w: "गुलाब",  r: "gulaab",  m: "rose",    e: "🌹" },
        { w: "सुई",    r: "sui",     m: "needle",  e: "🪡" },
        { w: "बुखार",  r: "bukhaar", m: "fever",   e: "🤒" },
        { w: "दुकान",  r: "dukaan",  m: "shop",    e: "🏪" },
        { w: "कुर्सी", r: "kursee",  m: "chair",   e: "🪑" }
      ]
    },
    {
      id: "oo", maatra: "ू", show: "ू",
      name: "Bada Oo ki Maatra", nameHi: "ऊ की मात्रा",
      vowel: "ऊ", vRoman: "oo",
      tip: "A bigger curl UNDER the letter. क + ू = कू",
      tipHi: "अक्षर के नीचे बड़ी पूँछ — ऊ!",
      sayAs: "बड़ी ऊ की मात्रा",
      words: [
        { w: "फूल",    r: "phool",    m: "flower",  e: "🌸" },
        { w: "झूला",   r: "jhoolaa",  m: "swing",   e: "🛝" },
        { w: "चूहा",   r: "choohaa",  m: "mouse",   e: "🐭" },
        { w: "जूता",   r: "jootaa",   m: "shoe",    e: "👟" },
        { w: "दूध",    r: "doodh",    m: "milk",    e: "🥛" },
        { w: "सूरज",   r: "sooraj",   m: "sun",     e: "☀️" },
        { w: "आलू",    r: "aaloo",    m: "potato",  e: "🥔" },
        { w: "तराजू",  r: "taraajoo", m: "scales",  e: "⚖️" },
        { w: "भालू",   r: "bhaaloo",  m: "bear",    e: "🐻" },
        { w: "कबूतर",  r: "kabootar", m: "pigeon",  e: "🕊️" }
      ]
    },
    {
      id: "e", maatra: "े", show: "े",
      name: "E ki Maatra", nameHi: "ए की मात्रा",
      vowel: "ए", vRoman: "e",
      tip: "One little line ON TOP of the letter. क + े = के",
      tipHi: "अक्षर के ऊपर एक लकीर — ए!",
      sayAs: "ए की मात्रा",
      words: [
        { w: "केला", r: "kelaa", m: "banana",  e: "🍌" },
        { w: "मेला", r: "melaa", m: "fair",    e: "🎡" },
        { w: "पेड़", r: "ped",   m: "tree",    e: "🌳" },
        { w: "बेटा", r: "betaa", m: "son",     e: "👦" },
        { w: "सेब",  r: "seb",   m: "apple",   e: "🍎" },
        { w: "मेज़", r: "mez",   m: "table",   e: "🪑" },
        { w: "तेल",  r: "tel",   m: "oil",     e: "🛢️" },
        { w: "रेल",  r: "rel",   m: "train",   e: "🚆" },
        { w: "देश",  r: "desh",  m: "country", e: "🌍" },
        { w: "खेल",  r: "khel",  m: "game",    e: "⚽" }
      ]
    },
    {
      id: "ai", maatra: "ै", show: "ै",
      name: "Ai ki Maatra", nameHi: "ऐ की मात्रा",
      vowel: "ऐ", vRoman: "ai",
      tip: "TWO little lines on top. क + ै = कै",
      tipHi: "अक्षर के ऊपर दो लकीरें — ऐ!",
      sayAs: "ऐ की मात्रा",
      words: [
        { w: "पैसा",   r: "paisaa",  m: "money",   e: "💰" },
        { w: "थैला",   r: "thailaa", m: "bag",     e: "👜" },
        { w: "बैल",    r: "bail",    m: "ox",      e: "🐂" },
        { w: "मैदान",  r: "maidaan", m: "field",   e: "🏟️" },
        { w: "पैर",    r: "pair",    m: "foot",    e: "🦶" },
        { w: "गैस",    r: "gais",    m: "gas",     e: "🔥" },
        { w: "सैनिक",  r: "sainik",  m: "soldier", e: "💂" },
        { w: "बैग",    r: "baig",    m: "school bag", e: "🎒" },
        { w: "तैरना",  r: "tairnaa", m: "to swim", e: "🏊" },
        { w: "मैना",   r: "mainaa",  m: "myna bird", e: "🐦" }
      ]
    },
    {
      id: "o", maatra: "ो", show: "ो",
      name: "O ki Maatra", nameHi: "ओ की मात्रा",
      vowel: "ओ", vRoman: "o",
      tip: "A stick AND a line on top. क + ो = को",
      tipHi: "खड़ी लकीर और ऊपर एक लकीर — ओ!",
      sayAs: "ओ की मात्रा",
      words: [
        { w: "मोर",   r: "mor",    m: "peacock", e: "🦚" },
        { w: "रोटी",  r: "rotee",  m: "bread",   e: "🫓" },
        { w: "सोना",  r: "sonaa",  m: "gold",    e: "🥇" },
        { w: "चोर",   r: "chor",   m: "thief",   e: "🥷" },
        { w: "गोल",   r: "gol",    m: "round",   e: "⭕" },
        { w: "घोड़ा", r: "ghodaa", m: "horse",   e: "🐴" },
        { w: "कोयल",  r: "koyal",  m: "cuckoo",  e: "🐦" },
        { w: "टोपी",  r: "topee",  m: "cap",     e: "🧢" },
        { w: "मोटा",  r: "motaa",  m: "fat",     e: "🐘" },
        { w: "बोतल",  r: "botal",  m: "bottle",  e: "🍼" }
      ]
    },
    {
      id: "au", maatra: "ौ", show: "ौ",
      name: "Au ki Maatra", nameHi: "औ की मात्रा",
      vowel: "औ", vRoman: "au",
      tip: "A stick AND two lines on top. क + ौ = कौ",
      tipHi: "खड़ी लकीर और ऊपर दो लकीरें — औ!",
      sayAs: "औ की मात्रा",
      words: [
        { w: "मौसम",   r: "mausam",    m: "weather",  e: "🌦️" },
        { w: "चौकी",   r: "chaukee",   m: "stool",    e: "🪑" },
        { w: "कौआ",    r: "kauaa",     m: "crow",     e: "🐦‍⬛" },
        { w: "नौका",   r: "naukaa",    m: "boat",     e: "⛵" },
        { w: "लौकी",   r: "laukee",    m: "gourd",    e: "🥒" },
        { w: "मौसी",   r: "mausee",    m: "aunt",     e: "👩" },
        { w: "चौदह",   r: "chaudah",   m: "fourteen", e: "1️⃣4️⃣" },
        { w: "दौड़",   r: "daud",      m: "race",     e: "🏃" },
        { w: "हथौड़ा", r: "hathaudaa", m: "hammer",   e: "🔨" },
        { w: "पौधा",   r: "paudhaa",   m: "plant",    e: "🌱" }
      ]
    },
    {
      id: "an", maatra: "ं", show: "ं",
      name: "Anusvaar (Bindi)", nameHi: "अं की मात्रा",
      vowel: "अं", vRoman: "an",
      tip: "One dot ON TOP makes an 'n' or 'm' hum. रंग, बंदर!",
      tipHi: "ऊपर एक बिंदी — गुनगुनाहट आती है।",
      sayAs: "बिंदी",
      syllables: [
        { s: "कं", r: "kan" }, { s: "गं", r: "gan" }, { s: "चं", r: "chan" },
        { s: "जं", r: "jan" }, { s: "तं", r: "tan" }, { s: "दं", r: "dan" },
        { s: "पं", r: "pan" }, { s: "बं", r: "ban" }, { s: "मं", r: "man" },
        { s: "रं", r: "ran" }, { s: "सं", r: "san" }, { s: "हं", r: "han" }
      ],
      words: [
        { w: "अंगूर", r: "angoor",  m: "grapes",  e: "🍇" },
        { w: "रंग",   r: "rang",    m: "colour",  e: "🎨" },
        { w: "बंदर",  r: "bandar",  m: "monkey",  e: "🐒" },
        { w: "मंदिर", r: "mandir",  m: "temple",  e: "🛕" },
        { w: "पंखा",  r: "pankhaa", m: "fan",     e: "🌀" },
        { w: "अंडा",  r: "andaa",   m: "egg",     e: "🥚" },
        { w: "संतरा", r: "santaraa", m: "orange", e: "🍊" },
        { w: "गंगा",  r: "gangaa",  m: "Ganga river", e: "🏞️" },
        { w: "चंदा",  r: "chandaa", m: "moon",    e: "🌙" },
        { w: "झंडा",  r: "jhandaa", m: "flag",    e: "🚩" }
      ]
    },
    {
      id: "chandra", maatra: "ँ", show: "ँ",
      name: "Chandrabindu", nameHi: "चंद्रबिंदु",
      vowel: "अँ", vRoman: "an",
      tip: "A moon with a dot 🌙 — the sound comes through your NOSE. चाँद!",
      tipHi: "चाँद और बिंदी — आवाज़ नाक से आती है।",
      sayAs: "चंद्रबिंदु",
      syllables: [
        { s: "कँ", r: "kan" }, { s: "गँ", r: "gan" }, { s: "चँ", r: "chan" },
        { s: "दँ", r: "dan" }, { s: "पँ", r: "pan" }, { s: "बँ", r: "ban" },
        { s: "मँ", r: "man" }, { s: "सँ", r: "san" }, { s: "हँ", r: "han" },
        { s: "आँ", r: "aan" }, { s: "ऊँ", r: "oon" }, { s: "माँ", r: "maan" }
      ],
      words: [
        { w: "चाँद",   r: "chaand",    m: "moon",      e: "🌙" },
        { w: "दाँत",   r: "daant",     m: "tooth",     e: "🦷" },
        { w: "आँख",    r: "aankh",     m: "eye",       e: "👁️" },
        { w: "हँसी",   r: "hansee",    m: "laughter",  e: "😄" },
        { w: "गाँव",   r: "gaanv",     m: "village",   e: "🏘️" },
        { w: "साँप",   r: "saanp",     m: "snake",     e: "🐍" },
        { w: "पाँच",   r: "paanch",    m: "five",      e: "5️⃣" },
        { w: "ऊँट",    r: "oont",      m: "camel",     e: "🐫" },
        { w: "बाँसुरी", r: "baansuree", m: "flute",    e: "🎶" },
        { w: "आँगन",   r: "aangan",    m: "courtyard", e: "🏡" }
      ]
    },
    {
      id: "ri", maatra: "ृ", show: "ृ", bonus: true,
      name: "Ri ki Maatra", nameHi: "ऋ की मात्रा",
      vowel: "ऋ", vRoman: "ri",
      tip: "A little curl under the letter that says 'ri'. क + ृ = कृ",
      tipHi: "अक्षर के नीचे छोटा घुमाव — ऋ!",
      sayAs: "ऋ की मात्रा",
      words: [
        { w: "ऋषि",   r: "rishi",   m: "sage",     e: "🧘" },
        { w: "कृपा",  r: "kripaa",  m: "kindness", e: "🙏" },
        { w: "मृग",   r: "mrig",    m: "deer",     e: "🦌" },
        { w: "वृक्ष", r: "vriksh",  m: "tree",     e: "🌳" },
        { w: "अमृत",  r: "amrit",   m: "nectar",   e: "🍯" },
        { w: "कृषि",  r: "krishi",  m: "farming",  e: "🌾" },
        { w: "गृह",   r: "grih",    m: "house",    e: "🏠" },
        { w: "तृण",   r: "trin",    m: "grass",    e: "🌿" },
        { w: "नृत्य", r: "nritya",  m: "dance",    e: "💃" },
        { w: "हृदय",  r: "hriday",  m: "heart",    e: "❤️" }
      ]
    },
    {
      id: "ah", maatra: "ः", show: "ः", bonus: true,
      name: "Visarg", nameHi: "अः (विसर्ग)",
      vowel: "अः", vRoman: "ah",
      tip: "Two dots after the letter — a soft 'h' puff at the end.",
      tipHi: "अक्षर के बाद दो बिंदियाँ — हल्की 'ह' आवाज़।",
      sayAs: "विसर्ग",
      syllables: [
        { s: "कः", r: "kah" }, { s: "गः", r: "gah" }, { s: "तः", r: "tah" },
        { s: "नः", r: "nah" }, { s: "मः", r: "mah" }, { s: "यः", r: "yah" },
        { s: "रः", r: "rah" }, { s: "सः", r: "sah" }, { s: "हः", r: "hah" }
      ],
      words: [
        { w: "नमः",    r: "namah",    m: "salutations", e: "🙏" },
        { w: "प्रातः", r: "praatah",  m: "morning",     e: "🌅" },
        { w: "दुःख",   r: "duhkh",    m: "sadness",     e: "😢" },
        { w: "अतः",    r: "atah",     m: "therefore",   e: "➡️" },
        { w: "पुनः",   r: "punah",    m: "again",       e: "🔁" },
        { w: "प्रायः", r: "praayah",  m: "usually",     e: "🔄" },
        { w: "स्वतः",  r: "svatah",   m: "by itself",   e: "⚙️" },
        { w: "अंततः",  r: "antatah",  m: "finally",     e: "🏁" },
        { w: "शनैः",   r: "shanaih",  m: "slowly",      e: "🐢" },
        { w: "मुख्यतः", r: "mukhyatah", m: "mainly",    e: "⭐" }
      ]
    }
  ],

  /* --------------------------------------------------------- READING LEVELS */
  reading: [
    {
      id: "l1", title: "Level 1 · तीन शब्द", titleEn: "Three little words",
      emoji: "🌱",
      items: [
        { s: "यह आम है।",     r: "yeh aam hai",     m: "This is a mango.",  e: "🥭" },
        { s: "वह नाव है।",    r: "vah naav hai",    m: "That is a boat.",   e: "⛵" },
        { s: "यह घर है।",     r: "yeh ghar hai",    m: "This is a house.",  e: "🏠" },
        { s: "वह गाय है।",    r: "vah gaay hai",    m: "That is a cow.",    e: "🐄" },
        { s: "यह किताब है।",  r: "yeh kitaab hai",  m: "This is a book.",   e: "📖" },
        { s: "वह पेड़ है।",   r: "vah ped hai",     m: "That is a tree.",   e: "🌳" },
        { s: "यह फूल है।",    r: "yeh phool hai",   m: "This is a flower.", e: "🌸" },
        { s: "वह चाँद है।",   r: "vah chaand hai",  m: "That is the moon.", e: "🌙" },
        { s: "यह सेब है।",    r: "yeh seb hai",     m: "This is an apple.", e: "🍎" },
        { s: "वह मोर है।",    r: "vah mor hai",     m: "That is a peacock.", e: "🦚" }
      ]
    },
    {
      id: "l2", title: "Level 2 · छोटे वाक्य", titleEn: "Short sentences",
      emoji: "🌿",
      items: [
        { s: "मेरा नाम मायरा है।",        r: "meraa naam Myra hai",        m: "My name is Myra.", e: "👧" },
        { s: "माँ रोटी बना रही है।",       r: "maan rotee banaa rahee hai", m: "Mother is making roti.", e: "🫓" },
        { s: "बिल्ली दूध पीती है।",        r: "billee doodh peetee hai",    m: "The cat drinks milk.", e: "🐱" },
        { s: "मैं स्कूल जाती हूँ।",        r: "main school jaatee hoon",    m: "I go to school.", e: "🏫" },
        { s: "पापा किताब पढ़ते हैं।",      r: "paapaa kitaab padhate hain", m: "Papa reads a book.", e: "📖" },
        { s: "चिड़िया पेड़ पर बैठी है।",   r: "chidiyaa ped par baithee hai", m: "The bird sits on the tree.", e: "🐦" },
        { s: "हाथी बहुत बड़ा है।",         r: "haathee bahut badaa hai",    m: "The elephant is very big.", e: "🐘" },
        { s: "मुझे आम बहुत पसंद है।",      r: "mujhe aam bahut pasand hai", m: "I like mangoes a lot.", e: "🥭" },
        { s: "बच्चे मैदान में खेलते हैं।", r: "bachche maidaan mein khelate hain", m: "Children play in the field.", e: "⚽" },
        { s: "सूरज सुबह निकलता है।",       r: "sooraj subah nikalataa hai", m: "The sun rises in the morning.", e: "🌅" }
      ]
    },
    {
      id: "l3", title: "Level 3 · बड़े वाक्य", titleEn: "Longer sentences",
      emoji: "🌳",
      items: [
        { s: "मेरा घर बहुत सुंदर है।",              r: "meraa ghar bahut sundar hai", m: "My house is very beautiful.", e: "🏡" },
        { s: "मैं रोज़ सुबह जल्दी उठती हूँ।",       r: "main roz subah jaldee uthatee hoon", m: "I wake up early every morning.", e: "⏰" },
        { s: "दादी मुझे अच्छी कहानी सुनाती हैं।",   r: "daadee mujhe achchhee kahaanee sunaatee hain", m: "Grandma tells me a nice story.", e: "👵" },
        { s: "बगीचे में लाल फूल खिले हैं।",         r: "bageeche mein laal phool khile hain", m: "Red flowers have bloomed in the garden.", e: "🌺" },
        { s: "मोर बारिश में नाचता है।",             r: "mor baarish mein naachataa hai", m: "The peacock dances in the rain.", e: "🦚" },
        { s: "हम सब मिलकर खाना खाते हैं।",          r: "ham sab milakar khaanaa khaate hain", m: "We all eat together.", e: "🍽️" },
        { s: "मुझे हिंदी पढ़ना अच्छा लगता है।",     r: "mujhe hindee padhanaa achchhaa lagataa hai", m: "I like reading Hindi.", e: "📕" },
        { s: "छोटी चिड़िया आसमान में उड़ती है।",    r: "chhotee chidiyaa aasamaan mein udatee hai", m: "The little bird flies in the sky.", e: "🕊️" },
        { s: "गाय हमें मीठा दूध देती है।",          r: "gaay hamen meethaa doodh detee hai", m: "The cow gives us sweet milk.", e: "🥛" },
        { s: "रात में आसमान में तारे चमकते हैं।",   r: "raat mein aasamaan mein taare chamakate hain", m: "Stars shine in the sky at night.", e: "🌟" }
      ]
    }
  ],

  /* ---------------------------------------------------------------- STORIES */
  stories: [
    {
      id: "s1", title: "मेरा दिन", titleEn: "My Day", emoji: "🌞",
      lines: [
        { s: "मैं सुबह जल्दी उठती हूँ।",        r: "main subah jaldee uthatee hoon",  m: "I wake up early in the morning." },
        { s: "फिर मैं दाँत साफ़ करती हूँ।",     r: "phir main daant saaf karatee hoon", m: "Then I brush my teeth." },
        { s: "माँ मुझे गरम दूध देती है।",       r: "maan mujhe garam doodh detee hai", m: "Mother gives me warm milk." },
        { s: "मैं बस्ता लेकर स्कूल जाती हूँ।",  r: "main bastaa lekar school jaatee hoon", m: "I take my bag and go to school." },
        { s: "शाम को मैं बगीचे में खेलती हूँ।", r: "shaam ko main bageeche mein khelatee hoon", m: "In the evening I play in the garden." }
      ]
    },
    {
      id: "s2", title: "प्यारी चिड़िया", titleEn: "The Sweet Little Bird", emoji: "🐦",
      lines: [
        { s: "एक छोटी चिड़िया थी।",             r: "ek chhotee chidiyaa thee",  m: "There was a little bird." },
        { s: "वह ऊँचे पेड़ पर रहती थी।",        r: "vah oonche ped par rahatee thee", m: "She lived on a tall tree." },
        { s: "रोज़ सुबह वह गाना गाती थी।",      r: "roz subah vah gaanaa gaatee thee", m: "Every morning she sang a song." },
        { s: "सब बच्चे उसे बहुत प्यार करते थे।", r: "sab bachche use bahut pyaar karate the", m: "All the children loved her very much." },
        { s: "वह सबको खुश कर देती थी।",         r: "vah sabako khush kar detee thee", m: "She made everyone happy." }
      ]
    },
    {
      id: "s3", title: "बारिश का दिन", titleEn: "A Rainy Day", emoji: "🌧️",
      lines: [
        { s: "आज बहुत बारिश हो रही है।",        r: "aaj bahut baarish ho rahee hai", m: "It is raining a lot today." },
        { s: "बादल काले और बड़े हैं।",          r: "baadal kaale aur bade hain", m: "The clouds are black and big." },
        { s: "मैं छाता लेकर बाहर गई।",          r: "main chhaataa lekar baahar gaee", m: "I went out with an umbrella." },
        { s: "मोर बगीचे में नाच रहा था।",       r: "mor bageeche mein naach rahaa thaa", m: "The peacock was dancing in the garden." },
        { s: "मुझे बारिश बहुत अच्छी लगती है।",  r: "mujhe baarish bahut achchhee lagatee hai", m: "I like the rain very much." }
      ]
    }
  ]
};

/* Build the syllable ladder for a maatra unit (क + ा = का). */
HINDI.syllablesFor = function (unit) {
  if (unit.syllables) return unit.syllables;
  return HI_CONSONANTS.slice(0, 12).map(c => ({
    s: c.c + unit.maatra,
    r: c.r + (unit.maatra === "" ? "a" : unit.vRoman)
  }));
};
/* Every word across every maatra — used for mixed revision games. */
HINDI.allWords = function () {
  return HINDI.maatras.reduce((a, u) => a.concat(u.words.map(w =>
    Object.assign({ unit: u.id }, w))), []);
};

if (typeof window !== "undefined") window.HINDI = HINDI;
