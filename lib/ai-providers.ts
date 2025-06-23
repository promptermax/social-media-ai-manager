// OpenAI and Anthropic provider adapters for text and image generation
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export type AIProvider = 'openai' | 'anthropic'

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
  generateImage?(params: AIImageGenerationParams): Promise<string[]>
}

// OpenAI Adapter
export class OpenAIAdapter implements AIProviderAdapter {
  private openai: OpenAI
  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey })
  }
  async generateText(params: AITextGenerationParams): Promise<string> {
    // TODO: Implement with openai.chat.completions.create
    return '[OpenAI] Generated text (stub)'
  }
  async generateImage(params: AIImageGenerationParams): Promise<string[]> {
    // TODO: Implement with openai.images.generate
    return ['https://via.placeholder.com/512x512?text=OpenAI+Image']
  }
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
    case 'openai':
      return new OpenAIAdapter(apiKey)
    case 'anthropic':
      return new AnthropicAdapter(apiKey)
    default:
      throw new Error('Unsupported AI provider')
  }
} 