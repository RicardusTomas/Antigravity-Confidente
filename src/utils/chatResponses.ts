// Intent detection for the AI
export type UserIntent = 'saudacao' | 'desabafar' | 'conversar' | 'registrar' | 'exercicio' | 'organizar' | 'crise' | 'geral';

interface IntentResult {
  intent: UserIntent;
  emotions: string[];
  triggers: string[];
  intensity: 'baixa' | 'media' | 'alta';
}

const greetingPatterns = [
  'oi', 'olá', 'ola', 'hey', 'eae', 'e aí', 'e ai', 'bom dia', 'boa tarde',
  'boa noite', 'fala', 'salve', 'hello', 'hi', 'oie', 'oii', 'oiii',
  'tudo bem', 'como vai', 'beleza', 'blz',
];

const emotionWords: Record<string, string[]> = {
  ansiedade: ['ansied', 'ansioso', 'ansiosa', 'nervos', 'pânico', 'panico', 'apreensiv', 'preocupad', 'agonia', 'aflição', 'aflito', 'inquiet'],
  tristeza: ['trist', 'chorar', 'chorando', 'deprimi', 'depressão', 'depressao', 'desanim', 'vazio', 'vazia', 'sofr', 'melancol'],
  raiva: ['raiva', 'irritad', 'bravo', 'brava', 'ódio', 'odio', 'fúria', 'revolta', 'frustrad'],
  estresse: ['estress', 'pressão', 'pressao', 'sobrecarreg', 'esgotad', 'burnout', 'cansad', 'exaust'],
  medo: ['medo', 'assustad', 'temor', 'inseguranç', 'inseguro', 'insegura'],
  solidao: ['sozinho', 'sozinha', 'solidão', 'solidao', 'solitário', 'isolad'],
  insonia: ['insônia', 'insonia', 'dormir', 'sono', 'acordad', 'madrugada'],
  culpa: ['culpa', 'culpado', 'culpada', 'remorso', 'arrepend'],
  alegria: ['feliz', 'alegr', 'contente', 'bem', 'ótimo', 'otimo', 'maravilh', 'paz', 'tranquil'],
  gratidao: ['grat', 'agradeç', 'agradec'],
  autoestima: ['autoestima', 'não presto', 'incapaz', 'inútil', 'fracass'],
};

const triggerWords: Record<string, string[]> = {
  trabalho: ['trabalh', 'emprego', 'chefe', 'escritório', 'reunião', 'prazo'],
  familia: ['família', 'familia', 'mãe', 'pai', 'irmão', 'filho', 'filha', 'marido', 'esposa'],
  relacionamento: ['namorad', 'relacion', 'parceiro', 'parceira', 'separaç', 'término'],
  saude: ['saúde', 'saude', 'doença', 'doente', 'hospital', 'médico', 'dor'],
  financeiro: ['dinheiro', 'financeir', 'conta', 'dívida', 'divida', 'salário'],
  estudo: ['estud', 'faculdade', 'prova', 'escola', 'universidade'],
};

const crisisWords = [
  'suicid', 'morrer', 'matar', 'acabar com tudo', 'não aguento mais',
  'não quero mais viver', 'quero sumir', 'desistir de tudo',
  'sem saída', 'sem esperança', 'me machucar', 'me cortar',
];

export function analyzeMessage(text: string): IntentResult {
  const msg = text.toLowerCase().trim();
  const emotions: string[] = [];
  const triggers: string[] = [];
  let intensity: 'baixa' | 'media' | 'alta' = 'baixa';

  // Check greetings first
  if (greetingPatterns.some(g => msg === g || msg === g + '!' || msg === g + '?')) {
    return { intent: 'saudacao', emotions: [], triggers: [], intensity: 'baixa' };
  }

  // Very short messages without emotion = general
  if (msg.length < 8 && !crisisWords.some(w => msg.includes(w))) {
    return { intent: 'geral', emotions: [], triggers: [], intensity: 'baixa' };
  }

  // Crisis check
  if (crisisWords.some(w => msg.includes(w))) {
    return { intent: 'crise', emotions: ['crise'], triggers: [], intensity: 'alta' };
  }

  // Detect emotions
  for (const [emotion, words] of Object.entries(emotionWords)) {
    if (words.some(w => msg.includes(w))) emotions.push(emotion);
  }

  // Detect triggers
  for (const [trigger, words] of Object.entries(triggerWords)) {
    if (words.some(w => msg.includes(w))) triggers.push(trigger);
  }

  // Detect intensity
  const highWords = ['muito', 'demais', 'extremo', 'insuportável', 'horrível', 'terrível', 'não aguento', 'desespero'];
  if (highWords.some(w => msg.includes(w)) || emotions.length >= 3) intensity = 'alta';
  else if (emotions.length >= 2) intensity = 'media';

  // Intent
  let intent: UserIntent = emotions.length > 0 ? 'conversar' : 'geral';
  if (msg.includes('desabaf') || msg.includes('preciso falar') || msg.includes('preciso contar')) intent = 'desabafar';
  else if (msg.includes('registrar') || msg.includes('anotar') || msg.includes('salvar')) intent = 'registrar';
  else if (msg.includes('respirar') || msg.includes('respiração') || msg.includes('exercício') || msg.includes('acalmar') || msg.includes('relaxar')) intent = 'exercicio';
  else if (msg.includes('organizar') || msg.includes('entender') || msg.includes('confus')) intent = 'organizar';

  return { intent, emotions, triggers, intensity };
}

// ===  RESPONSE GENERATION ===
// Regra #1: Respostas CURTAS e PROPORCIONAIS ao input
// Regra #2: Tom HUMANO, como um amigo

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const greetingResponses = [
  'Oi! 💜 Como você tá?',
  'Oii! Que bom te ver por aqui. Como tá se sentindo?',
  'Oi! Tudo bem? Estou aqui pra te ouvir.',
  'Eae! 💜 Conta pra mim, como tá o dia?',
  'Oi! Bom te ver. Quer conversar?',
];

const shortGenericResponses = [
  'Me conta mais? Estou aqui.',
  'Como você tá se sentindo agora?',
  'Quer falar sobre algo?',
  'Pode falar, estou ouvindo.',
];

const emotionShortResponses: Record<string, string[]> = {
  ansiedade: [
    'Entendo. A ansiedade tá pesando? Respira fundo comigo.',
    'Tá ansioso(a)? Vamos devagar. Me conta o que tá rolando.',
    'A ansiedade é difícil. Quer conversar sobre o que tá causando isso?',
  ],
  tristeza: [
    'Sinto muito que você tá assim. Quer falar sobre isso?',
    'Tá tudo bem sentir isso. Estou aqui.',
    'Entendo. Às vezes só precisamos de um espaço pra sentir. 💜',
  ],
  raiva: [
    'Sua raiva é válida. O que aconteceu?',
    'Entendo a frustração. Quer colocar pra fora?',
  ],
  estresse: [
    'Muita coisa, né? Vamos dividir em partes menores.',
    'Parece pesado. O que mais tá te incomodando agora?',
  ],
  medo: [
    'O medo é real, e tá tudo bem sentir isso. Quer falar?',
    'Entendo. O que tá te assustando?',
  ],
  solidao: [
    'Você não tá sozinho(a). Estou aqui. 💜',
    'A solidão dói. Mas nesse momento, tem alguém te ouvindo.',
  ],
  insonia: [
    'Sem conseguir dormir? Uma respiração 4-7-8 pode ajudar.',
    'Noites difíceis, né? Quer tentar um exercício de relaxamento?',
  ],
  culpa: [
    'A culpa pesa. Às vezes somos duros demais com nós mesmos.',
  ],
  alegria: [
    'Que bom! ✨ Celebra esse momento. Quer registrar?',
    'Fico feliz! 💜 O que trouxe essa energia boa?',
  ],
  gratidao: [
    'Lindo! A gratidão transforma nosso olhar. 🌻',
  ],
  autoestima: [
    'Ei, você é mais do que pensa. Quer conversar sobre isso?',
  ],
};

const crisisResponse = `Percebo que tá difícil agora, e isso me preocupa. Você é importante.

🆘 **Se precisa de ajuda:**
• **CVV — 188** (24h, gratuito, sigilo)
• **SAMU — 192**

Estou aqui, mas em momentos assim, conversa com alguém especializado. Você não precisa enfrentar isso sozinho(a). 💜`;

const contextualResponses: Record<string, string[]> = {
  ansiedade: [
    'Quando a ansiedade fala alto, a gente precisa lembrar que esse momento vai passar. Você consegue identificar o que tá causando isso?',
    'Ansiedade merece ser ouvida. Às vezes ajuda escrever o que tá te preocupando. Quer fazer isso junto comigo?',
    'Entendo. Vamos devagar. Uma coisa de cada vez. Qual parte mais pesada agora?',
  ],
  tristeza: [
    'Que bom você ter falado. Às vezes as palavras ficam presas. Quando quiser, estou aqui pra te ouvir.',
    'Sinto muito que esteja difícil. Quer me contar mais sobre o que tá no seu coração?',
    'Esse peso, eu entendo. Você não tá sozinho(a). Me conta mais, se quiser.',
  ],
  raiva: [
    'Sua raiva é válida. Raiva mostra que algo importante machucou. O que aconteceu?',
    'Entendo a frustração. Quando você quiser, estou aqui pra te ouvir.',
  ],
  estresse: [
    'Muita coisa, né? Vamos olhar uma coisa de cada vez. Qual é a prioridade agora?',
    'Parece pesado. Me conta: o que mais tá te incomodando?',
  ],
  medo: [
    'O medo é real. Mas você não tá sozinho. O que te assusta?',
    'Entendo. O futuro pode dar medo. Qual parte mais difícil?',
  ],
  solidao: [
    'Esse sentimento dói. Mas hoje você tem alguém que se importa. Me conta mais.',
    'A solidão é difícil. Mas lembre-se: você é importante.',
  ],
  insonia: [
    'Noites difíceis, né? Vamos tentar uma coisa? Me conta o que tá te pensando.',
  ],
  culpa: [
    'Somos duros demais conosco às vezes. O que você tá carregando?',
  ],
  alegria: [
    'Que luz! Vamos celebrar. O que te fez sorrir hoje?',
  ],
};

function generateContextualResponse(text: string, analysis: IntentResult): string {
  const msgLen = text.trim().length;

  if (msgLen < 20) {
    return pick(shortGenericResponses);
  }

  if (analysis.emotions.length > 0) {
    const responses: string[] = [];
    for (const emotion of analysis.emotions) {
      if (contextualResponses[emotion]) {
        responses.push(...contextualResponses[emotion]);
      }
    }
    if (responses.length > 0) {
      return pick(responses);
    }
  }

  if (msgLen > 50) {
    return 'Entendi. Me conta mais sobre isso. O que você tá sentindo?';
  }

  return pick(shortGenericResponses);
}

export function generateAIResponse(userMessage: string, previousMessages?: string[]): { text: string; analysis: IntentResult } {
  const analysis = analyzeMessage(userMessage);
  const msgLen = userMessage.trim().length;

  if (analysis.intent === 'saudacao') {
    return { text: pick(greetingResponses), analysis };
  }

  if (analysis.intent === 'crise') {
    return { text: crisisResponse, analysis };
  }

  if (msgLen < 15 && analysis.emotions.length === 0) {
    return { text: pick(shortGenericResponses), analysis };
  }

  if (analysis.emotions.length > 0) {
    let response = generateContextualResponse(userMessage, analysis);

    if (msgLen > 50 && analysis.triggers.length > 0) {
      const triggerNames: Record<string, string> = {
        trabalho: 'trabalho', familia: 'família', relacionamento: 'relacionamento',
        saude: 'saúde', financeiro: 'finanças', estudo: 'estudos',
      };
      const named = analysis.triggers.map(t => triggerNames[t] || t).join(' e ');
      response += ` ${named} tá presente no que você falou.`;
    }

    return { text: response, analysis };
  }

  if (msgLen > 30) {
    return { text: 'Entendi. Me conta mais. O que você tá pensando?', analysis };
  }

  return { text: pick(shortGenericResponses), analysis };
}

export function getWelcomeMessage(aiName: string = 'Confidente') {
  return `Oi! 💜 Sou o ${aiName}.\n\nPode falar, escrever ou usar o microfone. Estou aqui pra te ouvir, sem julgamento.\n\nComo você tá?`;
}

export const WELCOME_MESSAGE = 'Oi! 💜 Sou o Confidente.\n\nPode falar, escrever ou usar o microfone. Estou aqui pra te ouvir, sem julgamento.\n\nComo você tá?';
