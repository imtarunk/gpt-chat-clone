"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { ChatWindow } from "@/components/chat-window";

interface ChatLayoutProps {
  userId: string;
  userEmail: string | undefined;
  userAvatar?: string | null;
}

export function ChatLayout({ userId, userEmail, userAvatar }: ChatLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile()) setSidebarCollapsed(true);
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden mesh-gradient">
      {/* Ambient orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-400/5 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-400/5 dark:bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Mobile overlay when sidebar open */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
          aria-hidden
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar: narrow strip when collapsed, full when expanded */}
      <aside
        className={`
          h-full shrink-0 left-0 z-50 md:z-auto
          transition-[width] duration-300 ease-out
          ${sidebarCollapsed ? "w-0 overflow-hidden md:w-[72px]" : "w-72 fixed md:relative md:left-auto"}
        `}
      >
        <Sidebar
          userEmail={userEmail}
          userAvatar={userAvatar}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        />
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 relative overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 min-h-0 mx-0 md:mx-3 md:mt-3 md:mb-0 md:rounded-3xl glass-panel overflow-hidden shadow-xl md:shadow-2xl border border-[var(--glass-border)]">
          <ChatWindow userId={userId} onToggleSidebar={() => setSidebarCollapsed(false)} />
        </div>
      </main>
    </div>
  );
}
