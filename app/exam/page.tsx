import Link from "next/link";
import { getExamSampleContent } from "@/lib/course";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export const metadata = { title: "Exam Sample · MP26" };

export default function ExamPage() {
  const content = getExamSampleContent();

  return (
    <div style={s.wrapper}>
      <div style={s.container}>
        <nav style={s.breadcrumb}>
          <Link href="/" style={s.bcLink}>← Syllabus</Link>
        </nav>
        <header style={s.header}>
          <p style={s.eyebrow}>Assessment</p>
          <h1 style={s.title}>Exam Sample</h1>
          <p style={s.sub}>A representative example of the exam format and expected answers.</p>
        </header>
        <hr style={s.rule} />
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <div style={s.empty}>
            <p style={s.emptyIcon}>📋</p>
            <p style={s.emptyTitle}>Exam sample coming soon</p>
            <p style={s.emptyText}>Check back closer to the exam date.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrapper: { padding: "3.5rem 2rem 6rem" },
  container: { maxWidth: "740px", margin: "0 auto" },
  breadcrumb: { marginBottom: "2.5rem" },
  bcLink: {
    fontFamily: "var(--font-mono)", fontSize: "0.7rem",
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "var(--ink-4)", textDecoration: "none",
  },
  header: { marginBottom: "1.8rem" },
  eyebrow: {
    fontFamily: "var(--font-mono)", fontSize: "0.7rem",
    letterSpacing: "0.16em", textTransform: "uppercase" as const,
    color: "var(--amber)", marginBottom: "0.6rem",
  },
  title: {
    fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 400, lineHeight: 1.15, color: "var(--ink)", marginBottom: "0.8rem",
  },
  sub: { fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--ink-3)", fontStyle: "italic" },
  rule: { border: "none", borderTop: "1px solid var(--rule)", marginBottom: "2.5rem" },
  empty: { padding: "4.5rem 2rem", textAlign: "center" as const, border: "1px dashed var(--rule)", borderRadius: "4px" },
  emptyIcon: { fontSize: "2rem", marginBottom: "1rem" },
  emptyTitle: { fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--ink-3)", marginBottom: "0.5rem" },
  emptyText: { fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-4)", fontStyle: "italic" },
};
