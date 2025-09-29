"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SurveyResponsesModalProps {
  isOpen: boolean
  onClose: () => void
  assessment: any
  clientName: string
}

// Mock survey responses data - in a real app, this would come from an API
const getSurveyResponses = (assessmentType: string) => {
  const responses = {
    "PHQ-9": {
      questions: [
        {
          question: "Little interest or pleasure in doing things",
          response: "More than half the days",
          score: 2,
        },
        {
          question: "Feeling down, depressed, or hopeless",
          response: "Nearly every day",
          score: 3,
        },
        {
          question: "Trouble falling or staying asleep, or sleeping too much",
          response: "Nearly every day",
          score: 3,
        },
        {
          question: "Feeling tired or having little energy",
          response: "More than half the days",
          score: 2,
        },
        {
          question: "Poor appetite or overeating",
          response: "Several days",
          score: 1,
        },
        {
          question: "Feeling bad about yourself or that you are a failure",
          response: "Nearly every day",
          score: 3,
        },
        {
          question: "Trouble concentrating on things",
          response: "More than half the days",
          score: 2,
        },
        {
          question: "Moving or speaking slowly or being fidgety/restless",
          response: "Several days",
          score: 1,
        },
        {
          question: "Thoughts that you would be better off dead or hurting yourself",
          response: "More than half the days",
          score: 2,
        },
      ],
      totalScore: 19,
      maxScore: 27,
    },
    "GAD-7": {
      questions: [
        {
          question: "Feeling nervous, anxious, or on edge",
          response: "More than half the days",
          score: 2,
        },
        {
          question: "Not being able to stop or control worrying",
          response: "Nearly every day",
          score: 3,
        },
        {
          question: "Worrying too much about different things",
          response: "More than half the days",
          score: 2,
        },
        {
          question: "Trouble relaxing",
          response: "Several days",
          score: 1,
        },
        {
          question: "Being so restless that it's hard to sit still",
          response: "More than half the days",
          score: 2,
        },
        {
          question: "Becoming easily annoyed or irritable",
          response: "Several days",
          score: 1,
        },
        {
          question: "Feeling afraid as if something awful might happen",
          response: "Several days",
          score: 1,
        },
      ],
      totalScore: 12,
      maxScore: 21,
    },
    "BDI-II": {
      questions: [
        {
          question: "Sadness",
          response: "I feel sad much of the time",
          score: 2,
        },
        {
          question: "Pessimism",
          response: "I feel more discouraged about my future than I used to be",
          score: 1,
        },
        {
          question: "Past Failure",
          response: "I have failed more than I should have",
          score: 2,
        },
        {
          question: "Loss of Pleasure",
          response: "I get as much pleasure as I ever did from the things I enjoy",
          score: 0,
        },
        {
          question: "Guilty Feelings",
          response: "I feel quite guilty most of the time",
          score: 2,
        },
        {
          question: "Punishment Feelings",
          response: "I don't feel I am being punished",
          score: 0,
        },
        {
          question: "Self-Dislike",
          response: "I am disappointed in myself",
          score: 1,
        },
        {
          question: "Self-Criticalness",
          response: "I am more critical of myself than I used to be",
          score: 1,
        },
        {
          question: "Suicidal Thoughts or Wishes",
          response: "I have thoughts of killing myself, but I would not carry them out",
          score: 1,
        },
        {
          question: "Crying",
          response: "I cry more than I used to",
          score: 1,
        },
      ],
      totalScore: 11,
      maxScore: 63,
    },
  }

  return responses[assessmentType as keyof typeof responses] || null
}

const getScoreColor = (score: number) => {
  if (score === 0) return "text-green-600"
  if (score === 1) return "text-yellow-600"
  if (score === 2) return "text-orange-600"
  return "text-red-600"
}

export function SurveyResponsesModal({ isOpen, onClose, assessment, clientName }: SurveyResponsesModalProps) {
  if (!assessment) return null

  const surveyData = getSurveyResponses(assessment.type)

  if (!surveyData) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Survey Responses - {assessment.type}</DialogTitle>
          <DialogDescription>
            Detailed responses from {clientName} completed on {assessment.date}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Assessment Summary */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h3 className="font-semibold">Assessment Summary</h3>
              <p className="text-sm text-muted-foreground">
                Total Score: {surveyData.totalScore} / {surveyData.maxScore}
              </p>
            </div>
            <Badge variant={assessment.status === "flagged" ? "destructive" : "secondary"}>{assessment.severity}</Badge>
          </div>

          <Separator />

          {/* Survey Responses */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {surveyData.questions.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm leading-relaxed">
                      {index + 1}. {item.question}
                    </h4>
                    <Badge variant="outline" className={getScoreColor(item.score)}>
                      {item.score} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                    <strong>Response:</strong> {item.response}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
