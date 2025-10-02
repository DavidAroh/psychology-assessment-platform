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
      <div className="px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Welcome back, Dr. Smith
            </p>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
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

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <NotificationsDropdown />
              <UserProfileDropdown />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/assessments")}>
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">New</span>
              </Button>
              <Button size="sm" onClick={() => router.push("/reports")}>
                <FileText className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Report</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
