import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStore } from '../store/useStore';
import { generateOpenAIResponse, getWelcome } from '../utils/openai';
import { generateId } from '../utils/moodHelpers';
import { ChatMessage } from '../types';

export default function ChatVoiceScreen() {
  const navigation = useNavigation();
  const { chatMessages, addMessage, clearChat, addEntry, voiceEnabled } = useStore();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatMessages.length === 0) {
      const welcomeMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: getWelcome(),
        timestamp: new Date().toISOString()
      };
      addMessage(welcomeMsg);
    }
  }, []);

  const speakWithHumanVoice = (text: string) => {
    Speech.stop();
    Speech.speak(text, {
      language: 'pt-BR',
      pitch: 1.15,
      rate: 0.95,
    });
  };

  const startListening = () => {
    if (isListening) return;
    
    setIsListening(true);
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.log('Speech error:', event.error);
        setIsListening(false);
        Alert.alert('Erro', 'Não consegui entender. Tente falar mais alto.');
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      setIsListening(false);
      Alert.alert('Aviso', 'Reconhecimento de voz não disponível neste dispositivo.');
    }
  };

  const handleSend = async () => {
    if (!text.trim() || typing) return;
    
    const userMsg: ChatMessage = { 
      id: generateId(), 
      role: 'user', 
      content: text.trim(), 
      timestamp: new Date().toISOString() 
    };
    addMessage(userMsg);
    const userText = text.trim();
    setText('');
    setTyping(true);

    try {
      const history = chatMessages.map(m => ({ role: m.role, content: m.content }));
      const { text: response } = await generateOpenAIResponse(userText, history);
      
      const aiMsg: ChatMessage = { 
        id: generateId(), 
        role: 'assistant', 
        content: response, 
        timestamp: new Date().toISOString() 
      };
      addMessage(aiMsg);
      
      if (voiceEnabled) {
        speakWithHumanVoice(response);
      }
      
      const lowerResponse = response.toLowerCase();
      const lowerUser = userText.toLowerCase();
      
      if (lowerResponse.includes('escrever') || lowerResponse.includes('diário') || lowerResponse.includes('registrar') || 
          lowerUser.includes('escrever') || lowerUser.includes('diário') || lowerUser.includes('registrar')) {
        setTimeout(() => navigation.navigate('NewEntry'), 1500);
      } else if (lowerResponse.includes('respirar') || lowerResponse.includes('acalmar') || lowerResponse.includes('relaxar') ||
                 lowerUser.includes('respirar') || lowerUser.includes('acalmar') || lowerUser.includes('relaxar')) {
        setTimeout(() => navigation.navigate('Wellness'), 1500);
      } else if (lowerResponse.includes('ver registro') || lowerResponse.includes('diário') || lowerResponse.includes('humor') ||
                 lowerUser.includes('ver registro') || lowerUser.includes('meu humor')) {
        setTimeout(() => navigation.navigate('Journal'), 1500);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não consegui responder. Verifique sua conexão.');
    }
    
    setTyping(false);
  };

  const handleSaveToJournal = () => {
    const lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg?.role === 'assistant') {
      addEntry({ 
        id: generateId(), 
        date: new Date().toISOString().split('T')[0], 
        mood: 'neutral', 
        note: lastMsg.content, 
        tags: ['conversa'], 
        createdAt: new Date().toISOString() 
      });
      Alert.alert('Salvo', 'Conversa salva no diário!');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userMsg : styles.aiMsg]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#7C6F9B" />
      <LinearGradient 
        colors={['#7C6F9B', '#9B8BB8']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Confidente</Text>
          <Text style={styles.subtitle}>Sempre aqui para ouvir</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => Speech.stop()} 
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

      <FlatList
        ref={listRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.msgList}
        onContentSizeChange={() => listRef.current?.scrollToEnd()}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={[styles.micBtn, isListening && styles.micBtnActive]} 
            onPress={startListening}
          >
            <Ionicons name={isListening ? "mic" : "mic-outline"} size={24} color={isListening ? "#FFF" : "#7C6F9B"} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Digite ou fale sua mensagem..."
            placeholderTextColor="#999"
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
            editable={!typing}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, (typing || !text.trim()) && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={typing || !text.trim()}
          >
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#7C6F9B',
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 8, 
    paddingTop: 48,
    paddingBottom: 12, 
    gap: 8,
  },
  closeBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  headerCenter: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  headerActions: { flexDirection: 'row', gap: 4 },
  headerBtn: {
    width: 36, 
    height: 36, 
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  msgList: { 
    padding: 16,
    backgroundColor: '#F8F6FF',
  },
  messageBubble: {
    maxWidth: '85%', 
    borderRadius: 20, 
    padding: 14, 
    marginBottom: 10,
  },
  userMsg: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#7C6F9B',
    borderBottomRightRadius: 4,
  },
  aiMsg: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
  },
  messageText: { 
    fontSize: 15, 
    lineHeight: 22 
  },
  userText: { color: '#FFF' },
  aiText: { color: '#333' },
  inputContainer: {
    flexDirection: 'row', 
    padding: 12, 
    backgroundColor: '#FFF',
    gap: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#EEE',
  },
  input: {
    flex: 1, 
    borderRadius: 20, 
    paddingHorizontal: 18, 
    paddingVertical: 12,
    fontSize: 15, 
    backgroundColor: '#F5F5F5', 
    color: '#333',
    maxHeight: 100,
  },
  sendBtn: {
    width: 44, 
    height: 44, 
    borderRadius: 22,
    backgroundColor: '#7C6F9B', 
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  sendBtnDisabled: { backgroundColor: '#CCC' },
  micBtn: {
    width: 44, 
    height: 44, 
    borderRadius: 22,
    backgroundColor: '#F5F5F5', 
    alignItems: 'center', 
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  micBtnActive: {
    backgroundColor: '#7C6F9B',
  },
});