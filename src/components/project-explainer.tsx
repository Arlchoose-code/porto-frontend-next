"use client";

import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { AiMessage } from "@/components/ai-message";
import { plainText } from "@/lib/format";
import type { Project } from "@/lib/types";

const suggestions = [
  "Project ini buat apa?",
  "Tech stack-nya kenapa dipilih?",
  "Apa highlight paling penting?",
];

export function ProjectExplainer({ project }: { project: Project }) {
  const [question, setQuestion] = useState("");
  const [pendingQuestion, setPendingQuestion] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(nextQuestion?: string) {
    const content = (nextQuestion ?? question).trim();
    if (!content || loading) return;

    setLoading(true);
    setResult("");
    setQuestion("");
    setPendingQuestion(content);

    const context = [
      `Project: ${project.title}`,
      `Status: ${project.status}`,
      `Summary: ${plainText(project.summary)}`,
      project.description ? `Description: ${plainText(project.description)}` : null,
      project.tech_stack?.length ? `Tech stack: ${project.tech_stack.join(", ")}` : null,
      project.github_url ? `GitHub: ${project.github_url}` : null,
      project.live_url ? `Live URL: ${project.live_url}` : null,
      project.huggingface_url ? `HuggingFace: ${project.huggingface_url}` : null,
    ].filter(Boolean).join("\n");

    try {
      const response = await fetch("/api/ai/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Jawab dalam bahasa Indonesia yang ringkas dan ramah. Gunakan konteks project ini:\n${context}\n\nPertanyaan visitor: ${content}`,
            },
          ],
        }),
      });
      await readChatStream(response, (chunk) => {
        setResult((current) => `${current}${chunk}`);
      });
    } catch {
      setResult("AI sedang tidak tersedia.");
    } finally {
      setLoading(false);
      setPendingQuestion("");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask();
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-4 flex items-center gap-2">
        <Bot size={18} />
        <h2 className="font-semibold">Project Assistant</h2>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Tanya ringkasan, alasan tech stack, link, atau highlight dari project ini.
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {suggestions.map((item) => (
          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-teal-400 hover:text-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white"
            disabled={loading}
            key={item}
            type="button"
            onClick={() => void ask(item)}
          >
            <Sparkles size={13} /> {item}
          </button>
        ))}
      </div>
      <form className="grid gap-3" onSubmit={submit}>
        <textarea
          className="min-h-28 resize-y rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm leading-6 outline-none focus:border-teal-500 dark:border-slate-800"
          name="question"
          placeholder="Contoh: Jelasin project ini cocok dipakai buat apa?"
          required
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white disabled:opacity-60 dark:bg-white dark:text-slate-950" disabled={loading} type="submit">
          <Send size={16} /> {loading ? "Thinking" : "Ask"}
        </button>
      </form>
      {loading || result ? (
        <div className="mt-4 rounded-md bg-slate-100 p-4 text-sm dark:bg-slate-900">
          {pendingQuestion ? (
            <p className="mb-3 text-xs font-medium text-slate-500 dark:text-slate-400">Pertanyaan: {pendingQuestion}</p>
          ) : null}
          {result ? (
            <AiMessage content={result} />
          ) : (
            <div className="inline-flex items-center gap-2 text-slate-500">
              <Loader2 className="size-4 animate-spin" /> AI sedang menyusun jawaban...
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

async function readChatStream(response: Response, onChunk: (chunk: string) => void) {
  if (!response.body) throw new Error("Empty stream");

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
