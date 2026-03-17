-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Chats table (user_id references auth.users)
create table public.chats (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'First conversation',
  created_at timestamptz not null default now()
);

-- Messages table
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  chat_id uuid not null references public.chats(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

-- RLS policies
alter table public.chats enable row level security;
alter table public.messages enable row level security;

create policy "Users can manage own chats"
  on public.chats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage messages in own chats"
  on public.messages for all
  using (
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id and chats.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.chats
      where chats.id = messages.chat_id and chats.user_id = auth.uid()
    )
  );

-- Indexes
create index chats_user_id_idx on public.chats(user_id);
create index chats_created_at_idx on public.chats(created_at desc);
create index messages_chat_id_idx on public.messages(chat_id);
create index messages_created_at_idx on public.messages(created_at);
