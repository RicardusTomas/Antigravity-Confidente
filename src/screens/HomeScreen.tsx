import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, GRADIENTS } from '../theme/colors';
import { useStore, BackgroundTheme } from '../store/useStore';
import { getGreeting, getMoodInfo } from '../utils/moodHelpers';
import { getDailyAffirmation, getDailyTip } from '../utils/affirmations';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { userName, entries, breathingSessions, darkMode, backgroundTheme, setBackgroundTheme, setDarkMode, customBackgroundImage, setCustomBackgroundImage } = useStore();
  const colors = useThemeColors();
  const greeting = getGreeting();
  const name = userName || 'querido(a)';
  const affirmation = getDailyAffirmation();
  const tip = getDailyTip();
  const lastMood = entries.length > 0 ? getMoodInfo(entries[0].mood) : null;

  const [appearanceModal, setAppearanceModal] = useState(false);
  const [tempTheme, setTempTheme] = useState<BackgroundTheme>(backgroundTheme);

  const pickImage = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const uri = ev.target?.result as string;
            if (uri) setCustomBackgroundImage(uri);
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else {
      alert('Para escolher uma imagem no dispositivo nativo, instale expo-image-picker.');
    }
  };

  const removeImage = () => {
    setCustomBackgroundImage(null);
  };

  const saveAppearance = () => {
    setBackgroundTheme(tempTheme);
    if (tempTheme === 'dark') {
      setDarkMode(true);
    } else if (tempTheme !== 'custom') {
      setDarkMode(false);
    }
    setAppearanceModal(false);
  };

  const THEMES: { id: BackgroundTheme; label: string; emoji: string }[] = [
    { id: 'default', label: 'Claro', emoji: '☀️' },
    { id: 'dark', label: 'Escuro', emoji: '🌙' },
    { id: 'forest', label: 'Natureza', emoji: '🌿' },
    { id: 'sunset', label: 'Pôr do Sol', emoji: '🌅' },
    { id: 'ocean', label: 'Oceano', emoji: '🌊' },
    { id: 'lavender', label: 'Lavanda', emoji: '💜' },
  ];

  const mainActions = [
    { id: 'write', icon: 'create', label: 'Quero escrever', desc: 'Escreva o que está sentindo', color: colors.primary, bg: colors.primaryBg, screen: 'NewEntry' },
    { id: 'speak', icon: 'mic', label: 'Quero falar', desc: 'Fale com o Confidente por voz', color: colors.calm, bg: darkMode ? '#1E3B33' : '#E4F1EE', screen: 'ChatVoice' },
    { id: 'mood', icon: 'happy', label: 'Registrar humor', desc: 'Como está seu dia?', color: colors.accent, bg: darkMode ? '#4A3423' : '#FBECE3', screen: 'NewEntry' },
    { id: 'calm', icon: 'heart', label: 'Preciso me acalmar', desc: 'Exercícios e acolhimento', color: colors.angry, bg: darkMode ? '#4D2626' : '#F6E6E6', screen: 'Wellness' },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: 'transparent' }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header com design premium */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{greeting},</Text>
            <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
            <View style={[styles.taglineBox, { backgroundColor: colors.primaryBg }]}>
              <Text style={[styles.tagline, { color: colors.primary }]}>Fale sem medo. Estou aqui.</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              onPress={() => { setTempTheme(backgroundTheme); setAppearanceModal(true); }} 
              style={[styles.iconButton, { backgroundColor: colors.primaryBg }]}
              activeOpacity={0.8}
            >
              <Ionicons name="color-palette" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')} 
              style={[styles.profileButton, { shadowColor: colors.primary }]}
              activeOpacity={0.9}
            >
              <LinearGradient colors={GRADIENTS.primary} style={styles.profileCircle}>
                <Image source={require('../../assets/confidente.png')} style={styles.profileImg} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão grande para falar com IA */}
        <TouchableOpacity 
          style={[styles.aiChatButton, { backgroundColor: darkMode ? '#2A2040' : '#F5F0FF' }]}
          onPress={() => navigation.navigate('ChatVoice')}
          activeOpacity={0.85}
        >
          <View style={[styles.aiAvatarWrap, { backgroundColor: '#7C6F9B' }]}>
            <Image source={require('../../assets/confidente.png')} style={styles.aiAvatarImg} />
          </View>
          <View style={styles.aiChatContent}>
            <Text style={[styles.aiChatTitle, { color: colors.text }]}>Conversar com Confidente</Text>
            <Text style={[styles.aiChatSubtitle, { color: colors.textSecondary }]}>Fale ou escreva o que está sentindo</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Card de Afirmação com gradiente e borda arredondada premium */}
        <LinearGradient 
          colors={darkMode ? ['#3D3550', '#524A70'] : GRADIENTS.primary} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={[styles.affCard, { shadowColor: colors.primary }]}
        >
          <View style={styles.affHeader}>
            <View style={styles.affIconBox}>
              <Text style={styles.affIcon}>✨</Text>
            </View>
            <Text style={styles.affLabel}>AFIRMAÇÃO DO DIA</Text>
          </View>
          <Text style={styles.affText}>"{affirmation}"</Text>
          <View style={styles.affDecoration}>
            <View style={styles.affDot} />
            <View style={[styles.affDot, styles.affDotSmall]} />
            <View style={[styles.affDot, styles.affDotTiny]} />
          </View>
        </LinearGradient>

        {/* Seção de Ações Principais */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>O que você precisa agora?</Text>
        <View style={styles.actionsGrid}>
          {mainActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate(action.screen as any)}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon as any} size={26} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>{action.label}</Text>
              <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>{action.desc}</Text>
              <View style={[styles.actionArrow, { backgroundColor: action.bg }]}>
                <Ionicons name="arrow-forward" size={14} color={action.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card de Humor Recente */}
        {lastMood && (
          <TouchableOpacity 
            style={[styles.moodCard, { backgroundColor: colors.card }]} 
            onPress={() => navigation.navigate('Journal')} 
            activeOpacity={0.85}
          >
            <View style={styles.moodLeft}>
              <View style={[styles.moodEmojiBox, { backgroundColor: lastMood.color + '20' }]}>
                <Text style={styles.moodEmoji}>{lastMood.emoji}</Text>
              </View>
              <View style={styles.moodInfo}>
                <Text style={[styles.moodLabel, { color: colors.textTertiary }]}>Seu último registro</Text>
                <Text style={[styles.moodName, { color: colors.text }]}>{lastMood.label}</Text>
              </View>
            </View>
            <View style={[styles.chevronCircle, { backgroundColor: colors.backgroundAlt }]}>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </View>
          </TouchableOpacity>
        )}

        {/* Card de Dica do Dia */}
        <View style={[styles.tipCard, { backgroundColor: darkMode ? '#2D2520' : colors.accentLight + '15' }]}>
          <View style={[styles.tipIconBox, { backgroundColor: darkMode ? '#4A3530' : colors.accentLight + '35' }]}>
            <Ionicons name={tip.icon as any} size={22} color={colors.accentDark} />
          </View>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: colors.accentDark }]}>{tip.title}</Text>
            <Text style={[styles.tipDesc, { color: colors.textSecondary }]} numberOfLines={2}>{tip.desc}</Text>
          </View>
        </View>

        {/* Estatísticas em cards compactos */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.primaryBg }]}>
              <Ionicons name="document-text" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.statNum, { color: colors.text }]}>{entries.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Registros</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.primaryBg }]}>
              <Ionicons name="leaf" size={18} color={colors.primary} />
            </View>
            <Text style={[styles.statNum, { color: colors.text }]}>{breathingSessions.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Respirações</Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Aparência */}
      <Modal visible={appearanceModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Personalizar Aparência</Text>
              <TouchableOpacity 
                onPress={() => setAppearanceModal(false)} 
                style={[styles.closeButton, { backgroundColor: colors.backgroundAlt }]}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.settingLabelGroup, { color: colors.textTertiary }]}>TEMAS VISUAIS</Text>
              <View style={styles.themesGrid}>
                {THEMES.map(theme => (
                  <TouchableOpacity
                    key={theme.id}
                    style={[
                      styles.themePill,
                      tempTheme === theme.id
                        ? { backgroundColor: colors.primary }
                        : { backgroundColor: colors.backgroundAlt },
                    ]}
                    onPress={() => setTempTheme(theme.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                    <Text style={[styles.themePillText, tempTheme === theme.id ? { color: '#FFF' } : { color: colors.text }]}>{theme.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.settingLabelGroup, { color: colors.textTertiary, marginTop: 28 }]}>IMAGEM DE FUNDO</Text>
              {customBackgroundImage ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: customBackgroundImage }} style={styles.imagePreview} />
                  <TouchableOpacity 
                    style={styles.removeImageBtn} 
                    onPress={removeImage}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash" size={16} color="#FFF" />
                    <Text style={styles.removeImageText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.uploadButton, { borderColor: colors.primary }]} 
                  onPress={pickImage}
                  activeOpacity={0.7}
                >
                  <Ionicons name="image-outline" size={22} color={colors.primary} />
                  <Text style={[styles.uploadButtonText, { color: colors.primary }]}>Escolher da galeria</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary }]} 
              onPress={saveAppearance} 
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 50 },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 20 
  },
  headerLeft: { flex: 1, paddingRight: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  greeting: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  name: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  taglineBox: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, marginTop: 10, alignSelf: 'flex-start' },
  tagline: { fontSize: 12, fontWeight: '600' },
  iconButton: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  profileButton: { marginTop: 0, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  profileCircle: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  profileEmoji: { fontSize: 20 },
  profileImg: { width: 42, height: 42, borderRadius: 21 },
  
  aiChatButton: { 
    marginHorizontal: 16, 
    marginTop: 12,
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  aiAvatarWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  aiAvatarImg: { width: 52, height: 52, borderRadius: 26 },
  aiChatContent: { flex: 1 },
  aiChatTitle: { fontSize: 17, fontWeight: '700', marginBottom: 3 },
  aiChatSubtitle: { fontSize: 13 },
  
  affCard: { 
    marginHorizontal: 20, 
    borderRadius: 26, 
    padding: 22, 
    marginBottom: 28, 
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 16, 
    elevation: 10 
  },
  affHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  affIconBox: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  affIcon: { fontSize: 14 },
  affLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: 1.2 },
  affText: { fontSize: 18, fontWeight: '600', color: '#FFF', lineHeight: 26 },
  affDecoration: { flexDirection: 'row', position: 'absolute', right: 18, bottom: 18, gap: 6 },
  affDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)' },
  affDotSmall: { width: 6, height: 6 },
  affDotTiny: { width: 4, height: 4 },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', paddingHorizontal: 20, marginBottom: 16, letterSpacing: -0.3 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, gap: 12, marginBottom: 28 },
  actionCard: {
    borderRadius: 22, padding: 18,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
    flexGrow: 1, flexBasis: (width - 58) / 2, marginHorizontal: 6,
  },
  actionIconWrap: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  actionLabel: { fontSize: 14, fontWeight: '700' },
  actionDesc: { fontSize: 11, marginTop: 4, lineHeight: 15, fontWeight: '500' },
  actionArrow: { position: 'absolute', right: 14, bottom: 14, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  
  moodCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginHorizontal: 20, 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 18, 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  moodLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  moodEmojiBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  moodEmoji: { fontSize: 24 },
  moodInfo: { justifyContent: 'center' },
  moodLabel: { fontSize: 11, fontWeight: '600' },
  moodName: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  chevronCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  
  tipCard: { 
    flexDirection: 'row', 
    marginHorizontal: 20, 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 24, 
    alignItems: 'center', 
    gap: 14 
  },
  tipIconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 15, fontWeight: '700' },
  tipDesc: { fontSize: 12, lineHeight: 17, marginTop: 3, fontWeight: '500' },
  
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12 },
  statCard: { 
    flex: 1, 
    borderRadius: 18, 
    padding: 14, 
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 6, 
    elevation: 2 
  },
  statIconBox: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statNum: { fontSize: 24, fontWeight: '700' },
  statLabel: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { borderRadius: 26, padding: 24, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalScroll: { maxHeight: 320 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  closeButton: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  settingLabelGroup: { fontSize: 11, fontWeight: '700', marginBottom: 14, letterSpacing: 0.5 },
  themesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  themePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, gap: 8 },
  themeEmoji: { fontSize: 16 },
  themePillText: { fontSize: 13, fontWeight: '600' },
  uploadButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 2, 
    borderStyle: 'dashed', 
    gap: 10 
  },
  uploadButtonText: { fontSize: 14, fontWeight: '700' },
  imagePreviewContainer: { borderRadius: 16, overflow: 'hidden', height: 120 },
  imagePreview: { width: '100%', height: '100%' },
  removeImageBtn: { 
    position: 'absolute', 
    bottom: 10, 
    right: 10, 
    backgroundColor: 'rgba(224,122,122,0.9)', 
    flexDirection: 'row', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12, 
    alignItems: 'center', 
    gap: 6 
  },
  removeImageText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  saveButton: { 
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 16,
    shadowColor: '#7C6F9B', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    elevation: 5 
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
