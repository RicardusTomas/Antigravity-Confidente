export const AFFIRMATIONS = [
  'Você é mais forte do que imagina. 💪',
  'Cada dia é uma nova chance de recomeçar. 🌅',
  'Seus sentimentos são válidos e importantes. 💜',
  'Você merece paz e tranquilidade. 🕊️',
  'Está tudo bem pedir ajuda quando precisar. 🤝',
  'Você está fazendo o melhor que pode, e isso é suficiente. ⭐',
  'A jornada é tão importante quanto o destino. 🌿',
  'Cuidar de si é o primeiro passo pra cuidar do mundo. 🌻',
  'Respire. Você está exatamente onde precisa estar. 🌊',
  'Sua história importa. Sua voz importa. Você importa. 💫',
  'Não existe timeline certa pra curar. Vá no seu ritmo. 🐢',
  'Celebre cada pequena vitória. Elas constroem grandes conquistas. 🎉',
  'Você não precisa ter todas as respostas agora. 🌙',
  'A gentileza consigo mesmo é uma forma de coragem. 🦋',
  'O sol sempre volta depois da tempestade. ☀️',
];

export const DAILY_TIPS = [
  { title: 'Hidrate-se', desc: 'Beba pelo menos 2L de água hoje. Seu corpo e mente agradecem. 💧', icon: 'water-outline' },
  { title: 'Pausa consciente', desc: 'Faça uma pausa de 5 minutos a cada hora. Levante, alongue, respire. 🧘', icon: 'pause-circle-outline' },
  { title: 'Gratidão', desc: 'Escreva 3 coisas pelas quais você é grato(a) hoje. 📝', icon: 'heart-outline' },
  { title: 'Movimento', desc: 'Uma caminhada de 15 minutos pode transformar seu humor. 🚶', icon: 'walk-outline' },
  { title: 'Conexão', desc: 'Mande uma mensagem carinhosa pra alguém que você ama. 💌', icon: 'chatbubble-heart-outline' },
  { title: 'Natureza', desc: 'Passe alguns minutos ao ar livre. A natureza acalma a mente. 🌳', icon: 'leaf-outline' },
  { title: 'Limite digital', desc: 'Desconecte das redes sociais por 1 hora. Seu cérebro precisa descansar. 📵', icon: 'phone-portrait-outline' },
  { title: 'Sono', desc: 'Tente dormir e acordar no mesmo horário. Rotina ajuda muito. 😴', icon: 'moon-outline' },
];

export function getDailyAffirmation(): string {
  const idx = new Date().getDate() % AFFIRMATIONS.length;
  return AFFIRMATIONS[idx];
}

export function getDailyTip() {
  const idx = new Date().getDate() % DAILY_TIPS.length;
  return DAILY_TIPS[idx];
}
