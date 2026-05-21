const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "";

  if (!path.startsWith("/uploads/")) {
    return new Response("Invalid asset path", { status: 400 });
  }

  return fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });
}
