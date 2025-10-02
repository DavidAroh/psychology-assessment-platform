"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Activity, Users, FileText, BarChart3, User, Menu, X, Plus } from "lucide-react"
import { useDashboard } from "@/contexts/DashboardContext"
import { NotificationsDropdown } from "./notifications-dropdown"

const navigation = [
  { name: "Dashboard", href: "/", icon: Activity },
  { name: "Assessments", href: "/assessments", icon: FileText },
  { name: "Client Data", href: "/clients", icon: Users },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
]

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { highRiskClients } = useDashboard()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:border-border lg:bg-sidebar">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-sidebar-border">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">PsychAssess</h1>
              <p className="text-xs text-muted-foreground">Professional Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                  {item.name === "Dashboard" && highRiskClients && highRiskClients.length > 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs">
                      {highRiskClients.length}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-sidebar-border">
            <Button className="w-full" size="sm" onClick={() => router.push("/assessments")}>
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border bg-card shadow-sm">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-lg">PsychAssess</span>
                <p className="text-xs text-muted-foreground">Professional</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsDropdown />
            <Button 
              size="sm" 
              onClick={() => router.push("/assessments")}
              className="hidden sm:flex"
            >
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-b border-border bg-card shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 text-base font-medium rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground active:scale-95",
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-6 h-6" />
                    <span>{item.name}</span>
                    {item.name === "Dashboard" && highRiskClients && highRiskClients.length > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {highRiskClients.length}
                      </Badge>
                    )}
                  </Link>
                )
              })}
              
              {/* Mobile Quick Actions */}
              <div className="pt-4 mt-4 border-t border-border">
                <Button 
                  className="w-full justify-start text-base py-3 h-auto" 
                  onClick={() => {
                    router.push("/assessments")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Create New Assessment
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </>
  )
}
