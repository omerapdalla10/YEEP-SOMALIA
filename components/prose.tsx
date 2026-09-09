/**
 * Render plain-text body copy (from a textarea) as paragraphs. Blank lines
 * separate paragraphs; single newlines become line breaks. No HTML is
 * interpreted, so the content is safe by construction.
 */
export default function Prose({ text, className = "" }: { text?: string; className?: string }) {
  if (!text?.trim()) return null;
  const paragraphs = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={`prose-body space-y-4 text-[15px] leading-relaxed text-gray-600 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.split("\n").map((line, j, arr) => (
            <span key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
