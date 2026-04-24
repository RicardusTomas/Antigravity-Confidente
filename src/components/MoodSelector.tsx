import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeColors } from '../theme/colors';
import { MOODS, MoodInfo } from '../utils/moodHelpers';
import { Mood } from '../types';

interface MoodSelectorProps {
  selected?: Mood;
  onSelect: (mood: Mood) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {MOODS.map((m) => {
          const isSelected = selected === m.key;
          return (
            <TouchableOpacity
              key={m.key}
              style={[
                styles.chip,
                { backgroundColor: colors.card, borderColor: colors.divider },
                isSelected && { backgroundColor: m.color + '20', borderColor: m.color },
              ]}
              onPress={() => onSelect(m.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.emoji}>{m.emoji}</Text>
              <Text style={[
                styles.label,
                { color: colors.textSecondary },
                isSelected && { color: m.color, fontWeight: '700' },
              ]}>{m.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  scroll: { paddingHorizontal: 16, gap: 8 },
  chip: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    minWidth: 76,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  emoji: { fontSize: 24, marginBottom: 4 },
  label: { fontSize: 11, fontWeight: '600' },
});
