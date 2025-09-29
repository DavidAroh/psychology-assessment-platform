"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

const DashboardContext = createContext<any>(null)

export function useDashboard() {
  return useContext(DashboardContext)
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      try {
        setError(null)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout
        
        const response = await fetch("/api/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("token")
            router.push("/login")
            return
          }
          throw new Error(`Failed to fetch dashboard data: ${response.status}`)
        }
        
        const dashboardData = await response.json()
        setData(dashboardData)
      } catch (error) {
        console.error("Dashboard fetch error:", error)
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("Failed to load dashboard data")
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [router])

  return (
    <DashboardContext.Provider value={{ ...data, loading, error }}>
      {children}
    </DashboardContext.Provider>
  )
}