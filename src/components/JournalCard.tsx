import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../theme/colors';
import { getMoodInfo, formatDate } from '../utils/moodHelpers';
import { EmotionEntry } from '../types';

interface JournalCardProps {
  entry: EmotionEntry;
  onPress?: () => void;
  onDelete?: () => void;
}

export default function JournalCard({ entry, onPress, onDelete }: JournalCardProps) {
  const mood = getMoodInfo(entry.mood);
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, shadowColor: '#000' }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.moodStrip, { backgroundColor: mood.color }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.emojiCircle, { backgroundColor: mood.color + '18' }]}>
            <Text style={styles.emoji}>{mood.emoji}</Text>
          </View>
          <View style={styles.meta}>
            <Text style={[styles.moodLabel, { color: colors.text }]}>{mood.label}</Text>
            <Text style={[styles.date, { color: colors.textTertiary }]}>{formatDate(entry.createdAt)}</Text>
          </View>
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={[styles.deleteBtn, { backgroundColor: colors.backgroundAlt }]} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="trash-outline" size={14} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        {entry.note ? (
          <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={3}>{entry.note}</Text>
        ) : null}
        {entry.tags.length > 0 && (
          <View style={styles.tags}>
            {entry.tags.slice(0, 3).map((t, i) => (
              <View key={i} style={[styles.tag, { backgroundColor: colors.primaryBg }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>{t}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  moodStrip: { width: 5 },
  content: { flex: 1, padding: 16 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 24 },
  meta: { flex: 1 },
  moodLabel: { fontSize: 16, fontWeight: '700' },
  date: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  deleteBtn: {
    padding: 8,
    borderRadius: 12,
  },
  note: { fontSize: 14, marginTop: 10, lineHeight: 21, fontWeight: '400' },
  tags: { flexDirection: 'row', marginTop: 10, gap: 6 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  tagText: { fontSize: 11, fontWeight: '600' },
});
