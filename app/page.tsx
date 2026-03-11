import Link from "next/link";
import { getCourseData, getQuestions, getAvailablePageIds } from "@/lib/course";
import type { Week, Lecture } from "@/lib/course";
import CloneButton from "@/components/CloneButton";

export default function HomePage() {
  const { course, resources, data, instructors, weeks } = getCourseData();
  const totalLectures = weeks.flatMap(w => w.lectures).length;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <p className="fu d1" style={s.eyebrow}>
            University of Bologna · MSc Bioinformatics · 2026
          </p>
          <h1 className="fu d2" style={s.heroTitle}>
            Molecular<br />Phylogenetics
          </h1>
          <p className="fu d3" style={s.heroSub}>
            {totalLectures} lectures · Theory &amp; practicals
            · Curated by Giobbe Forni
          </p>
          <div className="fu d4" style={s.heroActions}>
            <a href="#syllabus" style={s.btnPrimary}>View Syllabus</a>
            <a href="#resources" style={s.btnGhost}>Resources</a>
            <a href={course.github} target="_blank" rel="noreferrer" style={s.btnGhost}>
              GitHub ↗
            </a>
          </div>
        </div>
        <div className="hero-decor" style={s.heroDecor} />
      </section>

      {/* ── Syllabus ──────────────────────────────────────── */}
      <section id="syllabus" style={s.section}>
        <div style={s.wrap}>
          <SectionHead>Course Syllabus</SectionHead>

          <div style={s.table}>
            {/* Header */}
            <div className="syllabus-header" style={{ ...s.tableRow, ...s.tableHead }}>
              <span style={s.headCell}>Code</span>
              <span style={s.headCell}>Lecture</span>
              <span style={{ ...s.headCell, textAlign: "right" as const }}>Material</span>
            </div>

            {weeks.map((week: Week) => (
              <WeekBlock key={week.week} week={week} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Resources ─────────────────────────────────────── */}
      <section id="resources" style={{ ...s.section, background: "var(--paper-2)" }}>
        <div style={s.wrap}>
          <SectionHead>Other Important Stuff</SectionHead>
          <div style={s.cardGrid}>
            <ResourceCard
              icon="📋" label="Exam Sample"
              desc="Representative exam questions and expected answer format."
              status={resources.exam_sample ? "ok" : "wip"}
              href={resources.exam_sample ?? undefined}
            />
            <ResourceCard
              icon="🎬" label="Lecture Recordings"
              desc="Video recordings of all lectures. Available after each session."
              status={resources.recordings ? "ok" : "wip"}
              href={resources.recordings ?? undefined}
            />
            <ResourceCard
              icon="📦" label="All Slides (Pack)"
              desc="Download all lecture slides as a single archive."
              status={resources.single_slides_pack ? "ok" : "wip"}
              href={resources.single_slides_pack ?? undefined}
              download
            />
          </div>
        </div>
      </section>

      {/* ── Data ──────────────────────────────────────────── */}
      <section id="data" style={s.section}>
        <div style={s.wrap}>
          <SectionHead>Course Data</SectionHead>
          <p style={s.bodyText}>{data.description}</p>
          <div style={{ marginBottom: "1.8rem" }}>
            <CloneButton command={data.clone_command} />
          </div>
          <div style={s.folderGrid}>
            {data.folders.map(f => (
              <div key={f.path} style={s.folder}>
                <span style={s.folderIcon}>📁</span>
                <div>
                  <div style={s.folderName}>{f.name}</div>
                  <code style={s.folderPath}>{f.path}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructors ───────────────────────────────────── */}
      <section id="instructors" style={{ ...s.section, background: "var(--paper-2)" }}>
        <div style={s.wrap}>
          <SectionHead>Instructors</SectionHead>
          <div style={s.instructorGrid}>
            {instructors.map(inst => (
              <div key={inst.name} style={s.instructorCard}>
                <div style={s.initials}>
                  {inst.name.split(" ").map((n: string) => n[0]).join("")}
                </div>
                <div>
                  <p style={s.instName}>{inst.name}</p>
                  <p style={s.instRole}>{inst.role}</p>
                  {inst.email && (
                    <a href={`mailto:${inst.email}`} style={s.instEmail}>{inst.email}</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "2.5rem" }}>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.18em",
        textTransform: "uppercase" as const, color: "var(--amber)", whiteSpace: "nowrap" as const, flexShrink: 0,
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--rule)" }} />
    </div>
  );
}

function WeekBlock({ week }: { week: Week }) {
  return (
    <>
      <div className="week-divider">
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.62rem",
          letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "var(--ink-4)",
        }}>
          Week {week.week}
        </span>
      </div>
      {week.lectures.map((lec: Lecture) => {
        const q = getQuestions(lec.id);
        const hasQ = (q.oral?.length ?? 0) > 0 || (q.mcq?.length ?? 0) > 0;
        const avail = getAvailablePageIds(lec.id);
        return <LectureRow key={lec.id} lec={lec} hasQ={hasQ} avail={avail} />;
      })}
    </>
  );
}

function LectureRow({ lec, hasQ, avail }: {
  lec: Lecture;
  hasQ: boolean;
  avail: Set<string>;
}) {
  const links: { href: string; label: string; external?: boolean }[] = [];

  if (lec.slides) links.push({ href: lec.slides, label: "slides", external: true });

  for (const page of lec.pages) {
    links.push({ href: `/lecture/${lec.id}/${page.id}`, label: page.label.toLowerCase() });
  }

  if (hasQ) links.push({ href: `/lecture/${lec.id}/questions`, label: "questions" });

  return (
    <div className="syllabus-row">
      <code style={{
        fontFamily: "var(--font-mono)", fontSize: "0.68rem",
        color: "var(--ink-4)", letterSpacing: "0.04em",
      }}>
        {lec.code}
      </code>

      <span style={{
        fontFamily: "var(--font-body)", fontSize: "0.95rem",
        color: "var(--ink)", lineHeight: 1.4,
      }}>
        {lec.title}
      </span>

      <span style={{ display: "flex", gap: "0.3rem", alignItems: "center", flexWrap: "wrap" as const, justifyContent: "flex-end" }}>
        {links.map((l, i) => (
          <span key={l.href} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            {i > 0 && <span style={{ color: "var(--ink-4)", fontSize: "0.7rem" }}>·</span>}
            {l.external ? (
              <a href={l.href} target="_blank" rel="noreferrer" style={s.matLink}>{l.label}</a>
            ) : (
              <Link href={l.href} style={{
                ...s.matLink,
                ...(!avail.has(l.href.split("/").pop()!) && l.href.includes("/lecture/") ? s.matLinkDim : {}),
              }}>
                {l.label}
              </Link>
            )}
          </span>
        ))}
        {links.length === 0 && <span style={{ color: "var(--ink-4)", fontSize: "0.82rem" }}>—</span>}
      </span>
    </div>
  );
}

function ResourceCard({ icon, label, desc, status, href, download }: {
  icon: string; label: string; desc: string;
  status: "ok" | "wip"; href?: string; download?: boolean;
}) {
  return (
    <div style={{ ...s.card, ...(status === "wip" ? { opacity: 0.6 } : {}) }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em",
          textTransform: "uppercase" as const, padding: "0.2em 0.65em", borderRadius: "2px",
          background: status === "ok" ? "var(--amber-4)" : "var(--paper-3)",
          color: status === "ok" ? "var(--amber)" : "var(--ink-4)",
          border: `1px solid ${status === "ok" ? "var(--amber-3)" : "var(--rule-2)"}`,
        }}>
          {status === "ok" ? "Available" : "Coming soon"}
        </span>
      </div>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.4rem" }}>
        {label}
      </p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--ink-3)", lineHeight: 1.55, flex: 1 }}>
        {desc}
      </p>
      {status === "ok" && href && (
        <a
          href={href}
          download={download || undefined}
          target={!download ? "_blank" : undefined}
          rel={!download ? "noreferrer" : undefined}
          style={{ display: "inline-block", marginTop: "1rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--amber)", fontWeight: 400 }}
        >
          {download ? "↓ Download" : "→ Open"}
        </a>
      )}
    </div>
  );
}

/* ── Styles ─────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
  hero: {
    maxWidth: "1000px", margin: "0 auto",
    padding: "7rem 2rem 5.5rem",
    position: "relative",
    borderBottom: "1px solid var(--rule)",
  },
  heroInner: { maxWidth: "580px" },
  eyebrow: {
    fontFamily: "var(--font-mono)", fontSize: "0.68rem",
    letterSpacing: "0.16em", textTransform: "uppercase" as const,
    color: "var(--amber)", marginBottom: "1.6rem",
  },
  heroTitle: {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(3.4rem, 9vw, 6rem)",
    fontWeight: 300, lineHeight: 1.0,
    letterSpacing: "-0.025em", color: "var(--ink)",
    marginBottom: "1.5rem",
  },
  heroSub: {
    fontFamily: "var(--font-body)", fontSize: "1.05rem",
    fontWeight: 300, color: "var(--ink-3)",
    marginBottom: "2.4rem", lineHeight: 1.65,
  },
  heroActions: { display: "flex", flexWrap: "wrap" as const, gap: "0.65rem" },
  btnPrimary: {
    display: "inline-block", padding: "0.55rem 1.4rem",
    background: "var(--charcoal)", color: "var(--paper)",
    fontFamily: "var(--font-body)", fontSize: "0.9rem",
    borderRadius: "var(--r)", textDecoration: "none",
  },
  btnGhost: {
    display: "inline-block", padding: "0.55rem 1.2rem",
    border: "1px solid var(--rule-2)", color: "var(--ink-3)",
    fontFamily: "var(--font-body)", fontSize: "0.9rem",
    borderRadius: "var(--r)", textDecoration: "none",
  },
  heroDecor: {
    position: "absolute" as const,
    top: "4rem", right: "2rem",
    width: "240px", height: "240px",
    borderRadius: "50%",
    background: "radial-gradient(circle, var(--amber-4) 0%, transparent 70%)",
    opacity: 0.6,
    pointerEvents: "none" as const,
  },
  section: { padding: "5.5rem 2rem" },
  wrap: { maxWidth: "1000px", margin: "0 auto" },
  table: { width: "100%", borderRadius: "var(--r2)", overflow: "hidden", border: "1px solid var(--rule)" },
  tableRow: { display: "grid", gridTemplateColumns: "7rem 1fr auto", gap: "1rem", alignItems: "center" },
  tableHead: {
    padding: "0.7rem 0.75rem",
    background: "var(--paper-3)",
    borderBottom: "1px solid var(--rule-2)",
  },
  headCell: {
    fontFamily: "var(--font-mono)", fontSize: "0.6rem",
    letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "var(--ink-4)",
  },
  matLink: {
    fontFamily: "var(--font-body)", fontSize: "0.85rem",
    color: "var(--amber)", textDecoration: "none",
    borderBottom: "1px solid transparent",
    transition: "border-color 150ms",
  },
  matLinkDim: { color: "var(--ink-4)" },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1.2rem",
  },
  card: {
    display: "flex", flexDirection: "column" as const,
    padding: "1.5rem",
    background: "var(--paper)",
    border: "1px solid var(--rule)",
    borderRadius: "var(--r2)",
  },
  bodyText: {
    fontFamily: "var(--font-body)", fontSize: "1rem",
    color: "var(--ink-3)", marginBottom: "1.5rem",
    lineHeight: 1.65, maxWidth: "560px",
  },
  folderGrid: { display: "flex", flexWrap: "wrap" as const, gap: "0.6rem", marginTop: "1rem" },
  folder: {
    display: "inline-flex", alignItems: "center", gap: "0.6rem",
    padding: "0.45rem 0.9rem",
    background: "var(--paper-2)", border: "1px solid var(--rule)",
    borderRadius: "var(--r)",
  },
  folderIcon: { fontSize: "0.85rem" },
  folderName: { fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--ink)", fontWeight: 400 },
  folderPath: {
    fontFamily: "var(--font-mono)", fontSize: "0.65rem",
    color: "var(--ink-4)", background: "transparent", padding: 0,
  },
  instructorGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.2rem" },
  instructorCard: {
    display: "flex", gap: "1rem", alignItems: "flex-start",
    padding: "1.3rem", background: "var(--paper)",
    border: "1px solid var(--rule)", borderRadius: "var(--r2)",
  },
  initials: {
    width: "40px", height: "40px", flexShrink: 0,
    background: "var(--charcoal)", color: "var(--paper)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "var(--font-mono)", fontSize: "0.7rem",
    letterSpacing: "0.05em", borderRadius: "var(--r)",
  },
  instName: { fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 500, color: "var(--ink)", marginBottom: "0.2rem" },
  instRole: { fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink-3)", fontStyle: "italic", marginBottom: "0.3rem" },
  instEmail: { fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--amber)", textDecoration: "none" },
};
