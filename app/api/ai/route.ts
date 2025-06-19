import { NextRequest, NextResponse } from 'next/server'
import { routeAIRequest } from '@/lib/ai-task-engine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, params, preferredProvider } = body
    if (!type || !params) {
      return NextResponse.json({ error: 'Missing type or params' }, { status: 400 })
    }
    const result = await routeAIRequest({ type, params, preferredProvider })
    return NextResponse.json({ result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'AI request failed' }, { status: 500 })
  }
} 