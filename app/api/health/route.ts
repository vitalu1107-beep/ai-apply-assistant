export const revalidate = 1;

export async function GET() {
  return Response.json({
    ok: true,
    service: "ai-apply-assistant",
    runtime: "vercel",
    timestamp: new Date().toISOString(),
  });
}
