# MP26 Course Site

A clean, warm-toned Next.js website for the [Molecular Phylogenetics course](https://github.com/for-giobbe/MP26) at the University of Bologna.

## Stack

- **Next.js 14** (App Router, static generation)
- **TypeScript**
- **`js-yaml`** — parses `content/course.yaml` at build time
- **`react-markdown` + `remark-gfm`** — renders practical `.md` files

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content Workflow

### Update the syllabus

Edit **`content/course.yaml`** — this single file drives everything:
- Add/remove lectures
- Toggle slides/practicals links
- Update instructor info

```yaml
# Example: add a new lecture
weeks:
  - week: 9
    lectures:
      - id: "17"
        code: "W9_L17"
        title: "New topic here"
        slides: "https://github.com/..."  # or null
        practicals: "/lecture/17"         # or null
```

### Add practical notes

Drop markdown files into the `practicals/` folder:

```
practicals/
  01.md
  02.md
  ...
```

The site will automatically render them at `/lecture/01`, `/lecture/02`, etc.

You can copy them straight from the GitHub repo:
```bash
# From the MP26 repo root:
cp practicals/*.md /path/to/this-site/practicals/
```

## Slides Setup (direct download, no GitHub dependency)

Place PDF files in `public/slides/` — they'll be served at `/slides/01.pdf` etc:

```bash
# From the MP26 repo root, copy all slides:
cp slides/*.pdf /path/to/this-site/public/slides/
```

The `content/course.yaml` already points to `/slides/01.pdf` etc.
If a PDF doesn't exist yet, set its `slides:` value to `null` in the YAML.

## Exam Sample

Place the exam markdown at `content/exam_sample.md` (or copy from the repo):

```bash
cp exam_sample.md /path/to/this-site/content/exam_sample.md
```



Deploy to **Vercel** with one click — just connect your GitHub repo and it works out of the box.

```bash
npm run build   # verify build locally
```

## Customise

| What | Where |
|---|---|
| Colors / fonts | `app/globals.css` — CSS variables at `:root` |
| Navbar | `components/Navbar.tsx` |
| Footer link | `components/Footer.tsx` |
| Course data | `content/course.yaml` |
| Lecture page layout | `app/lecture/[id]/page.tsx` |
