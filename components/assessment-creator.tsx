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
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  const handleCreateAssessment = async () => {
    setIsCreating(true)

    try {
      // Create assessment in database
      const assessment = createAssessment({
        type: assessmentType,
        clientId: clientId || undefined,
        notes: notes || undefined,
      })

      // Create assessment link
      const link = `${window.location.origin}/take/${assessment.id}`
      setAssessmentLink(link)
      setShowLinkDialog(true)

      toast({
        title: "Assessment Created",
        description: `${assessmentType} assessment has been created successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      })
    }

    setIsCreating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Assessment link has been copied to your clipboard.",
    })
  }

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
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
              <p className="text-sm font-mono break-all">{assessmentLink}</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => copyToClipboard(assessmentLink)} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>

              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.push(`/take/${assessmentLink.split('/').pop()}`)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview Assessment
              </Button>

              <Button variant="outline">
                <QrCode className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                • Assessment responses are stored securely in the system
              </p>
              <p>• Link expires after completion for security</p>
              <p>• Results are immediately available in your dashboard</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
