import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../theme/colors';
import { useStore } from '../store/useStore';
import ChatBubble from '../components/ChatBubble';
import { generateAIResponse, getWelcomeMessage } from '../utils/chatResponses';
import { generateId } from '../utils/moodHelpers';
import { ChatMessage } from '../types';

const { width } = Dimensions.get('window');

export default function ChatVoiceScreen({ route }: any) {
  const navigation = useNavigation();
  const { chatMessages, addMessage, clearChat, addEntry, voiceEnabled, setVoiceEnabled, aiVoice, voiceSpeed, aiName, userName } = useStore();
  const colors = useThemeColors();
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: text.trim(), timestamp: new Date().toISOString() };
    addMessage(userMsg);
    setText('');
    setTyping(true);
    const response = await generateAIResponse(text.trim());
    const aiMsg: ChatMessage = { id: generateId(), role: 'assistant', content: response, timestamp: new Date().toISOString() };
    addMessage(aiMsg);
    setTyping(false);
    if (voiceEnabled && aiVoice) {
      Speech.speak(response, { language: 'pt-BR', pitch: 1.0, rate: voiceSpeed });
    }
  };

  const handleSaveToJournal = () => {
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage?.role === 'assistant') {
      addEntry({ id: generateId(), date: new Date().toISOString().split('T')[0], mood: 'neutral', note: lastMessage.content, tags: ['conversa'], createdAt: new Date().toISOString() });
      Alert.alert('Salvo', 'Conversa salva no diário!');
    }
  };

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Confidente</Text>
          <Text style={styles.subtitle}>Siempre aqui para ouvir</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setVoiceEnabled(!voiceEnabled)} style={styles.headerBtn}>
            <Ionicons name={voiceEnabled ? 'volume-high' : 'volume-mute'} size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveToJournal} style={styles.headerBtn}>
            <Ionicons name="bookmark" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.msgList}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[styles.inputRow, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.backgroundAlt, color: colors.text }]}
            placeholder="Fale comigo..."
            placeholderTextColor={colors.textTertiary}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  msgList: { padding: 16 },
  inputRow: { flexDirection: 'row', padding: 12, gap: 10 },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 12, fontSize: 15 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});