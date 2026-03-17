import OpenAI from "openai";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

export const CHAT_MODEL = "gpt-4o-mini";

export async function streamChatCompletion(
  messages: { role: "user" | "assistant" | "system"; content: string }[]
) {
  const openai = getOpenAI();
  return openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: true,
  });
}
