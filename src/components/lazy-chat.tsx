"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ChatWidget = dynamic(() => import("./chat-widget").then((mod) => mod.ChatWidget), {
  ssr: false,
});

export function LazyChat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <ChatWidget />;
}
