"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function ChatInput({ onSend, disabled, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    setMounted(true);
    const SpeechRecognitionAPI =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: SpeechRecognition }).webkitSpeechRecognition);
    if (!SpeechRecognitionAPI) return;

    const recognition = new (SpeechRecognitionAPI as new () => SpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join("");
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled || isLoading) return;
    onSend(text);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [value]);

  const hasSpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);

  return (
    <form
      onSubmit={handleSubmit}
      className="pb-2"
    >
      <div
        className={cn(
          "flex items-end gap-2 rounded-[28px] border border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-2xl p-2 transition-all duration-500",
          "focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/20",
          "group hover:bg-white/50 dark:hover:bg-black/50"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI..."
          rows={1}
          disabled={disabled || isLoading}
          className="flex-1 min-h-[44px] max-h-[200px] resize-none bg-transparent px-4 py-2.5 text-[15px] font-medium placeholder:text-muted-foreground/60 focus:outline-none no-scrollbar leading-relaxed"
        />
        <div className="flex items-center gap-1.5 shrink-0 px-1 pb-1">
          {mounted && hasSpeechRecognition && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              disabled={disabled || isLoading}
              className={cn(
                "h-10 w-10 rounded-full transition-all duration-300",
                isListening 
                  ? "bg-red-500/10 text-red-500 animate-pulse" 
                  : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
              )}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
          )}
          <Button
            type="submit"
            variant="default"
            size="icon"
            disabled={!value.trim() || disabled || isLoading}
            className={cn(
              "h-10 w-10 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 active:scale-90",
              !value.trim() || disabled || isLoading ? "opacity-50 grayscale" : "hover:shadow-primary/40"
            )}
            aria-label="Send"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-4 w-4 fill-current" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
