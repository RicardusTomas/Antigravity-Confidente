import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../theme/colors';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const navigation = useNavigation();
  const colors = useThemeColors();

  const handlePress = () => {
    if (onAction) {
      onAction();
    } else {
      navigation.navigate('NewEntry' as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryBg }]}>
        <Ionicons name={icon as any} size={48} color={colors.primaryLight} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>
      {actionLabel && (
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handlePress} activeOpacity={0.85}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 23,
    maxWidth: 300,
    fontWeight: '400',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: '#7C6F9B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
