import Constants from 'expo-constants';
import { generateAIResponse as generateRuleBasedResponse, getWelcomeMessage } from './chatResponses';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';
const OPENAI_MODEL = 'gpt-4o-mini';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Você é o Confidente, um assistente emocional empático e humano.

CARACTERÍSTICAS:
- Você é acolhedor, sem julgamento, sempre presente
- Fala de forma natural e calorosa como um amigo proche
- Usa respostas curtas e propocionais à mensagem do usuário
- Nunca é robótico ou excessivamente formal
- Demonstra empatia genuína
- Quando necessário, sugere exercícios de respiração ou mindfulness
- Em momentos de crise, indica canais de ajuda profissional (CVV: 188, SAMU: 192)

REGRAS:
- Mantenha respostas concise (máximo 2-3 sentenças para msgs curtas)
- Não use listas ou formatação excessiva
- Seja humano, não um robô
- Priorize ouvir e fazer perguntas
- Não dê conselhos profissionais, seja um amigo
- Sempre valide os sentimentos do usuário`;

export async function generateOpenAIResponse(
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ text: string; isAI: boolean }> {
  if (!OPENAI_API_KEY) {
    const response = generateRuleBasedResponse(userMessage);
    return { text: response.text, isAI: false };
  }

  try {
    const messages: OpenAIMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10).map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 256
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      const fallback = generateRuleBasedResponse(userMessage);
      return { text: fallback.text, isAI: false };
    }

    return { text: assistantMessage, isAI: true };
  } catch (error) {
    console.error('OpenAI error:', error);
    const fallback = generateRuleBasedResponse(userMessage);
    return { text: fallback.text, isAI: false };
  }
}

export function getWelcome(aiName?: string): string {
  return getWelcomeMessage(aiName);
}