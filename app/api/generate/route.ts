import { NextResponse } from "next/server";

import { mockGenerateResult } from "../../../lib/mockGenerateResult";
import { normalizeGenerateResult } from "../../../lib/normalizeGenerateResult";
import type { GenerateRequest, GenerateResult } from "../../../types/generate";

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

  const result: GenerateResult = normalizeGenerateResult({
    ...mockGenerateResult,
    meta: {
      ...mockGenerateResult.meta,
      generatedAt: new Date().toISOString(),
    },
  });

  return NextResponse.json(result);
}
