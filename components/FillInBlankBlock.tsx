"use client";
import { useState } from "react";

export interface FillInBlankQuestion {
  question: string;   // underscores mark blanks: "The ___ is a ___"
  answers: string[];  // one entry per blank, in order
}

// ── Helpers ───────────────────────────────────────────────────

/** Split a question string into alternating text / blank segments.
 *  Blank markers: one or more underscores (___) or {{blank}} */
function parseSegments(raw: string): ("text" | "blank")[] {
  // Normalise both marker styles to a single token
  const normalised = raw.replace(/\{\{blank\}\}/g, "___");
  return normalised.split(/(_{2,})/).map((seg, i) =>
    i % 2 === 1 ? "blank" : "text"
  ) as ("text" | "blank")[];
}

function splitQuestion(raw: string): string[] {
  const normalised = raw.replace(/\{\{blank\}\}/g, "___");
  return normalised.split(/(_{2,})/);
}

/** Loose equality: trim whitespace, case-insensitive,
 *  also accept answers wrapped in parentheses like "(foo)" matching "foo" */
function isCorrect(input: string, answer: string): boolean {
  const clean = (s: string) =>
    s.trim().toLowerCase().replace(/^\((.+)\)$/, "$1").trim();
  // Support slash-separated alternatives: "foo / bar"
  return answer.split("/").map(clean).includes(clean(input));
}

// ── Main component ────────────────────────────────────────────

export default function FillInBlankBlock({
  questions,
}: {
  questions: FillInBlankQuestion[];
}) {
  const [mode, setMode] = useState<"instant" | "quiz">("instant");

  const btnBase: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.68rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "0.35em 1em",
    border: "1px solid var(--rule)",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    background: "none",
    transition: "all 150ms",
  };

  return (
    <div>
      {/* Mode toggle — identical pattern to MCQBlock */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
        {(["instant", "quiz"] as const).map((m) => (
          <button
            key={m}
            style={{
              ...btnBase,
              color: mode === m ? "var(--amber)" : "var(--ink-muted)",
              borderColor: mode === m ? "var(--amber-light)" : "var(--rule)",
              background: mode === m ? "var(--amber-pale)" : "none",
            }}
            onClick={() => setMode(m)}
          >
            {m === "instant" ? "Instant" : "Quiz"}
          </button>
        ))}
      </div>

      {mode === "instant" ? (
        <InstantMode questions={questions} />
      ) : (
        <QuizMode questions={questions} />
      )}
    </div>
  );
}

// ── Shared: one question card ─────────────────────────────────

function QuestionCard({
  q,
  qi,
  inputs,
  onChange,
  revealed,        // instant: per-blank reveal; quiz: all at once after submit
  disabled,
}: {
  q: FillInBlankQuestion;
  qi: number;
  inputs: string[];
  onChange: (blankIndex: number, value: string) => void;
  revealed: boolean;
  disabled: boolean;
}) {
  const parts = splitQuestion(q.question);
  let blankIdx = 0;

  return (
    <div
      style={{
        background: "var(--paper-dark)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--radius)",
        padding: "1.1rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          color: "var(--ink-faint)",
          marginBottom: "0.6rem",
          letterSpacing: "0.06em",
        }}
      >
        Q{qi + 1}
      </p>

      {/* Question with inline inputs */}
      <div
        style={{
          fontFamily: "var(--font-body)",
          fontStyle: "italic",
          fontSize: "1rem",
          color: "var(--ink)",
          lineHeight: 2.1,
          flexWrap: "wrap",
          display: "flex",
          alignItems: "center",
          gap: "0 0.15rem",
        }}
      >
        {parts.map((part, pi) => {
          if (!/^_{2,}$/.test(part) && !part.includes("{{blank}}")) {
            // plain text — split on newlines so paragraphs render
            return (
              <span key={pi} style={{ whiteSpace: "pre-wrap" }}>
                {part}
              </span>
            );
          }

          const bi = blankIdx++;
          const val = inputs[bi] ?? "";
          const correct = isCorrect(val, q.answers[bi] ?? "");
          const expected = q.answers[bi] ?? "";

          let borderColor = "var(--rule-2)";
          let bg = "var(--paper)";
          let color = "var(--ink)";

          if (revealed && val !== "") {
            borderColor = correct ? "#7cb87c" : "#d47c7c";
            bg = correct ? "#e8f5e8" : "#fde8e8";
            color = correct ? "#2d6b2d" : "#8b2d2d";
          } else if (revealed && val === "") {
            borderColor = "#d47c7c";
            bg = "#fde8e8";
          }

          // Width: grow with expected answer length
          const minW = Math.max(80, expected.length * 9);

          return (
            <span key={pi} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", margin: "0 0.15rem" }}>
              <input
                type="text"
                value={val}
                disabled={disabled}
                onChange={(e) => onChange(bi, e.target.value)}
                placeholder="___"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.82rem",
                  fontStyle: "normal",
                  padding: "0.2em 0.5em",
                  width: `${minW}px`,
                  maxWidth: "260px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: "var(--radius)",
                  background: bg,
                  color,
                  outline: "none",
                  transition: "border-color 120ms, background 120ms",
                  textAlign: "center",
                }}
              />
              {/* Show expected answer below if wrong after reveal */}
              {revealed && !correct && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.65rem",
                    color: "#7cb87c",
                    marginTop: "0.15rem",
                    fontStyle: "normal",
                  }}
                >
                  ✓ {expected}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ── Instant mode ──────────────────────────────────────────────
// Each question has its own "Check" button; answers revealed per-question.

function InstantMode({ questions }: { questions: FillInBlankQuestion[] }) {
  const makeInputs = () => questions.map((q) => Array(q.answers.length).fill(""));
  const [inputs, setInputs] = useState<string[][]>(makeInputs);
  const [revealed, setRevealed] = useState<boolean[]>(
    Array(questions.length).fill(false)
  );

  const update = (qi: number, bi: number, val: string) => {
    if (revealed[qi]) return;
    setInputs((prev) => {
      const next = prev.map((r) => [...r]);
      next[qi][bi] = val;
      return next;
    });
  };

  const check = (qi: number) =>
    setRevealed((prev) => { const n = [...prev]; n[qi] = true; return n; });

  const reset = () => { setInputs(makeInputs()); setRevealed(Array(questions.length).fill(false)); };

  const answeredCount = inputs.filter((row) => row.some((v) => v !== "")).length;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {questions.map((q, qi) => (
          <div key={qi}>
            <QuestionCard
              q={q}
              qi={qi}
              inputs={inputs[qi]}
              onChange={(bi, val) => update(qi, bi, val)}
              revealed={revealed[qi]}
              disabled={revealed[qi]}
            />
            {!revealed[qi] && (
              <div style={{ marginTop: "0.5rem", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => check(qi)}
                  disabled={inputs[qi].every((v) => v === "")}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "0.35em 1em",
                    border: "1px solid var(--amber-light)",
                    borderRadius: "var(--radius)",
                    cursor: inputs[qi].every((v) => v === "") ? "not-allowed" : "pointer",
                    background: "var(--amber-pale)",
                    color: "var(--amber)",
                    opacity: inputs[qi].every((v) => v === "") ? 0.45 : 1,
                    transition: "opacity 120ms",
                  }}
                >
                  Check
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <button
          onClick={reset}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "0.4em 1em",
            border: "1px solid var(--rule)",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            background: "none",
            color: "var(--ink-muted)",
          }}
        >
          Reset
        </button>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ink-faint)" }}>
          {answeredCount} / {questions.length} attempted
        </span>
      </div>
    </div>
  );
}

// ── Quiz mode ─────────────────────────────────────────────────
// Fill everything, then Submit once — score shown at the end.

function QuizMode({ questions }: { questions: FillInBlankQuestion[] }) {
  const makeInputs = () => questions.map((q) => Array(q.answers.length).fill(""));
  const [inputs, setInputs] = useState<string[][]>(makeInputs);
  const [submitted, setSubmitted] = useState(false);

  const update = (qi: number, bi: number, val: string) => {
    if (submitted) return;
    setInputs((prev) => {
      const next = prev.map((r) => [...r]);
      next[qi][bi] = val;
      return next;
    });
  };

  const reset = () => { setInputs(makeInputs()); setSubmitted(false); };

  // Score: count correct blanks across all questions
  const totalBlanks = questions.reduce((s, q) => s + q.answers.length, 0);
  const correctBlanks = submitted
    ? questions.reduce(
        (s, q, qi) =>
          s + q.answers.filter((ans, bi) => isCorrect(inputs[qi][bi] ?? "", ans)).length,
        0
      )
    : 0;
  const pct = submitted ? Math.round((correctBlanks / totalBlanks) * 100) : null;
  const scoreColor =
    pct !== null
      ? pct >= 70
        ? "#2d6b2d"
        : pct >= 40
        ? "var(--amber)"
        : "#8b2d2d"
      : "var(--amber)";

  const allFilled = inputs.every((row) => row.every((v) => v !== ""));

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {questions.map((q, qi) => (
          <QuestionCard
            key={qi}
            q={q}
            qi={qi}
            inputs={inputs[qi]}
            onChange={(bi, val) => update(qi, bi, val)}
            revealed={submitted}
            disabled={submitted}
          />
        ))}
      </div>

      <div style={{ marginTop: "1.2rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        {!submitted ? (
          <>
            <button
              onClick={() => setSubmitted(true)}
              disabled={!allFilled}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.5em 1.4em",
                border: "1px solid var(--amber-light)",
                borderRadius: "var(--radius)",
                cursor: allFilled ? "pointer" : "not-allowed",
                background: "var(--amber-pale)",
                color: "var(--amber)",
                opacity: allFilled ? 1 : 0.5,
              }}
            >
              Submit
            </button>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ink-faint)" }}>
              {inputs.flat().filter((v) => v !== "").length} / {totalBlanks} blanks filled
            </span>
          </>
        ) : (
          <>
            <button
              onClick={reset}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "0.4em 1em",
                border: "1px solid var(--rule)",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                background: "none",
                color: "var(--ink-muted)",
              }}
            >
              Try again
            </button>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontStyle: "italic", color: scoreColor }}>
              {correctBlanks} / {totalBlanks} blanks — {pct}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}