const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const cleanPath = path.map((part) => encodeURIComponent(part)).join("/");

  return fetch(`${API_BASE_URL}/uploads/${cleanPath}`, {
    cache: "no-store",
  });
}
