export function AiMessage({ content }: { content: string }) {
  return (
    <div
      className="ai-message leading-6"
      dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
    />
  );
}

function formatMessage(content: string) {
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return blocks.map((block) => {
    if (block.startsWith("```")) {
      const code = block.replace(/^```[a-zA-Z0-9_-]*\n?/, "").replace(/```$/, "");
      return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
    }

    return renderTextBlock(block);
  }).join("");
}

function renderTextBlock(block: string) {
  const lines = block.split(/\r?\n/);
  let html = "";
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length === 0) return;
    html += `<ul>${listItems.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`;
    listItems = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }

    const bullet = line.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
    if (bullet) {
      listItems.push(bullet[1]);
      continue;
    }

    flushList();

    if (line.startsWith("#### ")) {
      html += `<h4>${inline(line.slice(5))}</h4>`;
    } else if (line.startsWith("### ")) {
      html += `<h3>${inline(line.slice(4))}</h3>`;
    } else if (line.startsWith("## ")) {
      html += `<h2>${inline(line.slice(3))}</h2>`;
    } else if (line.startsWith("# ")) {
      html += `<h2>${inline(line.slice(2))}</h2>`;
    } else if (line.startsWith("> ")) {
      html += `<blockquote>${inline(line.slice(2))}</blockquote>`;
    } else {
      html += `<p>${inline(line)}</p>`;
    }
  }

  flushList();
  return html;
}

function inline(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
