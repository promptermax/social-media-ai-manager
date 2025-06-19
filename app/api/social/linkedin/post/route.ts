import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Implement posting to LinkedIn using stored OAuth tokens
  return NextResponse.json({
    success: false,
    note: "This is a stub. Implement real LinkedIn posting logic when OAuth is enabled."
  });
} 