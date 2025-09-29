"use client"

interface Toast {
  title: string
  description?: string
}

export function toast({ title, description }: Toast) {
  // Simple console log for now - in a real app this would show a toast notification
  console.log(`Toast: ${title}${description ? ` - ${description}` : ""}`)
}

export function useToast() {
  return { toast }
}
