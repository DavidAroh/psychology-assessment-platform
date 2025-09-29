import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/assessments/[id] → return a single assessment or 404
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const a = await prisma.assessment.findUnique({ where: { id } })
    if (!a) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(a)
  } catch (error) {
    console.error('Error fetching assessment:', error)
    return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 })
  }
}
