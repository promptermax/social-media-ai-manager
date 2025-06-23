import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const prefs = await prisma.notificationPreference.findMany({ where: { userId: session.user.id } })
  return NextResponse.json({ preferences: prefs })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { eventType, email, sms, inApp } = await req.json()
  if (!eventType) return NextResponse.json({ error: 'eventType required' }, { status: 400 })
  const pref = await prisma.notificationPreference.upsert({
    where: { userId_eventType: { userId: session.user.id, eventType } },
    update: { email: !!email, sms: !!sms, inApp: !!inApp },
    create: { userId: session.user.id, eventType, email: !!email, sms: !!sms, inApp: !!inApp },
  })
  return NextResponse.json({ preference: pref })
} 