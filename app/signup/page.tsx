"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, UserPlus } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess(true);
    router.refresh();
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
  };

  if (success) {
    return (
      <div className="page-container mesh-gradient relative overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-blue-400/5 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-400/5 dark:bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
        <header className="relative z-20 pt-6 px-6 safe-area-pt">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">← Back to home</a>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md glass-card p-8 sm:p-10 text-center animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-green-500/10 border border-green-500/20 mb-6">
             <Check className="h-8 w-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">Check your email</h1>
          <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
            We sent a confirmation link to <span className="text-foreground font-bold">{email}</span>. Click it to verify and then sign in.
          </p>
          <Link href="/login">
            <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              Go to sign in
            </Button>
          </Link>
        </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-container mesh-gradient relative overflow-hidden">
      <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-blue-400/5 dark:bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-purple-400/5 dark:bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
      <header className="relative z-20 pt-6 px-6 safe-area-pt">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">← Back to home</a>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
      <div className="w-full max-w-md glass-card p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/5 border border-primary/10 mb-6 group-hover:scale-110 transition-transform">
             <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
            Create account
          </h1>
          <p className="text-muted-foreground font-medium">
            Join the future of AI conversation.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 text-[13px] font-bold text-center animate-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
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
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 px-4 rounded-xl bg-white/40 dark:bg-black/40 border border-white/20 focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10 dark:border-white/5" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-bold text-muted-foreground/50">
            <span className="bg-transparent px-3">secure signup</span>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-bold transition-all">
            Sign in
          </Link>
        </p>
      </div>
      </main>
    </div>
  );
}
