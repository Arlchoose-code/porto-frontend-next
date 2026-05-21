const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
  const body = await request.text();

  return fetch(`${API_BASE_URL}/api/v1/ai/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    cache: "no-store",
  });
}
