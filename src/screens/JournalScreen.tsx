import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../theme/colors';
import { useStore } from '../store/useStore';
import { generateId, MOODS } from '../utils/moodHelpers';
import JournalCard from '../components/JournalCard';
import MoodSelector from '../components/MoodSelector';
import EmptyState from '../components/EmptyState';
import { Mood, EmotionEntry } from '../types';

export default function JournalScreen({ route }: any) {
  const navigation = useNavigation();
  const { entries, addEntry, deleteEntry } = useStore();
  const colors = useThemeColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>();
  const [note, setNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (route?.params?.openModal) {
      setModalVisible(true);
    }
  }, [route?.params]);

  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      if (route?.params?.openModal) {
        setModalVisible(true);
      }
    });
    return unsubscribe;
  }, [navigation, route?.params]);

  const handleSave = () => {
    if (!selectedMood) return;
    const entry: EmotionEntry = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      note: note.trim(),
      tags,
      stressLevel: 0,
      createdAt: new Date().toISOString(),
    };
    addEntry(entry);
    resetForm();
  };

  const resetForm = () => {
    setModalVisible(false);
    setSelectedMood(undefined);
    setNote('');
    setTags([]);
    setTagInput('');
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

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
          actionLabel="Criar primeiro registro"
          onAction={() => setModalVisible(true)}
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

      {/* FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => setModalVisible(true)} activeOpacity={0.8}>
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Add Entry Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Como você está?</Text>
              <TouchableOpacity onPress={resetForm}><Ionicons name="close" size={24} color={colors.textSecondary} /></TouchableOpacity>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Seu humor</Text>
            <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />

            <Text style={[styles.fieldLabel, { marginTop: 16, color: colors.textSecondary }]}>O que está sentindo?</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.backgroundAlt, color: colors.text }]}
              placeholder="Escreva livremente sobre seus sentimentos..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
              textAlignVertical="top"
            />

            <Text style={[styles.fieldLabel, { marginTop: 12, color: colors.textSecondary }]}>Tags (opcional)</Text>
            <View style={styles.tagInputRow}>
              <TextInput
                style={[styles.tagInput, { backgroundColor: colors.backgroundAlt, color: colors.text }]}
                placeholder="Ex: trabalho, família"
                placeholderTextColor={colors.textTertiary}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={[styles.tagAddBtn, { backgroundColor: colors.primaryBg }]} onPress={addTag}>
                <Ionicons name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
            {tags.length > 0 && (
              <View style={styles.tagsRow}>
                {tags.map((t, i) => (
                  <TouchableOpacity key={i} style={[styles.tagChip, { backgroundColor: colors.primaryBg }]} onPress={() => setTags(tags.filter((_, idx) => idx !== i))}>
                    <Text style={[styles.tagChipText, { color: colors.primary }]}>{t}</Text>
                    <Ionicons name="close-circle" size={14} color={colors.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }, !selectedMood && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={!selectedMood}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Salvar registro</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, marginTop: 4, fontWeight: '500' },
  fab: {
    position: 'absolute', bottom: 28, right: 20,
    width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800' },
  fieldLabel: { fontSize: 13, fontWeight: '700', paddingHorizontal: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  textArea: { marginHorizontal: 16, borderRadius: 14, padding: 16, fontSize: 16, minHeight: 120 },
  tagInputRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10 },
  tagInput: { flex: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15 },
  tagAddBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginTop: 10, gap: 8 },
  tagChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, gap: 6 },
  tagChipText: { fontSize: 13, fontWeight: '500' },
  saveBtn: { marginHorizontal: 16, marginTop: 24, paddingVertical: 18, borderRadius: 18, alignItems: 'center' },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { fontSize: 17, fontWeight: '600', color: '#FFF' },
});
