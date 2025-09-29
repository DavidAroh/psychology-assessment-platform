"use client"

import { Users, AlertTriangle, BarChart3, Clock, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/contexts/DashboardContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { RiskAlerts } from "@/components/risk-alerts"
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react"

export default function HomePage() {
  const router = useRouter()
  const { stats, recentAssessments, highRiskClients, flaggedAssessments, loading, error } = useDashboard()

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-muted mb-8"></div>
          <div className="px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 h-64 bg-muted rounded-lg"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading dashboard: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="lg:ml-64">
        <DashboardHeader />

        {/* Main Content */}
        <main className="px-4 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/assessments" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalAssessments}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalAssessments === 0 ? 'No assessments yet' : 'Completed assessments'}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/clients" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.activeClients}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeClients === 0 ? 'No clients yet' : 'Active clients'}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/clients?filter=risk" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Risk Flags</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.riskFlags}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.riskFlags === 0 ? 'No risk flags' : 'Require immediate attention'}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reports" className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.completionRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalAssessments === 0 ? 'No assessments' : 'Completion rate'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Risk Alerts - Takes up 2 columns */}
            <div className="xl:col-span-2">
              <RiskAlerts highRiskClients={highRiskClients} flaggedAssessments={flaggedAssessments} />
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest assessment submissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAssessments.length > 0 ? (
                  recentAssessments.map((assessment: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; clientId: any; status: string; severity: string; completedAt: string | number | Date }) => (
                    <div key={assessment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{assessment.name} Assessment</p>
                        <p className="text-sm text-muted-foreground">
                          {assessment.clientId ? `Client ${assessment.clientId}` : 'Anonymous'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={assessment.status === 'flagged' ? 'destructive' : 'secondary'}>
                          {assessment.severity?.split(' ')[0] || 'Completed'}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {assessment.completedAt ? 
                            new Date(assessment.completedAt).toLocaleDateString() : 
                            'Recently'
                          }
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No recent assessments</p>
                    <p className="text-xs mt-1">Create your first assessment to get started</p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Link href="/clients">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/assessments" className="block">
                    <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                      <FileText className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Create Assessment</div>
                        <div className="text-sm text-muted-foreground">Select from standard tests</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/clients" className="block">
                    <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                      <Users className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Client Data Sheet</div>
                        <div className="text-sm text-muted-foreground">Browse all results</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/reports" className="block">
                    <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                      <BarChart3 className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Generate Reports</div>
                        <div className="text-sm text-muted-foreground">Create PDF reports</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
