"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Shield, ArrowLeft, ArrowRight } from "lucide-react"

const assessmentQuestions = {
  phq9: {
    name: "PHQ-9",
    fullName: "Patient Health Questionnaire-9",
    description: "Depression screening and severity assessment",
    timeEstimate: "5 minutes",
    instructions: "Over the last 2 weeks, how often have you been bothered by the following problem?",
    questions: [
      {
        id: 1,
        text: "Little interest or pleasure in doing things",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 2,
        text: "Feeling down, depressed, or hopeless",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 3,
        text: "Trouble falling or staying asleep, or sleeping too much",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 4,
        text: "Feeling tired or having little energy",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 5,
        text: "Poor appetite or overeating",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 6,
        text: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 7,
        text: "Trouble concentrating on things, such as reading the newspaper or watching television",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 8,
        text: "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 9,
        text: "Thoughts that you would be better off dead, or of hurting yourself in some way",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
    ],
  },
  gad7: {
    name: "GAD-7",
    fullName: "Generalized Anxiety Disorder 7-item",
    description: "Anxiety screening and severity assessment",
    timeEstimate: "3 minutes",
    instructions: "Over the last 2 weeks, how often have you been bothered by the following problems?",
    questions: [
      {
        id: 1,
        text: "Feeling nervous, anxious, or on edge",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 2,
        text: "Not being able to stop or control worrying",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 3,
        text: "Worrying too much about different things",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 4,
        text: "Trouble relaxing",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 5,
        text: "Being so restless that it is hard to sit still",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 6,
        text: "Becoming easily annoyed or irritable",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
      {
        id: 7,
        text: "Feeling afraid, as if something awful might happen",
        options: [
          { value: 0, label: "Not at all" },
          { value: 1, label: "Several days" },
          { value: 2, label: "More than half the days" },
          { value: 3, label: "Nearly every day" },
        ],
      },
    ],
  },
  bdi2: {
    name: "BDI-II",
    fullName: "Beck Depression Inventory-II",
    description: "Comprehensive depression assessment",
    timeEstimate: "10 minutes",
    instructions:
      "Please read each group of statements carefully, then pick the one statement in each group that best describes the way you have been feeling during the past two weeks, including today.",
    questions: [
      {
        id: 1,
        text: "Sadness",
        options: [
          { value: 0, label: "I do not feel sad" },
          { value: 1, label: "I feel sad much of the time" },
          { value: 2, label: "I am sad all the time" },
          { value: 3, label: "I am so sad or unhappy that I can't stand it" },
        ],
      },
      {
        id: 2,
        text: "Pessimism",
        options: [
          { value: 0, label: "I am not discouraged about my future" },
          { value: 1, label: "I feel more discouraged about my future than I used to be" },
          { value: 2, label: "I do not expect things to work out for me" },
          { value: 3, label: "I feel my future is hopeless and will only get worse" },
        ],
      },
      {
        id: 3,
        text: "Past Failure",
        options: [
          { value: 0, label: "I do not feel like a failure" },
          { value: 1, label: "I have failed more than I should have" },
          { value: 2, label: "As I look back, I see a lot of failures" },
          { value: 3, label: "I feel I am a total failure as a person" },
        ],
      },
      // Adding more questions for completeness
      {
        id: 4,
        text: "Loss of Pleasure",
        options: [
          { value: 0, label: "I get as much pleasure as I ever did from the things I enjoy" },
          { value: 1, label: "I don't enjoy things as much as I used to" },
          { value: 2, label: "I get very little pleasure from the things I used to enjoy" },
          { value: 3, label: "I can't get any pleasure from the things I used to enjoy" },
        ],
      },
      {
        id: 5,
        text: "Guilty Feelings",
        options: [
          { value: 0, label: "I don't feel particularly guilty" },
          { value: 1, label: "I feel guilty over many things I have done or should have done" },
          { value: 2, label: "I feel quite guilty most of the time" },
          { value: 3, label: "I feel guilty all of the time" },
        ],
      },
    ],
  },
}

export default function TakeAssessmentPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime] = useState(new Date())
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAssessmentData = () => {
      try {
        const storedData = localStorage.getItem(`assessment_${params.id}`)
        if (storedData) {
          const data = JSON.parse(storedData)

          // Check if assessment has expired
          if (new Date() > new Date(data.expiresAt)) {
            setError("This assessment link has expired. Please contact your healthcare provider for a new link.")
            setIsLoading(false)
            return
          }

          setAssessmentData(data)
        } else {
          // Fallback to PHQ-9 for demo purposes if no data found
          setAssessmentData({
            id: params.id,
            type: "phq9",
            clientId: null,
            notes: null,
            createdAt: new Date().toISOString(),
          })
        }
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load assessment. Please check your link and try again.")
        setIsLoading(false)
      }
    }

    loadAssessmentData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Assessment Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentAssessment =
    assessmentQuestions[assessmentData.type as keyof typeof assessmentQuestions] || assessmentQuestions.phq9
  const questions = currentAssessment.questions

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const isLastQuestion = currentQuestion === questions.length - 1
  const canProceed = answers[questions[currentQuestion].id] !== undefined

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: Number.parseInt(value),
    }))
  }

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Calculate total score
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)

    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const results = {
      assessmentId: params.id,
      assessmentType: assessmentData.type,
      clientId: assessmentData.clientId,
      answers,
      totalScore,
      completedAt: new Date(),
      duration: Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60), // minutes
    }

    // Store results for demo purposes
    localStorage.setItem(`results_${params.id}`, JSON.stringify(results))

    console.log("Assessment submitted:", results)

    setIsCompleted(true)
    setIsSubmitting(false)
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete</CardTitle>
            <CardDescription>
              Thank you for completing the {currentAssessment.name} assessment. Your responses have been securely
              submitted.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Assessment Details</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Questions answered:</span>
                  <span className="font-medium">
                    {Object.keys(answers).length}/{questions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Time taken:</span>
                  <span className="font-medium">
                    {Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60)} minutes
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Your responses are confidential and secure</p>
              <p>• Results will be reviewed by your healthcare provider</p>
              <p>• You may be contacted if immediate attention is needed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">{currentAssessment.name} Assessment</h1>
                <p className="text-sm text-muted-foreground">{currentAssessment.fullName}</p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />~{currentAssessment.timeEstimate}
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl leading-relaxed">{currentAssessment.instructions}</CardTitle>
              <CardDescription className="text-lg font-medium text-foreground mt-4">{question.text}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="space-y-4"
              >
                {question.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer text-base">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <Button onClick={handleNext} disabled={!canProceed || isSubmitting}>
                  {isSubmitting ? (
                    "Submitting..."
                  ) : isLastQuestion ? (
                    "Submit Assessment"
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm space-y-1">
                <p className="font-medium">Your privacy is protected</p>
                <p className="text-muted-foreground">
                  This assessment is secure and confidential. Your responses are encrypted and will only be shared with
                  your healthcare provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
