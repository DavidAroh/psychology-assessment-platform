"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, Eye, BarChart3, Settings } from "lucide-react"

const sampleReports = [
  {
    id: "R-2024-001",
    clientId: "C-2024-089",
    assessment: "PHQ-9",
    score: 23,
    severity: "Severe Depression",
    generatedAt: "2024-01-15 15:30",
    status: "completed",
  },
  {
    id: "R-2024-002",
    clientId: "C-2024-088",
    assessment: "GAD-7",
    score: 18,
    severity: "Severe Anxiety",
    generatedAt: "2024-01-15 13:45",
    status: "completed",
  },
  {
    id: "R-2024-003",
    clientId: "C-2024-087",
    assessment: "BDI-II",
    score: 19,
    severity: "Moderate Depression",
    generatedAt: "2024-01-14 17:20",
    status: "completed",
  },
]

export default function ReportsPage() {
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedAssessment, setSelectedAssessment] = useState("")
  const [reportTitle, setReportTitle] = useState("")
  const [clinicalNotes, setClinicalNotes] = useState("")
  const [includeRecommendations, setIncludeRecommendations] = useState(true)
  const [includeScoring, setIncludeScoring] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [reportSettings, setReportSettings] = useState({
    defaultTemplate: "standard",
    includeHeader: true,
    includeLogo: true,
    autoSave: true,
    exportFormat: "pdf",
    clinicName: "Psychology Assessment Clinic",
    clinicAddress: "123 Healthcare Ave, Medical City, MC 12345",
  })

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Get survey responses for the selected assessment
    const getSurveyResponses = (assessmentType: string) => {
      const responses = {
        "PHQ-9": {
          questions: [
            { question: "Little interest or pleasure in doing things", response: "More than half the days", score: 2 },
            { question: "Feeling down, depressed, or hopeless", response: "Nearly every day", score: 3 },
            {
              question: "Trouble falling or staying asleep, or sleeping too much",
              response: "Nearly every day",
              score: 3,
            },
            { question: "Feeling tired or having little energy", response: "More than half the days", score: 2 },
            { question: "Poor appetite or overeating", response: "Several days", score: 1 },
            {
              question: "Feeling bad about yourself or that you are a failure",
              response: "Nearly every day",
              score: 3,
            },
            { question: "Trouble concentrating on things", response: "More than half the days", score: 2 },
            { question: "Moving or speaking slowly or being fidgety/restless", response: "Several days", score: 1 },
            {
              question: "Thoughts that you would be better off dead or hurting yourself",
              response: "More than half the days",
              score: 2,
            },
          ],
          totalScore: 19,
        },
        "GAD-7": {
          questions: [
            { question: "Feeling nervous, anxious, or on edge", response: "More than half the days", score: 2 },
            { question: "Not being able to stop or control worrying", response: "Nearly every day", score: 3 },
            { question: "Worrying too much about different things", response: "More than half the days", score: 2 },
            { question: "Trouble relaxing", response: "Several days", score: 1 },
            {
              question: "Being so restless that it's hard to sit still",
              response: "More than half the days",
              score: 2,
            },
            { question: "Becoming easily annoyed or irritable", response: "Several days", score: 1 },
            { question: "Feeling afraid as if something awful might happen", response: "Several days", score: 1 },
          ],
          totalScore: 12,
        },
        "BDI-II": {
          questions: [
            { question: "Sadness", response: "I feel sad much of the time", score: 2 },
            { question: "Pessimism", response: "I feel more discouraged about my future than I used to be", score: 1 },
            { question: "Past Failure", response: "I have failed more than I should have", score: 2 },
            {
              question: "Loss of Pleasure",
              response: "I get as much pleasure as I ever did from the things I enjoy",
              score: 0,
            },
            { question: "Guilty Feelings", response: "I feel quite guilty most of the time", score: 2 },
          ],
          totalScore: 7,
        },
      }
      return responses[assessmentType as keyof typeof responses] || null
    }

    const surveyData = getSurveyResponses(selectedAssessment)

    // Create detailed report content with survey responses
    const reportContent = `
PSYCHOLOGY ASSESSMENT REPORT
============================

Client Information:
- Client ID: ${selectedClient}
- Assessment Type: ${selectedAssessment}
- Assessment Date: ${new Date().toLocaleDateString()}
- Report Generated: ${new Date().toLocaleDateString()}

Assessment Results:
- Total Score: ${surveyData?.totalScore || 23}
- Severity Level: Severe Depression

${
  surveyData
    ? `
DETAILED SURVEY RESPONSES:
${surveyData.questions
  .map(
    (item, index) => `
${index + 1}. ${item.question}
   Response: ${item.response}
   Score: ${item.score} points
`,
  )
  .join("")}

SCORING BREAKDOWN:
- Total Questions: ${surveyData.questions.length}
- Total Score: ${surveyData.totalScore}
- Individual Question Scores: ${surveyData.questions.map((q) => q.score).join(", ")}
`
    : ""
}

${
  clinicalNotes
    ? `Clinical Notes:
${clinicalNotes}
`
    : ""
}

${
  includeRecommendations
    ? `Clinical Recommendations:
- Immediate follow-up recommended
- Consider referral to specialist
- Monitor for risk factors
- Schedule regular assessment intervals
`
    : ""
}

${
  includeScoring
    ? `Detailed Scoring Information:
- High severity responses indicate significant symptoms
- Moderate responses suggest ongoing concerns
- Low scores represent minimal symptom presence
- Total score interpretation based on standardized ranges
`
    : ""
}

This report is confidential and intended for professional use only.
Generated by Psychology Assessment Platform
  `

    // Create and download the report
    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `assessment-report-${selectedClient}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    console.log("Generated report with survey responses:", {
      clientId: selectedClient,
      assessment: selectedAssessment,
      surveyResponses: surveyData?.questions.length || 0,
      totalScore: surveyData?.totalScore,
    })

    setIsGenerating(false)
  }

  const handleDownloadReport = (reportId: string) => {
    const report = sampleReports.find((r) => r.id === reportId)
    if (!report) return

    const reportContent = `
PSYCHOLOGY ASSESSMENT REPORT
============================

Report ID: ${report.id}
Client ID: ${report.clientId}
Assessment Type: ${report.assessment}
Assessment Date: ${report.generatedAt}
Report Generated: ${new Date().toLocaleDateString()}

Assessment Results:
- Total Score: ${report.score}
- Severity Level: ${report.severity}

DETAILED SURVEY RESPONSES:
${
  report.assessment === "PHQ-9"
    ? `
1. Little interest or pleasure in doing things → "More than half the days" (2 pts)
2. Feeling down, depressed, or hopeless → "Nearly every day" (3 pts)
3. Trouble falling or staying asleep → "Nearly every day" (3 pts)
4. Feeling tired or having little energy → "More than half the days" (2 pts)
5. Poor appetite or overeating → "Several days" (1 pt)
6. Feeling bad about yourself → "Nearly every day" (3 pts)
7. Trouble concentrating → "More than half the days" (2 pts)
8. Moving slowly or being restless → "Several days" (1 pt)
9. Thoughts of self-harm → "More than half the days" (2 pts)
`
    : report.assessment === "GAD-7"
      ? `
1. Feeling nervous, anxious, or on edge → "More than half the days" (2 pts)
2. Not being able to stop worrying → "Nearly every day" (3 pts)
3. Worrying too much about different things → "More than half the days" (2 pts)
4. Trouble relaxing → "Several days" (1 pt)
5. Being restless → "More than half the days" (2 pts)
6. Becoming easily annoyed → "Several days" (1 pt)
7. Feeling afraid something awful might happen → "Several days" (1 pt)
`
      : `
1. Sadness → "I feel sad much of the time" (2 pts)
2. Pessimism → "I feel more discouraged about my future" (1 pt)
3. Past Failure → "I have failed more than I should have" (2 pts)
4. Loss of Pleasure → "I get as much pleasure as I ever did" (0 pts)
5. Guilty Feelings → "I feel quite guilty most of the time" (2 pts)
`
}

Clinical Recommendations:
- Immediate follow-up recommended
- Consider referral to specialist
- Monitor for risk factors
- Schedule regular assessment intervals

This report is confidential and intended for professional use only.
Generated by Psychology Assessment Platform
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.id}-assessment-report.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleViewReport = (reportId: string) => {
    const report = sampleReports.find((r) => r.id === reportId)
    if (!report) return

    const reportContent = `
PSYCHOLOGY ASSESSMENT REPORT
============================

Report ID: ${report.id}
Client ID: ${report.clientId}
Assessment Type: ${report.assessment}
Total Score: ${report.score}
Severity Level: ${report.severity}
Generated: ${report.generatedAt}

This report contains detailed assessment results and clinical recommendations.
    `

    // Open report in new window/tab for viewing
    const newWindow = window.open("", "_blank")
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Assessment Report - ${report.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
              h1 { color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px; }
              .header { background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .score { background: #fef3c7; padding: 10px; border-radius: 5px; font-weight: bold; }
            </style>
          </head>
          <body>
            <h1>Psychology Assessment Report</h1>
            <div class="header">
              <strong>Report ID:</strong> ${report.id}<br>
              <strong>Client ID:</strong> ${report.clientId}<br>
              <strong>Assessment Type:</strong> ${report.assessment}<br>
              <strong>Generated:</strong> ${report.generatedAt}
            </div>
            <div class="section">
              <h2>Assessment Results</h2>
              <div class="score">
                Total Score: ${report.score} - ${report.severity}
              </div>
            </div>
            <div class="section">
              <h2>Clinical Notes</h2>
              <p>This assessment indicates ${report.severity.toLowerCase()} symptoms requiring professional attention and follow-up care.</p>
            </div>
            <div class="section">
              <p><em>This report is confidential and intended for professional use only.</em></p>
            </div>
          </body>
        </html>
      `)
      newWindow.document.close()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="lg:ml-64">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Report Generation</h1>
                <p className="text-muted-foreground">Create professional assessment reports</p>
              </div>
              <Button variant="outline" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Report Settings
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 lg:px-8 py-8">
          <Tabs defaultValue="generate" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate New Report</TabsTrigger>
              <TabsTrigger value="history">Report History</TabsTrigger>
            </TabsList>

            {/* Generate Report Tab */}
            <TabsContent value="generate" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Report Configuration */}
                <Card>
                  <CardHeader>
                    <CardTitle>Report Configuration</CardTitle>
                    <CardDescription>Configure the details for your assessment report</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client-select">Client ID</Label>
                        <Select value={selectedClient} onValueChange={setSelectedClient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="C-2024-089">C-2024-089</SelectItem>
                            <SelectItem value="C-2024-088">C-2024-088</SelectItem>
                            <SelectItem value="C-2024-087">C-2024-087</SelectItem>
                            <SelectItem value="C-2024-086">C-2024-086</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="assessment-select">Assessment</Label>
                        <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assessment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PHQ-9">PHQ-9</SelectItem>
                            <SelectItem value="GAD-7">GAD-7</SelectItem>
                            <SelectItem value="BDI-II">BDI-II</SelectItem>
                            <SelectItem value="BAI">BAI</SelectItem>
                            <SelectItem value="DASS-21">DASS-21</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="report-title">Report Title (Optional)</Label>
                      <Input
                        id="report-title"
                        placeholder="e.g., Initial Assessment Report"
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="clinical-notes">Clinical Notes</Label>
                      <Textarea
                        id="clinical-notes"
                        placeholder="Add any additional clinical observations or notes..."
                        rows={4}
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Report Sections</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-scoring"
                            checked={includeScoring}
                            onCheckedChange={(checked) => setIncludeScoring(checked === true)}
                          />
                          <Label htmlFor="include-scoring">Include detailed scoring breakdown</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-recommendations"
                            checked={includeRecommendations}
                            onCheckedChange={(checked) => setIncludeRecommendations(checked === true)}
                          />
                          <Label htmlFor="include-recommendations">Include clinical recommendations</Label>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateReport}
                      disabled={!selectedClient || !selectedAssessment || isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <BarChart3 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Generate PDF Report
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Report Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Report Preview</CardTitle>
                    <CardDescription>Preview of the generated report layout</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-border rounded-lg p-6 bg-white text-black min-h-96">
                      {/* Report Header */}
                      <div className="border-b border-gray-200 pb-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h1 className="text-2xl font-bold text-green-700">Psychology Assessment Report</h1>
                            <p className="text-gray-600">Professional Clinical Assessment</p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-green-700" />
                          </div>
                        </div>
                      </div>

                      {/* Client Information */}
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold text-green-700 mb-3">Client Information</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Client ID:</span>
                            <span className="ml-2 font-medium">{selectedClient || "Not selected"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Assessment Date:</span>
                            <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Assessment Type:</span>
                            <span className="ml-2 font-medium">{selectedAssessment || "Not selected"}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Report Generated:</span>
                            <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Assessment Results */}
                      {selectedAssessment && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold text-green-700 mb-3">Assessment Results</h2>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Total Score:</span>
                              <span className="text-xl font-bold text-green-700">19</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Severity Level:</span>
                              <Badge className="bg-red-100 text-red-800">Severe Depression</Badge>
                            </div>
                          </div>

                          {/* Survey Responses Preview */}
                          <div className="mt-4">
                            <h3 className="text-md font-semibold text-green-700 mb-2">Survey Responses Preview</h3>
                            <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
                              <p>
                                <strong>Sample Questions:</strong>
                              </p>
                              <p>1. Little interest or pleasure in doing things → "More than half the days" (2 pts)</p>
                              <p>2. Feeling down, depressed, or hopeless → "Nearly every day" (3 pts)</p>
                              <p>3. Trouble falling or staying asleep → "Nearly every day" (3 pts)</p>
                              <p className="text-gray-600 italic">
                                ...and{" "}
                                {selectedAssessment === "PHQ-9" ? "6" : selectedAssessment === "GAD-7" ? "4" : "2"} more
                                questions
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Clinical Notes */}
                      {clinicalNotes && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold text-green-700 mb-3">Clinical Notes</h2>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{clinicalNotes}</p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="border-t border-gray-200 pt-4 mt-8">
                        <p className="text-xs text-gray-500 text-center">
                          This report is confidential and intended for professional use only.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Report History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>Previously generated assessment reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{report.assessment} Report</p>
                            <p className="text-sm text-muted-foreground">
                              Client: {report.clientId} • Score: {report.score} • {report.severity}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right text-sm">
                            <p className="font-medium">{report.id}</p>
                            <p className="text-muted-foreground">{new Date(report.generatedAt).toLocaleString()}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewReport(report.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDownloadReport(report.id)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Report Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Report Settings</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                    ✕
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Template Settings */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900">Default Template</Label>
                    <Select
                      value={reportSettings.defaultTemplate}
                      onValueChange={(value) => setReportSettings((prev) => ({ ...prev, defaultTemplate: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Report</SelectItem>
                        <SelectItem value="detailed">Detailed Clinical Report</SelectItem>
                        <SelectItem value="summary">Summary Report</SelectItem>
                        <SelectItem value="research">Research Format</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clinic Information */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-900">Clinic Information</Label>
                    <div>
                      <Label htmlFor="clinic-name">Clinic Name</Label>
                      <Input
                        id="clinic-name"
                        value={reportSettings.clinicName}
                        onChange={(e) => setReportSettings((prev) => ({ ...prev, clinicName: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clinic-address">Clinic Address</Label>
                      <Input
                        id="clinic-address"
                        value={reportSettings.clinicAddress}
                        onChange={(e) => setReportSettings((prev) => ({ ...prev, clinicAddress: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Report Options */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-900">Report Options</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-header"
                          checked={reportSettings.includeHeader}
                          onCheckedChange={(checked) =>
                            setReportSettings((prev) => ({ ...prev, includeHeader: !!checked }))
                          }
                        />
                        <Label htmlFor="include-header">Include clinic header in reports</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-logo"
                          checked={reportSettings.includeLogo}
                          onCheckedChange={(checked) =>
                            setReportSettings((prev) => ({ ...prev, includeLogo: !!checked }))
                          }
                        />
                        <Label htmlFor="include-logo">Include clinic logo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="auto-save"
                          checked={reportSettings.autoSave}
                          onCheckedChange={(checked) => setReportSettings((prev) => ({ ...prev, autoSave: !!checked }))}
                        />
                        <Label htmlFor="auto-save">Auto-save reports to history</Label>
                      </div>
                    </div>
                  </div>

                  {/* Export Settings */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900">Default Export Format</Label>
                    <Select
                      value={reportSettings.exportFormat}
                      onValueChange={(value) => setReportSettings((prev) => ({ ...prev, exportFormat: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="docx">Word Document</SelectItem>
                        <SelectItem value="txt">Text File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Save settings to localStorage
                      localStorage.setItem("reportSettings", JSON.stringify(reportSettings))
                      setShowSettings(false)
                      console.log("Report settings saved:", reportSettings)
                    }}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
