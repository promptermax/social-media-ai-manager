import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Implement fetching Facebook messages using stored OAuth tokens
  return NextResponse.json({
    messages: [],
    note: "This is a stub. Implement real Facebook API logic when OAuth is enabled."
  });
} 