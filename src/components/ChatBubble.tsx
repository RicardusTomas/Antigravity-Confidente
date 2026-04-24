import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../theme/colors';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export default function ChatBubble({ message, isUser, timestamp }: ChatBubbleProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.row, isUser && styles.rowUser]}>
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: colors.primaryBg }]}>
          <Text style={styles.avatarText}>💜</Text>
        </View>
      )}
      <View style={[
        styles.bubble,
        isUser
          ? [styles.userBubble, { backgroundColor: colors.primary }]
          : [styles.botBubble, { backgroundColor: colors.chatBot }],
      ]}>
        <Text style={[styles.text, isUser ? styles.userText : { color: colors.text }]}>{message}</Text>
        {timestamp && (
          <Text style={[styles.time, isUser ? styles.userTime : { color: colors.textTertiary }]}>
            {new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginBottom: 12, paddingHorizontal: 16, alignItems: 'flex-end' },
  rowUser: { justifyContent: 'flex-end' },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center', marginRight: 8,
  },
  avatarText: { fontSize: 16 },
  bubble: { maxWidth: '75%', padding: 14, borderRadius: 22 },
  userBubble: {
    borderBottomRightRadius: 6,
    shadowColor: '#7C6F9B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  botBubble: {
    borderBottomLeftRadius: 6,
  },
  text: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFF' },
  time: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  userTime: { color: 'rgba(255,255,255,0.7)' },
});
