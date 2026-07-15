import { NextResponse } from "next/server";

import { generateWithLLM } from "../../../lib/llm";
import { mockGenerateResult } from "../../../lib/mockGenerateResult";
import { normalizeGenerateResult } from "../../../lib/normalizeGenerateResult";
import { parseModelResult } from "../../../lib/parseModelResult";
import { buildGenerateMessages } from "../../../lib/prompt";
import type { GenerateRequest, GenerateResult } from "../../../types/generate";

function withMeta(result: GenerateResult, isMock: boolean): GenerateResult {
  return normalizeGenerateResult({
    ...result,
    meta: {
      ...result.meta,
      provider: isMock ? "mock" : process.env.LLM_PROVIDER || "volcengine",
      model: isMock ? result.meta?.model : process.env.LLM_MODEL || "doubao-seed-2-1-turbo-260628",
      isMock,
      generatedAt: new Date().toISOString(),
    },
  });
}

function logGenerateError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error("[api/generate]", message);
}

export async function POST(request: Request) {
  let payload: Partial<GenerateRequest>;

  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  if (!payload.jobDescription?.trim()) {
    return NextResponse.json({ error: "请先粘贴岗位 JD。" }, { status: 400 });
  }

  if (process.env.GENERATE_MODE === "mock") {
    return NextResponse.json(withMeta(mockGenerateResult, true));
  }

  try {
    const messages = buildGenerateMessages(payload as GenerateRequest);
    const rawText = await generateWithLLM(messages);
    const parsed = parseModelResult(rawText);

    return NextResponse.json(withMeta(parsed, false));
  } catch (error) {
    logGenerateError(error);

    if (error instanceof Error && error.message === "缺少 LLM 环境变量配置") {
      return NextResponse.json(
        { error: "模型服务未配置，请检查环境变量。" },
        { status: 500 },
      );
    }

    if (error instanceof Error && error.message === "模型返回格式异常，请重新生成。") {
      return NextResponse.json(
        { error: "模型返回格式异常，请重新生成。" },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "模型调用失败，请稍后重试。" }, { status: 500 });
  }
}
