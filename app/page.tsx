import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, AlertTriangle, BarChart3, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { RiskAlerts } from "@/components/risk-alerts"

export default function HomePage() {
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
                  <div className="text-2xl font-bold text-primary">247</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    +12% from last month
                  </div>
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
                  <div className="text-2xl font-bold text-primary">89</div>
                  <p className="text-xs text-muted-foreground">+5 new this week</p>
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
                  <div className="text-2xl font-bold text-destructive">3</div>
                  <p className="text-xs text-muted-foreground">Require immediate attention</p>
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
                  <div className="text-2xl font-bold text-primary">94%</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    +2% from last month
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Risk Alerts - Takes up 2 columns */}
            <div className="xl:col-span-2">
              <RiskAlerts />
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
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">PHQ-9 Assessment</p>
                    <p className="text-sm text-muted-foreground">Client C-2024-092</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Moderate</Badge>
                    <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">GAD-7 Assessment</p>
                    <p className="text-sm text-muted-foreground">Client C-2024-090</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">Minimal</Badge>
                    <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">BDI-II Assessment</p>
                    <p className="text-sm text-muted-foreground">Client C-2024-087</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">Moderate</Badge>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>

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
