"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Upload,
  FileText,
  Trash2,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Plus,
} from "lucide-react"

// Mock document data
const documents = [
  {
    id: 1,
    name: "Business Plan 2024",
    type: "Business Plan",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    status: "processed",
    pages: 45,
    keyInsights: [
      "Target market: Tech-savvy millennials aged 25-40",
      "Revenue goal: $2M by end of 2024",
      "Key differentiator: AI-powered personalization",
      "Main competitors: CompanyA, CompanyB, CompanyC",
    ],
    summary:
      "Comprehensive business plan outlining market strategy, financial projections, and growth plans for an AI-powered e-commerce platform targeting millennials.",
  },
  {
    id: 2,
    name: "Brand Guidelines",
    type: "Brand Document",
    size: "1.8 MB",
    uploadDate: "2024-01-12",
    status: "processed",
    pages: 28,
    keyInsights: [
      "Brand voice: Professional yet approachable",
      "Primary colors: #2563EB, #F59E0B",
      "Target emotion: Trust and innovation",
      "Key messaging: 'Empowering businesses through AI'",
    ],
    summary:
      "Complete brand guidelines including visual identity, voice and tone, messaging framework, and usage examples.",
  },
  {
    id: 3,
    name: "Market Research Report",
    type: "Research",
    size: "3.1 MB",
    uploadDate: "2024-01-10",
    status: "processing",
    pages: 67,
    keyInsights: [],
    summary: "",
  },
  {
    id: 4,
    name: "Product Specifications",
    type: "Product Document",
    size: "1.2 MB",
    uploadDate: "2024-01-08",
    status: "failed",
    pages: 0,
    keyInsights: [],
    summary: "",
  },
]

const statusColors = {
  processed: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-800",
}

const statusIcons = {
  processed: CheckCircle,
  processing: Clock,
  failed: AlertCircle,
  pending: Clock,
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setIsUploadDialogOpen(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <AppShell title="Document Knowledge Base">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                className="pl-10 w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Business Document</DialogTitle>
                <DialogDescription>
                  Upload documents like business plans, brand guidelines, or market research for AI to learn from
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="doc-name">Document Name</Label>
                  <Input id="doc-name" placeholder="e.g., Business Plan 2024" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc-type">Document Type</Label>
                  <select
                    id="doc-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    <option value="">Select document type</option>
                    <option value="business-plan">Business Plan</option>
                    <option value="brand-guidelines">Brand Guidelines</option>
                    <option value="market-research">Market Research</option>
                    <option value="product-specs">Product Specifications</option>
                    <option value="competitor-analysis">Competitor Analysis</option>
                    <option value="customer-personas">Customer Personas</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doc-description">Description (Optional)</Label>
                  <Textarea
                    id="doc-description"
                    placeholder="Brief description of what this document contains"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOCX, PPTX, or TXT (MAX. 25MB)</p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.pptx,.txt"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                    </label>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={isUploading}>{isUploading ? "Uploading..." : "Upload & Process"}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>
                  Documents that AI can reference when generating content and strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocuments.map((doc) => {
                    const StatusIcon = statusIcons[doc.status as keyof typeof statusIcons]
                    return (
                      <div
                        key={doc.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDocument === doc.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedDocument(doc.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <FileText className="h-8 w-8 text-blue-600 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{doc.name}</h4>
                                <Badge variant="outline">{doc.type}</Badge>
                                <Badge
                                  variant="secondary"
                                  className={statusColors[doc.status as keyof typeof statusColors]}
                                >
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {doc.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                <span>{doc.size}</span>
                                <span>{doc.pages} pages</span>
                                <span>Uploaded {doc.uploadDate}</span>
                              </div>
                              {doc.summary && <p className="text-sm text-gray-600">{doc.summary}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {selectedDocument && (
              <Card>
                <CardHeader>
                  <CardTitle>Document Insights</CardTitle>
                  <CardDescription>Key information extracted from this document</CardDescription>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const doc = documents.find((d) => d.id === selectedDocument)
                    if (!doc || doc.keyInsights.length === 0) {
                      return <p className="text-sm text-gray-500">No insights available yet</p>
                    }
                    return (
                      <div className="space-y-3">
                        {doc.keyInsights.map((insight, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm">{insight}</p>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
                <CardDescription>Overview of document processing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Documents</span>
                    <Badge variant="outline">{documents.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Processed</span>
                    <Badge className="bg-green-100 text-green-800">
                      {documents.filter((d) => d.status === "processed").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Processing</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {documents.filter((d) => d.status === "processing").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed</span>
                    <Badge className="bg-red-100 text-red-800">
                      {documents.filter((d) => d.status === "failed").length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Learning Status</CardTitle>
                <CardDescription>How well AI understands your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Business Understanding</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Brand Knowledge</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Market Insights</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
