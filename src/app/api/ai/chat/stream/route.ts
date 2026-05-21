const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
  const body = await request.text();

  const response = await fetch(`${API_BASE_URL}/api/v1/ai/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });

  if (!response.ok || !response.body) {
    return new Response(
      `event: error\ndata: ${JSON.stringify({ error: "AI sedang tidak tersedia." })}\n\n`,
      {
        status: 200,
        headers: streamHeaders(),
      },
    );
  }

  return new Response(response.body, {
    headers: streamHeaders(),
  });
}

function streamHeaders() {
  return {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  };
}
