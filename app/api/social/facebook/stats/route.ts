import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  // TODO: Implement real Facebook API integration using stored OAuth tokens
  return NextResponse.json({
    platform: 'facebook',
    followers: 12450,
    engagementRate: 3.2,
    posts: [
      { id: '1', title: 'New Product Launch', likes: 320, comments: 45, shares: 20, reach: 5000 },
      { id: '2', title: 'Behind the Scenes', likes: 210, comments: 30, shares: 10, reach: 3200 },
      { id: '3', title: 'Customer Testimonial', likes: 150, comments: 18, shares: 5, reach: 2100 },
    ],
    note: 'This is mock data. Replace with real Facebook API integration.'
  })
} 