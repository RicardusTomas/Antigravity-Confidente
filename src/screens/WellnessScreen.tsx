import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useThemeColors } from '../theme/colors';
import { useStore } from '../store/useStore';
import { generateId } from '../utils/moodHelpers';

interface Exercise {
  name: string;
  desc: string;
  icon: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfter: number;
  color: [string, string];
}

const EXERCISES: Exercise[] = [
  { name: 'Respiração 4-7-8', desc: 'Acalma e ajuda a dormir', icon: 'moon-outline', inhale: 4, hold: 7, exhale: 8, holdAfter: 0, color: ['#7C6F9B', '#A89CC8'] },
  { name: 'Respiração Quadrada', desc: 'Reduz estresse e ansiedade', icon: 'square-outline', inhale: 4, hold: 4, exhale: 4, holdAfter: 4, color: ['#7CB9A8', '#A8D8C8'] },
  { name: 'Respiração Calmante', desc: 'Relaxamento profundo', icon: 'leaf-outline', inhale: 5, hold: 2, exhale: 7, holdAfter: 0, color: ['#E8A87C', '#F5C4A6'] },
];

const GROUNDING_STEPS = [
  { num: 5, sense: '👀', label: 'coisas que você VÊ' },
  { num: 4, sense: '✋', label: 'coisas que pode TOCAR' },
  { num: 3, sense: '👂', label: 'coisas que OUVE' },
  { num: 2, sense: '👃', label: 'coisas que CHEIRA' },
  { num: 1, sense: '👅', label: 'coisa que SABOREIA' },
];

export default function WellnessScreen({ route }: any) {
  const navigation = useNavigation();
  const { addBreathingSession } = useStore();
  const colors = useThemeColors();
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [phase, setPhase] = useState('');
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [crisisMode, setCrisisMode] = useState(route?.params?.crisis || false);
  const [groundingStep, setGroundingStep] = useState(0);
  const [groundingActive, setGroundingActive] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startExercise = (ex: Exercise) => {
    setActiveExercise(ex);
    setRunning(true);
    setCycles(0);
    runCycle(ex, 0);
  };

  const runCycle = (ex: Exercise, cycle: number) => {
    if (cycle >= 4) { stopExercise(ex); return; }
    setPhase(`Inspire... ${ex.inhale}s`);
    Animated.timing(scaleAnim, { toValue: 1.5, duration: ex.inhale * 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start();
    timerRef.current = setTimeout(() => {
      if (ex.hold > 0) {
        setPhase(`Segure... ${ex.hold}s`);
        timerRef.current = setTimeout(() => {
          setPhase(`Expire... ${ex.exhale}s`);
          Animated.timing(scaleAnim, { toValue: 1, duration: ex.exhale * 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start();
          timerRef.current = setTimeout(() => {
            if (ex.holdAfter > 0) {
              setPhase(`Segure... ${ex.holdAfter}s`);
              timerRef.current = setTimeout(() => { setCycles(cycle + 1); runCycle(ex, cycle + 1); }, ex.holdAfter * 1000);
            } else { setCycles(cycle + 1); runCycle(ex, cycle + 1); }
          }, ex.exhale * 1000);
        }, ex.hold * 1000);
      } else {
        setPhase(`Expire... ${ex.exhale}s`);
        Animated.timing(scaleAnim, { toValue: 1, duration: ex.exhale * 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }).start();
        timerRef.current = setTimeout(() => { setCycles(cycle + 1); runCycle(ex, cycle + 1); }, ex.exhale * 1000);
      }
    }, ex.inhale * 1000);
  };

  const stopExercise = (ex?: Exercise) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRunning(false);
    setPhase('Concluído! 🎉');
    scaleAnim.setValue(1);
    if (ex || activeExercise) {
      addBreathingSession({ id: generateId(), type: 'calm', duration: 4, completedAt: new Date().toISOString() });
    }
  };

  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: 'transparent' }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.text }]}>Bem-estar</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Cuide de si agora</Text>
          </View>
        </View>

        {/* Crisis Mode Button */}
        <TouchableOpacity style={styles.crisisBtn} onPress={() => setCrisisMode(true)} activeOpacity={0.8}>
          <LinearGradient colors={['#C97B7B', '#D4A8D3']} style={styles.crisisGradient}>
            <Ionicons name="heart-outline" size={22} color="#FFF" />
            <View style={styles.crisisText}>
              <Text style={styles.crisisTitle}>Não estou bem agora</Text>
              <Text style={styles.crisisDesc}>Acolhimento e exercícios imediatos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Active breathing */}
        {activeExercise && (
          <View style={styles.activeCard}>
            <LinearGradient colors={activeExercise.color} style={styles.breathCard}>
              <Text style={styles.breathName}>{activeExercise.name}</Text>
              <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]}>
                <Text style={styles.circleText}>{phase || 'Preparar...'}</Text>
              </Animated.View>
              <Text style={styles.cycleText}>Ciclo {Math.min(cycles + 1, 4)} de 4</Text>
              <TouchableOpacity style={styles.stopBtn} onPress={() => stopExercise()}>
                <Text style={styles.stopBtnText}>{running ? 'Parar' : 'Fechar'}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Exercises */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercícios de Respiração</Text>
        {EXERCISES.map((ex, i) => (
          <TouchableOpacity key={i} style={[styles.exCard, { backgroundColor: colors.card }]} onPress={() => startExercise(ex)} activeOpacity={0.8}>
            <LinearGradient colors={ex.color} style={styles.exIcon}>
              <Ionicons name={ex.icon as any} size={20} color="#FFF" />
            </LinearGradient>
            <View style={styles.exInfo}>
              <Text style={[styles.exName, { color: colors.text }]}>{ex.name}</Text>
              <Text style={[styles.exDesc, { color: colors.textSecondary }]}>{ex.desc}</Text>
            </View>
            <Ionicons name="play-circle-outline" size={26} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}

        {/* Grounding Exercise */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercício de Aterramento</Text>
        <TouchableOpacity style={styles.groundingBtn} onPress={() => { setGroundingActive(true); setGroundingStep(0); }} activeOpacity={0.8}>
          <LinearGradient colors={['#2D2B36', '#5D5178']} style={styles.groundingCard}>
            <Text style={styles.groundingEmoji}>🌿</Text>
            <Text style={styles.groundingTitle}>Técnica 5-4-3-2-1</Text>
            <Text style={styles.groundingDesc}>Ancore-se no presente usando seus sentidos</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Crisis Modal */}
      <Modal visible={crisisMode} animationType="fade" transparent={false}>
        <SafeAreaView style={styles.crisisScreen}>
          <TouchableOpacity style={styles.crisisClose} onPress={() => setCrisisMode(false)}>
            <Ionicons name="close" size={24} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <View style={styles.crisisContent}>
            <Text style={styles.crisisEmoji}>💜</Text>
            <Text style={styles.crisisHeading}>Estou aqui com você</Text>
            <Text style={styles.crisisBody}>Respire devagar. Você está seguro(a). Esse momento vai passar.</Text>
            <Text style={styles.crisisBody}>Inspire... 4 segundos{'\n'}Segure... 4 segundos{'\n'}Expire... 4 segundos</Text>
            <View style={styles.crisisActions}>
              <TouchableOpacity style={styles.crisisAction} onPress={() => { setCrisisMode(false); startExercise(EXERCISES[0]); }}>
                <Ionicons name="leaf-outline" size={20} color="#FFF" />
                <Text style={styles.crisisActionText}>Respiração guiada</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.crisisHelp}>
              <Ionicons name="call-outline" size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.crisisHelpText}>CVV: 188 (24h, gratuito, sigilo total)</Text>
            </View>
            <Text style={styles.crisisFooter}>Você não precisa enfrentar isso sozinho(a).{'\n'}Procure ajuda profissional quando sentir necessidade.</Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Grounding Modal */}
      <Modal visible={groundingActive} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.groundScreen}>
          <TouchableOpacity style={styles.crisisClose} onPress={() => setGroundingActive(false)}>
            <Ionicons name="close" size={24} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <View style={styles.groundContent}>
            {groundingStep < GROUNDING_STEPS.length ? (
              <>
                <Text style={styles.groundEmoji}>{GROUNDING_STEPS[groundingStep].sense}</Text>
                <Text style={styles.groundNum}>{GROUNDING_STEPS[groundingStep].num}</Text>
                <Text style={styles.groundLabel}>Nomeie {GROUNDING_STEPS[groundingStep].num} {GROUNDING_STEPS[groundingStep].label}</Text>
                <Text style={styles.groundHint}>Olhe ao redor e observe com calma.</Text>
                <TouchableOpacity style={styles.groundNextBtn} onPress={() => setGroundingStep(groundingStep + 1)}>
                  <Text style={styles.groundNextText}>Próximo</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.groundEmoji}>✨</Text>
                <Text style={styles.groundLabel}>Exercício concluído!</Text>
                <Text style={styles.groundHint}>Você está mais presente agora. Respire fundo e siga com calma.</Text>
                <TouchableOpacity style={styles.groundNextBtn} onPress={() => setGroundingActive(false)}>
                  <Text style={styles.groundNextText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <View style={styles.groundDots}>
            {GROUNDING_STEPS.map((_, i) => (
              <View key={i} style={[styles.groundDot, i <= groundingStep && styles.groundDotDone]} />
            ))}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', paddingHorizontal: 20, marginTop: 24, marginBottom: 12 },
  crisisBtn: { marginHorizontal: 16, marginTop: 8, borderRadius: 18, overflow: 'hidden' },
  crisisGradient: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  crisisText: { flex: 1 },
  crisisTitle: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  crisisDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  activeCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 24, overflow: 'hidden' },
  breathCard: { padding: 28, alignItems: 'center', borderRadius: 24 },
  breathName: { fontSize: 16, fontWeight: '600', color: '#FFF', marginBottom: 20 },
  circle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  circleText: { fontSize: 14, fontWeight: '600', color: '#FFF', textAlign: 'center' },
  cycleText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 16 },
  stopBtn: { marginTop: 12, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  stopBtnText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  exCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8, borderRadius: 14, padding: 12, gap: 12 },
  exIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  exInfo: { flex: 1 },
  exName: { fontSize: 14, fontWeight: '600' },
  exDesc: { fontSize: 12, marginTop: 1 },
  groundingBtn: { marginHorizontal: 16, borderRadius: 18, overflow: 'hidden' },
  groundingCard: { padding: 22, alignItems: 'center', borderRadius: 18 },
  groundingEmoji: { fontSize: 32, marginBottom: 8 },
  groundingTitle: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  groundingDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  // Crisis modal
  crisisScreen: { flex: 1, backgroundColor: '#2D2B36' },
  crisisClose: { alignSelf: 'flex-end', padding: 16 },
  crisisContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  crisisEmoji: { fontSize: 56, marginBottom: 16 },
  crisisHeading: { fontSize: 24, fontWeight: '700', color: '#FFF', textAlign: 'center' },
  crisisBody: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 16, lineHeight: 26 },
  crisisActions: { marginTop: 32, gap: 12 },
  crisisAction: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, gap: 10 },
  crisisActionText: { fontSize: 15, fontWeight: '600', color: '#FFF' },
  crisisHelp: { flexDirection: 'row', alignItems: 'center', marginTop: 32, gap: 8, backgroundColor: 'rgba(255,255,255,0.1)', padding: 14, borderRadius: 14 },
  crisisHelpText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  crisisFooter: { fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 20, lineHeight: 18 },
  // Grounding modal
  groundScreen: { flex: 1, backgroundColor: '#2D2B36' },
  groundContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  groundEmoji: { fontSize: 56, marginBottom: 16 },
  groundNum: { fontSize: 64, fontWeight: '700', color: '#FFF', marginBottom: 8 },
  groundLabel: { fontSize: 20, fontWeight: '600', color: '#FFF', textAlign: 'center' },
  groundHint: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 12 },
  groundNextBtn: { marginTop: 32, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.15)' },
  groundNextText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  groundDots: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 32, gap: 8 },
  groundDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)' },
  groundDotDone: { backgroundColor: '#FFF' },
});
