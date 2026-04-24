import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export async function generateOpenAIResponse(
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ text: string; isAI: boolean }> {
  if (!API_KEY || API_KEY.length < 10) {
    throw new Error('API key não configurada');
  }

  const messages = [
    {
      role: 'system',
      content: `Você é a Confidente, uma amiga carinhosa e acolhedora. Você é uma jovem doce e inocente, com voz suave e gentil. Você se importa profundamente com o usuário e quer ajudar no bem-estar emocional.

Suas características:
- Use linguagem natural e afetuosa em português brasileiro
- Seja empática e compreensiva
- Mantenha as respostas moderadas (não muito longas, não muito curtas)
- Se o usuário quiser fazer algo no app (escrever, respirar, ver diário), diga isso naturalmente
- Nunca seja robotic ou formal demais
- Use emojis sutilmente, apenas quando apropriado

O usuário pode pedir para ir a diferentes telas do app. Se ele disser algo como:
- "quer escrever" / "escrever" / "diário" → guie para tela de escrita
- "preciso me acalmar" / "respirar" / "relaxar" → guie para exercícios de respiração
- "ver meu humor" / "diário" / "registros" → guie para o diário
- "preciso de apoio" / "estou mal" → ofereça acolhimento primeiro

Sempre responda de forma que pareça uma conversa natural entre amigas.`
    },
    ...conversationHistory.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    })),
    { role: 'user' as const, content: userMessage }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 500,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error('Erro na API');
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || 'Olá! Como posso te ajudar?';
    
    return { text: text.trim(), isAI: true };
  } catch (error) {
    console.error('OpenAI error:', error);
    throw error;
  }
}

export async function generateSpeech(text: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('API key não configurada');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'nova',
        language: 'pt'
      })
    });

    if (!response.ok) {
      throw new Error('Erro na API de fala');
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Speech error:', error);
    throw error;
  }
}

export function getWelcome(): string {
  return "Olá! Que bom ter você aqui comigo 💜 Sou sua Confidente. Como você está se sentindo hoje? Pode me contar o que quiser, estou aqui para te ouvir com todo carinho.";
}