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
import { useState, useEffect } from "react"
import { SurveyResponsesModal } from "@/components/survey-responses-modal"


export default function ClientDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const clientId = params.id as string
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [contactingClient, setContactingClient] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [showSurveyResponses, setShowSurveyResponses] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)

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

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    if (clientId) {
      const fetchClientData = async () => {
        try {
          const response = await fetch(`/api/clients/${clientId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          })
          if (!response.ok) {
            throw new Error("Failed to fetch client data")
          }
          const data = await response.json()
          setClient(data)
        } catch (error) {
          console.error(error)
          setClient(null) // Set client to null on error
        } finally {
          setLoading(false)
        }
      }
      fetchClientData()
    }
  }, [clientId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

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

      {/* Client Details Badge */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Client Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="space-y-1">
            <p><strong>ID:</strong> {client.id}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Risk Level:</strong> <Badge variant={getRiskBadgeVariant(client.riskLevel)}>{client.riskLevel.toUpperCase()}</Badge></p>
          </div>
          <Button variant="secondary" onClick={handleContactClient} disabled={contactingClient}>
            <MessageSquare className="w-4 h-4 mr-2" />
            {contactingClient ? "Contacting..." : "Contact Client"}
          </Button>
        </CardContent>
      </Card>

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
                    <p className="text-sm font-medium mb-2">Risk Flags:</p>
                    <div className="flex flex-wrap gap-1">
                      {(assessment.riskFlags || []).map((factor, factorIndex) => (
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
