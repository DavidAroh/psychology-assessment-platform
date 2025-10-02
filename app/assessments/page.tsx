"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Plus, Copy, ExternalLink, Clock, Users, Search } from "lucide-react"
import { AssessmentCreator } from "@/components/assessment-creator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { getAllAssessments, assessmentTemplates, initializeClientCache } from "@/lib/database"

// Convert assessment templates to the expected format
const getStandardAssessments = (cacheInitialized: boolean) => Object.entries(assessmentTemplates).map(([key, template]) => ({
  id: key.toLowerCase(),
  name: template.name,
  fullName: template.fullName,
  description: template.description,
  questions: template.questions.length,
  timeEstimate: template.timeEstimate,
  category: template.category,
  usageCount: cacheInitialized ? getAllAssessments().filter(a => a.type === key).length : 0,
}))

export default function AssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [showCreator, setShowCreator] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewAssessment, setPreviewAssessment] = useState<any>(null)
  const [cacheInitialized, setCacheInitialized] = useState(false)

  // Initialize cache on component mount
  useEffect(() => {
    const initCache = async () => {
      await initializeClientCache()
      setCacheInitialized(true)
    }
    initCache()
  }, [])

  // Get recent assessments from database
  const recentAssessments = cacheInitialized ? getAllAssessments()
    .slice(0, 10)
    .map(assessment => ({
      id: assessment.id,
      type: assessment.name,
      clientId: assessment.clientId || 'Anonymous',
      status: assessment.status,
      createdAt: new Date(assessment.createdAt).toLocaleDateString(),
      completedAt: assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString() : null,
    })) : []

  const standardAssessments = getStandardAssessments(cacheInitialized)
  const filteredAssessments = standardAssessments.filter((assessment) => {
    const matchesSearch =
      assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || assessment.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const handleCreateAssessment = (assessment: any) => {
    setSelectedAssessment(assessment)
    setShowCreator(true)
  }

  const handlePreviewAssessment = (assessment: any) => {
    setPreviewAssessment(assessment)
    setShowPreview(true)
  }

  const handleCopyLink = (assessmentId: string) => {
    const link = `${window.location.origin}/take/${assessmentId}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Link copied",
      description: "Assessment link has been copied to your clipboard.",
    })
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
                <h1 className="text-2xl font-bold text-foreground">Assessment Management</h1>
                <p className="text-muted-foreground">Create and manage psychological assessments</p>
              </div>
              <Button onClick={() => setShowCreator(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Custom Assessment
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 lg:px-8 py-8">
          <Tabs defaultValue="standard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="standard">Standard Assessments</TabsTrigger>
              <TabsTrigger value="custom">Custom Assessments</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>

            {/* Standard Assessments Tab */}
            <TabsContent value="standard" className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Standard Assessment Library</CardTitle>
                  <CardDescription>Select from validated psychological assessment tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex mb-6 w-[105%] gap-3">
                    <div className="flex-5">
                      <Label htmlFor="search">Search Assessments</Label>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search by name or description..."
                          className="pl-10 bg-white w-4xl"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-48 relative">
                      <Label htmlFor="category">Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="bg-white mt-2">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="depression">Depression</SelectItem>
                          <SelectItem value="anxiety">Anxiety</SelectItem>
                          <SelectItem value="trauma">Trauma</SelectItem>
                          <SelectItem value="combined">Combined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Assessment Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAssessments.map((assessment) => (
                      <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{assessment.name}</CardTitle>
                              <CardDescription className="text-sm">{assessment.fullName}</CardDescription>
                            </div>
                            <Badge variant="secondary">{assessment.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground">{assessment.description}</p>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span>{assessment.questions} questions</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{assessment.timeEstimate}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>Used {assessment.usageCount} times</span>
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1" size="sm" onClick={() => handleCreateAssessment(assessment)}>
                              Create Assessment
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handlePreviewAssessment(assessment)}>
                              Preview
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* No results message */}
                  {filteredAssessments.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No assessments found matching your criteria.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Custom Assessments Tab */}
            <TabsContent value="custom" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create Custom Assessment</CardTitle>
                  <CardDescription>Build your own assessment with custom questions and scoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="assessment-name">Assessment Name</Label>
                        <Input id="assessment-name" placeholder="e.g., Custom Mood Assessment" />
                      </div>

                      <div>
                        <Label htmlFor="assessment-description">Description</Label>
                        <Textarea
                          id="assessment-description"
                          placeholder="Brief description of what this assessment measures..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="assessment-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="depression">Depression</SelectItem>
                            <SelectItem value="anxiety">Anxiety</SelectItem>
                            <SelectItem value="trauma">Trauma</SelectItem>
                            <SelectItem value="personality">Personality</SelectItem>
                            <SelectItem value="cognitive">Cognitive</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="scoring-method">Scoring Method</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select scoring method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="likert">Likert Scale (1-5)</SelectItem>
                            <SelectItem value="binary">Yes/No</SelectItem>
                            <SelectItem value="custom">Custom Scoring</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="time-estimate">Estimated Time (minutes)</Label>
                        <Input id="time-estimate" type="number" placeholder="10" />
                      </div>

                      <div className="flex items-center gap-4">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Questions
                        </Button>
                        <Button variant="outline">Save Draft</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Activity Tab */}
            <TabsContent value="recent" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Assessment Activity</CardTitle>
                  <CardDescription>Track recently created and completed assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{assessment.type} Assessment</p>
                            <p className="text-sm text-muted-foreground">
                              Client: {assessment.clientId} • Created {assessment.createdAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant={assessment.status === "completed" ? "default" : "secondary"}>
                            {assessment.status}
                          </Badge>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleCopyLink(assessment.id)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </Button>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View
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
        </main>
      </div>

      {/* Assessment Creator Dialog */}
      <Dialog open={showCreator} onOpenChange={setShowCreator}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Assessment</DialogTitle>
          </DialogHeader>
          {selectedAssessment && (
            <AssessmentCreator assessmentType={selectedAssessment.name} assessmentName={selectedAssessment.fullName} />
          )}
        </DialogContent>
      </Dialog>

      {/* Assessment Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assessment Preview: {previewAssessment?.name}</DialogTitle>
          </DialogHeader>
          {previewAssessment && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">{previewAssessment.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-4">{previewAssessment.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Questions: {previewAssessment.questions}</div>
                  <div>Time: {previewAssessment.timeEstimate}</div>
                  <div>Category: {previewAssessment.category}</div>
                  <div>Usage: {previewAssessment.usageCount} times</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setShowPreview(false)
                    handleCreateAssessment(previewAssessment)
                  }}
                >
                  Create This Assessment
                </Button>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Close Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
