import { getAIProviderAdapter, AIProvider, AITextGenerationParams, AIImageGenerationParams } from './ai-providers'

// Supported task types
export type AITaskType = 'text' | 'image'

interface RouteAIRequestParams {
  type: AITaskType
  params: AITextGenerationParams | AIImageGenerationParams
  preferredProvider?: AIProvider
}

// Simple task assessment logic (can be extended with more advanced heuristics)
function assessProvider(type: AITaskType, preferredProvider?: AIProvider): AIProvider {
  if (preferredProvider) return preferredProvider
  // Example: Use OpenAI for images, Anthropic for long text, OpenAI for short text
  if (type === 'image') return 'openai'
  return 'openai' // Default to OpenAI for text for now
}

export async function routeAIRequest({ type, params, preferredProvider }: RouteAIRequestParams): Promise<any> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables. Please add it to your .env file.');
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables. Please add it to your .env file.');
  }
  const provider = assessProvider(type, preferredProvider)
  const apiKey =
    provider === 'openai'
      ? process.env.OPENAI_API_KEY || ''
      : process.env.ANTHROPIC_API_KEY || ''
  const adapter = getAIProviderAdapter(provider, apiKey)

  if (type === 'text') {
    return adapter.generateText(params as AITextGenerationParams)
  } else if (type === 'image' && adapter.generateImage) {
    return adapter.generateImage(params as AIImageGenerationParams)
  } else {
    throw new Error('Unsupported AI task type or provider does not support this task')
  }
} 