import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { current, new: newPassword } = await req.json()
  if (!current || !newPassword) return NextResponse.json({ error: 'Current and new password required' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.password) return NextResponse.json({ error: 'No password set' }, { status: 400 })
  const valid = await bcrypt.compare(current, user.password)
  if (!valid) return NextResponse.json({ error: 'Current password incorrect' }, { status: 400 })
  const hashed = await bcrypt.hash(newPassword, 12)
  await prisma.user.update({ where: { id: session.user.id }, data: { password: hashed } })
  return NextResponse.json({ success: true })
} 