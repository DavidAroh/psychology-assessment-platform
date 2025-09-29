"use client"

import { usePathname } from "next/navigation"
import { DashboardProvider } from "@/contexts/DashboardContext"
import { ReactNode } from "react"

interface AuthWrapperProps {
  children: ReactNode
}

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/take', // All assessment taking routes
]

export function AuthWrapper({ children }: AuthWrapperProps) {
  const pathname = usePathname()
  
  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // If it's a public route, don't wrap with DashboardProvider
  if (isPublicRoute) {
    return <>{children}</>
  }
  
  // For protected routes, wrap with DashboardProvider
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  )
}
