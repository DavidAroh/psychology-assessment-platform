"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Download, FileText, AlertTriangle, Calendar, MoreHorizontal, Eye, Trash2 } from "lucide-react"
import * as XLSX from "xlsx"

const assessmentTypes = ["All Assessments", "PHQ-9", "GAD-7"]

export default function ClientsPage() {
  const router = useRouter()
  const [selectedAssessment, setSelectedAssessment] = useState("All Assessments")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const [allAssessments, setAllAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      const fetchData = async () => {
        try {
          const response = await fetch("/api/clients", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          })
          if (!response.ok) {
            throw new Error("Failed to fetch data")
          }
          const data = await response.json()
          setAllAssessments(data)
        } catch (error) {
          console.error(error)
          // Handle error (e.g., redirect to login)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }
  
  // Transform to match the expected format
  const clientData = allAssessments.map(assessment => {
    const completedAt = assessment.completedAt ? new Date(assessment.completedAt) : null
    return {
      id: assessment.clientId || assessment.id,
      date: completedAt ? completedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      assessment: assessment.name,
      rawScore: assessment.score || 0,
      severity: assessment.severity || 'Unknown',
      flags: assessment.riskFlags || [],
      completedAt: completedAt ? completedAt.toLocaleString() : 'Unknown',
      status: assessment.status,
    }
  })

  // Filter data based on selected assessment and search term
  const filteredData = clientData.filter((item) => {
    const matchesAssessment = selectedAssessment === "All Assessments" || item.assessment === selectedAssessment
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assessment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.severity.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesAssessment && matchesSearch
  })

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField as keyof typeof a]
    const bValue = b[sortField as keyof typeof b]

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(sortedData.map((item) => item.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id])
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    if (severity.includes("Severe")) return "destructive"
    if (severity.includes("Moderate")) return "default"
    if (severity.includes("Mild")) return "secondary"
    return "outline"
  }

  const exportData = (format: "csv" | "excel") => {
    const dataToExport =
      selectedRows.length > 0 ? sortedData.filter((item) => selectedRows.includes(item.id)) : sortedData

    if (format === "excel") {
      const excelData = dataToExport.map((item) => ({
        "Client ID": item.id,
        Date: item.date,
        Assessment: item.assessment,
        "Raw Score": item.rawScore,
        Severity: item.severity,
        Flags: item.flags.join("; "),
        "Completed At": item.completedAt,
      }))

      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(excelData)

      const columnWidths = [
        { wch: 15 }, // Client ID
        { wch: 12 }, // Date
        { wch: 12 }, // Assessment
        { wch: 10 }, // Raw Score
        { wch: 25 }, // Severity
        { wch: 20 }, // Flags
        { wch: 20 }, // Completed At
      ]
      worksheet["!cols"] = columnWidths

      XLSX.utils.book_append_sheet(workbook, worksheet, "Assessment Data")

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `assessment-data-${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      console.log(`Exported ${dataToExport.length} records as Excel file`)
      return
    }

    if (format === "csv") {
      const headers = ["Client ID", "Date", "Assessment", "Raw Score", "Severity", "Flags", "Completed At"]
      const csvContent = [
        headers.join(","),
        ...dataToExport.map((item) =>
          [
            item.id,
            item.date,
            item.assessment,
            item.rawScore,
            `"${item.severity}"`,
            `"${item.flags.join("; ")}"`,
            item.completedAt,
          ].join(","),
        ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `assessment-data-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      console.log(`Exported ${dataToExport.length} records as CSV file`)
    }
  }

  const handleViewDetails = (clientId: string) => {
    router.push(`/clients/${clientId}`)
  }

  const handleGenerateReport = (clientId: string) => {
    router.push(`/reports?clientId=${clientId}`)
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
                <h1 className="text-2xl font-bold text-foreground">Client Data Sheet</h1>
                <p className="text-muted-foreground">View and manage all assessment results</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => exportData("csv")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportData("excel")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assessment Results</CardTitle>
                  <CardDescription>
                    {filteredData.length} results{" "}
                    {selectedAssessment !== "All Assessments" && `for ${selectedAssessment}`}
                  </CardDescription>
                </div>
                {selectedRows.length > 0 && <Badge variant="secondary">{selectedRows.length} selected</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by Client ID, Assessment, or Severity..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="w-full sm:w-64">
                  <Label htmlFor="assessment-filter">Assessment Type</Label>
                  <Select value={selectedAssessment} onValueChange={setSelectedAssessment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assessmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Data Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("id")}>
                        Client ID
                        {sortField === "id" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("date")}>
                        Date
                        {sortField === "date" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("assessment")}>
                        Assessment
                        {sortField === "assessment" && (
                          <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/80 text-center"
                        onClick={() => handleSort("rawScore")}
                      >
                        Raw Score
                        {sortField === "rawScore" && (
                          <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/80" onClick={() => handleSort("severity")}>
                        Severity
                        {sortField === "severity" && (
                          <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </TableHead>
                      <TableHead>Flags</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedData.map((item) => (
                      <TableRow key={item.id} className={selectedRows.includes(item.id) ? "bg-muted/30" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={selectedRows.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(item.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.assessment}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">{item.rawScore}</TableCell>
                        <TableCell>
                          <Badge variant={getSeverityBadgeVariant(item.severity)}>{item.severity}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.flags.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="w-4 h-4 text-destructive" />
                              <span className="text-sm text-destructive">{item.flags.join(", ")}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(item.completedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(item.id)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleGenerateReport(item.id)}>
                                <FileText className="w-4 h-4 mr-2" />
                                Generate Report
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{filteredData.length}</div>
                  <div className="text-sm text-muted-foreground">Total Results</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {filteredData.filter((item) => item.flags.length > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">With Risk Flags</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {filteredData.filter((item) => item.severity.includes("Severe")).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Severe Cases</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(filteredData.reduce((sum, item) => sum + item.rawScore, 0) / filteredData.length || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
