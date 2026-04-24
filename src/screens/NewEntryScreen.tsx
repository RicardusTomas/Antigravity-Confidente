import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../theme/colors';
import { useStore } from '../store/useStore';
import { generateId } from '../utils/moodHelpers';
import MoodSelector from '../components/MoodSelector';
import { Mood, EmotionEntry } from '../types';

export default function NewEntryScreen({ navigation }: any) {
  const { addEntry } = useStore();
  const colors = useThemeColors();
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>();
  const [note, setNote] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

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
    navigation.goBack();
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput('');
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Novo Registro</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          disabled={!selectedMood}
          style={[
            styles.saveBtn, 
            { backgroundColor: selectedMood ? colors.primary : colors.backgroundAlt }
          ]}
        >
          <Text style={{ color: selectedMood ? '#FFF' : colors.textTertiary, fontWeight: '600' }}>
            Salvar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Como você está?</Text>
        <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />

        <Text style={[styles.label, { marginTop: 24, color: colors.textSecondary }]}>O que está sentindo?</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: colors.backgroundAlt, color: colors.text }]}
          placeholder="Escreva livremente sobre seus sentimentos..."
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={6}
          value={note}
          onChangeText={setNote}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { marginTop: 20, color: colors.textSecondary }]}>Tags (opcional)</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 16 },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  textArea: { borderRadius: 16, padding: 16, fontSize: 16, minHeight: 140, textAlignVertical: 'top' },
  tagInputRow: { flexDirection: 'row', gap: 10 },
  tagInput: { flex: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15 },
  tagAddBtn: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tagChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, gap: 6 },
  tagChipText: { fontSize: 13, fontWeight: '600' },
});