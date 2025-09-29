import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { assessmentTemplates } from '@/lib/database'

// POST /api/assessments/[id]/complete → submit responses and compute results
export async function POST(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const responses: Record<number, number> = body?.responses || {}

    // Load assessment
    const a = await prisma.assessment.findUnique({ where: { id } })
    if (!a) return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })

    const template = assessmentTemplates[a.type as keyof typeof assessmentTemplates]
    if (!template) return NextResponse.json({ error: 'Template not found' }, { status: 400 })

    // Build labeled responses
    const labeledResponses = Object.entries(responses).map(([qid, value]) => {
      const q = template.questions.find(q => q.id === Number(qid))
      const opt = q?.options.find(o => o.value === value)
      return { questionId: Number(qid), value, label: opt?.label || 'Unknown' }
    }) as any

    // Evaluate score / severity / flags
    const totalScore = Object.values(responses).reduce((sum, v) => sum + (Number(v) || 0), 0)
    let severity = ''
    let riskFlags: string[] = []
    let status: 'completed' | 'flagged' = 'completed'

    if (a.type === 'PHQ-9') {
      if (totalScore <= 4) severity = 'Minimal Depression'
      else if (totalScore <= 9) severity = 'Mild Depression'
      else if (totalScore <= 14) severity = 'Moderate Depression'
      else if (totalScore <= 19) severity = 'Moderately Severe Depression'
      else severity = 'Severe Depression'

      if (responses[9] && responses[9] >= 1) { riskFlags.push('Suicidal ideation'); status = 'flagged' }
      if (totalScore >= 15) status = 'flagged'
    } else if (a.type === 'GAD-7') {
      if (totalScore <= 4) severity = 'Minimal Anxiety'
      else if (totalScore <= 9) severity = 'Mild Anxiety'
      else if (totalScore <= 14) severity = 'Moderate Anxiety'
      else severity = 'Severe Anxiety'

      if (totalScore >= 15) { riskFlags.push('Severe anxiety symptoms'); status = 'flagged' }
    } else if (a.type === 'BDI-II') {
      if (totalScore <= 13) severity = 'Minimal Depression'
      else if (totalScore <= 19) severity = 'Mild Depression'
      else if (totalScore <= 28) severity = 'Moderate Depression'
      else severity = 'Severe Depression'

      if (responses[9] && responses[9] >= 1) { riskFlags.push('Suicidal ideation'); status = 'flagged' }
      if (totalScore >= 29) status = 'flagged'
    } else if (a.type === 'BAI') {
      if (totalScore <= 7) severity = 'Minimal Anxiety'
      else if (totalScore <= 15) severity = 'Mild Anxiety'
      else if (totalScore <= 25) severity = 'Moderate Anxiety'
      else severity = 'Severe Anxiety'

      if (totalScore >= 26) { riskFlags.push('Severe anxiety symptoms'); status = 'flagged' }
    } else if (a.type === 'PCL-5') {
      if (totalScore <= 32) severity = 'Below PTSD Threshold'
      else severity = 'Probable PTSD'

      if (totalScore >= 33) { riskFlags.push('Probable PTSD'); status = 'flagged' }
    }

    const updated = await prisma.assessment.update({
      where: { id },
      data: {
        responses: labeledResponses,
        score: totalScore,
        severity,
        riskFlags,
        completedAt: new Date(),
        status,
      },
    })

    // Upsert client risk/contact state if linked
    if (updated.clientId) {
      await prisma.client.upsert({
        where: { id: updated.clientId },
        update: { lastContact: new Date(), riskLevel: status === 'flagged' ? 'high' : undefined },
        create: {
          id: updated.clientId,
          name: `Client ${updated.clientId}`,
          email: `${String(updated.clientId).toLowerCase()}@example.com`,
          lastContact: new Date(),
          riskLevel: status === 'flagged' ? 'high' : 'low',
        },
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error completing assessment:', error)
    return NextResponse.json({ error: 'Failed to complete assessment' }, { status: 500 })
  }
}
