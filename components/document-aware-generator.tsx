"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, FileText, Lightbulb, TrendingUp } from "lucide-react"

interface DocumentAwareGeneratorProps {
  type: "strategy" | "content" | "calendar"
  onGenerate: (prompt: string, documents: string[]) => void
  isGenerating: boolean
}

export function DocumentAwareGenerator({ type, onGenerate, isGenerating }: DocumentAwareGeneratorProps) {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [customPrompt, setCustomPrompt] = useState("")

  const availableDocuments = [
    { id: "business-plan", name: "Business Plan 2024", status: "processed", insights: 15 },
    { id: "brand-guidelines", name: "Brand Guidelines", status: "processed", insights: 8 },
    { id: "market-research", name: "Market Research Report", status: "processing", insights: 0 },
    { id: "competitor-analysis", name: "Competitor Analysis", status: "processed", insights: 12 },
  ]

  const handleDocumentToggle = (docId: string) => {
    setSelectedDocs((prev) => (prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]))
  }

  const getPromptSuggestions = () => {
    switch (type) {
      case "strategy":
        return [
          "Create a comprehensive social media strategy based on our business goals",
          "Develop a content strategy that aligns with our brand voice and target audience",
          "Generate a competitive social media strategy using market research insights",
        ]
      case "content":
        return [
          "Write engaging posts that reflect our brand personality",
          "Create content that addresses our target audience's pain points",
          "Generate posts that highlight our key differentiators",
        ]
      case "calendar":
        return [
          "Plan a month of content based on our product launch timeline",
          "Create a content calendar that supports our business objectives",
          "Schedule posts that align with our marketing campaigns",
        ]
      default:
        return []
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Document-Aware Generator
        </CardTitle>
        <CardDescription>Generate {type} using insights from your uploaded business documents</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="prompt">Custom Prompt</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div>
              <Label className="text-base font-medium">Select Documents to Reference</Label>
              <p className="text-sm text-gray-500 mb-3">
                Choose which documents the AI should use to inform the generation
              </p>
            </div>

            <div className="space-y-3">
              {availableDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedDocs.includes(doc.id) ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                  }`}
                  onClick={() => doc.status === "processed" && handleDocumentToggle(doc.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedDocs.includes(doc.id)}
                        onChange={() => handleDocumentToggle(doc.id)}
                        disabled={doc.status !== "processed"}
                        className="rounded border-gray-300"
                      />
                      <FileText className="h-4 w-4 text-gray-600" />
                      <div>
                        <span className="font-medium">{doc.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={
                              doc.status === "processed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {doc.status}
                          </Badge>
                          {doc.insights > 0 && (
                            <Badge variant="secondary">
                              <Lightbulb className="h-3 w-3 mr-1" />
                              {doc.insights} insights
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedDocs.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">AI Enhancement Active</span>
                </div>
                <p className="text-sm text-blue-700">
                  The AI will use insights from {selectedDocs.length} document(s) to create more accurate and
                  personalized {type}.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="prompt" className="space-y-4">
            <div>
              <Label htmlFor="custom-prompt">Custom Generation Prompt</Label>
              <Textarea
                id="custom-prompt"
                placeholder={`Enter specific instructions for ${type} generation...`}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific about what you want. The AI will combine your prompt with document insights.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <div>
              <Label className="text-base font-medium">Suggested Prompts</Label>
              <p className="text-sm text-gray-500 mb-3">Click on a suggestion to use it</p>
            </div>

            <div className="space-y-2">
              {getPromptSuggestions().map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-3"
                  onClick={() => setCustomPrompt(suggestion)}
                >
                  <div>
                    <p className="text-sm">{suggestion}</p>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            {selectedDocs.length > 0 && `Using ${selectedDocs.length} document(s) for context`}
          </div>
          <Button
            onClick={() => onGenerate(customPrompt, selectedDocs)}
            disabled={isGenerating || selectedDocs.length === 0}
          >
            {isGenerating ? "Generating..." : `Generate ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
