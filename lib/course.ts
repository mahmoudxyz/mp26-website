import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// ── Types ─────────────────────────────────────────────────────

export interface LecturePage {
  id: string;
  label: string;
  icon?: string;
}

export interface Lecture {
  id: string;
  code: string;
  title: string;
  slides: string | null;
  recording: string | null;
  pages: LecturePage[];
}

export interface Week {
  week: number;
  lectures: Lecture[];
}

export interface Instructor {
  name: string;
  email?: string;
  role: string;
}

export interface DataFolder {
  name: string;
  path: string;
}

export interface CourseData {
  course: { title: string; subtitle: string; github: string; };
  resources: { recordings: string | null; exam_sample: string | null; single_slides_pack: string | null; };
  data: { clone_command: string; description: string; folders: DataFolder[]; };
  instructors: Instructor[];
  weeks: Week[];
}

// ── Loaders ───────────────────────────────────────────────────

export function getCourseData(): CourseData {
  const filePath = path.join(process.cwd(), "content", "course.yaml");
  const raw = fs.readFileSync(filePath, "utf8");
  const data = yaml.load(raw) as CourseData;
  for (const week of data.weeks) {
    for (const lec of week.lectures) {
      if (!lec.pages) lec.pages = [];
    }
  }
  return data;
}

export function getAllLectures(): Lecture[] {
  return getCourseData().weeks.flatMap((w) => w.lectures);
}

export function getLectureById(id: string): Lecture | undefined {
  return getAllLectures().find((l) => l.id === id);
}

export function getPageContent(lectureId: string, pageId: string): string | null {
  const primary = path.join(process.cwd(), "content", "pages", lectureId, `${pageId}.md`);
  if (fs.existsSync(primary)) return fs.readFileSync(primary, "utf8");
  if (pageId === "practicals") {
    const legacy = path.join(process.cwd(), "practicals", `${lectureId}.md`);
    if (fs.existsSync(legacy)) return fs.readFileSync(legacy, "utf8");
  }
  return null;
}

export function getAvailablePageIds(lectureId: string): Set<string> {
  const available = new Set<string>();
  const dir = path.join(process.cwd(), "content", "pages", lectureId);
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".md")) available.add(f.replace(".md", ""));
    }
  }
  const legacy = path.join(process.cwd(), "practicals", `${lectureId}.md`);
  if (fs.existsSync(legacy)) available.add("practicals");
  return available;
}

// ── Questions ─────────────────────────────────────────────────

export interface OralQuestion { q: string; a: string; }
export interface MCQOption { text: string; correct: boolean; }
export interface MCQQuestion { question: string; options: MCQOption[]; explanation?: string; }
export interface QuestionFile { oral?: OralQuestion[]; mcq?: MCQQuestion[]; }

export function getQuestions(id: string): QuestionFile {
  const p = path.join(process.cwd(), "content", "questions", `${id}.yaml`);
  if (!fs.existsSync(p)) return {};
  return yaml.load(fs.readFileSync(p, "utf8")) as QuestionFile;
}

export function getExamSampleContent(): string | null {
  const paths = [
    path.join(process.cwd(), "content", "exam_sample.md"),
    path.join(process.cwd(), "exam_sample.md"),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  }
  return null;
}

export function getPracticalContent(id: string): string | null {
  return getPageContent(id, "practicals");
}
