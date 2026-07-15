import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export async function generateWithLLM(messages: ChatCompletionMessageParam[]) {
  const apiKey = process.env.LLM_API_KEY;
  const baseURL = process.env.LLM_BASE_URL;
  const model = process.env.LLM_MODEL;

  if (!apiKey || !baseURL || !model) {
    throw new Error("缺少 LLM 环境变量配置");
  }

  const client = new OpenAI({
    apiKey,
    baseURL,
  });

  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.4,
  });

  return completion.choices[0]?.message?.content ?? "";
}
