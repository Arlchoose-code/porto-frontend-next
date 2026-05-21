"use client";

import { AlertCircle, CheckCircle2, Loader2, Mail, MessageSquare, Send, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [messageLength, setMessageLength] = useState(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const formEl = event.currentTarget;
    const form = new FormData(formEl);

    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        formEl.reset();
        setMessageLength(0);
        setState("sent");
        return;
      }

      setState("error");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-950" onSubmit={submit}>
      <div className="border-b border-slate-200 bg-[#f8fafc] px-5 py-4 dark:border-slate-800 dark:bg-[#020617] sm:px-6">
        <p className="inline-flex items-center gap-2 font-semibold">
          <MessageSquare className="size-5 text-cyan-700 dark:text-cyan-300" />
          Send a message
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tell the full context. The textarea supports long messages.</p>
      </div>

      <div className="grid gap-5 p-5 sm:p-6">
        <label className="grid gap-2 text-sm font-semibold">
          Name
          <span className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8fafc] pl-11 pr-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white dark:border-slate-800 dark:bg-[#020617] dark:focus:border-cyan-500" maxLength={150} name="name" placeholder="Your name" required />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Email
          <span className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input className="h-12 w-full rounded-2xl border border-slate-200 bg-[#f8fafc] pl-11 pr-4 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white dark:border-slate-800 dark:bg-[#020617] dark:focus:border-cyan-500" maxLength={150} name="email" placeholder="you@example.com" required type="email" />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Message
          <textarea
            className="min-h-64 resize-y rounded-2xl border border-slate-200 bg-[#f8fafc] px-4 py-4 leading-7 outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white dark:border-slate-800 dark:bg-[#020617] dark:focus:border-cyan-500"
            maxLength={5000}
            name="message"
            placeholder="Write the project context, goals, timeline, stack, constraints, or anything important..."
            required
            onChange={(event) => setMessageLength(event.target.value.length)}
          />
          <span className="flex items-center justify-between gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>Line breaks and long messages are okay.</span>
            <span>{messageLength}/5000</span>
          </span>
        </label>

        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950" disabled={state === "sending"} type="submit">
          {state === "sending" ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
          {state === "sending" ? "Sending..." : "Send message"}
        </button>

        {state === "sent" ? (
          <p className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
            <CheckCircle2 className="size-4" />
            Message sent successfully.
          </p>
        ) : null}
        {state === "error" ? (
          <p className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            <AlertCircle className="size-4" />
            Failed to send message. Please try again.
          </p>
        ) : null}
      </div>
    </form>
  );
}
