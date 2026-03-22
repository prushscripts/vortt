import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { type, rating, message } = await req.json()
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }
    // TODO: Add Feedback model to Prisma schema
    // await prisma.feedback.create({
    //   data: {
    //     type: type ?? 'general',
    //     rating: rating ?? null,
    //     message: message.trim(),
    //   }
    // })
    console.log('Feedback received:', { type, rating, message })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: true })
  }
}
