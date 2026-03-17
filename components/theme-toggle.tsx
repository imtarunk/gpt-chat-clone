"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /* Same structure when not mounted to avoid hydration mismatch (null vs button) */
  if (!mounted) {
    return (
      <div className="h-10 w-10 shrink-0 rounded-xl" aria-hidden />
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-xl hover:bg-white/10 dark:hover:bg-white/5 h-10 w-10 flex items-center justify-center relative active:scale-90 transition-all duration-300"
      aria-label="Toggle theme"
    >
      <div className="relative h-5 w-5">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 absolute inset-0 dark:-rotate-180 dark:scale-0 text-amber-500" />
        <Moon className="h-5 w-5 rotate-180 scale-0 transition-all duration-500 absolute inset-0 dark:rotate-0 dark:scale-100 text-indigo-400" />
      </div>
    </Button>
  );
}
