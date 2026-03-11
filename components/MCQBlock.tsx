"use client";
import { useState } from "react";

export interface MCQOption {
  text: string;
  correct: boolean;
}

export interface MCQQuestion {
  question: string;
  options: MCQOption[];
  explanation?: string;
}

const LETTERS = ["A", "B", "C", "D", "E"];
type Mode = "instant" | "quiz";

export default function MCQBlock({ questions }: { questions: MCQQuestion[] }) {
  const [mode, setMode] = useState<Mode>("instant");

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
      {/* Mode toggle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
        <button
          style={{
            ...btnBase,
            color: mode === "instant" ? "var(--amber)" : "var(--ink-muted)",
            borderColor: mode === "instant" ? "var(--amber-light)" : "var(--rule)",
            background: mode === "instant" ? "var(--amber-pale)" : "none",
          }}
          onClick={() => setMode("instant")}
        >
          Instant
        </button>
        <button
          style={{
            ...btnBase,
            color: mode === "quiz" ? "var(--amber)" : "var(--ink-muted)",
            borderColor: mode === "quiz" ? "var(--amber-light)" : "var(--rule)",
            background: mode === "quiz" ? "var(--amber-pale)" : "none",
          }}
          onClick={() => setMode("quiz")}
        >
          Quiz
        </button>
      </div>

      {mode === "instant" ? (
        <InstantMode questions={questions} />
      ) : (
        <QuizMode questions={questions} />
      )}
    </div>
  );
}

function InstantMode({ questions }: { questions: MCQQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  const pick = (qi: number, oi: number) => {
    if (answers[qi] !== null) return;
    setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; });
  };

  const reset = () => setAnswers(Array(questions.length).fill(null));

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const answered = chosen !== null;
          return (
            <div
              key={qi}
              style={{
                background: "var(--paper-dark)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--radius)",
                padding: "1.1rem",
              }}
            >
              <p style={{
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
                fontSize: "1rem",
                color: "var(--ink)",
                marginBottom: "0.85rem",
                lineHeight: 1.5,
              }}>
                <span style={{ fontStyle: "normal", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--ink-faint)", marginRight: "0.5rem" }}>
                  Q{qi + 1}
                </span>
                {q.question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {q.options.map((opt, oi) => {
                  let bg = "var(--paper)";
                  let border = "var(--rule)";
                  let color = "var(--ink-muted)";
                  if (answered) {
                    if (oi === chosen) {
                      bg = opt.correct ? "#e8f5e8" : "#fde8e8";
                      border = opt.correct ? "#7cb87c" : "#d47c7c";
                      color = opt.correct ? "#2d6b2d" : "#8b2d2d";
                    } else if (opt.correct) {
                      bg = "#e8f5e8"; border = "#7cb87c"; color = "#2d6b2d";
                    } else {
                      color = "var(--ink-faint)";
                    }
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => pick(qi, oi)}
                      disabled={answered}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        padding: "0.6rem 0.85rem",
                        background: bg,
                        border: `1px solid ${border}`,
                        borderRadius: "var(--radius)",
                        cursor: answered ? "default" : "pointer",
                        textAlign: "left",
                        width: "100%",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.93rem",
                        color,
                        transition: "all 120ms",
                        opacity: answered && oi !== chosen && !opt.correct ? 0.45 : 1,
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: answered ? color : "var(--amber)",
                        minWidth: "1.3rem",
                        flexShrink: 0,
                        paddingTop: "0.1rem",
                      }}>
                        {LETTERS[oi]}
                      </span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {answered && q.explanation && (
                <div style={{
                  marginTop: "0.75rem",
                  padding: "0.65rem 0.9rem",
                  background: "var(--amber-pale)",
                  borderLeft: "2px solid var(--amber-light)",
                  borderRadius: "0 2px 2px 0",
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                  color: "var(--ink-muted)",
                  lineHeight: 1.65,
                }}>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
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
          {answers.filter(a => a !== null).length} / {questions.length} answered
        </span>
      </div>
    </div>
  );
}

function QuizMode({ questions }: { questions: MCQQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const pick = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers(prev => { const n = [...prev]; n[qi] = oi; return n; });
  };

  const reset = () => { setAnswers(Array(questions.length).fill(null)); setSubmitted(false); };

  const score = submitted
    ? questions.filter((q, i) => answers[i] !== null && q.options[answers[i]!]?.correct).length
    : null;

  const pct = score !== null ? Math.round((score / questions.length) * 100) : null;
  const scoreColor = pct !== null
    ? pct >= 70 ? "#2d6b2d" : pct >= 40 ? "var(--amber)" : "#8b2d2d"
    : "var(--amber)";

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <div
              key={qi}
              style={{
                background: "var(--paper-dark)",
                border: "1px solid var(--rule)",
                borderRadius: "var(--radius)",
                padding: "1.1rem",
              }}
            >
              <p style={{
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
                fontSize: "1rem",
                color: "var(--ink)",
                marginBottom: "0.85rem",
                lineHeight: 1.5,
              }}>
                <span style={{ fontStyle: "normal", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--ink-faint)", marginRight: "0.5rem" }}>
                  Q{qi + 1}
                </span>
                {q.question}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {q.options.map((opt, oi) => {
                  let bg = "var(--paper)";
                  let border = "var(--rule)";
                  let color = "var(--ink-muted)";
                  let opacity = 1;
                  if (submitted) {
                    if (opt.correct) { bg = "#e8f5e8"; border = "#7cb87c"; color = "#2d6b2d"; }
                    else if (oi === chosen) { bg = "#fde8e8"; border = "#d47c7c"; color = "#8b2d2d"; }
                    else { opacity = 0.4; }
                  } else if (oi === chosen) {
                    bg = "var(--amber-pale)"; border = "var(--amber-light)"; color = "var(--ink)";
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => pick(qi, oi)}
                      disabled={submitted}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        padding: "0.6rem 0.85rem",
                        background: bg,
                        border: `1px solid ${border}`,
                        borderRadius: "var(--radius)",
                        cursor: submitted ? "default" : "pointer",
                        textAlign: "left",
                        width: "100%",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.93rem",
                        color,
                        opacity,
                        transition: "all 120ms",
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        color: oi === chosen ? "var(--amber)" : "var(--ink-faint)",
                        minWidth: "1.3rem",
                        flexShrink: 0,
                        paddingTop: "0.1rem",
                      }}>
                        {LETTERS[oi]}
                      </span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {submitted && q.explanation && (
                <div style={{
                  marginTop: "0.75rem",
                  padding: "0.65rem 0.9rem",
                  background: "var(--amber-pale)",
                  borderLeft: "2px solid var(--amber-light)",
                  borderRadius: "0 2px 2px 0",
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontSize: "0.9rem",
                  color: "var(--ink-muted)",
                  lineHeight: 1.65,
                }}>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "1.2rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        {!submitted ? (
          <>
            <button
              onClick={() => setSubmitted(true)}
              disabled={answers.some(a => a === null)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "0.5em 1.4em",
                border: "1px solid var(--amber-light)",
                borderRadius: "var(--radius)",
                cursor: answers.some(a => a === null) ? "not-allowed" : "pointer",
                background: "var(--amber-pale)",
                color: "var(--amber)",
                opacity: answers.some(a => a === null) ? 0.5 : 1,
              }}
            >
              Submit
            </button>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--ink-faint)" }}>
              {answers.filter(a => a !== null).length} / {questions.length} answered
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
              {score} / {questions.length} — {pct}%
            </span>
          </>
        )}
      </div>
    </div>
  );
}
