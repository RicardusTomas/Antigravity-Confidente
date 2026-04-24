import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Animated, Image, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useThemeColors, GRADIENTS } from '../theme/colors';
import { useStore } from '../store/useStore';

const { width, height } = Dimensions.get('window');

interface Slide {
  icon: string;
  emoji: string;
  title: string;
  desc: string;
  gradient: [string, string];
}

const slides: Slide[] = [
  {
    icon: 'heart-outline', emoji: '💜',
    title: 'Seu espaço seguro',
    desc: 'O Confidente é seu companheiro emocional inteligente. Aqui você pode desabafar, organizar pensamentos e cuidar do seu bem-estar — sem julgamento.',
    gradient: ['#7C6F9B', '#A89CC8'],
  },
  {
    icon: 'chatbubble-ellipses-outline', emoji: '💬',
    title: 'Escreva ou fale',
    desc: 'Escolha como quer se expressar. Você pode digitar ou falar por voz. A IA escuta, entende e responde com acolhimento genuíno.',
    gradient: ['#7CB9A8', '#A8D8C8'],
  },
  {
    icon: 'book-outline', emoji: '📖',
    title: 'Diário emocional',
    desc: 'Registre como você se sente e acompanhe seus padrões emocionais ao longo do tempo. Cada registro te ajuda a se conhecer melhor.',
    gradient: ['#E8A87C', '#F5C4A6'],
  },
  {
    icon: 'leaf-outline', emoji: '🌿',
    title: 'Bem-estar',
    desc: 'Técnicas de respiração, meditação e exercícios de mindfulness para momentos de ansiedade ou stress.',
    gradient: ['#8BC98A', '#A8D8A8'],
  },
  {
    icon: 'shield-checkmark-outline', emoji: '🔒',
    title: 'Privacidade total',
    desc: 'Seus dados ficam apenas no seu dispositivo. Ninguém tem acesso ao que você escreve ou fala. Este é o SEU espaço seguro.',
    gradient: ['#2D2B36', '#5D5178'],
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const { setUserName, completeOnboarding } = useStore();
  const colors = useThemeColors();
  const isLastSlide = step === slides.length;

  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const goToSlide = (newStep: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start();
    setStep(newStep);
  };

  const handleFinish = () => {
    if (nameInput.trim()) setUserName(nameInput.trim());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding();
    onComplete();
  };

  const handleNext = () => {
    if (step < slides.length) {
      goToSlide(step + 1);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep(slides.length);
  };

  const pressInAnimation = () => {
    Animated.spring(buttonScale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const pressOutAnimation = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  if (isLastSlide) {
    return (
      <SafeAreaView style={styles.safe}>
        <LinearGradient colors={GRADIENTS.primary as any} style={styles.nameScreen}>
          <View style={styles.nameContent}>
            <Text style={styles.nameEmoji}>👋</Text>
            <Text style={styles.nameTitle}>Como podemos te chamar?</Text>
            <Text style={styles.nameDesc}>Pode ser seu nome, apelido ou como preferir que eu te chame.</Text>
            
            <View style={[styles.inputWrapper, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <TextInput
                style={styles.nameInput}
                placeholder="Seu nome"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
                autoCapitalize="words"
                onSubmitEditing={handleFinish}
              />
              {nameInput.length > 0 && (
                <TouchableOpacity onPress={() => setNameInput('')} style={styles.clearBtn}>
                  <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.7)" />
                </TouchableOpacity>
              )}
            </View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                style={styles.startBtn} 
                onPress={handleFinish} 
                onPressIn={pressInAnimation}
                onPressOut={pressOutAnimation}
                activeOpacity={1}
              >
                <Text style={styles.startBtnText}>
                  {nameInput.trim() ? `Começar, ${nameInput.trim()}!` : 'Continuar'}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#7C6F9B" />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={handleFinish} style={styles.skipName}>
              <Text style={styles.skipNameText}>Pular por enquanto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nameFooter}>
            <View style={[styles.footerPill, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <Ionicons name="shield-checkmark" size={14} color="#FFF" />
              <Text style={styles.footerText}>Seus dados ficam apenas aqui</Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const slide = slides[step];
  const progress = ((step + 1) / slides.length) * 100;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={slide.gradient as any} style={styles.slideContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.stepCount}>{step + 1}/{slides.length}</Text>
        </View>

        <Animated.View style={[styles.slideContent, { opacity: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) }]}>
          <Text style={styles.slideEmoji}>{slide.emoji}</Text>
          <Text style={styles.slideTitle}>{slide.title}</Text>
          <Text style={styles.slideDesc}>{slide.desc}</Text>
        </Animated.View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.dot, 
                  i === step && styles.dotActive,
                  i < step && styles.dotDone
                ]} 
              />
            ))}
          </View>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity 
              style={styles.nextBtn} 
              onPress={handleNext}
              onPressIn={pressInAnimation}
              onPressOut={pressOutAnimation}
              activeOpacity={1}
            >
              <Text style={styles.nextText}>
                {step === slides.length - 1 ? 'Começar' : 'Próximo'}
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  slideContainer: { flex: 1, paddingHorizontal: 28, paddingVertical: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  skipBtn: { padding: 8, borderRadius: 16 },
  skipText: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.75)' },
  progressContainer: { flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#FFF', borderRadius: 2 },
  stepCount: { fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  slideContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  slideEmoji: { fontSize: 80, marginBottom: 24 },
  slideTitle: { fontSize: 32, fontWeight: '800', color: '#FFF', textAlign: 'center', marginBottom: 16, letterSpacing: -0.5 },
  slideDesc: { fontSize: 17, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 26, maxWidth: 340 },
  footer: { alignItems: 'center', paddingBottom: 16 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  dotActive: { backgroundColor: '#FFF', width: 24, borderRadius: 4 },
  dotDone: { backgroundColor: 'rgba(255,255,255,0.6)' },
  nextBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 36, paddingVertical: 18, borderRadius: 30, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  nextText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  nameScreen: { flex: 1, justifyContent: 'space-between' },
  nameContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  nameEmoji: { fontSize: 72, marginBottom: 20 },
  nameTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', textAlign: 'center', letterSpacing: -0.5 },
  nameDesc: { fontSize: 16, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 12, marginBottom: 32 },
  inputWrapper: { width: '100%', maxWidth: 320, flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)' },
  nameInput: { flex: 1, paddingVertical: 18, fontSize: 20, color: '#FFF', textAlign: 'center' },
  clearBtn: { padding: 4 },
  startBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 36, paddingVertical: 18, borderRadius: 30, marginTop: 24, gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  startBtnText: { fontSize: 17, fontWeight: '700', color: '#7C6F9B' },
  skipName: { marginTop: 16 },
  skipNameText: { fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: '500' },
  nameFooter: { alignItems: 'center', paddingBottom: 24 },
  footerPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 8 },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
});
