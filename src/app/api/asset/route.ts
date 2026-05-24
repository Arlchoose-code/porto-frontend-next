const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "";

  if (!path && url.searchParams.has("_rsc")) {
    return new Response(null, { status: 204 });
  }

  if (!path.startsWith("/uploads/")) {
    return new Response("Invalid asset path", { status: 400 });
  }

  const upstream = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 31536000 },
  });

  const headers = new Headers(upstream.headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("CDN-Cache-Control", "public, max-age=31536000, immutable");

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
