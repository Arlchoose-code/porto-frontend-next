"use client";

import { Bot, Loader2, Minus, RotateCcw, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AiMessage } from "@/components/ai-message";
import type { ChatMessage } from "@/lib/types";

const initialMessage: ChatMessage = {
  role: "assistant",
  content:
    "Halo, aku Karina dari Aibys Ekosistem. Tanya aku tentang profil Syahril, project Aibys, Indonesian LLM, skill, pengalaman, atau kontak.",
};
const storageKey = "karina-chat-messages-v4";
const karinaContext = `Instruksi untuk Karina:
- Kamu adalah Karina, AI assistant dari Aibys Ekosistem di portfolio Syahril Haryono.
- Jangan bilang tidak punya informasi tentang Aibys ketika user bertanya "Aibys itu apa".
- Aibys adalah ekosistem project AI milik Syahril untuk eksperimen dan pengembangan LLM bahasa Indonesia, tooling data, backend API, frontend app, tokenizer, dan workflow fine-tuning.
- Project yang termasuk Aibys Ekosistem:
  1. Indonesian-LLM-Starter: starter resources untuk eksperimen model bahasa Indonesia.
  2. Indonesian-LLM-Finetune: workflow fine-tuning model bahasa Indonesia.
  3. Aibys-Data-Collector: tooling untuk pengumpulan dan persiapan data.
  4. aibys-backend: backend/API untuk layanan Aibys.
  5. aibys-frontend: frontend untuk pengalaman pengguna Aibys.
  6. aibys-tokenizer di Hugging Face: tokenizer untuk eksperimen Aibys.
- Kalau user bertanya Aibys, jelaskan singkat, percaya diri, dan hubungkan ke portfolio Syahril.
- Kalau detail tertentu tidak tersedia, katakan bagian detailnya belum tersedia, tapi tetap jelaskan konsep dan project yang diketahui.`;

function loadStoredMessages() {
  if (typeof window === "undefined") return [initialMessage];
  const stored = localStorage.getItem(storageKey);
  if (!stored) return [initialMessage];
  try {
    const parsed = JSON.parse(stored) as ChatMessage[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [initialMessage];
  } catch {
    localStorage.removeItem(storageKey);
    return [initialMessage];
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streamIdRef = useRef(0);
  const [showHint, setShowHint] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(loadStoredMessages);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) return;
    const interval = window.setInterval(() => {
      setShowHint(true);
      window.setTimeout(() => setShowHint(false), 3600);
    }, 11000);

    const firstHide = window.setTimeout(() => setShowHint(false), 5200);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(firstHide);
    };
  }, [open]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content || loading) return;
    const streamId = streamIdRef.current + 1;
    streamIdRef.current = streamId;

    const contextMessage: ChatMessage = {
      role: "user",
      content: karinaContext,
    };
    const requestMessages = [contextMessage, ...messages, { role: "user", content }].filter((msg) => msg.role !== "assistant" || msg.content !== initialMessage.content);
    const visibleMessages: ChatMessage[] = [...messages, { role: "user", content }, { role: "assistant", content: "" }];
    setMessages(visibleMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages }),
      });
      await readChatStream(response, (chunk) => {
        if (streamIdRef.current !== streamId) return;
        setMessages((current) => {
          const copy = [...current];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: `${last.content}${chunk}` };
          return copy;
        });
      });
    } catch {
      if (streamIdRef.current === streamId) {
        setMessages([...messages, { role: "user", content }, { role: "assistant", content: "AI sedang tidak tersedia." }]);
      }
    } finally {
      if (streamIdRef.current === streamId) setLoading(false);
    }
  }, [loading, messages]);

  useEffect(() => {
    function handlePrompt(event: Event) {
      const content = (event as CustomEvent<string>).detail;
      if (!content) return;
      setOpen(true);
      void sendMessage(content);
    }

    window.addEventListener("portfolio-ai-prompt", handlePrompt);
    return () => window.removeEventListener("portfolio-ai-prompt", handlePrompt);
  }, [sendMessage]);

  function endChat() {
    streamIdRef.current += 1;
    setMessages([initialMessage]);
    localStorage.removeItem(storageKey);
    setInput("");
    setLoading(false);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    await sendMessage(input.trim());
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {open ? (
          <motion.section
            className="mb-3 flex h-[520px] w-[min(calc(100vw-2rem),390px)] flex-col overflow-hidden rounded-2xl border border-cyan-200/60 bg-white shadow-2xl shadow-cyan-950/15 dark:border-cyan-400/20 dark:bg-slate-950 dark:shadow-black/40"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white dark:border-slate-800">
            <div className="flex items-center gap-3 font-semibold">
              <span className="relative grid size-9 place-items-center rounded-xl bg-cyan-300/15 text-cyan-200">
                <Bot size={18} />
                <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
              </span>
              <div>
                <p>Karina</p>
                <p className="text-xs font-medium text-cyan-200">Aibys Ekosistem AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="End chat" className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10" type="button" onClick={endChat}>
                <RotateCcw size={14} /> End
              </button>
              <button aria-label="Minimize chat" className="grid size-8 place-items-center rounded-lg text-slate-200 transition hover:bg-white/10" type="button" onClick={() => setOpen(false)}>
                <Minus size={18} />
              </button>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm" ref={scrollRef}>
            {messages.map((message, index) => (
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  message.role === "user"
                    ? "ml-auto bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                    : "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100"
                }`}
                key={`${message.role}-${index}`}
              >
                {message.content ? (
                  <AiMessage content={message.content} />
                ) : (
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <Loader2 className="size-3.5 animate-spin" /> Menyiapkan jawaban...
                  </span>
                )}
              </div>
            ))}
          </div>
          <form className="flex gap-2 border-t border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950" onSubmit={submit}>
            <input
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 sm:text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              placeholder="Ask Karina"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button aria-label="Send message" className="inline-flex size-10 items-center justify-center rounded-xl bg-slate-950 text-white disabled:opacity-50 dark:bg-white dark:text-slate-950" disabled={loading} type="submit">
              <Send size={17} />
            </button>
          </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {!open ? (
          <motion.div
            className="flex items-end gap-3"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.6 }}
          >
            <AnimatePresence>
              {showHint ? (
                <motion.div
                  className="max-w-[calc(100vw-5.5rem)] rounded-2xl border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-xl shadow-cyan-950/10 dark:border-cyan-400/20 dark:bg-slate-950 dark:text-slate-100 sm:px-4 sm:py-3 sm:text-sm"
                  initial={{ opacity: 0, x: 16, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, y: [0, -6, 0], scale: 1 }}
                  exit={{ opacity: 0, x: 12, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.28, y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } }}
                >
                  <span className="inline-flex items-center gap-2">
                    {loading ? <Loader2 className="size-4 animate-spin text-cyan-500" /> : <Sparkles className="size-4 text-cyan-500" />}
                    {loading ? "Karina lagi jawab..." : "Karina siap bantu"}
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <motion.button
              aria-label="Open Karina chat"
              className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-2xl shadow-cyan-950/20 dark:bg-white dark:text-slate-950"
              type="button"
              onClick={() => setOpen(true)}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.06 }}
            >
              <span className="absolute inset-0 rounded-2xl border border-cyan-300/70" />
              {loading ? (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-cyan-300 text-slate-950">
                  <Loader2 className="size-3 animate-spin" />
                </span>
              ) : null}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-2xl border border-cyan-300/50"
                animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <Bot size={24} />
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
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
