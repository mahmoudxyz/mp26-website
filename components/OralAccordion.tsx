"use client";
import { useState } from "react";

export interface OralQuestion {
  q: string;
  a: string;
}

export default function OralAccordion({ questions }: { questions: OralQuestion[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {questions.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            style={{
              border: `1px solid ${isOpen ? "var(--amber-light)" : "var(--rule)"}`,
              borderRadius: "var(--radius)",
              background: isOpen ? "var(--amber-pale)" : "var(--paper-dark)",
              overflow: "hidden",
              transition: "border-color 150ms, background 150ms",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "1rem",
                padding: "0.9rem 1.1rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  fontSize: "1rem",
                  fontWeight: 400,
                  color: "var(--ink)",
                  lineHeight: 1.55,
                  flex: 1,
                }}
              >
                {item.q}
              </span>
              <span
                style={{
                  color: "var(--amber)",
                  fontSize: "0.7rem",
                  flexShrink: 0,
                  marginTop: "0.3rem",
                  transform: isOpen ? "rotate(180deg)" : "none",
                  transition: "transform 220ms ease",
                  display: "inline-block",
                }}
              >
                ▼
              </span>
            </button>

            <div
              style={{
                maxHeight: isOpen ? "600px" : "0",
                overflow: "hidden",
                transition: "max-height 300ms ease",
              }}
            >
              <div
                style={{
                  padding: "0.8rem 1.1rem 1.1rem",
                  borderTop: "1px solid var(--rule)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.97rem",
                  color: "var(--ink-muted)",
                  lineHeight: 1.85,
                }}
                dangerouslySetInnerHTML={{
                  __html: item.a
                    .replace(/\*\*(.+?)\*\*/g, "<strong style=\"color:var(--ink);font-weight:500\">$1</strong>")
                    .replace(/\*(.+?)\*/g, "<em style=\"color:var(--amber)\">$1</em>")
                    .replace(/`(.+?)`/g, "<code style=\"font-family:var(--font-mono);font-size:0.82em;background:var(--paper-mid);padding:0.1em 0.35em;border-radius:2px\">$1</code>")
                    .replace(/\n\n/g, "</p><p style=\"margin-top:0.7rem\">")
                    .replace(/^/, "<p>")
                    .replace(/$/, "</p>"),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
