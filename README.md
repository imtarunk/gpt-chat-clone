# AI Chat Application

A modern AI chat app similar to ChatGPT built with Next.js 14 (App Router), Supabase, and OpenAI.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn-style UI
- **Backend / DB / Auth:** Supabase (Postgres, Auth)
- **AI:** OpenAI API (gpt-4o-mini)
- **State:** Zustand
- **Voice:** Web Speech API (speech-to-text)
- **Themes:** next-themes (light/dark)

## Features

- **Auth:** Email/password and Google OAuth (Supabase Auth)
- **Chat:** Persistent conversations in Supabase, streaming OpenAI responses
- **Sidebar:** New chat, search chats, collapsible, rename/delete, user section
- **Voice:** Microphone button for voice input (Web Speech API)
- **UI:** Glassmorphism, light/dark theme, responsive layout

## Setup

### 1. Environment variables

Copy the example env and set your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` from [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API
- `OPENAI_API_KEY` from [OpenAI API keys](https://platform.openai.com/api-keys)

### 2. Supabase database

In the Supabase SQL editor, run the migration:

```bash
# Or via Supabase CLI: supabase db push
```

Paste and run the contents of `supabase/migrations/001_schema.sql` to create `chats` and `messages` tables and RLS policies.

### 3. Google OAuth (optional)

In Supabase: Authentication → Providers → Google → enable and set Client ID/Secret from Google Cloud Console.

### 4. Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up or log in, then start chatting.

## Project structure

```
app/
  chat/page.tsx      # Protected chat page
  login/page.tsx
  signup/page.tsx
  api/chat/route.ts  # OpenAI streaming API
components/
  sidebar.tsx
  chat-window.tsx
  message.tsx
  chat-input.tsx
  chat-layout.tsx
  theme-provider.tsx
  theme-toggle.tsx
lib/
  supabase/          # Client, server, middleware, types
  openai.ts
  utils.ts
store/
  chat-store.ts
supabase/
  migrations/
    001_schema.sql
```

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm run start` – run production build
- `npm run lint` – ESLint
