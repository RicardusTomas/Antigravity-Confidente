import { generateAIResponse as generateDynamicAI } from './chatResponses';

export async function generateOpenAIResponse(
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ text: string; isAI: boolean }> {
  const result = generateDynamicAI(userMessage, { messageCount: conversationHistory.length });
  return { text: result.text, isAI: true };
}

export function getWelcome(): string {
  return generateDynamicAI('oi').text;
}