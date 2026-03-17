import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatLayout } from "@/components/chat-layout";

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <ChatLayout
      userId={user.id}
      userEmail={user.email ?? undefined}
      userAvatar={user.user_metadata?.avatar_url}
    />
  );
}
