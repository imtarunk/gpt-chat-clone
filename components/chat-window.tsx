"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useChatStore } from "@/store/chat-store";
import { Message } from "@/components/message";
import { ChatInput } from "@/components/chat-input";

import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  userId: string;
  onToggleSidebar?: () => void;
}

export function ChatWindow({ userId, onToggleSidebar }: ChatWindowProps) {
  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams.get("id");
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const {
    currentChatId,
    setCurrentChatId,
    setChats,
    addChat,
    addMessage,
    updateChat,
    updateMessage,
    getCurrentChat,
  } = useChatStore();

  const currentChat = getCurrentChat();
  const messages = useMemo(
    () => currentChat?.messages ?? [],
    [currentChat?.messages]
  );
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (chatIdFromUrl) setCurrentChatId(chatIdFromUrl);
    else setCurrentChatId(null);
  }, [chatIdFromUrl, setCurrentChatId]);

  useEffect(() => {
    const loadChats = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("id, user_id, title, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) {
        const withMessages = await Promise.all(
          data.map(async (chat) => {
            const { data: msgs } = await supabase
              .from("messages")
              .select("id, chat_id, role, content, created_at")
              .eq("chat_id", chat.id)
              .order("created_at", { ascending: true });
            return { ...chat, messages: msgs ?? [] };
          })
        );
        setChats(withMessages);
      }
    };
    loadChats();
  }, [userId, setChats, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      let activeChatId = currentChatId;
      const defaultTitle = "First conversation";

      if (!activeChatId) {
        const { data: newChat, error } = await supabase
          .from("chats")
          .insert({ user_id: userId, title: defaultTitle })
          .select("id, user_id, title, created_at")
          .single();
        if (error || !newChat) return;
        activeChatId = newChat.id;
        addChat({ ...newChat, messages: [] });
        setCurrentChatId(activeChatId);
      }
      if (!activeChatId) return;

      const userMessage = {
        id: crypto.randomUUID(),
        role: "user" as const,
        content,
        created_at: new Date().toISOString(),
      };
      addMessage(activeChatId, userMessage);

      const { error: insertError } = await supabase.from("messages").insert({
        chat_id: activeChatId,
        role: "user",
        content,
      });
      if (insertError) return;

      if (messages.length === 0) {
        const firstPromptTitle = content.slice(0, 50) + (content.length > 50 ? "…" : "");
        updateChat(activeChatId, { title: firstPromptTitle });
        await supabase.from("chats").update({ title: firstPromptTitle }).eq("id", activeChatId);
      }

      setIsLoading(true);
      abortRef.current = new AbortController();
      const history = [...messages, userMessage];
      const apiMessages = history.map((m) => ({ role: m.role, content: m.content }));

      const assistantId = crypto.randomUUID();
      const assistantMessage = {
        id: assistantId,
        role: "assistant" as const,
        content: "",
        created_at: new Date().toISOString(),
      };
      addMessage(activeChatId, assistantMessage);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId: activeChatId, messages: apiMessages }),
          signal: abortRef.current.signal,
        });
        if (!res.ok || !res.body) throw new Error("Stream failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          updateMessage(activeChatId, assistantId, full);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          updateMessage(activeChatId, assistantId, "Sorry, something went wrong. Please try again.");
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [
      currentChatId,
      userId,
      messages,
      supabase,
      addChat,
      addMessage,
      updateChat,
      updateMessage,
      setCurrentChatId,
    ]
  );

  return (
    <div className="flex flex-1 flex-col min-h-0 w-full overflow-hidden bg-transparent relative">
      {/* Top bar: always visible, safe-area via CSS class for hydration safety */}
      <header className="chat-header-bar relative z-[60] shrink-0 border-b border-[var(--glass-border)] flex items-center justify-between px-4 sm:px-6 bg-[var(--glass-bg)] dark:bg-[var(--glass-bg)] backdrop-blur-xl">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden -ml-2 h-9 w-9 rounded-xl hover:bg-white/10 active:scale-95 transition-all shrink-0"
              onClick={onToggleSidebar}
              aria-label="Open sidebar"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex flex-col min-w-0 justify-center">
            <h2 className="text-[15px] font-bold text-foreground truncate leading-tight">
              {currentChat?.title ?? "New Conversation"}
            </h2>
            {messages.length > 0 && (
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                {messages.length} message{messages.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <div className="flex -space-x-2 shrink-0">
          <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">AI</div>
          <div className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">U</div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0 relative no-scrollbar scroll-smooth">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none dark:opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, var(--foreground) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="content-width max-w-3xl py-4 sm:py-6 relative z-10">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="mb-6 p-5 rounded-[2rem] bg-primary/5 border border-primary/10 shadow-xl shadow-primary/5">
                <svg className="w-12 h-12 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 8V12L15 15" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-4 tracking-tight">How can I help today?</h2>
              <p className="text-muted-foreground text-lg max-w-sm leading-relaxed font-medium">
                Experience the clarity of AI conversation. Start typing or try voice input.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-12 w-full max-w-lg">
                <button onClick={() => sendMessage("Generate a creative story about a space traveler.")} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all text-left group">
                   <div className="text-primary mb-1 font-bold group-hover:underline">Creative writing</div>
                   <div className="text-muted-foreground text-xs line-clamp-1">Space traveler story...</div>
                </button>
                <button onClick={() => sendMessage("Explain quantum physics to a five year old.")} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all text-left group">
                   <div className="text-primary mb-1 font-bold group-hover:underline">Explain concepts</div>
                   <div className="text-muted-foreground text-xs line-clamp-1">Quantum physics...</div>
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-1 px-2 sm:px-4 pb-24 sm:pb-28">
            {messages.map((m) => (
              <Message
                key={m.id}
                role={m.role}
                content={m.content}
                createdAt={m.created_at}
                isStreaming={m.role === "assistant" && isLoading && m.id === messages[messages.length - 1]?.id}
              />
            ))}
          </div>
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 px-3 py-4 sm:px-6 sm:py-5 bg-gradient-to-t from-background/95 via-background/80 to-transparent pointer-events-none pb-[env(safe-area-inset-bottom,0)]">
        <div className="content-width max-w-3xl pointer-events-auto">
          <ChatInput onSend={sendMessage} disabled={false} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
