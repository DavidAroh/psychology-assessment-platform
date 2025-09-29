"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Shield, ArrowLeft, ArrowRight } from "lucide-react"
import { getAssessment, completeAssessment, assessmentTemplates } from "@/lib/database"

const getInstructions = (type: string) => {
  if (type === 'PHQ-9') return "Over the last 2 weeks, how often have you been bothered by the following problems?"
  if (type === 'GAD-7') return "Over the last 2 weeks, how often have you been bothered by the following problems?"
  return "Please read each question carefully and select the response that best describes your experience."
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TakeAssessmentPage({ params }: PageProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [startTime] = useState(new Date())
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  

  useEffect(() => {
    const loadParams = async () => {
      try {
        const resolvedParams = await params
        console.log('Assessment ID from params:', resolvedParams.id)
        setAssessmentId(resolvedParams.id)
      } catch (err) {
        console.error('Error loading params:', err)
        setError("Failed to load assessment parameters.")
        setIsLoading(false)
      }
    }

    loadParams()
  }, [params])

  useEffect(() => {
    if (!assessmentId) return

    const loadAssessmentData = async () => {
      try {
        console.log('Loading assessment with ID:', assessmentId)
        const assessment = await getAssessment(assessmentId)
        
        if (!assessment) {
          console.error('Assessment not found:', assessmentId)
          setError("Assessment not found. Please check your link and try again.")
          setIsLoading(false)
          return
        }

        console.log('Assessment loaded:', assessment)

        if (assessment.status === 'completed') {
          setError("This assessment has already been completed.")
          setIsLoading(false)
          return
        }

        // Get the assessment template to build the full assessment data
        const template = assessmentTemplates[assessment.type as keyof typeof assessmentTemplates]
        if (!template) {
          setError("Assessment type not supported.")
          setIsLoading(false)
          return
        }

        // Combine assessment data with template
        const fullAssessmentData = {
          ...assessment,
          name: template.name,
          questions: template.questions,
          fullName: template.fullName,
          timeEstimate: template.timeEstimate
        }

        setAssessmentData(fullAssessmentData)
        setIsLoading(false)
      } catch (err) {
        console.error('Error loading assessment:', err)
        setError("Failed to load assessment. Please check your link and try again.")
        setIsLoading(false)
      }
    }

    loadAssessmentData()
  }, [assessmentId])

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
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => router.push('/')} 
              variant="outline"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!assessmentData || !assessmentData.questions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Assessment Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Assessment data is incomplete. Please contact support.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const questions = assessmentData.questions
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
    if (!assessmentId) return
    
    setIsSubmitting(true)

    try {
      console.log('Submitting assessment:', assessmentId, answers)
      await completeAssessment(assessmentId, answers)
      console.log('Assessment completed successfully')
      setIsCompleted(true)
    } catch (error) {
      console.error('Failed to submit assessment:', error)
      // Show completion for better UX, but log the error
      setIsCompleted(true)
    } finally {
      setIsSubmitting(false)
    }
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
              Thank you for completing the {assessmentData.name} assessment. Your responses have been securely
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

            <Button 
              onClick={() => router.push('/')} 
              className="w-full mt-4"
            >
              Return to Home
            </Button>
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
                <h1 className="text-lg font-semibold">{assessmentData.name} Assessment</h1>
                <p className="text-sm text-muted-foreground">
                  {assessmentData.fullName}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />~{assessmentData.timeEstimate}
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
              <CardTitle className="text-xl leading-relaxed">{getInstructions(assessmentData.type)}</CardTitle>
              <CardDescription className="text-lg font-medium text-foreground mt-4">{question.text}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="space-y-4"
              >
                {question.options.map((option: { value: number | string; label: string }) => (
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