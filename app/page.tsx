"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
  check: { question: string; options: string[]; answer: number; explain: string };
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
    check: {
      question: "哪一個字最適合放進：Ŝi dancas ___.（她優雅地跳舞。）",
      options: ["eleganto", "eleganta", "elegante"],
      answer: 2,
      explain: "要描述「怎麼跳」，需要副詞詞尾 -e，所以是 elegante。",
    },
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
    check: {
      question: "「我看見紅色的花朵」應該用哪一組？",
      options: ["ruĝa floroj", "ruĝajn florojn", "ruĝaj floron"],
      answer: 1,
      explain: "花朵是複數受詞，所以形容詞與名詞都要加 -j，再加 -n。",
    },
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
    check: {
      question: "「明天我們將旅行」的動詞應該是哪一個？",
      options: ["vojaĝis", "vojaĝas", "vojaĝos"],
      answer: 2,
      explain: "morgaŭ（明天）指向未來，因此使用 -os：vojaĝos。",
    },
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
    check: {
      question: "「他們看見我們」應該怎麼說？",
      options: ["Ilin vidas ni.", "Ili vidas nin.", "Ili vidas ni."],
      answer: 1,
      explain: "ili 是做動作的主詞；ni 是被看見的對象，所以變成 nin。",
    },
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
    check: {
      question: "如果 kie 是「哪裡」，那麼 nenie 是什麼？",
      options: ["某處", "到處", "無處／哪裡都不"],
      answer: 2,
      explain: "neni- 表示「沒有任何」，-e 表示地點，因此 nenie 是「無處」。",
    },
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
    check: {
      question: "哪一句仍表示「狗追貓」？",
      options: ["Hundon ĉasas kato.", "Katon ĉasas hundo.", "Kato ĉasas hundo."],
      answer: 1,
      explain: "katon 有 -n，所以貓是受詞；沒有 -n 的 hundo 是主詞。",
    },
  },
];

const translations = [
  {
    english: "The cat sees the dog.",
    note: "提示：動作的對象需要 -n",
    answers: ["La kato vidas la hundon.", "La kato la hundon vidas.", "La hundon vidas la kato."],
    required: ["la", "kato", "vidas", "la", "hundon"],
  },
  {
    english: "I am learning Esperanto today.",
    note: "提示：語言名稱通常不用冠詞",
    answers: ["Mi lernas Esperanton hodiaŭ.", "Hodiaŭ mi lernas Esperanton.", "Mi hodiaŭ lernas Esperanton."],
    required: ["mi", "lernas", "esperanton", "hodiaŭ"],
  },
  {
    english: "The children will play in the garden.",
    note: "提示：未來式是 -os",
    answers: ["La infanoj ludos en la ĝardeno.", "En la ĝardeno la infanoj ludos.", "La infanoj en la ĝardeno ludos."],
    required: ["la", "infanoj", "ludos", "en", "la", "ĝardeno"],
  },
  {
    english: "She speaks very clearly.",
    note: "提示：描述動作使用 -e",
    answers: ["Ŝi parolas tre klare.", "Tre klare ŝi parolas.", "Ŝi tre klare parolas."],
    required: ["ŝi", "parolas", "tre", "klare"],
  },
  {
    english: "Tomorrow we will buy two red apples.",
    note: "提示：數詞後名詞不加 -j，但受詞仍加 -n",
    answers: ["Morgaŭ ni aĉetos du ruĝajn pomojn.", "Ni aĉetos du ruĝajn pomojn morgaŭ.", "Du ruĝajn pomojn ni aĉetos morgaŭ."],
    required: ["morgaŭ", "ni", "aĉetos", "du", "ruĝajn", "pomojn"],
  },
];

const specialChars = ["ĉ", "ĝ", "ĥ", "ĵ", "ŝ", "ŭ", "Ĉ", "Ĝ", "Ĥ", "Ĵ", "Ŝ", "Ŭ"];
const LESSON_PROGRESS_KEY = "saluton.completed-lessons.v1";

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/cx/g, "ĉ")
    .replace(/gx/g, "ĝ")
    .replace(/hx/g, "ĥ")
    .replace(/jx/g, "ĵ")
    .replace(/sx/g, "ŝ")
    .replace(/ux/g, "ŭ")
    .replace(/[.,!?;:“”"']/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

export default function Home() {
  const [mode, setMode] = useState<"grammar" | "translate">("grammar");
  const [lessonId, setLessonId] = useState(lessons[0].id);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [translation, setTranslation] = useState("");
  const [translationResult, setTranslationResult] = useState<"correct" | "close" | "wrong" | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const lesson = useMemo(() => lessons.find((item) => item.id === lessonId) ?? lessons[0], [lessonId]);
  const exercise = translations[exerciseIndex];
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LESSON_PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const lessonIds = new Set(lessons.map((item) => item.id));
          setCompletedLessonIds(parsed.filter((id): id is string => typeof id === "string" && lessonIds.has(id)));
        }
      }
    } catch {
      // Damaged or unavailable browser storage should not block learning.
    } finally {
      setProgressLoaded(true);
    }
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
    setLessonId(id);
    setQuizChoice(null);
    setMode("grammar");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    if (choice !== lesson.check.answer) return;
    setCompletedLessonIds((current) => current.includes(lesson.id) ? current : [...current, lesson.id]);
  }

  function checkTranslation() {
    if (!translation.trim()) return;
    const user = normalize(translation);
    const exact = exercise.answers.some((answer) => normalize(answer) === user);
    const tokens = user.split(" ").sort();
    const expected = exercise.required.map(normalize).sort();
    const samePieces = tokens.length === expected.length && tokens.every((token, index) => token === expected[index]);
    if (exact || samePieces) {
      setTranslationResult("correct");
      setScore((current) => current + (translationResult === "correct" ? 0 : 1));
    } else {
      const hits = exercise.required.filter((token) => user.includes(normalize(token))).length;
      setTranslationResult(hits >= Math.ceil(exercise.required.length * 0.7) ? "close" : "wrong");
    }
    setShowAnswers(true);
  }

  function nextExercise() {
    setExerciseIndex((current) => (current + 1) % translations.length);
    setTranslation("");
    setTranslationResult(null);
    setShowAnswers(false);
    inputRef.current?.focus();
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

        {mode === "grammar" ? (
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
                <span className="one-question">1 題快速檢查</span>
              </div>
              <div className="quiz-card">
                <p className="quiz-question">{lesson.check.question}</p>
                <div className="quiz-options">
                  {lesson.check.options.map((option, index) => {
                    const isAnswered = quizChoice !== null;
                    const className = isAnswered && index === lesson.check.answer ? "quiz-option correct" : isAnswered && index === quizChoice ? "quiz-option wrong" : "quiz-option";
                    return <button className={className} key={option} onClick={() => answerLessonQuiz(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>;
                  })}
                </div>
                {quizChoice !== null && (
                  <div className={quizChoice === lesson.check.answer ? "quiz-feedback success" : "quiz-feedback retry"}>
                    <b>{quizChoice === lesson.check.answer ? "Bonege! 答對了" : "差一點，再看一次"}</b>
                    <span>{lesson.check.explain}</span>
                  </div>
                )}
              </div>
            </section>

            <div className="lesson-actions">
              <button className="secondary-action" onClick={() => setQuizChoice(null)}>↻ 再複習一次</button>
              <button className="primary-action" onClick={() => {
                const next = lessons[(lessons.findIndex((item) => item.id === lesson.id) + 1) % lessons.length];
                chooseLesson(next.id);
              }}>下一個單元 <span>→</span></button>
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
              <div className="exercise-meta"><span>句子 {String(exerciseIndex + 1).padStart(2, "0")}</span><div className="dot-progress">{translations.map((_, i) => <i className={i === exerciseIndex ? "active" : i < exerciseIndex ? "done" : ""} key={i} />)}</div></div>
              <p className="english-label">請翻譯這句英文</p>
              <h2>{exercise.english}</h2>
              <p className="exercise-note">{exercise.note}</p>

              <label className="answer-label" htmlFor="translation-input">你的 Esperanto</label>
              <textarea
                ref={inputRef}
                id="translation-input"
                value={translation}
                onChange={(event) => { setTranslation(event.target.value); setTranslationResult(null); setShowAnswers(false); }}
                onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter") checkTranslation(); }}
                placeholder="例如：La kato..."
                spellCheck={false}
              />

              <div className="character-keyboard" aria-label="Esperanto 特殊字元鍵盤">
                <span>特殊字元</span>
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
                  <button className="primary-action" onClick={nextExercise}>下一題 <span>→</span></button>
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
