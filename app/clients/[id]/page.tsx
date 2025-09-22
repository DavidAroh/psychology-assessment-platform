"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  FileText,
  MessageSquare,
  ClipboardList,
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useState } from "react"
import { SurveyResponsesModal } from "@/components/survey-responses-modal"

// Mock client data - in a real app, this would come from an API
const getClientData = (id: string) => {
  const clients = {
    "C-2024-089": {
      id: "C-2024-089",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1985-03-15",
      assessments: [
        {
          type: "PHQ-9",
          score: 23,
          severity: "Severe Depression",
          date: "2024-01-15",
          riskFactors: ["Suicidal ideation", "Sleep disturbance"],
          status: "flagged",
        },
        {
          type: "GAD-7",
          score: 12,
          severity: "Moderate Anxiety",
          date: "2024-01-10",
          riskFactors: ["Worry", "Restlessness"],
          status: "completed",
        },
      ],
      notes: "Client has been experiencing increased symptoms over the past month. Requires immediate follow-up.",
      lastContact: "2024-01-14",
      riskLevel: "high",
    },
    "C-2024-091": {
      id: "C-2024-091",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 987-6543",
      dateOfBirth: "1990-07-22",
      assessments: [
        {
          type: "GAD-7",
          score: 18,
          severity: "Severe Anxiety",
          date: "2024-01-15",
          riskFactors: ["Panic attacks", "Avoidance behavior"],
          status: "flagged",
        },
      ],
      notes: "Client reports frequent panic attacks affecting daily functioning.",
      lastContact: "2024-01-13",
      riskLevel: "high",
    },
    "C-2024-088": {
      id: "C-2024-088",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "+1 (555) 456-7890",
      dateOfBirth: "1992-11-08",
      assessments: [
        {
          type: "BDI-II",
          score: 19,
          severity: "Moderate Depression",
          date: "2024-01-15",
          riskFactors: ["Hopelessness"],
          status: "flagged",
        },
      ],
      notes: "Client showing improvement with current treatment plan.",
      lastContact: "2024-01-12",
      riskLevel: "medium",
    },
  }

  return clients[id as keyof typeof clients] || null
}

export default function ClientDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string
  const [contactingClient, setContactingClient] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [showSurveyResponses, setShowSurveyResponses] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)

  const client = getClientData(clientId)

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Client Not Found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const handleContactClient = () => {
    setContactingClient(true)
    setTimeout(() => {
      setContactingClient(false)
      alert(`Contact initiated with ${client.name}. Check your communication log for details.`)
    }, 1500)
  }

  const handleGenerateReport = () => {
    setGeneratingReport(true)
    setTimeout(() => {
      setGeneratingReport(false)
      router.push(`/reports?clientId=${client.id}&clientName=${encodeURIComponent(client.name)}`)
    }, 1500)
  }

  const handleViewSurveyResponses = (assessment: any) => {
    setSelectedAssessment(assessment)
    setShowSurveyResponses(true)
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Client Details</h1>
          <p className="text-muted-foreground">Comprehensive client information and assessment history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{client.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {client.id}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">DOB: {client.dateOfBirth}</span>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Risk Level</span>
                  <Badge variant={getRiskBadgeVariant(client.riskLevel)}>{client.riskLevel.toUpperCase()} RISK</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Last Contact: {client.lastContact}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full" onClick={handleContactClient} disabled={contactingClient}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {contactingClient ? "Contacting..." : "Contact Client"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleGenerateReport}
                  disabled={generatingReport}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {generatingReport ? "Generating..." : "Generate Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>Complete assessment results and risk factors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {client.assessments.map((assessment, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{assessment.type} Assessment</h4>
                      <p className="text-sm text-muted-foreground">Completed on {assessment.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{assessment.score}</div>
                      <Badge variant={assessment.status === "flagged" ? "destructive" : "secondary"}>
                        {assessment.status === "flagged" ? "FLAGGED" : "COMPLETED"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-sm font-medium">Severity: </span>
                    <span className="text-sm">{assessment.severity}</span>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Risk Factors:</p>
                    <div className="flex flex-wrap gap-1">
                      {assessment.riskFactors.map((factor, factorIndex) => (
                        <Badge key={factorIndex} variant="outline" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSurveyResponses(assessment)}
                      className="w-full"
                    >
                      <ClipboardList className="w-4 h-4 mr-2" />
                      View Survey Responses
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{client.notes}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Survey Responses Modal */}
      <SurveyResponsesModal
        isOpen={showSurveyResponses}
        onClose={() => setShowSurveyResponses(false)}
        assessment={selectedAssessment}
        clientName={client.name}
      />
    </div>
  )
}
