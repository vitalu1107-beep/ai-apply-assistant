import { NextResponse } from "next/server";

import { mockGenerateResult } from "../../../lib/mockGenerateResult";
import type { GenerateRequest } from "../../../types/generate";

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

  return NextResponse.json(mockGenerateResult);
}
