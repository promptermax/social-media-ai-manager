import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // TODO: Implement real Instagram API integration using stored OAuth tokens
  return NextResponse.json({
    platform: 'instagram',
    followers: 15700,
    engagementRate: 4.1,
    posts: [
      { id: '1', title: 'Giveaway', likes: 540, comments: 80, saves: 30, reach: 8000 },
      { id: '2', title: 'Reel: Office Tour', likes: 320, comments: 40, saves: 15, reach: 4200 },
      { id: '3', title: 'Story: Q&A', likes: 110, comments: 10, saves: 5, reach: 1500 },
    ],
    note: 'This is mock data. Replace with real Instagram API integration.'
  })
} 