import { notFound } from "next/navigation";
import Link from "next/link";
import { getLectureById, getAllLectures, getPageContent, getAvailablePageIds } from "@/lib/course";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export async function generateStaticParams() {
  const lectures = getAllLectures();
  const params: { id: string; pageId: string }[] = [];
  for (const lec of lectures) {
    for (const page of lec.pages) {
      params.push({ id: lec.id, pageId: page.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: { id: string; pageId: string } }) {
  const lec = getLectureById(params.id);
  if (!lec) return {};
  const page = lec.pages.find(p => p.id === params.pageId);
  return { title: `${lec.code} · ${page?.label ?? params.pageId} · MP26` };
}

export default function ContentPage({ params }: { params: { id: string; pageId: string } }) {
  const lec = getLectureById(params.id);
  if (!lec) notFound();

  const page = lec.pages.find(p => p.id === params.pageId);
  if (!page) notFound();

  const markdown = getPageContent(params.id, params.pageId);
  const avail = getAvailablePageIds(params.id);

  // Build tab list: all pages in this lecture
  const tabs = lec.pages;

  return (
    <div style={s.wrapper}>
      <div style={s.container}>

        {/* Breadcrumb */}
        <nav style={s.breadcrumb} aria-label="breadcrumb">
          <Link href="/" style={s.bcLink}>Syllabus</Link>
          <span style={s.bcSep}>/</span>
          <Link href={`/lecture/${params.id}`} style={s.bcLink}>{lec.code}</Link>
          <span style={s.bcSep}>/</span>
          <span style={{ ...s.bcLink, color: "var(--amber)" }}>{page.label}</span>
        </nav>

        {/* Header */}
        <header style={s.header}>
          <p style={s.eyebrow}>{lec.code}</p>
          <h1 style={s.title}>{lec.title}</h1>

          {/* Action buttons */}
          <div style={s.actions}>
            {lec.slides && (
              <a href={lec.slides} target="_blank" rel="noreferrer" style={s.btnDark}>
                <span>↗</span> Slides
              </a>
            )}
            <span style={s.pillLabel}>{page.icon} {page.label}</span>
          </div>
        </header>

        {/* Tab nav */}
        {tabs.length > 1 && (
          <nav style={s.tabs} aria-label="Lecture pages">
            {tabs.map(t => {
              const isActive = t.id === params.pageId;
              const isReady = avail.has(t.id);
              return (
                isReady ? (
                  <Link
                    key={t.id}
                    href={`/lecture/${params.id}/${t.id}`}
                    style={{ ...s.tab, ...(isActive ? s.tabActive : {}) }}
                  >
                    {t.icon && <span>{t.icon}</span>}
                    {t.label}
                  </Link>
                ) : (
                  <span key={t.id} style={{ ...s.tab, ...s.tabDim }}>
                    {t.icon && <span>{t.icon}</span>}
                    {t.label}
                  </span>
                )
              );
            })}
          </nav>
        )}

        <hr style={s.rule} />

        {/* Markdown content */}
        {markdown ? (
          <MarkdownRenderer content={markdown} />
        ) : (
          <div style={s.empty}>
            <p style={s.emptyIcon}>{page.icon ?? "📄"}</p>
            <p style={s.emptyTitle}>{page.label} coming soon</p>
            <p style={s.emptyText}>
              Add content at{" "}
              <code style={s.emptyCode}>content/pages/{params.id}/{params.pageId}.md</code>
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrapper: { padding: "3.5rem 2rem 6rem" },
  container: { maxWidth: "760px", margin: "0 auto" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" },
  bcLink: {
    fontFamily: "var(--font-mono)", fontSize: "0.7rem",
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: "var(--ink-4)", textDecoration: "none", transition: "color 150ms",
  },
  bcSep: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--rule-2)" },
  header: { marginBottom: "1.5rem" },
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
    marginBottom: "1.2rem",
  },
  actions: { display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" as const },
  btnDark: {
    display: "inline-flex", alignItems: "center", gap: "0.35rem",
    padding: "0.4rem 1rem",
    background: "var(--charcoal)", color: "var(--paper)",
    fontFamily: "var(--font-body)", fontSize: "0.85rem",
    borderRadius: "var(--r)", textDecoration: "none",
  },
  pillLabel: {
    display: "inline-flex", alignItems: "center", gap: "0.35rem",
    padding: "0.4rem 1rem",
    border: "1px solid var(--rule-2)",
    fontFamily: "var(--font-body)", fontSize: "0.82rem",
    color: "var(--ink-3)", borderRadius: "var(--r)", fontStyle: "italic",
  },
  tabs: {
    display: "flex", gap: "0", borderBottom: "1px solid var(--rule)",
    marginBottom: "0", marginTop: "1.5rem",
  },
  tab: {
    display: "inline-flex", alignItems: "center", gap: "0.35rem",
    padding: "0.55rem 1rem",
    fontFamily: "var(--font-body)", fontSize: "0.88rem",
    color: "var(--ink-3)", textDecoration: "none",
    borderBottom: "2px solid transparent",
    marginBottom: "-1px",
    transition: "color 150ms, border-color 150ms",
  },
  tabActive: { color: "var(--amber)", borderBottomColor: "var(--amber)" },
  tabDim: { opacity: 0.4, cursor: "default" as const },
  rule: { border: "none", borderTop: "1px solid var(--rule)", marginBottom: "2.5rem", marginTop: 0 },
  empty: {
    padding: "4.5rem 2rem", textAlign: "center" as const,
    border: "1px dashed var(--rule)", borderRadius: "var(--r2)",
  },
  emptyIcon: { fontSize: "2.2rem", marginBottom: "1rem" },
  emptyTitle: {
    fontFamily: "var(--font-display)", fontSize: "1.5rem",
    color: "var(--ink-3)", marginBottom: "0.6rem",
  },
  emptyText: { fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-4)", fontStyle: "italic" },
  emptyCode: {
    fontFamily: "var(--font-mono)", fontSize: "0.78em",
    background: "var(--paper-2)", padding: "0.15em 0.4em", borderRadius: "2px",
    color: "var(--ink-2)",
  },
};
