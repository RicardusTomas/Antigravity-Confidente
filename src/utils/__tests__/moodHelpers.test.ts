describe('moodHelpers', () => {
  const MOODS = [
    { key: 'happy', emoji: '😊', label: 'Feliz', color: '#F5C547', message: 'Que bom!' },
    { key: 'calm', emoji: '😌', label: 'Calmo', color: '#7CB9A8', message: 'Aproveite.' },
    { key: 'grateful', emoji: '🙏', label: 'Grato', color: '#8BC98A', message: 'Lindo!' },
    { key: 'hopeful', emoji: '🌟', label: 'Esperançoso', color: '#D4A8D3', message: 'Força!' },
    { key: 'anxious', emoji: '😰', label: 'Ansioso', color: '#E8A87C', message: 'Respire.' },
    { key: 'sad', emoji: '😢', label: 'Triste', color: '#7C8CB5', message: 'Estou aqui.' },
    { key: 'angry', emoji: '😤', label: 'Irritado', color: '#C97B7B', message: 'Válido.' },
    { key: 'tired', emoji: '😴', label: 'Cansado', color: '#A89CC8', message: 'Descanse.' },
    { key: 'lonely', emoji: '🥺', label: 'Solitário', color: '#8BA7C8', message: 'Não está só.' },
    { key: 'overwhelmed', emoji: '😵', label: 'Sobrecarregado', color: '#A08B9B', message: 'Devagar.' },
  ];

  const getMoodInfo = (mood: string) => MOODS.find((m) => m.key === mood) || MOODS[0];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const formatDate = (ds: string) => {
    const d = new Date(ds);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    if (diff < 7) return `${diff} dias atrás`;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

  describe('getMoodInfo', () => {
    it('should return correct mood info for happy', () => {
      const moodInfo = getMoodInfo('happy');
      expect(moodInfo.key).toBe('happy');
      expect(moodInfo.emoji).toBe('😊');
      expect(moodInfo.label).toBe('Feliz');
    });

    it('should return correct mood for sad', () => {
      const moodInfo = getMoodInfo('sad');
      expect(moodInfo.key).toBe('sad');
      expect(moodInfo.emoji).toBe('😢');
    });

    it('should return first mood for invalid key', () => {
      const moodInfo = getMoodInfo('invalid');
      expect(moodInfo.key).toBe('happy');
    });
  });

  describe('getGreeting', () => {
    it('should return a valid greeting', () => {
      const greeting = getGreeting();
      expect(['Bom dia', 'Boa tarde', 'Boa noite']).toContain(greeting);
    });
  });

  describe('formatDate', () => {
    it('should return "Hoje" for today', () => {
      const today = new Date().toISOString();
      expect(formatDate(today)).toBe('Hoje');
    });

    it('should return "Ontem" for yesterday', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      expect(formatDate(yesterday)).toBe('Ontem');
    });

    it('should return days ago for within a week', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
      expect(formatDate(threeDaysAgo)).toBe('3 dias atrás');
    });
  });

  describe('generateId', () => {
    it('should generate a unique string id', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toBeTruthy();
      expect(typeof id1).toBe('string');
      expect(id1).not.toBe(id2);
    });
  });

  describe('MOODS constant', () => {
    it('should have 10 moods', () => {
      expect(MOODS).toHaveLength(10);
    });

    it('should have all required properties', () => {
      MOODS.forEach((mood) => {
        expect(mood).toHaveProperty('key');
        expect(mood).toHaveProperty('emoji');
        expect(mood).toHaveProperty('label');
        expect(mood).toHaveProperty('color');
        expect(mood).toHaveProperty('message');
      });
    });

    it('should have unique keys', () => {
      const keys = MOODS.map((m) => m.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(10);
    });
  });
});