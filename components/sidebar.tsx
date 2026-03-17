"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquarePlus,
  Search,
  ChevronLeft,
  PanelLeftClose,
  LogOut,
  Settings,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useChatStore } from "@/store/chat-store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userEmail: string | undefined;
  userAvatar?: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  userEmail,
  userAvatar,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { chats, currentChatId, setCurrentChatId, updateChat, removeChat } =
    useChatStore();

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;
    const q = search.toLowerCase();
    return chats.filter((c) => c.title.toLowerCase().includes(q));
  }, [chats, search]);

  const handleNewChat = () => {
    setCurrentChatId(null);
    router.push("/chat");
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    setEditingId(null);
    router.push(`/chat?id=${id}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const startRename = (chat: { id: string; title: string }) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const saveRename = async () => {
    if (!editingId || !editTitle.trim()) {
      setEditingId(null);
      return;
    }
    updateChat(editingId, { title: editTitle.trim() });
    const { error } = await supabase
      .from("chats")
      .update({ title: editTitle.trim() })
      .eq("id", editingId);
    if (!error) setEditingId(null);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleDeleteChat = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const { error } = await supabase.from("chats").delete().eq("id", id);
    if (!error) removeChat(id);
    if (currentChatId === id) {
      setCurrentChatId(null);
      router.push("/chat");
    }
  };

  if (collapsed) {
    return (
      <div className="flex flex-col w-[72px] shrink-0 bg-[var(--glass-bg)] backdrop-blur-2xl border-r border-[var(--glass-border)] h-full items-center pt-[calc(1.5rem+env(safe-area-inset-top,0px))] pb-6 gap-6 transition-all duration-500 ease-in-out">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="rounded-2xl hover:bg-white/10 dark:hover:bg-white/5 active:scale-95 transition-all h-12 w-12"
          aria-label="Expand sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNewChat} 
          className="rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 active:scale-95 transition-all h-12 w-12"
          aria-label="New chat"
        >
          <MessageSquarePlus className="h-5 w-5 text-primary" />
        </Button>
        <div className="flex-1" />
        <div className="flex flex-col gap-4 items-center mb-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-2xl hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition-all h-12 w-12" aria-label="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-72 shrink-0 bg-[var(--glass-bg)] backdrop-blur-2xl border-r border-[var(--glass-border)] h-full transition-all duration-500 ease-in-out overflow-hidden">
      <div className="p-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] flex items-center justify-between gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNewChat} 
          className="flex-1 justify-start gap-2.5 h-11 rounded-2xl bg-primary/5 border border-primary/10 hover:bg-primary/10 active:scale-[0.98] transition-all font-medium"
        >
          <MessageSquarePlus className="h-4.5 w-4.5 text-primary" />
          New Chat
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-11 w-11 rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 py-2">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/5 dark:bg-black/20 border border-white/10 text-[14px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-4 space-y-1 no-scrollbar">
        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 opacity-40">
            <MessageSquarePlus className="h-8 w-8 mb-3" />
            <p className="text-sm font-medium text-center">
              No conversations yet
            </p>
          </div>
        )}
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer transition-all active:scale-[0.98]",
              currentChatId === chat.id
                ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                : "hover:bg-white/10 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
            )}
            onClick={() => editingId !== chat.id && handleSelectChat(chat.id)}
          >
            {editingId === chat.id ? (
              <div className="flex items-center gap-2 w-full animate-in fade-in duration-300">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRename();
                    if (e.key === "Escape") cancelRename();
                  }}
                  className="flex-1 min-w-0 bg-white/10 dark:bg-black/40 border border-white/20 rounded-xl px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-green-500/10 hover:text-green-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      saveRename();
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-red-500/10 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelRename();
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <span className="flex-1 truncate text-[14px] font-medium leading-relaxed">{chat.title}</span>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-1 translate-x-2 group-hover:translate-x-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      startRename(chat);
                    }}
                    aria-label="Rename"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg hover:bg-red-500/10 hover:text-red-500"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white/5 dark:bg-black/20 backdrop-blur-md border-t border-[var(--glass-border)] m-3 rounded-2xl shadow-xl space-y-3">
        <div className="flex items-center gap-3 px-1 py-1">
          <div
            className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20 shrink-0 border border-white/20"
            style={
              userAvatar
                ? { backgroundImage: `url(${userAvatar})`, backgroundSize: "cover" }
                : undefined
            }
          >
            {!userAvatar && (userEmail?.[0]?.toUpperCase() ?? "?")}
          </div>
          <div className="flex flex-col min-w-0 pr-2">
            <span className="truncate text-[14px] font-bold text-foreground">
              {userEmail?.split('@')[0] ?? "User"}
            </span>
            <span className="truncate text-[12px] text-muted-foreground font-medium">
              {userEmail ?? "user@example.com"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="p-1 rounded-xl bg-primary/5 border border-primary/10 flex-1">
            <ThemeToggle />
          </div>
          <Button variant="ghost" size="icon" aria-label="Settings" className="h-10 w-10 rounded-xl hover:bg-white/10 active:scale-95 transition-all">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout" className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 active:scale-95 transition-all">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
