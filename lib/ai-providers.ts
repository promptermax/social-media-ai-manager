// OpenAI and Anthropic provider adapters for text and image generation
import Anthropic from '@anthropic-ai/sdk'

export type AIProvider = 'anthropic'

export interface AITextGenerationParams {
  prompt: string
  model?: string
  [key: string]: any
}

export interface AIImageGenerationParams {
  prompt: string
  n?: number
  size?: string
  [key: string]: any
}

export interface AIProviderAdapter {
  generateText(params: AITextGenerationParams): Promise<string>
}

// Anthropic Adapter
export class AnthropicAdapter implements AIProviderAdapter {
  private anthropic: Anthropic
  constructor(apiKey: string) {
    this.anthropic = new Anthropic({ apiKey })
  }
  async generateText(params: AITextGenerationParams): Promise<string> {
    // TODO: Implement with anthropic.messages.create
    return '[Claude] Generated text (stub)'
  }
}

// Adapter Factory
export function getAIProviderAdapter(provider: AIProvider, apiKey: string): AIProviderAdapter {
  switch (provider) {
    case 'anthropic':
      return new AnthropicAdapter(apiKey)
    default:
      throw new Error('Unsupported AI provider')
  }
} 