const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const cleanPath = path.map((part) => encodeURIComponent(part)).join("/");

  const upstream = await fetch(`${API_BASE_URL}/uploads/${cleanPath}`, {
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
