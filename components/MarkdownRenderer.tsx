"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import AuthWall from "./AuthWall";

export default function MarkdownRenderer({ content }: { content: string }) {
  const AUTH_WALL_RE = /<!--\s*auth-wall\s*-->/i;
  const parts = content.split(AUTH_WALL_RE);
  const publicContent = parts[0];
  const gatedContent = parts.length > 1 ? parts.slice(1).join("") : null;

  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{publicContent}</ReactMarkdown>
      {gatedContent && (
        <AuthWall>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{gatedContent}</ReactMarkdown>
        </AuthWall>
      )}
    </div>
  );
}
