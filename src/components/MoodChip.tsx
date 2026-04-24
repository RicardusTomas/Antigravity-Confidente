import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '../theme/colors';

interface MoodChipProps {
  label: string;
  emoji: string;
  color: string;
  selected?: boolean;
  onPress?: () => void;
}

export default function MoodChip({ label, emoji, color, selected, onPress }: MoodChipProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={selected ? [color, `${color}AA`] : [colors.card, colors.card]}
        style={[styles.chip, selected && [styles.chipSelected, { borderColor: color }]]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[
          styles.label,
          { color: colors.textSecondary },
          selected && { color: colors.text, fontWeight: '700' },
        ]}>{label}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 4,
  },
  chip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    minWidth: 80,
  },
  chipSelected: {
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
