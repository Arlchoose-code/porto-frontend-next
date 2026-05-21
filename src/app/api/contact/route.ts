import { NextResponse } from "next/server";
import { postContact } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    await postContact(payload);
    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed to send message." },
      { status: 400 },
    );
  }
}
