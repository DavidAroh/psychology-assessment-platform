import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { assessmentTemplates } from '@/lib/database'

// Handle POST /api/assessments → create new assessment
export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Normalize inputs
    const clientId: string | null = (typeof body.clientId === 'string' ? body.clientId.trim() : body.clientId) || null

    // Get the template to get the proper name
    const template = assessmentTemplates[body.type as keyof typeof assessmentTemplates]
    if (!template) {
      return NextResponse.json({ error: `Assessment type ${body.type} not found` }, { status: 400 })
    }

    // Ensure client exists if provided (use provided id as primary key)
    if (clientId) {
      await prisma.client.upsert({
        where: { id: clientId },
        update: { lastContact: new Date() },
        create: {
          id: clientId,
          name: `Client ${clientId}`,
          email: `${String(clientId).toLowerCase()}@example.com`,
          lastContact: new Date(),
        },
      })
    }

    const created = await prisma.assessment.create({
      data: {
        type: body.type,
        name: template.name,
        clientId,
        status: 'pending',
        notes: (typeof body.notes === 'string' ? body.notes.trim() : body.notes) || null,
      },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    // Improve logging and error surface for debugging while keeping generic response
    console.error('Error creating assessment:', error)
    const message = (error as any)?.code ? `Failed to create assessment (${(error as any).code})` : 'Failed to create assessment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Handle GET /api/assessments → list all assessments
export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(assessments)
  } catch (error) {
    console.error('Error fetching assessments:', error)
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 })
  }
}
