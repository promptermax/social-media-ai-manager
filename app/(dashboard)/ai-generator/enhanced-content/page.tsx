"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DocumentAwareGenerator } from "@/components/document-aware-generator"
import { Copy, RefreshCw, Download, Sparkles } from "lucide-react"

export default function EnhancedContentPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState({
    caption: "",
    hashtags: "",
    blog: "",
    strategy: "",
  })

  const handleGenerate = async (prompt: string, documents: string[]) => {
    setIsGenerating(true)
    // Simulate AI generation with document context (remove setTimeout)
    setGeneratedContent({
      caption: `🚀 Exciting news from our AI-powered e-commerce platform! \n\nBased on our business plan insights, we're targeting tech-savvy millennials aged 25-40 who value personalization and innovation. Our latest feature uses advanced AI to create truly personalized shopping experiences.\n\nThis aligns perfectly with our goal to reach $2M revenue by end of 2024, and our key differentiator of AI-powered personalization is what sets us apart from CompanyA and CompanyB.\n\nWhat do you think about AI in e-commerce? Share your thoughts below! 👇\n\n#AIEcommerce #Personalization #Innovation #TechMillennials #EmpoweringBusinesses`,
      hashtags: `#AIEcommerce #Personalization #Innovation #TechMillennials #EmpoweringBusinesses #AITechnology #SmartShopping #DigitalTransformation #CustomerExperience #FutureOfRetail #MachineLearning #DataDriven #UserExperience #TechTrends #BusinessGrowth`,
      blog: `# The Future of AI-Powered E-commerce: Empowering Businesses Through Personalization\n\n*Based on our comprehensive business strategy and market research*\n\n## Executive Summary\n\nAs outlined in our business plan, the e-commerce landscape is rapidly evolving, and AI-powered personalization has become the key differentiator for success. Our platform targets tech-savvy millennials aged 25-40, a demographic that values innovation and personalized experiences above traditional shopping methods.\n\n## Market Opportunity\n\nOur market research reveals that 73% of millennials are willing to pay premium prices for personalized experiences. This aligns perfectly with our revenue goal of $2M by end of 2024, positioning us strategically against competitors like CompanyA and CompanyB who still rely on traditional recommendation systems.\n\n## Our AI Advantage\n\n### Personalization at Scale\nOur AI technology analyzes user behavior, preferences, and purchase history to create unique shopping experiences for each customer. This isn't just about showing related products – it's about understanding the customer's lifestyle and needs.\n\n### Key Differentiators\n- **Advanced Machine Learning**: Unlike CompanyA's rule-based system\n- **Real-time Adaptation**: Instant personalization based on current session behavior  \n- **Cross-platform Integration**: Seamless experience across web and mobile\n- **Predictive Analytics**: Anticipating customer needs before they realize them\n\n## Brand Alignment\n\nThis initiative perfectly embodies our brand message of "Empowering businesses through AI" while maintaining our professional yet approachable voice. Our target emotion of trust and innovation is reflected in every aspect of the user experience.\n\n## Looking Forward\n\nAs we work toward our 2024 goals, AI-powered personalization will continue to be our north star, helping us build lasting relationships with our millennial customer base while driving sustainable revenue growth.\n\n*What are your thoughts on AI in e-commerce? How do you see personalization evolving in the next few years?*`,
      strategy: `# AI-Enhanced Social Media Strategy\n*Generated using Business Plan 2024 and Brand Guidelines*\n\n## Strategic Overview\nBased on our business plan analysis, this strategy targets tech-savvy millennials (25-40) to achieve our $2M revenue goal by end of 2024.\n\n## Content Pillars\n1. **AI Innovation Showcase** (30%)\n   - Highlight our AI-powered personalization features\n   - Behind-the-scenes AI development content\n   - Customer success stories with AI\n\n2. **Millennial Lifestyle Content** (25%)\n   - Tech trends and insights\n   - Work-life balance solutions\n   - Sustainable shopping practices\n\n3. **Educational Content** (25%)\n   - AI in e-commerce tutorials\n   - Personalization benefits\n   - Industry thought leadership\n\n4. **Community Building** (20%)\n   - User-generated content\n   - Customer testimonials\n   - Interactive polls and Q&As\n\n## Platform Strategy\n- **Instagram**: Visual storytelling, behind-the-scenes, lifestyle content\n- **LinkedIn**: Thought leadership, B2B insights, professional content\n- **TikTok**: Quick AI demos, trend participation, younger millennial engagement\n- **Twitter**: Industry news, quick updates, customer service\n\n## Brand Voice Implementation\n- Professional yet approachable tone\n- Focus on trust and innovation\n- "Empowering businesses through AI" messaging\n- Use of primary colors: #2563EB, #F59E0B\n\n## Competitive Positioning\n- Emphasize AI personalization vs. CompanyA's basic recommendations\n- Highlight real-time adaptation vs. CompanyB's static approach\n- Position as innovation leader in the space\n\n## Success Metrics\n- Engagement rate: Target 8%+\n- Lead generation: 500 qualified leads/month\n- Brand awareness: 25% increase in brand mentions\n- Revenue attribution: 15% of $2M goal from social media`,
    })
    setIsGenerating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <AppShell title="Document-Aware Content Generator">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DocumentAwareGenerator type="content" onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generated Content
                  </CardTitle>
                  <CardDescription>AI-generated content based on your business documents</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyzing your documents and generating personalized content...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                  </div>
                </div>
              ) : generatedContent.caption ? (
                <Tabs defaultValue="caption" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="caption">Social Post</TabsTrigger>
                    <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
                    <TabsTrigger value="blog">Blog Post</TabsTrigger>
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                  </TabsList>

                  <TabsContent value="caption" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Document-Enhanced Social Media Post</h3>
                        <Badge className="bg-green-100 text-green-800">Business Plan Applied</Badge>
                        <Badge className="bg-blue-100 text-blue-800">Brand Voice Applied</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.caption)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={generatedContent.caption}
                      onChange={(e) => setGeneratedContent({ ...generatedContent, caption: e.target.value })}
                      rows={12}
                      className="resize-none"
                    />
                  </TabsContent>

                  <TabsContent value="hashtags" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Targeted Hashtags</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.hashtags)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={generatedContent.hashtags}
                      onChange={(e) => setGeneratedContent({ ...generatedContent, hashtags: e.target.value })}
                      rows={6}
                      className="resize-none"
                    />
                  </TabsContent>

                  <TabsContent value="blog" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Business-Aligned Blog Post</h3>
                        <Badge className="bg-purple-100 text-purple-800">Market Research Applied</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.blog)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={generatedContent.blog}
                      onChange={(e) => setGeneratedContent({ ...generatedContent, blog: e.target.value })}
                      rows={16}
                      className="resize-none"
                    />
                  </TabsContent>

                  <TabsContent value="strategy" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Comprehensive Strategy</h3>
                        <Badge className="bg-orange-100 text-orange-800">All Documents Applied</Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedContent.strategy)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={generatedContent.strategy}
                      onChange={(e) => setGeneratedContent({ ...generatedContent, strategy: e.target.value })}
                      rows={20}
                      className="resize-none"
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select documents and generate content to see AI-enhanced results</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Content will be personalized based on your business documents
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
