"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

type Lesson = {
  id: string;
  unit: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  summary: string;
  endings: { ending: string; label: string; example: string; tone: string }[];
  example: { eo: string; zh: string; parts: { text: string; role: string; tone: string }[] };
  tip: string;
  checks: QuizQuestion[];
};

const lessons: Lesson[] = [
  {
    id: "word-building",
    unit: "01",
    title: "詞尾積木",
    subtitle: "名詞、形容詞與副詞",
    eyebrow: "3 分鐘觀念",
    summary: "Esperanto 的詞尾就像標籤：看到字尾，通常就能立刻知道它在句子裡扮演什麼角色。先抓住 -o、-a、-e，你已經能讀懂一大塊了。",
    endings: [
      { ending: "-o", label: "名詞 · 一件事物", example: "muziko 音樂", tone: "mint" },
      { ending: "-a", label: "形容詞 · 形容事物", example: "muzika 音樂的", tone: "sun" },
      { ending: "-e", label: "副詞 · 描述動作", example: "muzike 音樂般地", tone: "coral" },
    ],
    example: {
      eo: "La ĝoja infano kantas bele.",
      zh: "快樂的孩子唱得很好聽。",
      parts: [
        { text: "La", role: "定冠詞", tone: "plain" },
        { text: "ĝoja", role: "形容詞 -a", tone: "sun" },
        { text: "infano", role: "名詞 -o", tone: "mint" },
        { text: "kantas", role: "動詞 -as", tone: "violet" },
        { text: "bele", role: "副詞 -e", tone: "coral" },
      ],
    },
    tip: "把同一個字根換上不同詞尾試試看：san-o（健康）、san-a（健康的）、san-e（健康地）。",
    checks: [
      {
        question: "哪一個字最適合放進：Ŝi dancas ___.（她優雅地跳舞。）",
        options: ["eleganto", "eleganta", "elegante"],
        answer: 2,
        explain: "要描述「怎麼跳」，需要副詞詞尾 -e，所以是 elegante。",
      },
      {
        question: "哪個字表示「美麗的」？",
        options: ["belo", "bela", "bele"],
        answer: 1,
        explain: "形容事物使用 -a 詞尾，所以「美麗的」是 bela。",
      },
      {
        question: "Mi aŭdas belan ___.（我聽見一首美麗的歌。）",
        options: ["kanton", "kanta", "kante"],
        answer: 0,
        explain: "這裡需要名詞「歌」作為受詞，因此是帶 -n 的 kanton。",
      },
    ],
  },
  {
    id: "plural-accusative",
    unit: "02",
    title: "J 與 N 的任務",
    subtitle: "複數與受格",
    eyebrow: "5 分鐘觀念",
    summary: "-j 告訴你「不只一個」，-n 則標出動作直接影響的對象。兩者同時出現時，永遠是 -j 在前、-n 在後。",
    endings: [
      { ending: "-j", label: "複數 · 一個以上", example: "libroj 幾本書", tone: "sun" },
      { ending: "-n", label: "受格 · 動作對象", example: "libron 一本書（受詞）", tone: "coral" },
      { ending: "-jn", label: "複數＋受格", example: "librojn 幾本書（受詞）", tone: "violet" },
    ],
    example: {
      eo: "La knabino legas interesajn librojn.",
      zh: "那個女孩讀著幾本有趣的書。",
      parts: [
        { text: "La", role: "定冠詞", tone: "plain" },
        { text: "knabino", role: "主詞", tone: "mint" },
        { text: "legas", role: "動作", tone: "violet" },
        { text: "interesajn", role: "複數受格形容詞", tone: "sun" },
        { text: "librojn", role: "複數受詞", tone: "coral" },
      ],
    },
    tip: "形容詞要跟名詞一起配合：granda hundo → grandaj hundoj → grandajn hundojn。",
    checks: [
      {
        question: "「我看見紅色的花朵」應該用哪一組？",
        options: ["ruĝa floroj", "ruĝajn florojn", "ruĝaj floron"],
        answer: 1,
        explain: "花朵是複數受詞，所以形容詞與名詞都要加 -j，再加 -n。",
      },
      {
        question: "哪個形式表示「幾隻狗（受詞）」？",
        options: ["hundoj", "hundon", "hundojn"],
        answer: 2,
        explain: "複數先加 -j，受格再加 -n，因此是 hundojn。",
      },
      {
        question: "Mi aĉetas du ___.（我買兩本新書。）",
        options: ["novajn librojn", "novaj libroj", "novan libron"],
        answer: 0,
        explain: "du 後的名詞仍是複數；整個名詞詞組又是受詞，所以使用 novajn librojn。",
      },
    ],
  },
  {
    id: "verbs",
    unit: "03",
    title: "動詞時間機",
    subtitle: "時態、條件與命令",
    eyebrow: "4 分鐘觀念",
    summary: "Esperanto 動詞不會因人稱改變，只要換詞尾就能移動時間。mi、vi、ili 後面的動詞形式完全一樣。",
    endings: [
      { ending: "-as", label: "現在 · 正在或習慣", example: "mi lernas 我學習", tone: "mint" },
      { ending: "-is", label: "過去 · 已發生", example: "mi lernis 我學過", tone: "coral" },
      { ending: "-os", label: "未來 · 將發生", example: "mi lernos 我會學", tone: "sun" },
    ],
    example: {
      eo: "Hieraŭ mi studis, hodiaŭ mi ripozas.",
      zh: "昨天我讀了書，今天我休息。",
      parts: [
        { text: "Hieraŭ", role: "昨天", tone: "plain" },
        { text: "mi", role: "我", tone: "mint" },
        { text: "studis", role: "過去 -is", tone: "coral" },
        { text: "hodiaŭ", role: "今天", tone: "plain" },
        { text: "mi", role: "我", tone: "mint" },
        { text: "ripozas", role: "現在 -as", tone: "violet" },
      ],
    },
    tip: "另外記住：-i 是不定詞、-u 是意願／命令、-us 是假設條件。",
    checks: [
      {
        question: "「明天我們將旅行」的動詞應該是哪一個？",
        options: ["vojaĝis", "vojaĝas", "vojaĝos"],
        answer: 2,
        explain: "morgaŭ（明天）指向未來，因此使用 -os：vojaĝos。",
      },
      {
        question: "Hieraŭ ŝi ___.（昨天她工作。）",
        options: ["laboras", "laboris", "laboros"],
        answer: 1,
        explain: "hieraŭ（昨天）表示過去，所以動詞使用 -is：laboris。",
      },
      {
        question: "Bonvolu ___.（請坐。）",
        options: ["sidi", "sidas", "sidu"],
        answer: 0,
        explain: "bonvolu 後面通常接不定詞 -i，因此是 Bonvolu sidi。",
      },
    ],
  },
  {
    id: "pronouns",
    unit: "04",
    title: "誰在句子裡？",
    subtitle: "人稱代名詞",
    eyebrow: "4 分鐘觀念",
    summary: "人稱代名詞很規律：mi、vi、li、ŝi、ĝi、ni、ili。要把代名詞變成受詞，一樣只需加上 -n。",
    endings: [
      { ending: "mi", label: "我", example: "min 我（受詞）", tone: "mint" },
      { ending: "vi", label: "你／你們", example: "vin 你／你們（受詞）", tone: "sun" },
      { ending: "ili", label: "他們／她們／它們", example: "ilin 他們（受詞）", tone: "coral" },
    ],
    example: {
      eo: "Ŝi amas lin, kaj li amas ŝin.",
      zh: "她愛他，而他愛她。",
      parts: [
        { text: "Ŝi", role: "她 · 主詞", tone: "mint" },
        { text: "amas", role: "愛", tone: "violet" },
        { text: "lin", role: "他 · 受詞", tone: "coral" },
        { text: "kaj", role: "而且", tone: "plain" },
        { text: "li", role: "他 · 主詞", tone: "mint" },
        { text: "amas ŝin", role: "愛她 · 受詞", tone: "coral" },
      ],
    },
    tip: "si 表示回指句子的主詞：Li lavas sin（他洗自己），不要用在句子的主詞位置。",
    checks: [
      {
        question: "「他們看見我們」應該怎麼說？",
        options: ["Ilin vidas ni.", "Ili vidas nin.", "Ili vidas ni."],
        answer: 1,
        explain: "ili 是做動作的主詞；ni 是被看見的對象，所以變成 nin。",
      },
      {
        question: "Mi amas ŝi. 問題在哪裡？",
        options: ["ŝi 應為 ŝin", "mi 應為 min", "amas 應為 aman"],
        answer: 0,
        explain: "「她」是愛的對象，所以代名詞要加 -n，成為 ŝin。",
      },
      {
        question: "Li lavas ___.（他洗自己。）",
        options: ["lin", "sin", "ŝin"],
        answer: 1,
        explain: "動作回到同一個第三人稱主詞時，使用反身代名詞 sin。",
      },
    ],
  },
  {
    id: "correlatives",
    unit: "05",
    title: "表格詞魔方",
    subtitle: "疑問詞與對應詞",
    eyebrow: "7 分鐘觀念",
    summary: "Esperanto 把常用疑問與指示詞整理成規律表格。前綴決定「哪一類」，詞尾決定「問什麼」。",
    endings: [
      { ending: "ki-", label: "哪一個？疑問／關係", example: "kio 什麼", tone: "sun" },
      { ending: "ti-", label: "那一個 · 指示", example: "tio 那件事", tone: "coral" },
      { ending: "ĉi-", label: "每一個 · 全部", example: "ĉio 一切", tone: "mint" },
    ],
    example: {
      eo: "Kie estas la kafejo? Ĝi estas tie.",
      zh: "咖啡館在哪裡？它在那裡。",
      parts: [
        { text: "Kie", role: "哪裡？", tone: "sun" },
        { text: "estas", role: "是／位於", tone: "violet" },
        { text: "la kafejo?", role: "咖啡館", tone: "plain" },
        { text: "Ĝi estas", role: "它在", tone: "mint" },
        { text: "tie", role: "那裡", tone: "coral" },
      ],
    },
    tip: "先學詞尾：-u 人、-o 事物、-e 地點、-am 時間、-al 原因，再替換前綴。",
    checks: [
      {
        question: "如果 kie 是「哪裡」，那麼 nenie 是什麼？",
        options: ["某處", "到處", "無處／哪裡都不"],
        answer: 2,
        explain: "neni- 表示「沒有任何」，-e 表示地點，因此 nenie 是「無處」。",
      },
      {
        question: "kial 問的是什麼？",
        options: ["時間", "原因", "方式"],
        answer: 1,
        explain: "表格詞的 -al 表示原因，因此 kial 是「為什麼」。",
      },
      {
        question: "「每個人」是哪個表格詞？",
        options: ["ĉiu", "io", "neniu"],
        answer: 0,
        explain: "ĉi- 表示每一個，-u 表示個體，因此 ĉiu 是「每個人／每一個」。",
      },
    ],
  },
  {
    id: "word-order",
    unit: "06",
    title: "自由，但不混亂",
    subtitle: "語序與重點",
    eyebrow: "6 分鐘觀念",
    summary: "最自然的基本順序是「主詞－動詞－受詞」，但 -n 已經清楚標出受詞，所以你能調整順序來改變語氣重點。清楚易懂永遠是第一原則。",
    endings: [
      { ending: "S", label: "主詞 · 做動作的人", example: "la kato 貓", tone: "mint" },
      { ending: "V", label: "動詞 · 發生的動作", example: "ĉasas 追", tone: "violet" },
      { ending: "O-n", label: "受詞 · 被影響者", example: "muson 老鼠", tone: "coral" },
    ],
    example: {
      eo: "Muson ĉasas la kato.",
      zh: "一隻老鼠，是那隻貓在追。（強調老鼠）",
      parts: [
        { text: "Muson", role: "受詞 -n", tone: "coral" },
        { text: "ĉasas", role: "動詞", tone: "violet" },
        { text: "la kato", role: "主詞", tone: "mint" },
      ],
    },
    tip: "ne、nur、ankaŭ 等小詞通常緊靠它修飾的內容；介系詞也要放在所帶詞組前。",
    checks: [
      {
        question: "哪一句仍表示「狗追貓」？",
        options: ["Hundon ĉasas kato.", "Katon ĉasas hundo.", "Kato ĉasas hundo."],
        answer: 1,
        explain: "katon 有 -n，所以貓是受詞；沒有 -n 的 hundo 是主詞。",
      },
      {
        question: "哪句清楚表示「老鼠咬貓」？",
        options: ["Muso mordas katon.", "Muson mordas kato.", "Muso mordas kato."],
        answer: 0,
        explain: "muso 沒有 -n，是主詞；katon 有 -n，是被咬的受詞。",
      },
      {
        question: "ne 通常放在哪裡？",
        options: ["固定在句尾", "被否定的內容前", "固定在介系詞後"],
        answer: 1,
        explain: "ne 通常緊接在要否定的詞或片語之前，讓否定範圍清楚。",
      },
    ],
  },
  {
    id: "determiners",
    unit: "07",
    title: "La 的聚光燈",
    subtitle: "冠詞與限定詞",
    eyebrow: "5 分鐘觀念",
    summary: "Esperanto 只有定冠詞 la，沒有英文 a／an 那樣的不定冠詞。la 表示「你知道我說的是哪一個」；第一次提到或只談種類時，通常不放冠詞。",
    endings: [
      { ending: "la", label: "已知 · 特定的人事物", example: "la libro 那本書", tone: "sun" },
      { ending: "∅", label: "新資訊 · 不特定", example: "libro 一本書", tone: "mint" },
      { ending: "mia", label: "其他限定詞 · 不再加 la", example: "mia libro 我的書", tone: "coral" },
    ],
    example: {
      eo: "Mi aĉetis libron. La libro estas interesa.",
      zh: "我買了一本書。那本書很有趣。",
      parts: [
        { text: "Mi aĉetis", role: "我買了", tone: "violet" },
        { text: "libron", role: "首次提到 · 不加 la", tone: "mint" },
        { text: "La libro", role: "再次提到 · 加 la", tone: "sun" },
        { text: "estas interesa", role: "很有趣", tone: "coral" },
      ],
    },
    tip: "語言名稱若是省略 lingvo 的形容詞，要用 la：la angla、la franca；Esperanto 是名詞名稱，所以不用 la。",
    checks: [
      {
        question: "哪一句正確表示「我正在學 Esperanto」？",
        options: ["Mi lernas la Esperanton.", "Mi lernas Esperanton.", "Mi lernas Esperanto."],
        answer: 1,
        explain: "Esperanto 是名詞形式的語言名稱，不用 la；作為 lernas 的受詞要加 -n。",
      },
      {
        question: "la 遇到複數或受格時會怎麼變？",
        options: ["變成 laj／lan", "只變成 lan", "完全不變"],
        answer: 2,
        explain: "la 永遠保持原形；複數與受格標記放在名詞和形容詞上。",
      },
      {
        question: "Mi havas hundon. ___ hundo estas blanka.",
        options: ["La", "Unu", "Mia la"],
        answer: 0,
        explain: "第二句談的是剛提過的同一隻狗，因此用 la hundo。",
      },
    ],
  },
  {
    id: "prepositions-direction",
    unit: "08",
    title: "地圖上的小箭頭",
    subtitle: "介系詞與方向",
    eyebrow: "6 分鐘觀念",
    summary: "介系詞先畫出關係：en 是「在裡面」，sur 是「在上面」，al 是「朝向」。某些地點介系詞後加 -n，會把靜態位置變成移動的終點。",
    endings: [
      { ending: "en", label: "在裡面 · 靜態位置", example: "en la domo 在屋裡", tone: "mint" },
      { ending: "al", label: "朝向 · 前往某處", example: "al la domo 前往屋子", tone: "sun" },
      { ending: "en + n", label: "進入 · 方向終點", example: "en la domon 進屋裡", tone: "coral" },
    ],
    example: {
      eo: "La kato kuras en la ĝardenon.",
      zh: "那隻貓跑進花園裡。",
      parts: [
        { text: "La kato", role: "主詞 · 那隻貓", tone: "mint" },
        { text: "kuras", role: "跑", tone: "violet" },
        { text: "en", role: "進入某範圍", tone: "sun" },
        { text: "la ĝardenon", role: "方向終點 -n", tone: "coral" },
      ],
    },
    tip: "比較：Mi estas en la ĝardeno（我在花園裡）與 Mi iras en la ĝardenon（我走進花園裡）。",
    checks: [
      {
        question: "「她坐在房間裡」應該是哪一個？",
        options: ["Ŝi sidas en la ĉambro.", "Ŝi sidas en la ĉambron.", "Ŝi sidas al la ĉambron."],
        answer: 0,
        explain: "sidas 描述靜態位置，所以 en 後面不加方向受格 -n。",
      },
      {
        question: "「孩子跑進屋裡」應該用哪個詞組？",
        options: ["en la domo", "en la domon", "al la domon"],
        answer: 1,
        explain: "從外面移動到裡面時，en 後的終點使用 -n：en la domon。",
      },
      {
        question: "「我們前往學校」應該怎麼說？",
        options: ["Ni iras al la lernejo.", "Ni iras al la lernejon.", "Ni iras en la lernejo."],
        answer: 0,
        explain: "al 本身已經表示方向，後面的名詞通常不再加方向 -n。",
      },
    ],
  },
  {
    id: "comparisons",
    unit: "09",
    title: "比一比就明白",
    subtitle: "比較級與最高級",
    eyebrow: "5 分鐘觀念",
    summary: "Esperanto 不必改變形容詞本身：pli 表示「更……」，plej 表示「最……」，比較對象則由 ol 接上。規則固定，長字短字都一樣。",
    endings: [
      { ending: "pli", label: "比較級 · 更……", example: "pli rapida 更快的", tone: "sun" },
      { ending: "ol", label: "比較對象 · 比……", example: "ol mi 比我", tone: "coral" },
      { ending: "plej", label: "最高級 · 最……", example: "la plej alta 最高的", tone: "mint" },
    ],
    example: {
      eo: "La neĝo estas pli blanka ol la papero.",
      zh: "雪比紙更白。",
      parts: [
        { text: "La neĝo", role: "比較主體 · 雪", tone: "mint" },
        { text: "estas", role: "是", tone: "violet" },
        { text: "pli blanka", role: "更白", tone: "sun" },
        { text: "ol la papero", role: "比紙", tone: "coral" },
      ],
    },
    tip: "反方向也很規律：malpli 是「比較不……」，malplej 是「最不……」。",
    checks: [
      {
        question: "「這朵花比那朵更美」需要哪個結構？",
        options: ["plej bela de", "pli bela ol", "bela pli al"],
        answer: 1,
        explain: "比較兩者使用 pli + 形容詞 + ol：pli bela ol。",
      },
      {
        question: "「最高的山」應該怎麼說？",
        options: ["la pli alta monto", "la plej alta monto", "la alta plej monto"],
        answer: 1,
        explain: "最高級使用 plej，通常與 la 一起限定獨一的對象：la plej alta monto。",
      },
      {
        question: "Ŝi kantas ___ bone ol mi.（她唱得比我好。）",
        options: ["pli", "plej", "tre"],
        answer: 0,
        explain: "句中有比較對象 ol mi，因此前面使用 pli bone。",
      },
    ],
  },
  {
    id: "questions-negation",
    unit: "10",
    title: "問與不問",
    subtitle: "問句與否定",
    eyebrow: "6 分鐘觀念",
    summary: "是非問句把 ĉu 放到句首；否定時，ne 緊靠要否定的內容。neniu、nenio、nenie 等 neni- 表格詞本身已帶有「沒有任何」的意思。",
    endings: [
      { ending: "ĉu", label: "是非問句 · 是否……", example: "Ĉu vi venos? 你會來嗎？", tone: "sun" },
      { ending: "ne", label: "否定 · 不／沒有", example: "mi ne scias 我不知道", tone: "coral" },
      { ending: "neni-", label: "零個 · 沒有任何", example: "neniu 沒有人", tone: "mint" },
    ],
    example: {
      eo: "Ĉu vi komprenas? Ne, mi ne komprenas.",
      zh: "你明白嗎？不，我不明白。",
      parts: [
        { text: "Ĉu", role: "是非問句", tone: "sun" },
        { text: "vi komprenas?", role: "你明白嗎", tone: "violet" },
        { text: "Ne", role: "否定回答", tone: "coral" },
        { text: "mi ne komprenas", role: "我不明白", tone: "mint" },
      ],
    },
    tip: "有 neni- 詞時通常不再加 ne：Mi vidis neniun（我誰也沒看見）。",
    checks: [
      {
        question: "要把 Vi parolas Esperanton. 變成是非問句，應該加什麼？",
        options: ["Kio", "Ĉu", "Ne"],
        answer: 1,
        explain: "詢問整句是否成立時，把 ĉu 放在句首：Ĉu vi parolas Esperanton?",
      },
      {
        question: "哪一句正確表示「我今天不工作」？",
        options: ["Mi laboras ne hodiaŭ.", "Mi ne laboras hodiaŭ.", "Ne mi laboras hodiaŭ."],
        answer: 1,
        explain: "要否定動作 laboras，ne 放在動詞前：mi ne laboras。",
      },
      {
        question: "「我誰也沒看見」最自然的說法是哪個？",
        options: ["Mi ne vidis neniun.", "Mi vidis neniun.", "Mi neniu vidis."],
        answer: 1,
        explain: "neniun 已經表示「沒有任何人」並帶受格 -n，通常不再另外加 ne。",
      },
    ],
  },
];

const translations = [
  {
    id: "cat-sees-dog",
    english: "The cat sees the dog.",
    note: "提示：動作的對象需要 -n",
    answers: ["La kato vidas la hundon.", "La kato la hundon vidas.", "La hundon vidas la kato."],
    required: ["la", "kato", "vidas", "la", "hundon"],
  },
  {
    id: "learning-today",
    english: "I am learning Esperanto today.",
    note: "提示：Esperanto 是名詞形式的語言名稱，不用冠詞；la angla、la franca 等形容詞形式要用 la",
    answers: ["Mi lernas Esperanton hodiaŭ.", "Hodiaŭ mi lernas Esperanton.", "Mi hodiaŭ lernas Esperanton."],
    required: ["mi", "lernas", "esperanton", "hodiaŭ"],
  },
  {
    id: "children-garden",
    english: "The children will play in the garden.",
    note: "提示：未來式是 -os",
    answers: ["La infanoj ludos en la ĝardeno.", "En la ĝardeno la infanoj ludos.", "La infanoj en la ĝardeno ludos."],
    required: ["la", "infanoj", "ludos", "en", "la", "ĝardeno"],
  },
  {
    id: "speaks-clearly",
    english: "She speaks very clearly.",
    note: "提示：描述動作使用 -e",
    answers: ["Ŝi parolas tre klare.", "Tre klare ŝi parolas.", "Ŝi tre klare parolas."],
    required: ["ŝi", "parolas", "tre", "klare"],
  },
  {
    id: "red-apples",
    english: "Tomorrow we will buy two red apples.",
    note: "提示：數詞本身不加 -j；名詞與形容詞仍標複數受格",
    answers: ["Morgaŭ ni aĉetos du ruĝajn pomojn.", "Ni aĉetos du ruĝajn pomojn morgaŭ.", "Du ruĝajn pomojn ni aĉetos morgaŭ."],
    required: ["morgaŭ", "ni", "aĉetos", "du", "ruĝajn", "pomojn"],
  },
  {
    id: "want-coffee",
    english: "Do you want coffee?",
    note: "提示：是非問句以 ĉu 開頭",
    answers: ["Ĉu vi volas kafon?", "Ĉu kafon vi volas?", "Ĉu vi kafon volas?"],
    required: ["ĉu", "vi", "volas", "kafon"],
  },
  {
    id: "sister-meat",
    english: "My sister does not eat meat.",
    note: "提示：ne 放在要否定的動詞前",
    answers: ["Mia fratino ne manĝas viandon.", "Viandon mia fratino ne manĝas.", "Mia fratino viandon ne manĝas."],
    required: ["mia", "fratino", "ne", "manĝas", "viandon"],
  },
  {
    id: "near-sea",
    english: "We live near the sea.",
    note: "提示：「靠近」可以說 proksime al",
    answers: ["Ni loĝas proksime al la maro.", "Proksime al la maro ni loĝas.", "Ni proksime al la maro loĝas."],
    required: ["ni", "loĝas", "proksime", "al", "la", "maro"],
  },
  {
    id: "interesting-book",
    english: "This book is more interesting than that book.",
    note: "提示：比較級使用 pli ... ol ...",
    answers: ["Ĉi tiu libro estas pli interesa ol tiu libro.", "Pli interesa ol tiu libro estas ĉi tiu libro."],
    required: ["ĉi", "tiu", "libro", "estas", "pli", "interesa", "ol", "tiu", "libro"],
  },
  {
    id: "train-station",
    english: "Where is the train station?",
    note: "提示：詢問地點使用 kie",
    answers: ["Kie estas la stacidomo?", "Kie la stacidomo estas?", "La stacidomo estas kie?"],
    required: ["kie", "estas", "la", "stacidomo"],
  },
  {
    id: "visited-us",
    english: "They visited us yesterday.",
    note: "提示：「我們」作受詞時是 nin",
    answers: ["Ili vizitis nin hieraŭ.", "Hieraŭ ili vizitis nin.", "Nin ili vizitis hieraŭ."],
    required: ["ili", "vizitis", "nin", "hieraŭ"],
  },
  {
    id: "close-window",
    english: "Please close the window.",
    note: "提示：bonvolu 後面接不定詞 -i",
    answers: ["Bonvolu fermi la fenestron.", "Bonvolu la fenestron fermi.", "La fenestron bonvolu fermi."],
    required: ["bonvolu", "fermi", "la", "fenestron"],
  },
];

const specialChars = ["ĉ", "ĝ", "ĥ", "ĵ", "ŝ", "ŭ", "Ĉ", "Ĝ", "Ĥ", "Ĵ", "Ŝ", "Ŭ"];
const LESSON_PROGRESS_KEY = "saluton.completed-lessons.v1";

function convertXSystem(value: string) {
  const replacements: Record<string, string> = {
    c: "ĉ", g: "ĝ", h: "ĥ", j: "ĵ", s: "ŝ", u: "ŭ",
    C: "Ĉ", G: "Ĝ", H: "Ĥ", J: "Ĵ", S: "Ŝ", U: "Ŭ",
  };

  return value.replace(/([cghjsuCGHJSU])[xX]/g, (_, letter: string) => replacements[letter]);
}

function shuffleIndexes(length: number, firstToAvoid?: number) {
  const indexes = Array.from({ length }, (_, index) => index);
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }
  if (firstToAvoid !== undefined && indexes.length > 1 && indexes[0] === firstToAvoid) {
    [indexes[0], indexes[1]] = [indexes[1], indexes[0]];
  }
  return indexes;
}

function randomQuizIndex(length: number, current = -1) {
  if (length <= 1) return 0;
  let next = current;
  while (next === current) next = Math.floor(Math.random() * length);
  return next;
}

function normalize(value: string) {
  return convertXSystem(value)
    .toLowerCase()
    .replace(/[.,!?;:“”"']/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

export default function Home() {
  const [mode, setMode] = useState<"grammar" | "translate">("grammar");
  const [lessonId, setLessonId] = useState(lessons[0].id);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [exerciseOrder, setExerciseOrder] = useState(() => translations.map((_, index) => index));
  const [exercisePosition, setExercisePosition] = useState(0);
  const [translation, setTranslation] = useState("");
  const [translationResult, setTranslationResult] = useState<"correct" | "close" | "wrong" | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [scoredExerciseIds, setScoredExerciseIds] = useState<string[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [showCourseCompletion, setShowCourseCompletion] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const lesson = useMemo(() => lessons.find((item) => item.id === lessonId) ?? lessons[0], [lessonId]);
  const currentCheck = lesson.checks[quizIndex] ?? lesson.checks[0];
  const exerciseIndex = exerciseOrder[exercisePosition] ?? 0;
  const exercise = translations[exerciseIndex];
  const score = scoredExerciseIds.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(LESSON_PROGRESS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const lessonIds = new Set(lessons.map((item) => item.id));
            const validIds = parsed.filter((id): id is string => typeof id === "string" && lessonIds.has(id));
            setCompletedLessonIds(validIds);
            setShowCourseCompletion(validIds.length === lessons.length);
          }
        }
      } catch {
        // Damaged or unavailable browser storage should not block learning.
      } finally {
        setProgressLoaded(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setExerciseOrder(shuffleIndexes(translations.length));
      setQuizIndex(randomQuizIndex(lessons[0].checks.length));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!progressLoaded) return;
    try {
      window.localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(completedLessonIds));
    } catch {
      // The lesson still works when storage is unavailable or full.
    }
  }, [completedLessonIds, progressLoaded]);

  function chooseLesson(id: string) {
    const target = lessons.find((item) => item.id === id) ?? lessons[0];
    setLessonId(id);
    setQuizIndex(randomQuizIndex(target.checks.length));
    setQuizChoice(null);
    setShowCourseCompletion(false);
    setMode("grammar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function randomizeQuiz() {
    setQuizIndex((current) => randomQuizIndex(lesson.checks.length, current));
    setQuizChoice(null);
  }

  function addCharacter(character: string) {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const next = translation.slice(0, start) + character + translation.slice(end);
    setTranslation(next);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + 1, start + 1);
    });
  }

  function answerLessonQuiz(choice: number) {
    setQuizChoice(choice);
    if (choice !== currentCheck.answer) return;
    setCompletedLessonIds((current) => current.includes(lesson.id) ? current : [...current, lesson.id]);
  }

  function goToNextLesson() {
    const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);
    const nextIncomplete = lessons
      .map((_, offset) => lessons[(lessonIndex + offset + 1) % lessons.length])
      .find((item) => !completedLessonIds.includes(item.id));

    if (nextIncomplete) {
      chooseLesson(nextIncomplete.id);
      return;
    }

    setShowCourseCompletion(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function checkTranslation() {
    if (!translation.trim()) return;
    const converted = convertXSystem(translation);
    setTranslation(converted);
    const user = normalize(converted);
    const exact = exercise.answers.some((answer) => normalize(answer) === user);
    const tokens = user.split(" ").sort();
    const expected = exercise.required.map(normalize).sort();
    const samePieces = tokens.length === expected.length && tokens.every((token, index) => token === expected[index]);
    if (exact || samePieces) {
      setTranslationResult("correct");
      setScoredExerciseIds((current) => current.includes(exercise.id) ? current : [...current, exercise.id]);
    } else {
      const hits = exercise.required.filter((token) => user.includes(normalize(token))).length;
      setTranslationResult(hits >= Math.ceil(exercise.required.length * 0.7) ? "close" : "wrong");
    }
    setShowAnswers(true);
  }

  function nextExercise() {
    if (exercisePosition === exerciseOrder.length - 1) {
      setExerciseOrder(shuffleIndexes(translations.length, exerciseIndex));
      setExercisePosition(0);
      setScoredExerciseIds([]);
    } else {
      setExercisePosition((current) => current + 1);
    }
    setTranslation("");
    setTranslationResult(null);
    setShowAnswers(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Saluton 首頁">
          <span className="brand-mark">S</span>
          <span>saluton<span className="brand-dot">!</span></span>
        </a>

        <nav className="primary-nav" aria-label="主要功能">
          <button className={mode === "grammar" ? "nav-button active" : "nav-button"} onClick={() => setMode("grammar")}>
            <span className="nav-icon">⌁</span>
            文法學習
          </button>
          <button className={mode === "translate" ? "nav-button active" : "nav-button"} onClick={() => setMode("translate")}>
            <span className="nav-icon">A↔</span>
            逆翻譯練習
          </button>
        </nav>

        <div className="course-label">基礎路線 · {lessons.length} 個單元</div>
        <div className="lesson-list">
          {lessons.map((item) => {
            const isCompleted = completedLessonIds.includes(item.id);
            return (
              <button
                key={item.id}
                className={mode === "grammar" && item.id === lessonId ? "lesson-link active" : "lesson-link"}
                onClick={() => chooseLesson(item.id)}
              >
                <span className={isCompleted ? "lesson-status done" : "lesson-status"}>{isCompleted ? "✓" : item.unit}</span>
                <span><b>{item.title}</b><small>{item.subtitle}</small></span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-progress">
          <div className="progress-copy"><span>學習進度</span><b>{completedCount} / {lessons.length}</b></div>
          <div className="progress-track" role="progressbar" aria-label="文法課程完成進度" aria-valuemin={0} aria-valuemax={lessons.length} aria-valuenow={completedCount}>
            <span style={{ width: `${progressPercent}%` }} />
          </div>
          <p>{completedCount === lessons.length ? "Bonege! 基礎路線完成 🎉" : completedCount === 0 ? "答對單元測驗，開始累積進度 🌱" : "Daŭrigu! 再完成一課 🌱"}</p>
        </div>
      </aside>

      <main className="main" id="top">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">S</span><b>saluton!</b></div>
          <div className="topbar-actions">
            <span className="streak">🔥 <b>3</b> 天連續學習</span>
            <button className="round-button" aria-label="通知">•</button>
            <div className="avatar" aria-label="學習者頭像">E</div>
          </div>
        </header>

        {mode === "grammar" ? showCourseCompletion ? (
          <div className="content-wrap course-complete">
            <div className="completion-burst" aria-hidden="true">
              <span>✦</span>
              <strong>{lessons.length} / {lessons.length}</strong>
              <small>finita!</small>
            </div>
            <div className="eyebrow">基礎路線完成</div>
            <h1>Vi sukcesis<span>!</span></h1>
            <p className="completion-lead">你已經完成所有基礎文法單元。從詞尾、受格與動詞，到冠詞、介系詞、比較、問句與自由語序，都已經成為你的 Esperanto 工具箱。</p>
            <div className="completion-lessons" aria-label="已完成的單元">
              {lessons.map((item) => (
                <span key={item.id}><i>✓</i>{item.title}</span>
              ))}
            </div>
            <div className="completion-progress">
              <div><span>課程進度</span><b>100%</b></div>
              <div className="progress-track" role="progressbar" aria-label="文法課程已完成" aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}><span style={{ width: "100%" }} /></div>
            </div>
            <div className="completion-actions">
              <button className="secondary-action completion-review" onClick={() => chooseLesson(lessons[0].id)}>↻ 回頭複習</button>
              <button className="primary-action" onClick={() => setMode("translate")}>開始逆翻譯 <span>→</span></button>
            </div>
          </div>
        ) : (
          <div className="content-wrap grammar-view">
            <div className="breadcrumbs"><span>文法學習</span><b>／</b><span>單元 {lesson.unit}</span></div>
            <section className="lesson-hero">
              <div>
                <div className="eyebrow">{lesson.eyebrow}</div>
                <h1>{lesson.title}<span>。</span></h1>
                <p>{lesson.summary}</p>
              </div>
              <div className="hero-sticker" aria-hidden="true">
                <span className="sticker-star">✦</span>
                <span className="sticker-word">facile!</span>
                <small>其實很簡單</small>
              </div>
            </section>

            <section className="ending-grid" aria-label="文法重點">
              {lesson.endings.map((item) => (
                <article className={`ending-card ${item.tone}`} key={item.ending}>
                  <span className="ending">{item.ending}</span>
                  <div><b>{item.label}</b><small>{item.example}</small></div>
                </article>
              ))}
            </section>

            <section className="sentence-lab">
              <div className="section-heading">
                <div><span className="section-number">01</span><h2>把句子拆開看</h2></div>
                <p>點讀每一塊，詞尾會自己說明身分。</p>
              </div>
              <div className="sentence-stage">
                <div className="sentence-parts">
                  {lesson.example.parts.map((part, index) => (
                    <div className={`word-piece ${part.tone}`} key={`${part.text}-${index}`}>
                      <span>{part.text}</span><small>{part.role}</small>
                    </div>
                  ))}
                  <span className="period">.</span>
                </div>
                <div className="translation-line"><span>中文</span>{lesson.example.zh}</div>
              </div>
              <div className="tip-card"><span>💡</span><p><b>詞尾偵探提示</b>{lesson.tip}</p></div>
            </section>

            <section className="quick-check">
              <div className="section-heading">
                <div><span className="section-number coral-number">02</span><h2>換你試試看</h2></div>
                <button className="one-question" onClick={randomizeQuiz}>隨機題庫 {lesson.checks.length} 題 · 換一題 ↻</button>
              </div>
              <div className="quiz-card">
                <p className="quiz-question">{currentCheck.question}</p>
                <div className="quiz-options">
                  {currentCheck.options.map((option, index) => {
                    const isAnswered = quizChoice !== null;
                    const className = isAnswered && index === currentCheck.answer ? "quiz-option correct" : isAnswered && index === quizChoice ? "quiz-option wrong" : "quiz-option";
                    return <button className={className} key={option} onClick={() => answerLessonQuiz(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>;
                  })}
                </div>
                {quizChoice !== null && (
                  <div className={quizChoice === currentCheck.answer ? "quiz-feedback success" : "quiz-feedback retry"}>
                    <b>{quizChoice === currentCheck.answer ? "Bonege! 答對了" : "差一點，再看一次"}</b>
                    <span>{currentCheck.explain}</span>
                  </div>
                )}
              </div>
            </section>

            <div className="lesson-actions">
              <button className="secondary-action" onClick={randomizeQuiz}>↻ 換一題練習</button>
              <button className="primary-action" onClick={goToNextLesson}>{completedCount === lessons.length ? "完成基礎路線" : "下一個單元"} <span>→</span></button>
            </div>
          </div>
        ) : (
          <div className="content-wrap translate-view">
            <div className="breadcrumbs"><span>逆翻譯練習</span><b>／</b><span>日常英文</span></div>
            <section className="translate-hero">
              <div>
                <div className="eyebrow coral-eyebrow">自由語序訓練</div>
                <h1>把意思帶回<br /><span>Esperanto</span>。</h1>
                <p>不只背一個答案。我們會比對詞尾、關鍵詞與多種自然語序。</p>
              </div>
              <div className="score-card"><small>本輪答對</small><strong>{score}</strong><span>/ {translations.length}</span></div>
            </section>

            <section className="translation-card">
              <div className="exercise-meta"><span>隨機題目 {String(exercisePosition + 1).padStart(2, "0")} / {translations.length}</span><div className="dot-progress">{exerciseOrder.map((_, i) => <i className={i === exercisePosition ? "active" : i < exercisePosition ? "done" : ""} key={i} />)}</div></div>
              <p className="english-label">請翻譯這句英文</p>
              <h2>{exercise.english}</h2>
              <p className="exercise-note">{exercise.note}</p>

              <label className="answer-label" htmlFor="translation-input">你的 Esperanto</label>
              <textarea
                ref={inputRef}
                id="translation-input"
                value={translation}
                onChange={(event) => { setTranslation(event.target.value); setTranslationResult(null); setShowAnswers(false); }}
                onKeyDown={(event) => {
                  if (!(event.metaKey || event.ctrlKey) || event.key !== "Enter") return;
                  event.preventDefault();
                  if (translationResult === "correct") nextExercise();
                  else checkTranslation();
                }}
                aria-keyshortcuts="Meta+Enter Control+Enter"
                placeholder="例如：La kato..."
                spellCheck={false}
              />

              <div className="character-keyboard" aria-label="Esperanto 特殊字元鍵盤">
                <span>特殊字元<br /><small>也可輸入 cx、gx、hx、jx、sx、ux</small></span>
                <div>{specialChars.map((character) => <button key={character} onClick={() => addCharacter(character)}>{character}</button>)}</div>
              </div>

              {translationResult && (
                <div className={`translation-feedback ${translationResult}`}>
                  <span className="feedback-icon">{translationResult === "correct" ? "✓" : translationResult === "close" ? "~" : "!"}</span>
                  <div>
                    <b>{translationResult === "correct" ? "Bonege! 這個翻譯成立" : translationResult === "close" ? "很接近，再檢查詞尾" : "意思還沒對上，再試一次"}</b>
                    <p>{translationResult === "correct" ? "語序清楚、必要的受格與時態也都到位。" : "看看下方的自然答案，比較哪些小零件不同。"}</p>
                  </div>
                </div>
              )}

              {showAnswers && (
                <div className="accepted-answers">
                  <div><b>可接受的自然說法</b><span>語序可變，語氣重點略有不同</span></div>
                  <ol>{exercise.answers.map((answer) => <li key={answer}>{answer}</li>)}</ol>
                </div>
              )}

              <div className="translation-actions">
                <button className="text-action" onClick={() => setShowAnswers((shown) => !shown)}>◎ {showAnswers ? "收起參考答案" : "查看參考答案"}</button>
                {translationResult === "correct" ? (
                  <button className="primary-action" onClick={nextExercise}>{exercisePosition === exerciseOrder.length - 1 ? "開始新一輪" : "下一題"} <span>⌘↵</span></button>
                ) : (
                  <button className="primary-action" onClick={checkTranslation} disabled={!translation.trim()}>檢查答案 <span>⌘↵</span></button>
                )}
              </div>
            </section>

            <section className="freedom-note">
              <span className="freedom-mark">N</span>
              <div><h3>為什麼答案不只一個？</h3><p>受格 <b>-n</b> 像名牌一樣標示受詞，因此 Esperanto 可以調整語序來強調不同內容。不過介系詞與 ne、nur、tre 等修飾詞仍要待在清楚的位置。</p></div>
            </section>
          </div>
        )}

        <footer>
          <span>Farite kun scivolemo · 用好奇心製作</span>
          <a href="https://lernu.net/gramatiko?hl=en" target="_blank" rel="noreferrer">文法架構參考 lernu! ↗</a>
        </footer>
      </main>

      <nav className="mobile-nav" aria-label="手機版主要功能">
        <button className={mode === "grammar" ? "active" : ""} onClick={() => setMode("grammar")}><span>⌁</span>文法</button>
        <button className={mode === "translate" ? "active" : ""} onClick={() => setMode("translate")}><span>A↔</span>翻譯</button>
      </nav>
    </div>
  );
}
