"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, QrCode, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createAssessment } from "@/lib/database"

interface AssessmentCreatorProps {
  assessmentType: string
  assessmentName: string
}

export function AssessmentCreator({ assessmentType, assessmentName }: AssessmentCreatorProps) {
  const router = useRouter()
  const [clientId, setClientId] = useState("")
  const [notes, setNotes] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [assessmentLink, setAssessmentLink] = useState("")
  const [assessmentId, setAssessmentId] = useState("")
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  const handleCreateAssessment = async () => {
    if (isCreating) return // Prevent double-clicks
    
    setIsCreating(true)

    try {
      // Create assessment in database
      const assessment = await createAssessment({
        type: assessmentType,
        clientId: clientId.trim() || undefined,
        notes: notes.trim() || undefined,
      })

      // Ensure we have a valid assessment ID
      if (!assessment || !assessment.id) {
        throw new Error("Failed to create assessment - no ID returned")
      }

      // Store the assessment ID separately for better handling
      setAssessmentId(assessment.id)
      
      // Create assessment link with proper URL construction
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      const link = `${baseUrl}/take/${assessment.id}`
      setAssessmentLink(link)
      setShowLinkDialog(true)

      toast({
        title: "Assessment Created",
        description: `${assessmentType} assessment has been created successfully.`,
      })
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create assessment. Please try again."
      })
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Assessment link has been copied to your clipboard.",
      })
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      
      toast({
        title: "Copied to clipboard",
        description: "Assessment link has been copied to your clipboard.",
      })
    }
  }

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const previewAssessment = () => {
    if (assessmentId) {
      router.push(`/take/${assessmentId}`)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Create {assessmentType} Assessment
            <Badge variant="secondary">{assessmentName}</Badge>
          </CardTitle>
          <CardDescription>Create a secure assessment link for your client to complete</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="client-id">Client ID (Optional)</Label>
            <Input
              id="client-id"
              placeholder="e.g., C-2024-001"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">Leave blank for anonymous assessment</p>
          </div>

          <div>
            <Label htmlFor="notes">Internal Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this assessment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button onClick={handleCreateAssessment} disabled={isCreating} className="w-full">
            {isCreating ? "Creating Assessment..." : "Create Assessment Link"}
          </Button>
        </CardContent>
      </Card>

      {/* Assessment Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assessment Link Created</DialogTitle>
            <DialogDescription>
              Share this secure link with your client to complete the {assessmentType} assessment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-mono break-all select-all">{assessmentLink}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(assessmentLink)} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>

              <Button variant="outline" className="flex-1" onClick={previewAssessment}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview Assessment
              </Button>

              <Button variant="outline" onClick={() => openInNewTab(assessmentLink)}>
                <QrCode className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                • Assessment responses are stored securely in the system
              </p>
              <p>• Link expires after completion for security</p>
              <p>• Results are immediately available in your dashboard</p>
              <p>• Make sure your `/take/[id]` route is properly configured</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}