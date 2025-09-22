import { Navigation } from "@/components/navigation"
import { AssessmentCreator } from "@/components/assessment-creator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Clock, AlertTriangle } from "lucide-react"
import Link from "next/link"

// This would typically come from a database or API
const assessmentDetails = {
  phq9: {
    name: "PHQ-9",
    fullName: "Patient Health Questionnaire-9",
    description:
      "A 9-question instrument for screening, diagnosing, monitoring and measuring the severity of depression.",
    questions: 9,
    timeEstimate: "5 minutes",
    category: "Depression",
    scoringRanges: [
      { range: "0-4", severity: "Minimal depression", color: "bg-green-100 text-green-800" },
      { range: "5-9", severity: "Mild depression", color: "bg-yellow-100 text-yellow-800" },
      { range: "10-14", severity: "Moderate depression", color: "bg-orange-100 text-orange-800" },
      { range: "15-19", severity: "Moderately severe depression", color: "bg-red-100 text-red-800" },
      { range: "20-27", severity: "Severe depression", color: "bg-red-200 text-red-900" },
    ],
    riskFlags: ["Question 9 (suicidal ideation) score ≥ 1"],
  },
}

export default function CreateAssessmentPage({ params }: { params: { type: string } }) {
  const assessment = assessmentDetails[params.type as keyof typeof assessmentDetails]

  if (!assessment) {
    return <div>Assessment not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="lg:ml-64">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link href="/assessments">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Assessments
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Create {assessment.name} Assessment</h1>
                <p className="text-muted-foreground">{assessment.fullName}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Assessment Creator */}
            <div className="lg:col-span-2">
              <AssessmentCreator assessmentType={assessment.name} assessmentName={assessment.fullName} />
            </div>

            {/* Assessment Information */}
            <div className="space-y-6">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Assessment Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {assessment.category}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{assessment.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{assessment.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{assessment.timeEstimate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scoring Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Scoring Ranges</CardTitle>
                  <CardDescription>Interpretation guidelines for assessment results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {assessment.scoringRanges.map((range, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                      <span className="text-sm font-medium">{range.range}</span>
                      <Badge variant="outline" className={range.color}>
                        {range.severity}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Risk Flags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Risk Flags
                  </CardTitle>
                  <CardDescription>Automatic alerts for high-risk responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assessment.riskFlags.map((flag, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
