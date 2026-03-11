"use client";
import Link from "next/link";
import type { Lecture } from "@/lib/course";

export default function LectureRow({ lecture, hasQuestions }: { lecture: Lecture; hasQuestions: boolean }) {
  return (
    <div
      className="syllabus-row"
      style={s.row}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--amber-pale)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      <span className="syllabus-col-code" style={s.colCode}>
        <code style={s.lectureCode}>{lecture.code}</code>
      </span>
      <span className="syllabus-col-title" style={s.colTitle}>
        <span style={s.lectureTitle}>{lecture.title}</span>
      </span>
      <span className="syllabus-col-links" style={s.colLinks}>
        {lecture.slides ? (
          <a
            href={lecture.slides}
            target="_blank"
            rel="noopener noreferrer"
            style={s.materialLink}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderBottomColor = "var(--amber)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderBottomColor = "transparent")}
          >
            slides
          </a>
        ) : (
          <span style={s.materialWip}>—</span>
        )}
        <span style={s.linkSep}>·</span>
        {lecture.practicals ? (
          <Link
            href={lecture.practicals}
            style={s.materialLink}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderBottomColor = "var(--amber)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderBottomColor = "transparent")}
          >
            practicals
          </Link>
        ) : (
          <span style={s.materialWip}>—</span>
        )}
        {hasQuestions && (
          <>
            <span style={s.linkSep}>·</span>
            <Link
              href={`/lecture/${lecture.id}/questions`}
              style={s.materialLink}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderBottomColor = "var(--amber)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderBottomColor = "transparent")}
            >
              questions
            </Link>
          </>
        )}
      </span>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  row: {
    display: "grid",
    gridTemplateColumns: "140px 1fr 160px",
    gap: "1rem",
    padding: "0.75rem 0.8rem",
    borderBottom: "1px solid var(--rule)",
    alignItems: "center",
    transition: "background-color 150ms ease",
    cursor: "default",
  },
  colCode: { fontSize: "0.82rem" },
  colTitle: { fontSize: "0.95rem" },
  colLinks: {
    display: "flex",
    gap: "0.4rem",
    alignItems: "center",
    fontSize: "0.85rem",
  },
  lectureCode: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    color: "var(--ink-muted)",
    backgroundColor: "transparent",
    padding: 0,
  },
  lectureTitle: {
    fontFamily: "var(--font-body)",
    fontWeight: 400,
    color: "var(--ink)",
    lineHeight: 1.4,
  },
  materialLink: {
    fontFamily: "var(--font-body)",
    fontSize: "0.85rem",
    color: "var(--amber)",
    textDecoration: "none",
    borderBottom: "1px solid transparent",
    transition: "border-color 150ms ease",
    fontWeight: 400,
  },
  materialWip: {
    color: "var(--ink-faint)",
    fontSize: "0.85rem",
  },
  linkSep: {
    color: "var(--ink-faint)",
    fontSize: "0.75rem",
  },
};
