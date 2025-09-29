"use client"

import { Button } from "@/components/ui/button"
import { Plus, FileText, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { NotificationsDropdown } from "./notifications-dropdown"
import { UserProfileDropdown } from "./user-profile-dropdown"
import { getHighRiskClients } from "@/lib/database"

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
      </div>
    </header>
  )
}
