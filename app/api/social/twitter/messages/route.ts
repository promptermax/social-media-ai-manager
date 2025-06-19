import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Implement fetching Twitter messages using stored OAuth tokens
  return NextResponse.json({
    messages: [],
    note: "This is a stub. Implement real Twitter API logic when OAuth is enabled."
  });
} 