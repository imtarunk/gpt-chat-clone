import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/chat");
  }

  return (
    <div className="page-container mesh-gradient relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 sm:px-8 safe-area-pt">
        <Link href="/" className="flex items-center gap-2 text-foreground font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          AI Chat
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sign in
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pb-12 pt-4 sm:pt-0 relative z-10">
        <div className="content-width max-w-lg">
          <div className="glass-card p-8 sm:p-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6 inline-flex items-center justify-center p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-3 sm:text-5xl">
              AI Chat
            </h1>
            <p className="text-lg text-muted-foreground mb-10 text-pretty max-w-md mx-auto">
              Experience the next generation of conversation with our refined, minimal AI companion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full h-12 px-8 rounded-xl text-base font-medium shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]">
                  Get Started
                </Button>
              </Link>
              <Link href="/signup" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full h-12 px-8 rounded-xl text-base font-medium border border-border/50 bg-secondary/50 backdrop-blur-sm hover:bg-secondary/80 transition-all active:scale-[0.98]">
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-6 text-center">
        <p className="text-sm text-muted-foreground/70 font-medium">
          Powered by Advanced AI · Voice ready
        </p>
      </footer>
    </div>
  );
}
