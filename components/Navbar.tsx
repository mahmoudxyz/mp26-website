"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar({ github }: { github: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <nav className="nav-inner">
        <Link href="/" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="nav-badge">MP26</span>
          <span className="nav-sep">·</span>
          <span className="nav-title">Molecular Phylogenetics</span>
        </Link>

        <div className="nav-links">
          <a href="/#syllabus" className="nav-link">Syllabus</a>
          <a href="/#resources" className="nav-link">Resources</a>
          <a href="/#data" className="nav-link">Data</a>
          <a href="/#instructors" className="nav-link">Instructors</a>
          <a href={github} target="_blank" rel="noreferrer" className="nav-link">GitHub ↗</a>
        </div>

        <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span className={`bar bar-t ${open ? "open" : ""}`} />
          <span className={`bar bar-m ${open ? "open" : ""}`} />
          <span className={`bar bar-b ${open ? "open" : ""}`} />
        </button>
      </nav>

      <div className={`nav-mobile ${open ? "open" : ""}`}>
        {[
          { href: "/#syllabus", label: "Syllabus" },
          { href: "/#resources", label: "Resources" },
          { href: "/#data", label: "Data" },
          { href: "/#instructors", label: "Instructors" },
          { href: github, label: "GitHub ↗", ext: true },
        ].map(({ href, label, ext }) => (
          <a
            key={label}
            href={href}
            target={ext ? "_blank" : undefined}
            rel={ext ? "noreferrer" : undefined}
            className="nav-mobile-link"
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </div>
    </header>
  );
}
