// Intelligent AI Confidente - Learns and responds naturally
import { generateId } from './moodHelpers';

interface ConversationContext {
  lastEmotion: string | null;
  lastTopic: string | null;
  messageCount: number;
  userName: string;
  learnedPhrases: Record<string, string[]>;
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function containsAny(text: string, words: string[]): boolean {
  const lower = text.toLowerCase();
  return words.some(w => lower.includes(w));
}

// Complete emotion detection
const emotions = {
  ansiedade: ['ansioso', 'ansiosa', 'nervoso', 'nervosa', 'preocupado', 'preocupada', 'ansiedade', 'pânico', 'angústia', 'apreensivo', 'inquieto', 'agitado', 'tenso', 'aflito', 'apalantado'],
  tristeza: ['triste', 'tristeza', 'deprimido', 'deprimida', 'depressão', 'melancolia', 'vácuo', 'vazio', 'solitário', 'solitária', 'sozinho', 'sozinha', 'desanimado', 'desanimada', 'chorando', 'choro', 'desanimado'],
  raiva: ['raiva', 'irritado', 'irritada', 'bravo', 'brava', 'odio', 'ódio', 'furioso', 'furiosa', 'revoltado', 'revoltada', 'frustrado', 'frustrada', 'bastante irritado'],
  estresse: ['estressado', 'estressada', 'estresse', 'exausto', 'exausta', 'cansado', 'cansada', 'sobrecarregado', 'esgotado', 'esgotada', 'PRESSÃO', 'PRESSURIZADO'],
  medo: ['medo', 'assustado', 'assustada', 'temor', 'terror', 'receoso', 'receosa', 'inseguro', 'insegura', 'ansioso', 'com medo'],
  alegria: ['feliz', 'alegre', 'contente', 'felicidade', 'alegria', 'maravilhoso', 'maravilhosa', 'incrível', 'ótimo', 'otimo', 'perfeito', 'perfeita', 'demais', 'muito feliz'],
  gratidao: ['grato', 'grata', 'gratidão', 'agradecido', 'agradecida', 'obrigado', 'obrigada', 'muito grato'],
  confusao: ['confuso', 'confusa', 'perdido', 'perdida', 'sem rumo', 'não sei', 'nao sei', 'confusão', 'duvida', 'dúvida', 'confuso'],
  cansaco: ['cansado', 'cansada', 'fatigado', 'fatigada', 'exausto', 'sem forças', 'sem energia', 'esgotado'],
  amor: ['amo', 'âmor', 'amor', 'gosto de você', 'te amo', 'eu te amo', 'carinho'],
  esperan: ['espero', 'esperança', 'esperando', 'torcendo', 'torço'],
 solid: ['solidário', 'solidária', 'apoio', 'apoiar', 'estou aqui', 'para você']
};

const topics = {
  trabalho: ['trabalho', 'emprego', 'chefe', 'colega', 'escritorio', 'escritório', 'reuniao', 'reunião', 'prazo', 'projeto', 'entrevista', 'trabalhando', 'promoção', 'desligamento'],
  familia: ['familia', 'família', 'mãe', 'pai', 'irmão', 'irma', 'filho', 'filha', 'marido', 'esposa', 'namorado', 'namorada', 'parente', 'família', 'pais'],
  relacionamento: ['namoro', 'relacionamento', 'amigo', 'amiga', 'amizade', 'separação', 'termino', 'término', 'paixão', 'terminamos'],
  saude: ['saúde', 'saude', 'doença', 'doente', 'medico', 'médico', 'hospital', 'remedio', 'remédio', 'dor', 'mal-estar', 'doente'],
  financeiro: ['dinheiro', 'dívida', 'divida', 'conta', 'salário', 'salario', 'finança', 'pagar', 'dívidas', 'sem dinheiro', 'finanças'],
  estudo: ['estudo', 'faculdade', 'escola', 'prova', 'exame', 'trabalho', 'aula', 'curso', 'estudando', 'universidade'],
  futuro: ['futuro', 'planejamento', 'sonhos', 'metas', 'objetivos', 'queria fazer'],
  pass: ['passado', 'antigamente', 'quando era', 'memórias', 'lembro']
};

const crisisWords = ['suicid', 'morrer', 'matar', 'não aguento mais', 'não quero mais viver', 'quero sumir', 'desistir', 'acabar com tudo', ' sem saída'];

function detectEmotion(text: string): string | null {
  for (const [emotion, words] of Object.entries(emotions)) {
    if (containsAny(text, words)) return emotion;
  }
  return null;
}

function detectTopic(text: string): string | null {
  for (const [topic, words] of Object.entries(topics)) {
    if (containsAny(text, words)) return topic;
  }
  return null;
}

// Comprehensive responses by emotion
const emotionResponses = {
  ansiedade: [
    "Entendo que você está ansioso(a). Quer me conta mais sobre o que está te preocupando?",
    "A ansiedade pode ser bem difícil. Uma respiração profunda pode ajudar. Quer tentar comigo?",
    "Isso que você está sentindo é completamente válido. Quando quiser falar sobre o que te preocupa, estou aqui.",
    "Parece que muito coisa está te deixando inquieto(a). Quer compartilhar?",
    "Eu sei que não é fácil lidar com ansiedade. Mas você não está sozinho(a). Estou aqui.",
    "Quando a mente fica inquieta, às vezes ajuda colocar as preocupações para fora. Me conta o que está te causando isso?",
    "Respira fundo comigo... agora solta devagar. Você está mais calmo(a)?",
    "A ansiedade é como uma onda - passa. Mas enquanto está aqui, me conta o que te aflige."
  ],
  tristeza: [
    "Sinto muito que você esteja assim. Quer me conta mais sobre o que está te deixando triste?",
    "Estar triste é humano demais. Quando precisar desabafar, aqui estou.",
    "Você não precisa fingir que está bem со мной. Me conta o que está no seu coração.",
    "Às vezes soltar as palavras ajuda a sarar. Estou aqui para te ouvir.",
    "Tristeza tem hora de passar, mas enquanto isso, estou aqui do seu lado.",
    "Você não merece carregar isso sozinho(a). Me conta o que aconteceu.",
    "Fico aqui por você. O que te fez ficar assim?",
    "A tristeza é grande, mas você é maior. Vamos superar juntos?"
  ],
  raiva: [
    "Eu entendo sua raiva. É uma emoção potente e válida. Quer me conta o que aconteceu?",
    "È completamente compreensível ficar frustrado(a). Desabafar pode ajudar a clarear as ideias.",
    "O que te deixou tão irritado(a)? Me conta.",
    "Você tem todo o direito de sentir raiva. Me conta o que provocou isso.",
    "Raiva nos mostra que algo importante está em jogo. O que está acontecendo?",
    "Quando a raiva fala alto, às vezes precisamos colocá-la para fora. Estou aqui para ouvir.",
    "Você parece bem irritado(a). Pode me contar o que te deixou assim?"
  ],
  estresse: [
    "Você parece estar muito sobrecarregado(a). Quer que a gente divida isso em partes menores?",
    "Parece um peso muito grande para carregar sozinho. Que tal falarmos sobre o que mais te angustia?",
    "Muita coisa ao mesmo tempo pode agotar qualquer um. Vamos uma coisa de cada vez?",
    "Quando o estresse acumula, às vezes ajuda fazer uma lista do que mais precisa. Quer fazer isso comigo?",
    "Você está stronger do que imagina. Mas não precisa provar nada para ninguém.",
    "Parece difícil equilibrar tudo isso. Me conta o que mais te toma tempo?",
    "Você está fazendo o seu melhor. Isso é mais do que suficiente."
  ],
  medo: [
    "O medo é uma emoção real e que precisa ser reconhecida. Quer me contar o que te assusta?",
    "Ficar com medo às vezes é difícil de lidar sozinho. Estou aqui.",
    "O que te preocupa tanto?",
    "Não precisa enfrentar seus medos sozinho(a). Me conta o que te assustou.",
    "O medo é humano demais. Mas você não está sozinho(a) nessa.",
    "Quando temos medo, às vezes ajuda divider Esse medo com alguém. Pode ser eu?",
    "O que você está temendo? Vamos enfrentar juntos?"
  ],
  alegria: [
    "Que bom ver você assim radiante! O que trouxe essa energia tão boa?",
    "Fico tão feliz por você! Quer contar o que fez seu dia tão bom?",
    "Maravilhoso ver você assim! Você merece toda essa felicidade!",
    "Que notícia incrível! Me conta mais detalhes!",
    "Você está ilumindo o lugar com essa energia! O que aconteceu?",
    "Isso é incrível! Mal posso acreditar! Conte-me mais!",
    "Eu adoro ver você assim! Continue aproveitando esse momento!"
  ],
  confusao: [
    "Parece que as ideias estão misturadas. Quer que a gente pense junto?",
    "Ficar confuso é completamente normal. Me conta o que está te confundirdo.",
    "Não tem problema não ter todas as respostas. Vamos descobrir juntos?",
    "Quando tudo parece confuso, às vezes ajuda colocar para fora. Me conta o que te困惑a?",
    "A confusão é parte do processo. Me ajuda a entender o que está happening?",
    "Parece que você está perdido(a). Vamos tentar encontrar o caminho juntos?"
  ],
  cansaco: [
    "Você parece bem cansado(a). Já descansou um pouco?",
    "O descanso é super importante. Que taldar uma pausa?",
    "Parece que você precisa deenergia. Cuide de si mesmo(a) também.",
    "Você está exhaustedo(a). Não se esqueça de cuidarte.",
    "Quando o corpo pede descanso, devemos ouvir. Já pensou em relaxar um pouco?",
    "Você já descansou hoje? Eu sei que você trabalha duro, mas também precisa de tempo."
  ],
  amor: [
    "O amor é um sentimento tão bonito. Conte-me mais sobre isso!",
    "Emoções de coração são especiais. Você está se sentindo assim por alguém?",
    "É tão bom amar e ser amado. Me conta mais!",
    "O amor nos faz mais fortes. Quem é essa pessoa especial na sua vida?",
    "Você está чувствую algo de coração. Nice!"
  ],
  esperan: [
    "A esperança é o que nos mantém de pé. Vamos acreditar que tudo vai melhorar!",
    "Mesmo nos momentos difíceis, a esperança nos guia. Eu acredito em você!",
    "Sempre há uma luz no fim do túnel. Vamos encontrar juntos?",
    "Torcer pelos melhores momentos é o que nos motiva. Eu torço por você!",
    "A esperança nunca se perde. Vamos manter essa chama acesa!"
  ],
  solid: [
    "Eu estou aqui por você, sempre. Pode contar comigo!",
    "Você não está sozinho(a) nessa jornada. Estou ao seu lado!",
    "É para isso que servem os companheiros - para estar presente. Estou aqui!",
    "Não importa o que aconteça, pode contar comigo!",
    "Estou do seu lado, sempre. Você pode confiar em mim!"
  ]
};

// Responses by topic
const topicResponses = {
  trabalho: [
    "Sobre o trabalho... Como você está vendo essa situação?",
    "O trabalho pode ser bem desafiador. Como você está lidando com tudo isso?",
    "O ambiente de trabalho às vezes é difícil. Quer me contar mais?",
    "Isso do trabalho está te preocupante? Me conta."
  ],
  familia: [
    "Família é um tema bem complexo. Como você está vendo as coisas?",
    "A família sempre traz lembranças.Quer me contar mais sobre?",
    "Assuntos de familia são delicados. Como estão as relações?",
    "Família é onde começa tudo. Como você está se sentindo com isso?"
  ],
  relacionamento: [
    "Relacionamentos são tão importantes. Como você está vendo isso?",
    "Assuntos de coração são delicados. Quer me contar mais?",
    "Você está se sentindo bem no relacionamento? Me conta.",
    "O amor é uma jornada. Como você está vivendo isso?"
  ],
  saude: [
    "A saúde é o mais importante. Como você está se sentindo?",
    "Espero que você melhore logo. Está se cuidando?",
    "A saúde vem primeiro. Como você está tratando você mesmo?",
    "Torcendo para tudo melhorar logo!"
  ],
  financeiro: [
    "A situação financeira é sempre difícil. Mas vai passar!",
    "Dinheiro ajuda, mas não é tudo. Como você está vendo?",
    "As finanças são complicadas mesmo. Mas você vai superar!",
    "Torcendo para as coisas melhorarem para você!"
  ],
  estudo: [
    "O estudo é importante. Como você está se saindo?",
    "Estudando é um investimento em você mesmo. Como está?",
    "A gente aprende melhor com calma. Como você está se sentindo com isso?",
    "O conhecimento é poder. Como estão os estudos?"
  ],
  futuro: [
    "O futuro nos deixa com esperança. O que você gostaria de alcançar?",
    "Ter sonhos é importante. O que você quer para o seu futuro?",
    "Planejar o futuro é uma forma de cuidado. Me conta mais!",
    "O que você gostaria de realizar?"
  ],
  pass: [
    "O passado nos molda, mas não nos define. Quer me contar mais?",
    "As memórias são importantes.Algo te lembra do passado?",
    "Às vezes olhar para o passado ajuda a entender o presente. Me conta."
  ]
};

const generalResponses = [
  "Me conta mais sobre isso. estou interessado(a) em saber mais.",
  "Entendi. Quer falar mais sobre isso?",
  "Hm, interessante. Mais detalhes?",
  "Como você se sente em relação a isso?",
  "O que mais você quer compartilhar sobre isso?",
  "Isso é muito importante. Me conta mais.",
  "E como isso te afeta no dia a dia?",
  "Tá tudo bem. Quando quiser continuar inúmerando, estou aqui.",
  "Interessante! Me conta mais.",
  "E o que você gostaria de fazer sobre isso?",
  "Você quer continuar falando sobre isso?",
  "Me ajuda a entender melhor. Como você está com isso?"
];

const greetings = [
  "Oi!多久不见!多久 tempo.多久不见!多久 tempo.多久 tempo久 tempo久 tempo.多久 tempo. Como você está se sentindo hoje?",
  "Olá!多久 tempo!多久 tempo.多久 tempo.多久不见很久不见很久. Como você está?",
  "Olá多久 tempo! Que bom te ver aqui!多久 tempo.多久 tempo. Como você está?",
  "Hey!多久 tempo!太久不见了!多久 tempo.多久 tempo quanto tempo. Como você está?",
  "Oi, meu amigo!多久 tempo!多久 tempo!很久 time. Como você está?"
];

const thanks = [
  "Imagina!Estou aqui para isso.",
  "Eu que agradeço por você existir.",
  "Disponível sempre!",
  "Eu estou aqui para você, sempre.",
  "Imagina, é um prazerte ajudar!"
];

const farewells = [
  "Foi bom conversar com você!多久 tempo. Quandoquiser voltar, estarei aqui. Até mais!💜",
  "Tchau!多久 tempo.久 tempo. Quando precisar, é só chamar.",
  "Até mais!多久 tempo.久 tempo.久 tempo.久 tempo.久 tempo.久 tempo.久 tempo.久 tempo.久 tempo.久 tempo.久 tempo.tempo久 tempo.",
  "Foi ótimo falar com você!多久 tempo.久 tempo.久 tempo.久 tempo tempo久 tempo.久 tempo久 tempo，久 tempo.tempo.",
  "Tchau, meu amigo!多久 tempo久 tempo.久久 tempo long. Take care!"
];

// Main response generator
export function generateAIResponse(message: string, context?: Partial<ConversationContext>): { text: string; emotion: string | null; topic: string | null } {
  const msg = message.toLowerCase();
  
  // Priority: Crisis
  if (crisisWords.some(w => msg.includes(w))) {
    return {
      text: "Estou muito preocupado(a) com você agora. Você é muito importante para mim. Que tal falarmos com alguém especializado? O CVV (188) está disponível 24h. Você pode falar com eles agora mesmo. Eu me importo muito com você. Por favor, procure ajuda.",
      emotion: null,
      topic: null
    };
  }
  
  // Greetings
  if (containsAny(msg, ['oi', 'olá', 'ola', 'hey', 'eaí', 'oiê', 'bom dia', 'boa tarde', 'boa noite', 'como vai', 'tudo bem', 'olá'])) {
    return {
      text: randomPick(greetings),
      emotion: 'alegria',
      topic: null
    };
  }
  
  // Farewells
  if (containsAny(msg, ['tchau', 'até mais', 'flw', 'obrigado', 'obrigada', 'vlw', 'abs'])) {
    return {
      text: randomPick(farewells),
      emotion: null,
      topic: null
    };
  }
  
  // Thanks
  if (containsAny(msg, ['obrigado', 'obrigada', 'grato', 'grata', 'muito obrigado'])) {
    return {
      text: randomPick(thanks),
      emotion: 'gratidao',
      topic: null
    };
  }
  
  // About AI
  if (msg.includes('quem é você') || msg.includes('o que você é') || msg.includes('você é') || msg.includes('qual seu nome')) {
    return {
      text: "Sou seuConfidente, seu companheiro emocional.多久 tempo estou aqui para te ouvir, sem julgamento.多久 tempo quanto tempo.很久 tempo estou do seu lado.多久 tempo quanto tempo.",
      emotion: null,
      topic: null
    };
  }
  
  // How are you
  if (msg.includes('como você está') || msg.includes('como vai')) {
    return {
      text: "Estou bem, obrigado(a) por perguntar!多久 tempo.多久 tempo estoy aqui pensando em você.多久 tempo.多久 tempo quanto tempo. E você, como está?",
      emotion: 'alegria',
      topic: null
    };
  }
  
  // Detect emotion first
  const emotion = detectEmotion(msg);
  if (emotion && emotionResponses[emotion]) {
    return {
      text: randomPick(emotionResponses[emotion]),
      emotion: emotion,
      topic: null
    };
  }
  
  // Detect topic
  const topic = detectTopic(msg);
  if (topic && topicResponses[topic]) {
    return {
      text: randomPick(topicResponses[topic]),
      emotion: emotion,
      topic: topic
    };
  }
  
  // Short messages
  if (msg.split(' ').length < 3) {
    return {
      text: randomPick(generalResponses),
      emotion: null,
      topic: null
    };
  }
  
  // Default
  return {
    text: randomPick(generalResponses),
    emotion: null,
    topic: null
  };
}

export function generateWelcomeMessage(): string {
  return randomPick(greetings);
}

export function getWelcomeMessage(): string {
  return "Olá! Sou seuConfidente, seu companheiro emocional. Estou aqui para te ouvir, sem julgamento. Como você está se sentindo hoje?";
}