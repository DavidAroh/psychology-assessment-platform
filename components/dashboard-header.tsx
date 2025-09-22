"use client"

import { Button } from "@/components/ui/button"
import { Plus, FileText, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationsDropdown } from "./notifications-dropdown"
import { UserProfileDropdown } from "./user-profile-dropdown"

export function DashboardHeader() {
  const router = useRouter()

  return (
    <header className="border-b border-border bg-card">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Dr. Smith</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationsDropdown />
            <UserProfileDropdown />
            <Button variant="outline" size="sm" onClick={() => router.push("/assessments")}>
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
            <Button size="sm" onClick={() => router.push("/reports")}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Alert Banner for High Risk Cases */}
        <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">3 high-risk assessments require immediate attention</p>
            <p className="text-xs text-muted-foreground">PHQ-9 scores indicating severe depression detected</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => router.push("/clients?filter=high-risk")}>
            Review Now
          </Button>
        </div>
      </div>
    </header>
  )
}
