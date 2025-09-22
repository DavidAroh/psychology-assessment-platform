"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const riskAlerts = [
  {
    id: "C-2024-089",
    assessment: "PHQ-9",
    score: 23,
    severity: "Severe Depression",
    riskFactors: ["Suicidal ideation", "Sleep disturbance"],
    timeAgo: "2 hours ago",
    priority: "high",
  },
  {
    id: "C-2024-091",
    assessment: "GAD-7",
    score: 18,
    severity: "Severe Anxiety",
    riskFactors: ["Panic attacks", "Avoidance behavior"],
    timeAgo: "4 hours ago",
    priority: "high",
  },
  {
    id: "C-2024-088",
    assessment: "BDI-II",
    score: 19,
    severity: "Moderate Depression",
    riskFactors: ["Hopelessness"],
    timeAgo: "6 hours ago",
    priority: "medium",
  },
]

export function RiskAlerts() {
  const router = useRouter()
  const [contactingClient, setContactingClient] = useState<string | null>(null)

  const handleViewDetails = (clientId: string) => {
    router.push(`/clients/${clientId}`)
  }

  const handleContactClient = (clientId: string) => {
    setContactingClient(clientId)
    setTimeout(() => {
      setContactingClient(null)
      alert(`Initiated contact with client ${clientId}. Check your communication log for details.`)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-5 h-5" />
          Risk Alerts
        </CardTitle>
        <CardDescription>Clients requiring immediate clinical attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {riskAlerts.map((alert) => (
          <div key={alert.id} className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Client {alert.id}</p>
                  <p className="text-sm text-muted-foreground">{alert.assessment} Assessment</p>
                </div>
              </div>
              <Badge variant="destructive" className="text-xs">
                {alert.priority === "high" ? "HIGH RISK" : "MEDIUM RISK"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              <div>
                <span className="text-muted-foreground">Score:</span>
                <span className="ml-2 font-medium text-destructive">{alert.score}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Severity:</span>
                <span className="ml-2 font-medium">{alert.severity}</span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-sm text-muted-foreground mb-1">Risk Factors:</p>
              <div className="flex flex-wrap gap-1">
                {alert.riskFactors.map((factor, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {alert.timeAgo}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(alert.id)}>
                  View Details
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleContactClient(alert.id)}
                  disabled={contactingClient === alert.id}
                >
                  {contactingClient === alert.id ? "Contacting..." : "Contact Client"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
