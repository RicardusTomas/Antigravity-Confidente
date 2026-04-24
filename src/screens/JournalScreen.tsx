import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../theme/colors';
import { useStore } from '../store/useStore';
import JournalCard from '../components/JournalCard';
import EmptyState from '../components/EmptyState';

export default function JournalScreen({ navigation }: any) {
  const { entries, deleteEntry } = useStore();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: 'transparent' }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Diário Emocional</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Registre como você se sente</Text>
      </View>

      {entries.length === 0 ? (
        <EmptyState
          icon="book-outline"
          title="Seu diário está vazio"
          description="Comece registrando como você está se sentindo. Cada registro ajuda a entender melhor suas emoções."
          actionLabel="Criar registro"
        />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalCard entry={item} onDelete={() => deleteEntry(item.id)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4 },
});