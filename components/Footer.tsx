export default function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.inner}>
        <span style={s.text}>
          Built by{" "}
          <a href="https://mahmoud.ninja" target="_blank" rel="noreferrer" style={s.link}>Mahmoud</a>
        </span>
        <span style={s.sep}>·</span>
        <span style={s.text}>
          Course material by{" "}
          <a href="mailto:giobbe.forni2@unibo.it" style={s.link}>Giobbe Forni</a> et al.
        </span>
        <span style={s.sep}>·</span>
        <a href="https://github.com/for-giobbe/MP26" target="_blank" rel="noreferrer" style={s.link}>
          GitHub ↗
        </a>
      </div>
    </footer>
  );
}

const s: Record<string, React.CSSProperties> = {
  footer: {
    borderTop: "1px solid var(--rule)",
    padding: "2rem 2rem",
    background: "var(--paper-2)",
  },
  inner: {
    maxWidth: "1000px", margin: "0 auto",
    display: "flex", flexWrap: "wrap" as const,
    alignItems: "center", gap: "0.5rem 1rem",
  },
  text: { fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--ink-4)", fontWeight: 300 },
  sep:  { color: "var(--rule-2)", fontSize: "0.9rem" },
  link: { fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--amber)", textDecoration: "none" },
};
