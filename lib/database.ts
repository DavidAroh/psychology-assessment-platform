// Simple in-memory database for demo purposes
// In production, you'd use a real database like PostgreSQL with Prisma

export interface Assessment {
  id: string
  shareToken: string
  type: string
  name: string
  clientId?: string
  questions: AssessmentQuestion[]
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
  assessments: Assessment[]
  notes?: string
  lastContact?: Date
  riskLevel: 'low' | 'medium' | 'high'
}

// In-memory storage
let assessments: Assessment[] = []
let clients: Client[] = []
let assessmentCounter = 1
let clientCounter = 1

// Assessment templates
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
}

// Database functions
export function createAssessment(data: {
  type: string
  clientId?: string
  notes?: string
}): Promise<Assessment> {
  const template = assessmentTemplates[data.type as keyof typeof assessmentTemplates]
  if (!template) {
    throw new Error(`Assessment type ${data.type} not found`)
  }

  // Generate a unique share token
  const shareToken = `ast_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

  const assessment: Assessment = {
    id: `A-${Date.now()}-${assessmentCounter++}`,
    shareToken,
    type: data.type,
    name: template.name,
    clientId: data.clientId,
    questions: template.questions,
    createdAt: new Date(),
    status: 'pending',
    notes: data.notes,
  }

  assessments.push(assessment)
  return Promise.resolve(assessment)
}

export function getAssessmentByToken(token: string): Promise<Assessment | null> {
  const assessment = assessments.find(a => a.shareToken === token)
  return Promise.resolve(assessment || null)
}

export function getAssessment(id: string): Assessment | null {
  return assessments.find(a => a.id === id) || null
}

export function getAllAssessments(): Assessment[] {
  return [...assessments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function completeAssessment(idOrToken: string, responses: Record<number, number>): Promise<Assessment> {
  let assessment = assessments.find(a => a.id === idOrToken)
  if (!assessment) {
    assessment = assessments.find(a => a.shareToken === idOrToken)
  }
  
  if (!assessment) {
    throw new Error('Assessment not found')
  }

  // Convert responses to proper format
  const assessmentResponses: AssessmentResponse[] = Object.entries(responses).map(([questionId, value]) => {
    const question = assessment.questions.find(q => q.id === parseInt(questionId))
    const option = question?.options.find(o => o.value === value)
    return {
      questionId: parseInt(questionId),
      value,
      label: option?.label || 'Unknown',
    }
  })

  // Calculate score
  const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0)
  
  // Determine severity and risk flags based on assessment type
  let severity = ''
  let riskFlags: string[] = []
  let status: 'completed' | 'flagged' = 'completed'

  if (assessment.type === 'PHQ-9') {
    if (totalScore <= 4) severity = 'Minimal Depression'
    else if (totalScore <= 9) severity = 'Mild Depression'
    else if (totalScore <= 14) severity = 'Moderate Depression'
    else if (totalScore <= 19) severity = 'Moderately Severe Depression'
    else severity = 'Severe Depression'

    // Check for suicidal ideation (question 9)
    if (responses[9] && responses[9] >= 1) {
      riskFlags.push('Suicidal ideation')
      status = 'flagged'
    }
    if (totalScore >= 15) {
      status = 'flagged'
    }
  } else if (assessment.type === 'GAD-7') {
    if (totalScore <= 4) severity = 'Minimal Anxiety'
    else if (totalScore <= 9) severity = 'Mild Anxiety'
    else if (totalScore <= 14) severity = 'Moderate Anxiety'
    else severity = 'Severe Anxiety'

    if (totalScore >= 15) {
      riskFlags.push('Severe anxiety symptoms')
      status = 'flagged'
    }
  }

  // Update assessment
  assessment.responses = assessmentResponses
  assessment.score = totalScore
  assessment.severity = severity
  assessment.riskFlags = riskFlags
  assessment.completedAt = new Date()
  assessment.status = status

  // Update or create client
  if (assessment.clientId) {
    let client = clients.find(c => c.id === assessment.clientId)
    if (!client) {
      client = {
        id: assessment.clientId,
        name: `Client ${assessment.clientId}`,
        email: `${assessment.clientId.toLowerCase()}@example.com`,
        assessments: [],
        riskLevel: 'low',
        lastContact: new Date(),
      }
      clients.push(client)
    }
    
    // Update client risk level
    if (status === 'flagged') {
      client.riskLevel = 'high'
    } else if (client.riskLevel === 'low' && totalScore > 10) {
      client.riskLevel = 'medium'
    }
    
    client.assessments.push(assessment)
    client.lastContact = new Date()
  }

  return Promise.resolve(assessment)
}

export function getAllClients(): Client[] {
  return [...clients].sort((a, b) => (b.lastContact?.getTime() || 0) - (a.lastContact?.getTime() || 0))
}

export function getClient(id: string): Client | null {
  return clients.find(c => c.id === id) || null
}

export function getHighRiskClients(): Client[] {
  return clients.filter(c => c.riskLevel === 'high')
}

export function getRecentAssessments(limit: number = 10): Assessment[] {
  return assessments
    .filter(a => a.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
    .slice(0, limit)
}

export function getAssessmentStats() {
  const total = assessments.filter(a => a.status === 'completed').length
  const flagged = assessments.filter(a => a.status === 'flagged').length
  const completionRate = assessments.length > 0 ? Math.round((total / assessments.length) * 100) : 0
  
  return {
    totalAssessments: total,
    activeClients: clients.length,
    riskFlags: flagged,
    completionRate,
  }
}