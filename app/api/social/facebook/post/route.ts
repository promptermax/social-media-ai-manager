import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Implement posting to Facebook using stored OAuth tokens
  return NextResponse.json({
    success: false,
    note: "This is a stub. Implement real Facebook posting logic when OAuth is enabled."
  });
} 