// Prisma-backed database utilities with client/server compatibility
// - Server: Uses Prisma directly
// - Client: Calls REST endpoints (to be added under /app/api) and keeps a small cache for
//   synchronous reads used in client components

export interface Assessment {
  id: string
  type: string
  name: string
  clientId?: string
  questions?: AssessmentQuestion[]
  responses?: AssessmentResponse[]
  score?: number
  severity?: string
  riskFlags?: string[]
  createdAt: Date
  completedAt?: Date
  status: 'pending' | 'completed' | 'flagged'
  notes?: string
}

export interface AssessmentQuestion {
  id: number
  text: string
  options: { value: number; label: string }[]
}

export interface AssessmentResponse {
  questionId: number
  value: number
  label: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  dateOfBirth?: string
  assessments?: Assessment[]
  notes?: string
  lastContact?: Date
  riskLevel: 'low' | 'medium' | 'high'
}

// Environment helpers
const isServer = typeof window === 'undefined'

function getPrisma() {
  if (!isServer) throw new Error('Prisma can only be used on the server')
  // Lazy require to avoid bundling Prisma in the client
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const prisma = require('./prisma').default as any
  return prisma
}

// Assessment templates (unchanged)
export const assessmentTemplates = {
  'PHQ-9': {
    name: 'PHQ-9',
    fullName: 'Patient Health Questionnaire-9',
    description: 'Depression screening and severity assessment',
    timeEstimate: '5 minutes',
    category: 'Depression',
    questions: [
      {
        id: 1,
        text: 'Little interest or pleasure in doing things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 2,
        text: 'Feeling down, depressed, or hopeless',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 3,
        text: 'Trouble falling or staying asleep, or sleeping too much',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 4,
        text: 'Feeling tired or having little energy',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 5,
        text: 'Poor appetite or overeating',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 6,
        text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 7,
        text: 'Trouble concentrating on things, such as reading the newspaper or watching television',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 8,
        text: 'Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 9,
        text: 'Thoughts that you would be better off dead, or of hurting yourself in some way',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
    ],
  },
  'GAD-7': {
    name: 'GAD-7',
    fullName: 'Generalized Anxiety Disorder 7-item',
    description: 'Anxiety screening and severity assessment',
    timeEstimate: '3 minutes',
    category: 'Anxiety',
    questions: [
      {
        id: 1,
        text: 'Feeling nervous, anxious, or on edge',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 2,
        text: 'Not being able to stop or control worrying',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 3,
        text: 'Worrying too much about different things',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 4,
        text: 'Trouble relaxing',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 5,
        text: 'Being so restless that it is hard to sit still',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 6,
        text: 'Becoming easily annoyed or irritable',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
      {
        id: 7,
        text: 'Feeling afraid, as if something awful might happen',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Several days' },
          { value: 2, label: 'More than half the days' },
          { value: 3, label: 'Nearly every day' },
        ],
      },
    ],
  },
  'BDI-II': {
    name: 'BDI-II',
    fullName: 'Beck Depression Inventory-II',
    description: 'Comprehensive depression assessment measuring cognitive, affective, and somatic symptoms',
    timeEstimate: '10 minutes',
    category: 'Depression',
    questions: [
      {
        id: 1,
        text: 'Sadness: I do not feel sad.',
        options: [
          { value: 0, label: 'I do not feel sad' },
          { value: 1, label: 'I feel sad much of the time' },
          { value: 2, label: 'I am sad all the time' },
          { value: 3, label: 'I am so sad or unhappy that I can\'t stand it' },
        ],
      },
      {
        id: 2,
        text: 'Pessimism: I am not discouraged about my future.',
        options: [
          { value: 0, label: 'I am not discouraged about my future' },
          { value: 1, label: 'I feel more discouraged about my future than I used to be' },
          { value: 2, label: 'I do not expect things to work out for me' },
          { value: 3, label: 'I feel my future is hopeless and will only get worse' },
        ],
      },
      {
        id: 3,
        text: 'Past Failure: I do not feel like a failure.',
        options: [
          { value: 0, label: 'I do not feel like a failure' },
          { value: 1, label: 'I have failed more than I should have' },
          { value: 2, label: 'As I look back, I see a lot of failures' },
          { value: 3, label: 'I feel I am a total failure as a person' },
        ],
      },
      {
        id: 4,
        text: 'Loss of Pleasure: I get as much pleasure as I ever did from the things I enjoy.',
        options: [
          { value: 0, label: 'I get as much pleasure as I ever did from the things I enjoy' },
          { value: 1, label: 'I don\'t enjoy things as much as I used to' },
          { value: 2, label: 'I get very little pleasure from the things I used to enjoy' },
          { value: 3, label: 'I can\'t get any pleasure from the things I used to enjoy' },
        ],
      },
      {
        id: 5,
        text: 'Guilty Feelings: I don\'t feel particularly guilty.',
        options: [
          { value: 0, label: 'I don\'t feel particularly guilty' },
          { value: 1, label: 'I feel guilty over many things I have done or should have done' },
          { value: 2, label: 'I feel quite guilty most of the time' },
          { value: 3, label: 'I feel guilty all of the time' },
        ],
      },
      {
        id: 6,
        text: 'Punishment Feelings: I don\'t feel I am being punished.',
        options: [
          { value: 0, label: 'I don\'t feel I am being punished' },
          { value: 1, label: 'I have a sense that something bad may happen to me' },
          { value: 2, label: 'I feel I may be punished' },
          { value: 3, label: 'I expect to be punished' },
        ],
      },
      {
        id: 7,
        text: 'Self-Dislike: I feel the same about myself as ever.',
        options: [
          { value: 0, label: 'I feel the same about myself as ever' },
          { value: 1, label: 'I have lost confidence in myself' },
          { value: 2, label: 'I am disappointed in myself' },
          { value: 3, label: 'I dislike myself' },
        ],
      },
      {
        id: 8,
        text: 'Self-Criticalness: I don\'t criticize or blame myself more than usual.',
        options: [
          { value: 0, label: 'I don\'t criticize or blame myself more than usual' },
          { value: 1, label: 'I am more critical of myself than I used to be' },
          { value: 2, label: 'I criticize myself for all of my faults' },
          { value: 3, label: 'I blame myself for everything bad that happens' },
        ],
      },
      {
        id: 9,
        text: 'Suicidal Thoughts: I don\'t have any thoughts of killing myself.',
        options: [
          { value: 0, label: 'I don\'t have any thoughts of killing myself' },
          { value: 1, label: 'I have thoughts of killing myself, but I would not carry them out' },
          { value: 2, label: 'I would like to kill myself' },
          { value: 3, label: 'I would kill myself if I had the chance' },
        ],
      },
      {
        id: 10,
        text: 'Crying: I don\'t cry any more than I used to.',
        options: [
          { value: 0, label: 'I don\'t cry any more than I used to' },
          { value: 1, label: 'I cry more than I used to' },
          { value: 2, label: 'I cry over every little thing' },
          { value: 3, label: 'I feel like crying, but I can\'t' },
        ],
      },
      {
        id: 11,
        text: 'Agitation: I am no more restless or wound up than usual.',
        options: [
          { value: 0, label: 'I am no more restless or wound up than usual' },
          { value: 1, label: 'I feel more restless or wound up than usual' },
          { value: 2, label: 'I am so restless or agitated that it\'s hard to stay still' },
          { value: 3, label: 'I am so restless or agitated that I have to keep moving or doing something' },
        ],
      },
      {
        id: 12,
        text: 'Loss of Interest: I have not lost interest in other people or activities.',
        options: [
          { value: 0, label: 'I have not lost interest in other people or activities' },
          { value: 1, label: 'I am less interested in other people or things than before' },
          { value: 2, label: 'I have lost most of my interest in other people or things' },
          { value: 3, label: 'It\'s hard to get interested in anything' },
        ],
      },
      {
        id: 13,
        text: 'Indecisiveness: I make decisions about as well as ever.',
        options: [
          { value: 0, label: 'I make decisions about as well as ever' },
          { value: 1, label: 'I find it more difficult to make decisions than usual' },
          { value: 2, label: 'I have much greater difficulty in making decisions than I used to' },
          { value: 3, label: 'I have trouble making any decisions' },
        ],
      },
      {
        id: 14,
        text: 'Worthlessness: I do not feel I am worthless.',
        options: [
          { value: 0, label: 'I do not feel I am worthless' },
          { value: 1, label: 'I don\'t consider myself as worthwhile and useful as I used to' },
          { value: 2, label: 'I feel more worthless as compared to other people' },
          { value: 3, label: 'I feel utterly worthless' },
        ],
      },
      {
        id: 15,
        text: 'Loss of Energy: I have as much energy as ever.',
        options: [
          { value: 0, label: 'I have as much energy as ever' },
          { value: 1, label: 'I have less energy than I used to have' },
          { value: 2, label: 'I don\'t have enough energy to do very much' },
          { value: 3, label: 'I don\'t have enough energy to do anything' },
        ],
      },
      {
        id: 16,
        text: 'Changes in Sleeping Pattern: I sleep as well as usual.',
        options: [
          { value: 0, label: 'I sleep as well as usual' },
          { value: 1, label: 'I sleep somewhat less well than usual' },
          { value: 2, label: 'I sleep a lot less than usual' },
          { value: 3, label: 'I sleep most of the night' },
        ],
      },
      {
        id: 17,
        text: 'Irritability: I am no more irritable than usual.',
        options: [
          { value: 0, label: 'I am no more irritable than usual' },
          { value: 1, label: 'I am more irritable than usual' },
          { value: 2, label: 'I am much more irritable than usual' },
          { value: 3, label: 'I am irritable all the time' },
        ],
      },
      {
        id: 18,
        text: 'Changes in Appetite: My appetite is no different than usual.',
        options: [
          { value: 0, label: 'My appetite is no different than usual' },
          { value: 1, label: 'My appetite is somewhat less than usual' },
          { value: 2, label: 'My appetite is much less than usual' },
          { value: 3, label: 'I have no appetite at all' },
        ],
      },
      {
        id: 19,
        text: 'Concentration Difficulty: I can concentrate as well as ever.',
        options: [
          { value: 0, label: 'I can concentrate as well as ever' },
          { value: 1, label: 'I have a little trouble concentrating' },
          { value: 2, label: 'It\'s hard to concentrate on anything for very long' },
          { value: 3, label: 'I find I can\'t concentrate on anything' },
        ],
      },
      {
        id: 20,
        text: 'Tiredness or Fatigue: I am not more tired or fatigued than usual.',
        options: [
          { value: 0, label: 'I am not more tired or fatigued than usual' },
          { value: 1, label: 'I get more tired or fatigued more easily than usual' },
          { value: 2, label: 'I am too tired or fatigued to do a lot of the things I used to do' },
          { value: 3, label: 'I am too tired or fatigued to do most of the things I used to do' },
        ],
      },
      {
        id: 21,
        text: 'Loss of Interest in Sex: I have not noticed any recent change in my interest in sex.',
        options: [
          { value: 0, label: 'I have not noticed any recent change in my interest in sex' },
          { value: 1, label: 'I am less interested in sex than I used to be' },
          { value: 2, label: 'I am much less interested in sex now' },
          { value: 3, label: 'I have lost interest in sex completely' },
        ],
      },
    ],
  },
  'BAI': {
    name: 'BAI',
    fullName: 'Beck Anxiety Inventory',
    description: 'Measures the severity of anxiety symptoms',
    timeEstimate: '8 minutes',
    category: 'Anxiety',
    questions: [
      {
        id: 1,
        text: 'Numbness or tingling',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'Mildly, but it didn\'t bother me much' },
          { value: 2, label: 'Moderately - it wasn\'t pleasant at times' },
          { value: 3, label: 'Severely - it bothered me a lot' },
        ],
      },
      // ... (continuing with all BAI questions)
    ],
  },
  'PCL-5': {
    name: 'PCL-5',
    fullName: 'PTSD Checklist for DSM-5',
    description: 'Assessment for Post-Traumatic Stress Disorder symptoms',
    timeEstimate: '7 minutes',
    category: 'Trauma',
    questions: [
      {
        id: 1,
        text: 'Repeated, disturbing, and unwanted memories of the stressful experience',
        options: [
          { value: 0, label: 'Not at all' },
          { value: 1, label: 'A little bit' },
          { value: 2, label: 'Moderately' },
          { value: 3, label: 'Quite a bit' },
          { value: 4, label: 'Extremely' },
        ],
      },
      // ... (continuing with all PCL-5 questions)
    ],
  },
}

// Small client-side cache to support synchronous reads in client-only components
const clientCache: { assessments: Assessment[]; clients: Client[] } = {
  assessments: [],
  clients: [],
}

// Initialize client cache by fetching data from API
export async function initializeClientCache(): Promise<void> {
  if (isServer) return // Only run on client
  
  try {
    // Fetch assessments
    const assessmentsRes = await fetch('/api/assessments')
    if (assessmentsRes.ok) {
      const assessments = await assessmentsRes.json()
      clientCache.assessments = assessments.map((a: any) => ({
        ...a,
        createdAt: new Date(a.createdAt),
        completedAt: a.completedAt ? new Date(a.completedAt) : undefined,
      }))
    }
    
    // Fetch clients
    const clientsRes = await fetch('/api/clients')
    if (clientsRes.ok) {
      const clients = await clientsRes.json()
      clientCache.clients = clients.map((c: any) => ({
        ...c,
        lastContact: c.lastContact ? new Date(c.lastContact) : undefined,
      }))
    }
  } catch (error) {
    console.error('Failed to initialize client cache:', error)
  }
}

// Utility: score/severity/risk evaluation
function evaluateAssessment(type: string, responses: Record<number, number>) {
  const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0)
  let severity = ''
  let riskFlags: string[] = []
  let status: 'completed' | 'flagged' = 'completed'

  if (type === 'PHQ-9') {
    if (totalScore <= 4) severity = 'Minimal Depression'
    else if (totalScore <= 9) severity = 'Mild Depression'
    else if (totalScore <= 14) severity = 'Moderate Depression'
    else if (totalScore <= 19) severity = 'Moderately Severe Depression'
    else severity = 'Severe Depression'

    if (responses[9] && responses[9] >= 1) {
      riskFlags.push('Suicidal ideation')
      status = 'flagged'
    }
    if (totalScore >= 15) status = 'flagged'
  } else if (type === 'GAD-7') {
    if (totalScore <= 4) severity = 'Minimal Anxiety'
    else if (totalScore <= 9) severity = 'Mild Anxiety'
    else if (totalScore <= 14) severity = 'Moderate Anxiety'
    else severity = 'Severe Anxiety'

    if (totalScore >= 15) {
      riskFlags.push('Severe anxiety symptoms')
      status = 'flagged'
    }
  } else if (type === 'BDI-II') {
    if (totalScore <= 13) severity = 'Minimal Depression'
    else if (totalScore <= 19) severity = 'Mild Depression'
    else if (totalScore <= 28) severity = 'Moderate Depression'
    else severity = 'Severe Depression'

    if (responses[9] && responses[9] >= 1) {
      riskFlags.push('Suicidal ideation')
      status = 'flagged'
    }
    if (totalScore >= 29) status = 'flagged'
  } else if (type === 'BAI') {
    if (totalScore <= 7) severity = 'Minimal Anxiety'
    else if (totalScore <= 15) severity = 'Mild Anxiety'
    else if (totalScore <= 25) severity = 'Moderate Anxiety'
    else severity = 'Severe Anxiety'

    if (totalScore >= 26) {
      riskFlags.push('Severe anxiety symptoms')
      status = 'flagged'
    }
  } else if (type === 'PCL-5') {
    if (totalScore <= 32) severity = 'Below PTSD Threshold'
    else severity = 'Probable PTSD'

    if (totalScore >= 33) {
      riskFlags.push('Probable PTSD')
      status = 'flagged'
    }
  }

  return { totalScore, severity, riskFlags, status }
}

// Create assessment
export async function createAssessment(data: {
  type: string
  clientId?: string
  notes?: string
}): Promise<Assessment> {
  const template = assessmentTemplates[data.type as keyof typeof assessmentTemplates]
  if (!template) throw new Error(`Assessment type ${data.type} not found`)

  if (isServer) {
    const prisma = getPrisma()
    // Ensure client exists if provided (use provided id as primary key)
    if (data.clientId) {
      await prisma.client.upsert({
        where: { id: data.clientId },
        update: { lastContact: new Date() },
        create: {
          id: data.clientId,
          name: `Client ${data.clientId}`,
          email: `${String(data.clientId).toLowerCase()}@example.com`,
          lastContact: new Date(),
        },
      })
    }

    const created = await prisma.assessment.create({
      data: {
        type: data.type,
        name: template.name,
        clientId: data.clientId ?? null,
        status: 'pending',
        notes: data.notes ?? null,
      },
    })

    const result: Assessment = {
      id: created.id,
      type: created.type,
      name: created.name,
      clientId: created.clientId ?? undefined,
      createdAt: created.createdAt,
      status: created.status as Assessment['status'],
      notes: created.notes ?? undefined,
    }
    return result
  }

  // Client: call API and update cache
  const res = await fetch('/api/assessments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create assessment')
  const created = (await res.json()) as Assessment
  
  // Ensure dates are properly converted to Date objects
  const normalizedAssessment = {
    ...created,
    createdAt: new Date(created.createdAt),
    completedAt: created.completedAt ? new Date(created.completedAt) : undefined,
  }
  
  clientCache.assessments.unshift(normalizedAssessment)
  return normalizedAssessment
}

// Get single assessment
export async function getAssessment(id: string): Promise<Assessment | null> {
  if (isServer) {
    const prisma = getPrisma()
    const a = await prisma.assessment.findUnique({ where: { id } })
    if (!a) return null
    return {
      id: a.id,
      type: a.type,
      name: a.name,
      clientId: a.clientId ?? undefined,
      createdAt: a.createdAt,
      completedAt: a.completedAt ?? undefined,
      score: a.score ?? undefined,
      severity: a.severity ?? undefined,
      riskFlags: (a.riskFlags as string[] | null) ?? undefined,
      responses: (a.responses as AssessmentResponse[] | null) ?? undefined,
      status: (a.status as Assessment['status']) ?? 'pending',
      notes: a.notes ?? undefined,
    }
  }

  const res = await fetch(`/api/assessments/${encodeURIComponent(id)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to load assessment')
  const a = (await res.json()) as Assessment
  
  // Ensure dates are properly converted to Date objects
  return {
    ...a,
    createdAt: new Date(a.createdAt),
    completedAt: a.completedAt ? new Date(a.completedAt) : undefined,
  }
}

// Get all assessments (server should prefer explicit queries; this is sync for client-only use)
export function getAllAssessments(): Assessment[] {
  // Client: read from cache
  if (!isServer) {
    return [...clientCache.assessments].sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
  }
  // Server: advise using an explicit async query or API route
  return []
}

// Complete an assessment
export async function completeAssessment(id: string, responses: Record<number, number>): Promise<Assessment> {
  const prisma = isServer ? getPrisma() : null

  // Find assessment to get type/template
  let assessment: Assessment | null = null
  if (isServer) {
    const a = await prisma!.assessment.findUnique({ where: { id } })
    if (!a) throw new Error('Assessment not found')
    assessment = {
      id: a.id,
      type: a.type,
      name: a.name,
      clientId: a.clientId ?? undefined,
      createdAt: a.createdAt,
      status: a.status as Assessment['status'],
      notes: a.notes ?? undefined,
    }
  } else {
    assessment = await getAssessment(id)
  }
  if (!assessment) throw new Error('Assessment not found')

  const template = assessmentTemplates[assessment.type as keyof typeof assessmentTemplates]
  if (!template) throw new Error('Assessment template not found')

  // Build responses array with labels
  const assessmentResponses: AssessmentResponse[] = Object.entries(responses).map(([questionId, value]) => {
    const q = template.questions.find(q => q.id === Number(questionId))
    const option = q?.options.find(o => o.value === value)
    return { questionId: Number(questionId), value, label: option?.label || 'Unknown' }
  })

  const { totalScore, severity, riskFlags, status } = evaluateAssessment(assessment.type, responses)

  if (isServer) {
    const updated = await prisma!.assessment.update({
      where: { id },
      data: {
        responses: assessmentResponses as any,
        score: totalScore,
        severity,
        riskFlags: riskFlags as any,
        completedAt: new Date(),
        status,
      },
    })

    // Update or create client
    if (updated.clientId) {
      await prisma!.client.upsert({
        where: { id: updated.clientId },
        update: {
          lastContact: new Date(),
          riskLevel: status === 'flagged' ? 'high' : undefined,
        },
        create: {
          id: updated.clientId,
          name: `Client ${updated.clientId}`,
          email: `${String(updated.clientId).toLowerCase()}@example.com`,
          lastContact: new Date(),
          riskLevel: status === 'flagged' ? 'high' : 'low',
        },
      })
    }

    return {
      id: updated.id,
      type: updated.type,
      name: updated.name,
      clientId: updated.clientId ?? undefined,
      createdAt: updated.createdAt,
      completedAt: updated.completedAt ?? undefined,
      score: updated.score ?? undefined,
      severity: updated.severity ?? undefined,
      riskFlags: (updated.riskFlags as string[] | null) ?? undefined,
      responses: (updated.responses as AssessmentResponse[] | null) ?? undefined,
      status: (updated.status as Assessment['status']) ?? 'completed',
      notes: updated.notes ?? undefined,
    }
  }

  // Client: call API and update cache
  const res = await fetch(`/api/assessments/${encodeURIComponent(id)}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responses }),
  })
  if (!res.ok) throw new Error('Failed to complete assessment')
  const updated = (await res.json()) as Assessment
  
  // Ensure dates are properly converted to Date objects
  const normalizedAssessment = {
    ...updated,
    createdAt: new Date(updated.createdAt),
    completedAt: updated.completedAt ? new Date(updated.completedAt) : undefined,
  }
  
  const idx = clientCache.assessments.findIndex(a => a.id === id)
  if (idx >= 0) clientCache.assessments[idx] = normalizedAssessment
  else clientCache.assessments.unshift(normalizedAssessment)

  if (normalizedAssessment.clientId) {
    let client = clientCache.clients.find(c => c.id === normalizedAssessment.clientId)
    if (!client) {
      client = {
        id: normalizedAssessment.clientId,
        name: `Client ${normalizedAssessment.clientId}`,
        email: `${String(normalizedAssessment.clientId).toLowerCase()}@example.com`,
        riskLevel: 'low',
        lastContact: new Date(),
        assessments: [],
      }
      clientCache.clients.push(client)
    }
    if (normalizedAssessment.status === 'flagged') client.riskLevel = 'high'
    client.assessments = client.assessments || []
    client.assessments.push(normalizedAssessment)
    client.lastContact = new Date()
  }

  return normalizedAssessment
}

// Clients - client-only sync helpers
export function getAllClients(): Client[] {
  if (!isServer) {
    return [...clientCache.clients].sort((a, b) => {
      const dateA = a.lastContact ? (a.lastContact instanceof Date ? a.lastContact : new Date(a.lastContact)) : new Date(0)
      const dateB = b.lastContact ? (b.lastContact instanceof Date ? b.lastContact : new Date(b.lastContact)) : new Date(0)
      return dateB.getTime() - dateA.getTime()
    })
  }
  return []
}

export function getClient(id: string): Client | null {
  if (!isServer) return clientCache.clients.find(c => c.id === id) || null
  return null
}

export function getHighRiskClients(): Client[] {
  if (!isServer) return clientCache.clients.filter(c => c.riskLevel === 'high')
  return []
}

export function getRecentAssessments(limit: number = 10): Assessment[] {
  if (!isServer) {
    return clientCache.assessments
      .filter(a => a.status === 'completed' || a.status === 'flagged')
      .sort((a, b) => {
        const dateA = a.completedAt ? (a.completedAt instanceof Date ? a.completedAt : new Date(a.completedAt)) : new Date(0)
        const dateB = b.completedAt ? (b.completedAt instanceof Date ? b.completedAt : new Date(b.completedAt)) : new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
      .slice(0, limit)
  }
  // Server callers should implement their own async fetch or API call; return empty to avoid breaking sync signature
  return []
}

export function getAssessmentStats() {
  if (!isServer) {
    const completed = clientCache.assessments.filter(a => a.status === 'completed' || a.status === 'flagged').length
    const flagged = clientCache.assessments.filter(a => a.status === 'flagged').length
    const completionRate = clientCache.assessments.length > 0 ? Math.round((completed / clientCache.assessments.length) * 100) : 0
    return {
      totalAssessments: completed,
      activeClients: clientCache.clients.length,
      riskFlags: flagged,
      completionRate,
    }
  }
  return { totalAssessments: 0, activeClients: 0, riskFlags: 0, completionRate: 0 }
}
