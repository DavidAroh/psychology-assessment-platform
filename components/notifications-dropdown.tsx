"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, AlertTriangle, Clock, CheckCircle } from "lucide-react"

const mockNotifications: any[] = [
  {
    id: 1,
    type: "high-risk",
    title: "High-Risk Client Alert",
    message: "Client Sarah Johnson (C-2024-089) has been flagged as high-risk.",
    time: "5 minutes ago",
    unread: true,
    clientId: "C-2024-089",
  },
  {
    id: 2,
    type: "completed",
    title: "Assessment Completed",
    message: "Michael Chen (C-2024-091) completed a GAD-7 assessment.",
    time: "1 hour ago",
    unread: true,
    clientId: "C-2024-091",
  },
  {
    id: 3,
    type: "reminder",
    title: "Follow-up Reminder",
    message: "Follow-up with Emily Rodriguez (C-2024-088) is due tomorrow.",
    time: "Yesterday",
    unread: false,
    clientId: "C-2024-088",
  },
  {
    id: 4,
    type: "completed",
    title: "Assessment Completed",
    message: "John Doe (C-2024-092) completed a PHQ-9 assessment.",
    time: "2 days ago",
    unread: false,
    clientId: "C-2024-092",
  },
]

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const unreadCount = notifications.filter((n) => n.unread).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    setIsOpen(false)

    // Navigate based on notification type
    switch (notification.type) {
      case "high-risk":
      case "completed":
        // Navigate to clients page with filter for this client
        router.push(`/clients?search=${notification.clientId}`)
        break
      case "reminder":
        // Navigate to clients page to view client details
        router.push(`/clients?search=${notification.clientId}`)
        break
      default:
        router.push("/clients")
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "high-risk":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "reminder":
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="mt-0.5">{getIcon(notification.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {notification.unread && <div className="w-2 h-2 bg-primary rounded-full" />}
                </div>
                <p className="text-xs text-muted-foreground">{notification.message}</p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
