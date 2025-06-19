import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// TODO: Add authentication and user scoping

// GET: List all scheduled posts
export async function GET() {
  try {
    const posts = await prisma.scheduledPost.findMany({ orderBy: { scheduledAt: "asc" } });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json([]);
  }
}

// POST: Create a new scheduled post
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // TODO: Validate input and associate with authenticated user
    const post = await prisma.scheduledPost.create({ data });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// PATCH: Edit a scheduled post
export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    // TODO: Validate input and check user permissions
    const post = await prisma.scheduledPost.update({
      where: { id: data.id },
      data,
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

// DELETE: Delete a scheduled post
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    // TODO: Check user permissions
    await prisma.scheduledPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
} 