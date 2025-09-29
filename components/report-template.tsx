import { BarChart3, AlertTriangle, CheckCircle } from "lucide-react"

interface ReportTemplateProps {
  clientId: string
  assessment: string
  score: number
  severity: string
  riskFlags: string[]
  clinicalNotes?: string
  recommendations?: string[]
  generatedDate: Date
  assessmentDate: Date
}

export function ReportTemplate({
  clientId,
  assessment,
  score,
  severity,
  riskFlags,
  clinicalNotes,
  recommendations,
  generatedDate,
  assessmentDate,
}: ReportTemplateProps) {
  const getSeverityColor = (severity: string) => {
    if (severity.includes("Severe")) return "text-red-700 bg-red-50"
    if (severity.includes("Moderate")) return "text-orange-700 bg-orange-50"
    if (severity.includes("Mild")) return "text-yellow-700 bg-yellow-50"
    return "text-green-700 bg-green-50"
  }

  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-2 border-green-200 pb-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">Psychology Assessment Report</h1>
            <p className="text-gray-600 text-lg">Professional Clinical Assessment</p>
          </div>
          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-green-700" />
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-100 pb-2">Client Information</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 font-medium">Client ID:</span>
              <span className="ml-3 text-gray-900">{clientId}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Assessment Type:</span>
              <span className="ml-3 text-gray-900">{assessment}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 font-medium">Assessment Date:</span>
              <span className="ml-3 text-gray-900">{assessmentDate.toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Report Generated:</span>
              <span className="ml-3 text-gray-900">{generatedDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Results */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-100 pb-2">Assessment Results</h2>
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <span className="text-gray-600 font-medium">Total Score:</span>
              <span className="ml-3 text-2xl font-bold text-green-700">{score}</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Severity Level:</span>
              <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(severity)}`}>
                {severity}
              </span>
            </div>
          </div>

          {/* Risk Flags */}
          {riskFlags.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-semibold text-red-700">Risk Flags Identified</span>
              </div>
              <ul className="list-disc list-inside text-red-700 space-y-1">
                {riskFlags.map((flag, index) => (
                  <li key={index}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Clinical Notes */}
      {clinicalNotes && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-100 pb-2">Clinical Notes</h2>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-gray-700 leading-relaxed">{clinicalNotes}</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-100 pb-2">
            Clinical Recommendations
          </h2>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scoring Breakdown */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-green-700 mb-4 border-b border-green-100 pb-2">
          Scoring Interpretation
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Score Ranges ({assessment}):</h3>
              <ul className="space-y-1 text-gray-600">
                <li>0-4: Minimal symptoms</li>
                <li>5-9: Mild symptoms</li>
                <li>10-14: Moderate symptoms</li>
                <li>15-19: Moderately severe symptoms</li>
                <li>20-27: Severe symptoms</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Clinical Significance:</h3>
              <p className="text-gray-600">
                Scores of 10 or greater indicate clinically significant symptoms that may warrant further evaluation and
                potential treatment intervention.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-green-200 pt-6 mt-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            This report is confidential and intended for professional clinical use only.
          </p>
          <p className="text-xs text-gray-500">
            Generated by Psychology Assessment Platform • {generatedDate.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
