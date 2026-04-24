import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../theme/colors';
import { useStore } from '../store/useStore';
import { getMoodInfo, MOODS } from '../utils/moodHelpers';
import { Mood } from '../types';

export default function InsightsScreen() {
  const { entries } = useStore();
  const colors = useThemeColors();

  // Compute mood frequency
  const moodFrequency = useMemo(() => {
    const freq: Record<string, number> = {};
    entries.forEach(e => {
      freq[e.mood] = (freq[e.mood] || 0) + 1;
    });
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([mood, count]) => ({ ...getMoodInfo(mood as Mood), count }));
  }, [entries]);

  // Weekly data (last 7 days)
  const weeklyData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const now = new Date();
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayEntries = entries.filter(e => e.date === dateStr);
      const mood = dayEntries.length > 0 ? getMoodInfo(dayEntries[0].mood) : null;
      result.push({ day: days[d.getDay()], date: d.getDate(), mood, count: dayEntries.length });
    }
    return result;
  }, [entries]);

  // Insights generation
  const insights = useMemo(() => {
    const msgs: string[] = [];
    if (entries.length === 0) return msgs;

    if (moodFrequency.length > 0) {
      msgs.push(`Sua emoção mais registrada é "${moodFrequency[0].label}" (${moodFrequency[0].count}x).`);
    }

    const recent = entries.slice(0, 5);
    const negativeCount = recent.filter(e => ['anxious', 'sad', 'angry', 'overwhelmed', 'lonely'].includes(e.mood)).length;
    if (negativeCount >= 3) {
      msgs.push('Seus últimos registros mostram emoções mais difíceis. Lembre-se de cuidar de si. 💜');
    } else if (negativeCount === 0 && recent.length >= 3) {
      msgs.push('Seus registros recentes mostram um bom momento. Continue assim! ✨');
    }

    const tagCount: Record<string, number> = {};
    entries.forEach(e => e.tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));
    const topTags = Object.entries(tagCount).sort(([, a], [, b]) => b - a).slice(0, 3);
    if (topTags.length > 0) {
      msgs.push(`Temas mais presentes: ${topTags.map(([t]) => t).join(', ')}.`);
    }

    if (entries.length >= 7) {
      msgs.push(`Você já fez ${entries.length} registros. Parabéns por acompanhar suas emoções! 🎉`);
    }

    return msgs;
  }, [entries, moodFrequency]);

  const maxBarValue = Math.max(...moodFrequency.map(m => m.count), 1);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: 'transparent' }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Insights</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Entenda seus padrões emocionais</Text>
        </View>

        {entries.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="analytics-outline" size={56} color={colors.primaryLight} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Ainda sem dados</Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>Registre suas emoções no diário para ver insights sobre seus padrões.</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Última semana</Text>
            <View style={[styles.weekRow, { backgroundColor: colors.card }]}>
              {weeklyData.map((d, i) => (
                <View key={i} style={styles.weekDay}>
                  <Text style={[styles.weekDayLabel, { color: colors.textTertiary }]}>{d.day}</Text>
                  <View style={[styles.weekCircle, { backgroundColor: colors.backgroundAlt, borderColor: colors.divider }, d.mood && { backgroundColor: d.mood.color + '25', borderColor: d.mood.color }]}>
                    <Text style={styles.weekEmoji}>{d.mood ? d.mood.emoji : '—'}</Text>
                  </View>
                  <Text style={[styles.weekDate, { color: colors.textTertiary }]}>{d.date}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Emoções mais frequentes</Text>
            <View style={[styles.chartCard, { backgroundColor: colors.card }]}>
              {moodFrequency.map((m, i) => (
                <View key={i} style={styles.barRow}>
                  <Text style={styles.barEmoji}>{m.emoji}</Text>
                  <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{m.label}</Text>
                  <View style={[styles.barTrack, { backgroundColor: colors.backgroundAlt }]}>
                    <View style={[styles.barFill, { width: `${(m.count / maxBarValue) * 100}%`, backgroundColor: m.color }]} />
                  </View>
                  <Text style={[styles.barCount, { color: colors.text }]}>{m.count}</Text>
                </View>
              ))}
            </View>

            {insights.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>O que o Confidente percebeu</Text>
                {insights.map((msg, i) => (
                  <View key={i} style={[styles.insightCard, { backgroundColor: colors.card, borderLeftColor: colors.accent }]}>
                    <Ionicons name="bulb-outline" size={18} color={colors.accent} />
                    <Text style={[styles.insightText, { color: colors.text }]}>{msg}</Text>
                  </View>
                ))}
              </>
            )}

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumo</Text>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.summaryNum, { color: colors.primary }]}>{entries.length}</Text>
                <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Total de registros</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.summaryNum, { color: colors.primary }]}>{new Set(entries.map(e => e.mood)).size}</Text>
                <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Emoções diferentes</Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  empty: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16 },
  emptyDesc: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 16, borderRadius: 16, padding: 12 },
  weekDay: { alignItems: 'center', gap: 4 },
  weekDayLabel: { fontSize: 11, fontWeight: '500' },
  weekCircle: { width: 38, height: 38, borderRadius: 19, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  weekEmoji: { fontSize: 18 },
  weekDate: { fontSize: 11 },
  chartCard: { marginHorizontal: 16, borderRadius: 16, padding: 16, gap: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barEmoji: { fontSize: 18, width: 24, textAlign: 'center' },
  barLabel: { fontSize: 12, width: 90 },
  barTrack: { flex: 1, height: 10, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barCount: { fontSize: 13, fontWeight: '700', width: 24, textAlign: 'right' },
  insightCard: { flexDirection: 'row', marginHorizontal: 16, borderRadius: 14, padding: 14, marginBottom: 8, gap: 10, alignItems: 'flex-start', borderLeftWidth: 3 },
  insightText: { flex: 1, fontSize: 14, lineHeight: 20 },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 16, alignItems: 'center' },
  summaryNum: { fontSize: 28, fontWeight: '700' },
  summaryLabel: { fontSize: 11, marginTop: 4, textAlign: 'center' },
});
