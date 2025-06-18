"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, Download, RefreshCw, PlusCircle, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function StrategyPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("plan")

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <AppShell title="Strategy & Planning">
      <div className="grid gap-6">
        <Tabs defaultValue="plan" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="plan">Social Media Plan</TabsTrigger>
              <TabsTrigger value="strategy">Communication Strategy</TabsTrigger>
              <TabsTrigger value="audience">Audience Analysis</TabsTrigger>
              <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="plan" className="m-0">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Social Media Plan</CardTitle>
                  <CardDescription>Define your social media goals, platforms, and content strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="goals">Business Goals</Label>
                      <Textarea
                        id="goals"
                        placeholder="What are your main business objectives for social media?"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platforms">Target Platforms</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {["Instagram", "Facebook", "Twitter", "LinkedIn", "TikTok", "YouTube"].map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <input type="checkbox" id={platform} className="rounded border-gray-300" />
                            <Label htmlFor={platform}>{platform}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Target Audience</Label>
                      <Textarea
                        id="audience"
                        placeholder="Describe your target audience demographics, interests, and behaviors"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content-types">Content Types</Label>
                      <Textarea
                        id="content-types"
                        placeholder="What types of content will you create? (e.g., educational posts, product showcases, behind-the-scenes)"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="posting-frequency">Posting Frequency</Label>
                      <Textarea
                        id="posting-frequency"
                        placeholder="How often will you post on each platform?"
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Plan
                  </Button>
                  <Button>Save Plan</Button>
                </CardFooter>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Strategy Generator</CardTitle>
                    <CardDescription>Generate a social media strategy based on your business</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="business-type">Business Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="saas">SaaS</SelectItem>
                            <SelectItem value="local">Local Business</SelectItem>
                            <SelectItem value="b2b">B2B</SelectItem>
                            <SelectItem value="influencer">Influencer/Creator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" placeholder="e.g., Fashion, Technology, Food" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="key-products">Key Products/Services</Label>
                        <Textarea
                          id="key-products"
                          placeholder="Briefly describe your main products or services"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Reference Documents</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="business-plan" className="rounded border-gray-300" />
                            <Label htmlFor="business-plan" className="text-sm">
                              Business Plan 2024
                            </Label>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Processed
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="brand-guidelines" className="rounded border-gray-300" />
                            <Label htmlFor="brand-guidelines" className="text-sm">
                              Brand Guidelines
                            </Label>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Processed
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="market-research" className="rounded border-gray-300" />
                            <Label htmlFor="market-research" className="text-sm">
                              Market Research Report
                            </Label>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              Processing
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          AI will reference selected documents to create more accurate strategies
                        </p>
                      </div>

                      <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Documents & Generating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate AI Strategy
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Import Existing Strategy</CardTitle>
                    <CardDescription>Upload your existing strategy documents</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                          <p className="text-xs text-gray-500">PDF, DOCX, or XLSX (MAX. 10MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Communication Strategy</CardTitle>
                <CardDescription>Define your brand voice, messaging, and communication guidelines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="brand-voice">Brand Voice & Tone</Label>
                    <Textarea
                      id="brand-voice"
                      placeholder="Describe your brand's voice and tone (e.g., professional, friendly, humorous)"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="key-messages">Key Messages</Label>
                    <Textarea
                      id="key-messages"
                      placeholder="What are the main messages you want to communicate?"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Content Pillars</Label>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Input placeholder={`Content Pillar ${i}`} />
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Pillar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hashtags">Brand Hashtags</Label>
                    <Input id="hashtags" placeholder="e.g., #YourBrand #YourSlogan" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="crisis-plan">Crisis Communication Plan</Label>
                    <Textarea
                      id="crisis-plan"
                      placeholder="How will you handle negative feedback or PR issues?"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Strategy
                </Button>
                <Button>Save Strategy</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Audience Analysis</CardTitle>
                <CardDescription>Understand your audience demographics and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="demographics">Demographics</Label>
                    <Textarea
                      id="demographics"
                      placeholder="Age range, gender, location, income level, etc."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests & Behaviors</Label>
                    <Textarea
                      id="interests"
                      placeholder="What are your audience's interests, hobbies, and online behaviors?"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pain-points">Pain Points & Needs</Label>
                    <Textarea
                      id="pain-points"
                      placeholder="What problems does your audience face that your product/service solves?"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platforms-used">Platforms Used</Label>
                    <Textarea
                      id="platforms-used"
                      placeholder="Which social media platforms does your audience use most?"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Analysis</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="competitors" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Competitor Analysis</CardTitle>
                <CardDescription>Analyze your competitors' social media presence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Competitors</Label>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2 p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`competitor-${i}`}>Competitor {i}</Label>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Input id={`competitor-${i}`} placeholder="Competitor name" />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`platforms-${i}`}>Platforms</Label>
                              <Input id={`platforms-${i}`} placeholder="e.g., Instagram, TikTok" />
                            </div>
                            <div>
                              <Label htmlFor={`followers-${i}`}>Followers</Label>
                              <Input id={`followers-${i}`} placeholder="e.g., 10K, 500K" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor={`strengths-${i}`}>Strengths & Weaknesses</Label>
                            <Textarea
                              id={`strengths-${i}`}
                              placeholder="What do they do well? Where do they fall short?"
                              rows={2}
                            />
                          </div>
                        </div>
                      ))}
                      <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Competitor
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="opportunities">Opportunities</Label>
                    <Textarea
                      id="opportunities"
                      placeholder="What gaps or opportunities exist that your brand can capitalize on?"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Analysis</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
