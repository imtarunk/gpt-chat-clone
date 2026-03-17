"use client";

import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import { useState, useEffect } from "react";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
  isStreaming?: boolean;
}

function formatTime(isoString: string) {
  try {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function Message({ role, content, createdAt, isStreaming }: MessageProps) {
  const isUser = role === "user";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className={cn(
        "flex gap-4 px-2 py-3 animate-in fade-in slide-in-from-bottom-2 duration-500",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "h-9 w-9 shrink-0 rounded-[14px] flex items-center justify-center shadow-sm border border-white/10",
        isUser 
          ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white" 
          : "bg-white dark:bg-zinc-900 text-primary"
      )}>
        {isUser ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
      </div>
      
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-[22px] px-5 py-3.5 shadow-xl border backdrop-blur-2xl transition-all duration-300",
          isUser
            ? "bg-primary/5 border-primary/10 text-foreground rounded-tr-none"
            : "bg-white/40 dark:bg-black/40 border-white/10 text-foreground rounded-tl-none"
        )}
      >
        <div className="text-[15px] whitespace-pre-wrap break-words leading-relaxed font-medium">
          {content}
          {isStreaming && (
            <span className="inline-flex gap-0.5 ml-2 items-center align-middle">
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
            </span>
          )}
        </div>
        {createdAt && mounted && (
          <div className="flex items-center gap-1.5 mt-2.5 opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {formatTime(createdAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
