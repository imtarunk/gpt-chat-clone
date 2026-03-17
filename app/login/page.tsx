"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/chat");
    router.refresh();
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
  };

  return (
    <div className="page-container mesh-gradient relative overflow-hidden">
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-blue-400/5 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-400/5 dark:bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

      <header className="relative z-20 pt-6 px-6 safe-area-pt">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          ← Back to home
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
      <div className="w-full max-w-md glass-card p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/5 border border-primary/10 mb-6 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground font-medium">
            Sign in to continue to your AI companion.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-[13px] font-bold text-center animate-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 px-4 rounded-xl bg-white/40 dark:bg-black/40 border border-white/20 focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 px-4 rounded-xl bg-white/40 dark:bg-black/40 border border-white/20 focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10 dark:border-white/5" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-bold text-muted-foreground/50">
            <span className="bg-transparent px-3">secure access</span>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-bold transition-all">
            Join now
          </Link>
        </p>
      </div>
      </main>
    </div>
  );
}
