// hooks/useAIClient.ts

type AIRequest = {
  type: 'text' | 'image';
  params: Record<string, any>;
  preferredProvider?: 'openai' | 'anthropic';
};

export async function aiRequest({ type, params, preferredProvider }: AIRequest) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, params, preferredProvider }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'AI request failed');
  return data.result;
} 