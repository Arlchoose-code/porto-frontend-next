"use client";

import { Bot, Braces, Check, Clipboard, Loader2, Send, Trash2, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { AiMessage } from "@/components/ai-message";

const examples = {
  go: `func main() {
  router := gin.Default()
  router.GET("/health", func(c *gin.Context) {
    c.JSON(200, gin.H{"status": "ok"})
  })
  router.Run(":8080")
}`,
  javascript: `async function fetchProjects() {
  const response = await fetch("/api/projects")
  if (!response.ok) throw new Error("Failed")
  return response.json()
}`,
  python: `def chunk_text(text, size=500):
    return [text[i:i + size] for i in range(0, len(text), size)]`,
  react: `export function ProjectCard({ title, summary }) {
  return (
    <article className="rounded-xl border p-4">
      <h3>{title}</h3>
      <p>{summary}</p>
    </article>
  )
}`,
  sql: `SELECT projects.title, COUNT(skills.id) AS skill_count
FROM projects
LEFT JOIN skills ON skills.project_id = projects.id
GROUP BY projects.title
ORDER BY skill_count DESC;`,
};

const languagePresets = ["auto", "go", "javascript", "typescript", "react", "next.js", "python", "sql", "html", "css", "php", "java", "c#", "rust"];

export function CodeExplainerTool() {
  const [language, setLanguage] = useState("auto");
  const [customLanguage, setCustomLanguage] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);
  const [copied, setCopied] = useState(false);

  async function explain(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const source = code.trim();
    if (!source || loading) return;

    setLoading(true);
    setResult("");
    setAsked(true);

    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: source, language: customLanguage.trim() || language }),
      });
      await readExplainStream(response, (chunk) => setResult((current) => `${current}${chunk}`));
    } catch {
      setResult("AI sedang tidak tersedia.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-[#f6f9fc] py-12 dark:border-slate-800 dark:bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_94%_22%,rgba(168,85,247,0.1),transparent_26%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <motion.form
          className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-slate-950 shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          onSubmit={explain}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
            <div>
              <div className="inline-flex items-center gap-2 font-semibold">
                <Braces className="size-5 text-cyan-300" /> Code Input
              </div>
              <p className="mt-1 text-xs text-slate-400">Paste anything from a function to a query or component.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                className="h-10 rounded-xl border border-slate-200 bg-[#f8fafc] px-3 text-sm font-semibold text-slate-900 outline-none focus:border-cyan-300 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                {languagePresets.map((item) => (
                  <option value={item} key={item}>
                    {item === "auto" ? "Auto detect" : item}
                  </option>
                ))}
              </select>
              <input
                className="h-10 w-44 rounded-xl border border-slate-200 bg-[#f8fafc] px-3 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-300 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                placeholder="Custom stack"
                value={customLanguage}
                onChange={(event) => setCustomLanguage(event.target.value)}
              />
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
            <textarea
            className="min-h-[430px] w-full resize-y bg-[#f8fafc] p-5 font-mono text-sm leading-7 text-slate-900 outline-none placeholder:text-slate-400 dark:bg-[#020617] dark:text-cyan-50 dark:placeholder:text-slate-500"
            placeholder="Paste kode di sini..."
            value={code}
            onChange={(event) => setCode(event.target.value)}
            />
            <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-400">
              {code.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(examples).map(([key, value]) => (
                <button
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-cyan-300/50 hover:bg-cyan-50 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100 dark:hover:bg-cyan-300/10"
                  key={key}
                  type="button"
                  onClick={() => {
                    setLanguage(key);
                    setCustomLanguage("");
                    setCode(value);
                  }}
                >
                <Wand2 className="size-3.5 text-cyan-300" /> {key}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                type="button"
                onClick={() => {
                  setCode("");
                  setResult("");
                  setAsked(false);
                }}
              >
                <Trash2 size={16} /> Clear
              </button>
              <button
                className="inline-flex h-10 items-center gap-2 rounded-full bg-cyan-300 px-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:opacity-60"
                disabled={loading || !code.trim()}
                type="submit"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send size={16} />}
                Explain
              </button>
            </div>
          </div>
        </motion.form>

        <motion.div
          className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-slate-950 shadow-2xl shadow-slate-950/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="inline-flex items-center gap-2 font-semibold">
              <Bot className="size-5 text-cyan-600 dark:text-cyan-300" /> AI Explanation
            </div>
            <button
              className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:border-cyan-300 dark:border-slate-800 dark:text-slate-300"
              disabled={!result}
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(result);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1400);
              }}
            >
              {copied ? <Check size={14} /> : <Clipboard size={14} />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="min-h-[520px] p-5 text-sm leading-7">
            {loading && !result ? (
              <div className="grid h-full min-h-[420px] place-items-center text-center">
                <div>
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                    <Loader2 className="size-6 animate-spin" />
                  </div>
                  <p className="mt-4 font-semibold text-slate-700 dark:text-slate-200">AI sedang membaca kode...</p>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Struktur jawaban akan muncul secara streaming.</p>
                </div>
              </div>
            ) : result ? (
              <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 dark:border-slate-800 dark:bg-[#020617]">
                <AiMessage content={result} />
              </div>
            ) : (
              <div className="grid h-full min-h-[420px] place-items-center text-center text-slate-500">
                <div>
                  <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
                    <Bot className="size-8" />
                  </div>
                  <p className="font-semibold">{asked ? "Belum ada jawaban." : "Paste kode, pilih bahasa, lalu klik Explain."}</p>
                  <p className="mt-2 text-sm">AI akan jelasin fungsi kode, pola, dan hal penting yang perlu dipahami.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

async function readExplainStream(response: Response, onChunk: (chunk: string) => void) {
  if (!response.ok || !response.body) throw new Error("Empty stream");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let received = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const dataLine = part.split("\n").find((line) => line.startsWith("data:"));
      if (!dataLine) continue;
      const raw = dataLine.replace(/^data:\s*/, "");
      if (!raw || raw === "{}") continue;
      const parsed = JSON.parse(raw) as { chunk?: string; error?: string };
      if (parsed.error) throw new Error(parsed.error);
      if (parsed.chunk) {
        received = true;
        onChunk(parsed.chunk);
      }
    }
  }

  if (!received) onChunk("AI sedang tidak tersedia.");
}
