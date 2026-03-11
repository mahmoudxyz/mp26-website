import { notFound } from "next/navigation";
import Link from "next/link";
import { getLectureById, getAllLectures, getQuestions, getAvailablePageIds } from "@/lib/course";

export async function generateStaticParams() {
  return getAllLectures().map(l => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const lec = getLectureById(params.id);
  if (!lec) return {};
  return { title: `${lec.code} · ${lec.title} · MP26` };
}

export default function LectureHub({ params }: { params: { id: string } }) {
  const lec = getLectureById(params.id);
  if (!lec) notFound();

  const q = getQuestions(params.id);
  const hasQ = (q.oral?.length ?? 0) > 0 || (q.mcq?.length ?? 0) > 0;
  const avail = getAvailablePageIds(params.id);

  const cards = [
    ...(lec.slides ? [{
      id: "slides",
      label: "Slides",
      icon: "↗",
      href: lec.slides,
      external: true,
      ready: true,
      desc: "View lecture slides (PDF)",
    }] : []),
    ...lec.pages.map(p => ({
      id: p.id,
      label: p.label,
      icon: p.icon ?? "📄",
      href: `/lecture/${lec.id}/${p.id}`,
      external: false,
      ready: avail.has(p.id),
      desc: avail.has(p.id) ? "Available" : "Coming soon",
    })),
    ...(hasQ ? [{
      id: "questions",
      label: "Questions",
      icon: "❓",
      href: `/lecture/${lec.id}/questions`,
      external: false,
      ready: true,
      desc: `${(q.oral?.length ?? 0) + (q.mcq?.length ?? 0)} questions · oral + MCQ`,
    }] : []),
  ];

  return (
    <div style={s.wrapper}>
      <div style={s.container}>

        {/* Breadcrumb */}
        <nav style={s.breadcrumb} aria-label="breadcrumb">
          <Link href="/" style={s.bcLink}>← Syllabus</Link>
        </nav>

        {/* Header */}
        <header style={s.header}>
          <p style={s.eyebrow}>{lec.code}</p>
          <h1 style={s.title}>{lec.title}</h1>
        </header>

        <hr style={s.rule} />

        {/* Content cards */}
        {cards.length > 0 ? (
          <div style={s.grid}>
            {cards.map(card => (
              card.external ? (
                <a
                  key={card.id}
                  href={card.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...s.card, ...(card.ready ? {} : s.cardDim) }}
                >
                  <span style={s.cardIcon}>{card.icon}</span>
                  <span style={s.cardLabel}>{card.label}</span>
                  <span style={s.cardDesc}>{card.desc}</span>
                  <span style={s.cardArrow}>↗</span>
                </a>
              ) : card.ready ? (
                <Link
                  key={card.id}
                  href={card.href}
                  style={s.card}
                >
                  <span style={s.cardIcon}>{card.icon}</span>
                  <span style={s.cardLabel}>{card.label}</span>
                  <span style={s.cardDesc}>{card.desc}</span>
                  <span style={s.cardArrow}>→</span>
                </Link>
              ) : (
                <div key={card.id} style={{ ...s.card, ...s.cardDim }}>
                  <span style={s.cardIcon}>{card.icon}</span>
                  <span style={s.cardLabel}>{card.label}</span>
                  <span style={s.cardDesc}>{card.desc}</span>
                </div>
              )
            ))}
          </div>
        ) : (
          <div style={s.empty}>
            <p style={s.emptyTitle}>No materials yet</p>
            <p style={s.emptyText}>Check back soon.</p>
          </div>
        )}

        {/* Add more hint */}
        <div style={s.hint}>
          <span style={s.hintIcon}>💡</span>
          <span style={s.hintText}>
            Add more pages by creating{" "}
            <code style={s.hintCode}>content/pages/{params.id}/{"{pageId}"}.md</code>
            {" "}and listing them under this lecture in{" "}
            <code style={s.hintCode}>content/course.yaml</code>
          </span>
        </div>

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
    color: "var(--ink-4)", textDecoration: "none", transition: "color 150ms",
  },
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
  },
  rule: { border: "none", borderTop: "1px solid var(--rule)", marginBottom: "2.5rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2.5rem",
  },
  card: {
    display: "flex", flexDirection: "column" as const, gap: "0.4rem",
    padding: "1.3rem 1.2rem",
    background: "var(--paper-2)",
    border: "1px solid var(--rule)",
    borderRadius: "4px",
    textDecoration: "none", color: "inherit",
    transition: "border-color 150ms, background 150ms",
    position: "relative" as const,
    cursor: "pointer",
  },
  cardDim: { opacity: 0.5, cursor: "default" as const },
  cardIcon: { fontSize: "1.4rem", marginBottom: "0.2rem" },
  cardLabel: {
    fontFamily: "var(--font-display)", fontSize: "1.1rem",
    fontWeight: 500, color: "var(--ink)", lineHeight: 1.2,
  },
  cardDesc: {
    fontFamily: "var(--font-body)", fontSize: "0.82rem",
    color: "var(--ink-3)", fontStyle: "italic", lineHeight: 1.4,
  },
  cardArrow: {
    position: "absolute" as const, top: "1rem", right: "1rem",
    fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--amber)",
    opacity: 0.7,
  },
  empty: {
    padding: "3.5rem 2rem", textAlign: "center" as const,
    border: "1px dashed var(--rule)", borderRadius: "4px",
    marginBottom: "2.5rem",
  },
  emptyTitle: { fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--ink-3)", marginBottom: "0.4rem" },
  emptyText: { fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-4)", fontStyle: "italic" },
  hint: {
    display: "flex", alignItems: "flex-start", gap: "0.7rem",
    padding: "1rem 1.2rem",
    background: "var(--amber-4)",
    border: "1px solid var(--amber-3)",
    borderRadius: "4px",
  },
  hintIcon: { fontSize: "0.9rem", flexShrink: 0, marginTop: "0.1rem" },
  hintText: { fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink-3)", lineHeight: 1.6 },
  hintCode: {
    fontFamily: "var(--font-mono)", fontSize: "0.75em",
    background: "var(--amber-3)", color: "var(--ink-2)",
    padding: "0.1em 0.35em", borderRadius: "2px",
  },
};
