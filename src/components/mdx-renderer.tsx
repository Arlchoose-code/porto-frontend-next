export function MdxRenderer({ content }: { content?: string }) {
  const html = addHeadingIds(normalizeRichText(content));

  return (
    <div
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: html || "<p>No content available.</p>" }}
    />
  );
}

function addHeadingIds(html: string) {
  return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    if (/\sid=/.test(attrs)) return match;
    const text = inner.replace(/<[^>]+>/g, " ");
    const id = slugify(decodeEntities(text));
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function normalizeRichText(content?: string) {
  const value = (content ?? "").trim();
  if (!value) return "";
  if (/<(p|h[1-6]|ul|ol|li|blockquote|pre|img|figure|a|strong|em|br)\b/i.test(value)) {
    return value;
  }
  return value
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
