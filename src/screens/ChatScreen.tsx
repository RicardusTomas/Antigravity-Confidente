import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../theme/colors';
import { useStore } from '../store/useStore';
import ChatBubble from '../components/ChatBubble';
import { generateAIResponse, getWelcomeMessage } from '../utils/chatResponses';
import { generateId } from '../utils/moodHelpers';
import { ChatMessage } from '../types';

const { width } = Dimensions.get('window');

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatScreen({ route }: any) {
  const { chatMessages, addMessage, clearChat, addEntry, voiceEnabled, setVoiceEnabled, aiVoice, voiceSpeed, aiName, userName } = useStore();
  const colors = useThemeColors();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const listRef = useRef<FlatList>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (chatMessages.length === 0) {
      const displayName = aiName || 'Confidente';
      const welcome: ChatMessage = {
        id: generateId(), role: 'assistant',
        content: getWelcomeMessage(displayName), timestamp: new Date().toISOString(),
      };
      addMessage(welcome);
    }
  }, [aiName]);

  const startListening = () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Microfone', 'Reconhecimento de voz disponível apenas na web.');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      Alert.alert('Navegador não suportado', 'Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SR();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = '';

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t + ' ';
        else interim = t;
      }
      setTranscript(finalTranscript + interim);
      setText(finalTranscript + interim);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setTranscript('');
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
  };

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    Speech.stop();
    const cleanText = text.replace(/[*#💜🆘✨✍️🎙️📝\n]/g, ' ').replace(/\s+/g, ' ').trim();
    
    const voiceSettings = getVoiceSettings();
    Speech.speak(cleanText, {
      language: 'pt-BR',
      pitch: voiceSettings.pitch,
      rate: voiceSettings.rate,
    });
  };

  const getVoiceSettings = () => {
    const baseRate = voiceSpeed;
    switch (aiVoice) {
      case 'female':
        return { pitch: 1.2, rate: baseRate };
      case 'male':
        return { pitch: 0.8, rate: baseRate };
      case 'neutral':
        return { pitch: 1.0, rate: baseRate };
      default:
        return { pitch: 1.1, rate: baseRate };
    }
  };

  const handleSend = () => {
    const msg = text.trim();
    if (!msg) return;

    if (listening) stopListening();

    const userMsg: ChatMessage = {
      id: generateId(), role: 'user',
      content: msg, timestamp: new Date().toISOString(),
    };
    addMessage(userMsg);
    setText('');
    setTranscript('');
    setTyping(true);

    const delay = msg.length < 10 ? 300 : msg.length < 30 ? 500 : 800;
    setTimeout(() => {
      const { text: response } = generateAIResponse(msg);
      const botMsg: ChatMessage = {
        id: generateId(), role: 'assistant',
        content: response, timestamp: new Date().toISOString(),
      };
      addMessage(botMsg);
      setTyping(false);
      speak(response);
    }, delay);
  };

  const handleSaveToJournal = () => {
    if (chatMessages.length < 2) return;
    const userMsgs = chatMessages.filter(m => m.role === 'user').map(m => m.content).join('\n');
    if (!userMsgs.trim()) return;
    
    addEntry({
      id: generateId(), date: new Date().toISOString().split('T')[0],
      mood: 'calm', note: userMsgs, tags: ['conversa-ia'], stressLevel: 0,
      createdAt: new Date().toISOString(),
    });
    Alert.alert('Salvo! 💜', 'A conversa foi salva no seu diário emocional.');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: 'transparent' }]} edges={['top']}>
      {/* Modern Header with Gradient */}
      <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Confidente</Text>
          <Text style={styles.subtitle}>Sempre aqui para ouvir</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => { Speech.stop(); setVoiceEnabled(!voiceEnabled); }}
            style={styles.headerBtn}
          >
            <Ionicons name={voiceEnabled ? 'volume-high' : 'volume-mute'} size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveToJournal} style={styles.headerBtn}>
            <Ionicons name="bookmark" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearChat} style={styles.headerBtn}>
            <Ionicons name="refresh" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble message={item.content} isUser={item.role === 'user'} timestamp={item.timestamp} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Typing indicator */}
      {typing && (
        <View style={styles.typingRow}>
          <View style={styles.typingDots}>
            <View style={[styles.dot, { backgroundColor: colors.primary, opacity: 1 }]} />
            <View style={[styles.dot, { backgroundColor: colors.primary, opacity: 0.6 }]} />
            <View style={[styles.dot, { backgroundColor: colors.primary, opacity: 0.3 }]} />
          </View>
          <Text style={[styles.typingText, { color: colors.textSecondary }]}>Confidente está pensando...</Text>
        </View>
      )}

      {/* Modern Live Transcript */}
      {listening && transcript ? (
        <View style={styles.transcriptContainer}>
          <View style={[styles.transcriptBar, { backgroundColor: colors.card, borderColor: 'rgba(224, 122, 122, 0.3)' }]}>
            <View style={styles.liveIndicator}><View style={styles.liveInner} /></View>
            <Text style={[styles.transcriptText, { color: colors.text }]} numberOfLines={2}>{transcript}</Text>
          </View>
        </View>
      ) : null}

      {/* Input area */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <View style={[styles.inputWrapper, { backgroundColor: colors.backgroundAlt }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Escreva como você se sente..."
              placeholderTextColor={colors.textTertiary}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={1000}
            />
            {/* Mic button */}
            <TouchableOpacity
              style={[styles.micBtn, listening && styles.micBtnActive]}
              onPress={listening ? stopListening : startListening}
              activeOpacity={0.7}
            >
              <Ionicons name={listening ? 'stop' : 'mic'} size={20} color={listening ? '#FFF' : colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* Send button */}
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: colors.primary }, !text.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!text.trim()}
            activeOpacity={0.7}
          >
            <Ionicons name="send" size={18} color="#FFF" style={{ marginLeft: 3 }} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 22, paddingVertical: 18,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18, shadowRadius: 16, elevation: 10, zIndex: 10
  },
  headerLeft: { flex: 1 },
  title: { fontSize: 24, fontWeight: '800', color: '#FFF', letterSpacing: 0.5 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, fontWeight: '500' },
  headerActions: { flexDirection: 'row', gap: 10 },
  headerBtn: { padding: 12, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)' },
  list: { paddingVertical: 24, paddingHorizontal: 6 },
  typingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 26, paddingBottom: 14, gap: 10 },
  typingDots: { flexDirection: 'row', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  typingText: { fontSize: 14, fontStyle: 'italic' },
  transcriptContainer: { paddingHorizontal: 18, marginBottom: 12 },
  transcriptBar: { 
    flexDirection: 'row', alignItems: 'center', padding: 16, 
    borderRadius: 18, gap: 14, borderWidth: 1,
    shadowColor: '#E07A7A', shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12, shadowRadius: 10, elevation: 5
  },
  liveIndicator: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#E07A7A', alignItems: 'center', justifyContent: 'center' },
  liveInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FFF' },
  transcriptText: { flex: 1, fontSize: 15, fontStyle: 'italic' },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 18, paddingVertical: 14, gap: 14,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06, shadowRadius: 16, elevation: 12
  },
  inputWrapper: {
    flex: 1, flexDirection: 'row', alignItems: 'flex-end',
    borderRadius: 26, paddingHorizontal: 6, paddingVertical: 6
  },
  input: { 
    flex: 1, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 14, 
    fontSize: 16, maxHeight: 130, minHeight: 48
  },
  micBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4, marginRight: 6 },
  micBtnActive: { backgroundColor: '#E07A7A' },
  sendBtn: { 
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6
  },
  sendBtnDisabled: { opacity: 0.4, shadowOpacity: 0 },
});
