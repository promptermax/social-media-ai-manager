import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { task } = await req.json();

  let suggestions: string[] = [];

  switch (task) {
    case "Ideas":
      suggestions = [
        "Share a behind-the-scenes look at your team.",
        "Post a customer testimonial as a quote graphic.",
        "Create a poll about a trending topic in your industry.",
      ];
      break;
    case "Trends":
      suggestions = [
        "#AIinMarketing",
        "#SustainableBusiness",
        "Short-form video content is gaining traction.",
      ];
      break;
    case "Strategies":
      suggestions = [
        "Post consistently 3-5 times per week.",
        "Engage with comments within the first hour.",
        "Use a mix of video, image, and carousel posts.",
      ];
      break;
    default:
      suggestions = ["No suggestions available for this task."];
  }

  return NextResponse.json({ suggestions });
} 