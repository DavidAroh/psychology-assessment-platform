"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Copy, QrCode, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface AssessmentCreatorProps {
  assessmentType: string
  assessmentName: string
}

export function AssessmentCreator({ assessmentType, assessmentName }: AssessmentCreatorProps) {
  const [clientId, setClientId] = useState("")
  const [notes, setNotes] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [assessmentLink, setAssessmentLink] = useState("")
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  const getGoogleFormUrl = (type: string) => {
    const formUrls = {
      "PHQ-9": "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_PHQ9_FORM_ID/viewform",
      "GAD-7": "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_GAD7_FORM_ID/viewform",
      "BDI-II": "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_BDI2_FORM_ID/viewform",
      "DASS-21": "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_DASS21_FORM_ID/viewform",
      "PCL-5": "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_PCL5_FORM_ID/viewform",
      MINI: "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_MINI_FORM_ID/viewform",
    }
    return (
      formUrls[type as keyof typeof formUrls] || "https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/viewform"
    )
  }

  const handleCreateAssessment = async () => {
    setIsCreating(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const baseFormUrl = getGoogleFormUrl(assessmentType)

    if (baseFormUrl.includes("REPLACE_WITH_YOUR")) {
      toast({
        title: "Setup Required",
        description: "Please replace the placeholder Google Form URLs with your actual form IDs in the code.",
        variant: "destructive",
      })
      setIsCreating(false)
      return
    }

    const trackingParams = new URLSearchParams({
      client_id: clientId || "anonymous",
      assessment_type: assessmentType,
      created_at: new Date().toISOString(),
      notes: notes || "",
    })

    const link = `${baseFormUrl}?${trackingParams.toString()}`
    setAssessmentLink(link)
    setShowLinkDialog(true)
    setIsCreating(false)

    toast({
      title: "Assessment Created",
      description: `${assessmentType} Google Form link has been generated successfully.`,
    })
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
          <CardDescription>Generate a Google Form link for your client to complete this assessment</CardDescription>
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
            <DialogTitle>Google Form Assessment Link Created</DialogTitle>
            <DialogDescription>
              Share this Google Form link with your client to complete the {assessmentType} assessment.
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

              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => openInNewTab(assessmentLink)}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Form
              </Button>

              <Button variant="outline">
                <QrCode className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                • <strong>Setup Required:</strong> Replace placeholder Form IDs with your actual Google Form IDs
              </p>
              <p>• Client responses will be collected in Google Sheets</p>
              <p>• Link can be used multiple times if needed</p>
              <p>• Results can be imported back to your dashboard</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
