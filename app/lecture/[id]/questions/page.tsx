import { notFound } from "next/navigation";
import Link from "next/link";
import { getLectureById, getAllLectures, getQuestions } from "@/lib/course";
import OralAccordion from "@/components/OralAccordion";
import MCQBlock from "@/components/MCQBlock";

export async function generateStaticParams() {
  return getAllLectures().map(l => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const lec = getLectureById(params.id);
  if (!lec) return {};
  return { title: `${lec.code} · Questions · MP26` };
}

export default function QuestionsPage({ params }: { params: { id: string } }) {
  const lec = getLectureById(params.id);
  if (!lec) notFound();

  const questions = getQuestions(params.id);
  const oral = questions.oral ?? [];
  const mcq  = questions.mcq  ?? [];

  if (oral.length === 0 && mcq.length === 0) notFound();

  return (
    <div style={s.wrapper}>
      <div style={s.container}>

        {/* Breadcrumb */}
        <nav style={s.breadcrumb} aria-label="breadcrumb">
          <Link href="/" style={s.bcLink}>Syllabus</Link>
          <span style={s.bcSep}>/</span>
          <Link href={`/lecture/${params.id}`} style={s.bcLink}>{lec.code}</Link>
          <span style={s.bcSep}>/</span>
          <span style={{ ...s.bcLink, color: "var(--amber)" }}>Questions</span>
        </nav>

        {/* Header */}
        <header style={s.header}>
          <p style={s.eyebrow}>{lec.code}</p>
          <h1 style={s.title}>{lec.title}</h1>
          <div style={s.chips}>
            {oral.length > 0 && <span style={s.chip}>{oral.length} oral</span>}
            {mcq.length  > 0 && <span style={s.chip}>{mcq.length} MCQ</span>}
          </div>
        </header>

        <hr style={s.rule} />

        {/* Oral */}
        {oral.length > 0 && (
          <section style={s.section}>
            <h2 style={s.sectionTitle}>Oral Questions</h2>
            <p style={s.sectionSub}>Click any question to reveal the model answer.</p>
            <OralAccordion questions={oral} />
          </section>
        )}

        {/* MCQ */}
        {mcq.length > 0 && (
          <section style={{ ...s.section, marginTop: oral.length > 0 ? "3.5rem" : 0 }}>
            <h2 style={s.sectionTitle}>MCQ Practice</h2>
            <p style={s.sectionSub}>
              Use <em>Instant</em> for immediate feedback, or <em>Quiz</em> to score yourself at the end.
            </p>
            <MCQBlock questions={mcq} />
          </section>
        )}

      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrapper: { padding: "3.5rem 2rem 6rem" },
  container: { maxWidth: "740px", margin: "0 auto" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" },
  bcLink: {
    fontFamily: "var(--font-mono)", fontSize: "0.7rem",
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "var(--ink-4)", textDecoration: "none", transition: "color 150ms",
  },
  bcSep: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--rule-2)" },
  header: { marginBottom: "1.8rem" },
  eyebrow: {
    fontFamily: "var(--font-mono)", fontSize: "0.7rem",
    letterSpacing: "0.16em", textTransform: "uppercase" as const,
    color: "var(--amber)", marginBottom: "0.6rem",
  },
  title: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.9rem, 5vw, 2.8rem)",
    fontWeight: 400, lineHeight: 1.15,
    letterSpacing: "-0.01em", color: "var(--ink)",
    marginBottom: "1rem",
  },
  chips: { display: "flex", gap: "0.5rem", flexWrap: "wrap" as const },
  chip: {
    fontFamily: "var(--font-mono)", fontSize: "0.65rem",
    letterSpacing: "0.08em", textTransform: "uppercase" as const,
    padding: "0.22em 0.75em",
    border: "1px solid var(--amber-3)",
    borderRadius: "var(--r)", color: "var(--amber)",
    background: "var(--amber-4)",
  },
  rule: { border: "none", borderTop: "1px solid var(--rule)", marginBottom: "2.5rem" },
  section: {},
  sectionTitle: {
    fontFamily: "var(--font-display)", fontSize: "1.7rem",
    fontWeight: 400, fontStyle: "italic",
    color: "var(--ink)", marginBottom: "0.4rem",
  },
  sectionSub: {
    fontFamily: "var(--font-body)", fontSize: "0.92rem",
    color: "var(--ink-4)", marginBottom: "1.3rem",
    fontStyle: "italic",
  },
};
