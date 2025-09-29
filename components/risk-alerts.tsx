"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, User, FileText, ArrowRight } from "lucide-react"

export function RiskAlerts({ highRiskClients, flaggedAssessments }: { highRiskClients: any[]; flaggedAssessments: any[] }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Risk Alerts
        </CardTitle>
        <CardDescription>Flagged assessments requiring follow-up</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {flaggedAssessments.length > 0 ? (
          flaggedAssessments.map((a) => (
            <div key={a.id} className="flex items-start justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="font-medium">{a.name}</p>
                  {a.severity && <Badge variant="destructive">{a.severity}</Badge>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {a.clientId && (
                    <>
                      <User className="w-3 h-3" />
                      <span>Client {a.clientId}</span>
                    </>
                  )}
                  {a.riskFlags && a.riskFlags.length > 0 && <span>• {a.riskFlags.join(", ")}</span>}
                </div>
              </div>
              <Link href={`/clients/${a.clientId}`}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Review
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <p>No active risk alerts</p>
            <p className="text-xs mt-1">Flagged assessments will appear here</p>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="flex gap-2">
            <Link href="/clients?filter=high-risk">
              <Button variant="destructive" size="sm">
                {highRiskClients.length} High-Risk Client{highRiskClients.length === 1 ? "" : "s"}
              </Button>
            </Link>
            <Link href="/clients">
              <Button variant="outline" size="sm" className="bg-transparent">
                View All Clients
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
