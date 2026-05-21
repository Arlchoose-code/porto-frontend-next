import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  const body = await request.json().catch(() => ({ tags: [] }));

  if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET && body.secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ success: false, message: "Invalid secret." }, { status: 401 });
  }

  const tags = Array.isArray(body.tags) ? body.tags : [];

  tags.forEach((tag: string) => revalidateTag(tag, "max"));

  return NextResponse.json({ success: true, revalidated: tags });
}
