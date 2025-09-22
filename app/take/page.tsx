import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function TakeAssessmentIndexPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle>Invalid Assessment Link</CardTitle>
          <CardDescription>The assessment link you're trying to access is invalid or has expired.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Assessment links are single-use only</p>
            <p>• Links expire after 7 days</p>
            <p>• Please contact your healthcare provider for a new link</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
