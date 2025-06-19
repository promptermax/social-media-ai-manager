import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Implement fetching LinkedIn messages using stored OAuth tokens
  return NextResponse.json({
    messages: [],
    note: "This is a stub. Implement real LinkedIn API logic when OAuth is enabled."
  });
} 