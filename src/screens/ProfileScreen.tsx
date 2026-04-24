import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors, GRADIENTS } from '../theme/colors';
import { useStore, AIVoice } from '../store/useStore';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { userName, setUserName, entries, breathingSessions, chatMessages, clearChat, logout, aiName, setAIName, aiVoice, setAIVoice, voiceEnabled, setVoiceEnabled, voiceSpeed, setVoiceSpeed } = useStore();
  const colors = useThemeColors();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [voiceModal, setVoiceModal] = useState(false);
  const [aiNameInput, setAiNameInput] = useState(aiName);

  const saveName = () => {
    setUserName(nameInput.trim());
    setEditing(false);
  };

  const handleClearChat = () => {
    Alert.alert('Limpar conversa', 'Deseja apagar todo o histórico de conversa com o Confidente?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: clearChat },
    ]);
  };

  const stats = [
    { icon: 'book-outline', label: 'Registros no diário', value: entries.length },
    { icon: 'chatbubble-outline', label: 'Mensagens trocadas', value: chatMessages.length },
    { icon: 'leaf-outline', label: 'Sessões de respiração', value: breathingSessions.length },
  ];

  const getVoiceLabel = () => {
    switch (aiVoice) {
      case 'female': return 'Feminina';
      case 'male': return 'Masculina';
      case 'neutral': return 'Neutra';
      default: return 'Padrão';
    }
  };

  const voiceOptions: { id: AIVoice; label: string; emoji: string; desc: string }[] = [
    { id: 'default', label: 'Padrão', emoji: '💜', desc: 'Voz suave e equilibrada' },
    { id: 'female', label: 'Feminina', emoji: '👩', desc: 'Tom mais agudo e suave' },
    { id: 'male', label: 'Masculina', emoji: '👨', desc: 'Tom mais grave e firme' },
    { id: 'neutral', label: 'Neutra', emoji: '🎙️', desc: 'Tom natural e neutro' },
  ];

  const saveVoiceSettings = () => {
    if (aiNameInput.trim()) setAIName(aiNameInput.trim());
    setVoiceModal(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: 'transparent' }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>
        </View>

        {/* Avatar & Name */}
        <LinearGradient colors={GRADIENTS.primary} style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Image source={require('../../assets/confidente.png')} style={styles.avatarImg} />
          </View>
          {editing ? (
            <View style={styles.editRow}>
              <TextInput
                style={styles.nameInput}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Seu nome"
                placeholderTextColor="rgba(255,255,255,0.5)"
                autoFocus
                onSubmitEditing={saveName}
              />
              <TouchableOpacity onPress={saveName} style={styles.saveNameBtn}>
                <Ionicons name="checkmark" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => { setNameInput(userName); setEditing(true); }} style={styles.nameRow}>
              <Text style={styles.name}>{userName || 'Toque para adicionar seu nome'}</Text>
              <Ionicons name="pencil-outline" size={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Stats */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sua Jornada</Text>
        {stats.map((s, i) => (
          <View key={i} style={[styles.statRow, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.primaryBg }]}>
              <Ionicons name={s.icon as any} size={20} color={colors.primary} />
            </View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{s.value}</Text>
          </View>
        ))}

        {/* Voice Settings */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Configurações da Voz</Text>
        
        <TouchableOpacity style={[styles.settingRow, { backgroundColor: colors.card }]} onPress={() => setVoiceModal(true)}>
          <View style={[styles.statIcon, { backgroundColor: colors.primaryBg }]}>
            <Ionicons name="volume-high-outline" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Voz da IA</Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{getVoiceLabel()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingRow, { backgroundColor: colors.card }]} onPress={() => setVoiceEnabled(!voiceEnabled)}>
          <View style={[styles.statIcon, { backgroundColor: voiceEnabled ? colors.primaryBg : colors.backgroundAlt }]}>
            <Ionicons name={voiceEnabled ? 'volume-high' : 'volume-mute-outline'} size={20} color={voiceEnabled ? colors.primary : colors.textTertiary} />
          </View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Resposta por voz</Text>
          <Switch value={voiceEnabled} onValueChange={setVoiceEnabled} trackColor={{ false: colors.divider, true: colors.primary }} thumbColor="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingRow, { backgroundColor: colors.card }]} onPress={() => { setAiNameInput(aiName); setVoiceModal(true); }}>
          <View style={[styles.statIcon, { backgroundColor: colors.primaryBg }]}>
            <Ionicons name="person-outline" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Nome da IA</Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{aiName}</Text>
        </TouchableOpacity>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Configurações</Text>
        <TouchableOpacity 
          style={[styles.settingRow, { backgroundColor: colors.card }]} 
          onPress={handleClearChat}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
          <Text style={[styles.settingLabel, { color: colors.error }]}>Limpar histórico do chat</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.settingRow, { backgroundColor: colors.card }]} 
          onPress={() => logout()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.settingLabel, { color: colors.error }]}>Sair da conta</Text>
</TouchableOpacity>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
        <View style={[styles.aboutCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.aboutTitle, { color: colors.text }]}>Confidente 💜</Text>
          <Text style={[styles.aboutVersion, { color: colors.textTertiary }]}>Versão 1.0.0</Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            O Confidente é um aplicativo de apoio emocional diário. Ele não substitui acompanhamento psicológico ou psiquiátrico profissional. Se você está em crise, procure ajuda profissional.
          </Text>
          <View style={[styles.helpLine, { backgroundColor: colors.primaryBg }]}>
            <Ionicons name="call-outline" size={16} color={colors.primary} />
            <Text style={[styles.helpText, { color: colors.primary }]}>CVV: 188 (24h, gratuito)</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Voice Settings Modal */}
      <Modal visible={voiceModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Configurações da Voz</Text>
              <TouchableOpacity onPress={() => setVoiceModal(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Tipo de voz</Text>
            <View style={styles.voiceGrid}>
              {voiceOptions.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.voiceOption, aiVoice === v.id && { backgroundColor: colors.primaryBg, borderColor: colors.primary }]}
                  onPress={() => setAIVoice(v.id)}
                >
                  <Text style={styles.voiceEmoji}>{v.emoji}</Text>
                  <Text style={[styles.voiceLabel, aiVoice === v.id && { color: colors.primary }]}>{v.label}</Text>
                  <Text style={[styles.voiceDesc, { color: colors.textTertiary }]}>{v.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary, marginTop: 20 }]}>Nome da IA</Text>
            <TextInput
              style={[styles.aiNameInput, { backgroundColor: colors.backgroundAlt, color: colors.text }]}
              value={aiNameInput}
              onChangeText={setAiNameInput}
              placeholder="Digite o nome da IA"
              placeholderTextColor={colors.textTertiary}
            />

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={saveVoiceSettings}>
              <Text style={styles.saveBtnText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  title: { fontSize: 24, fontWeight: '700' },
  profileCard: { marginHorizontal: 16, borderRadius: 24, padding: 28, alignItems: 'center', marginTop: 12 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 32 },
  avatarImg: { width: 72, height: 72, borderRadius: 36 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 18, fontWeight: '600', color: '#FFF' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nameInput: { fontSize: 18, fontWeight: '600', color: '#FFF', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.5)', paddingVertical: 4, minWidth: 150, textAlign: 'center' },
  saveNameBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', paddingHorizontal: 20, marginTop: 28, marginBottom: 12 },
  statRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 10 },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  statLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  statValue: { fontSize: 15, fontWeight: '600' },
  settingRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 10 },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '500', marginLeft: 12 },
  settingValue: { fontSize: 14 },
  aboutCard: { marginHorizontal: 16, borderRadius: 24, padding: 24, marginTop: 12 },
  aboutTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  aboutVersion: { fontSize: 13, marginBottom: 12 },
  aboutText: { fontSize: 13, lineHeight: 20, marginBottom: 16 },
  helpLine: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, gap: 8, alignSelf: 'flex-start' },
  helpText: { fontSize: 13, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800' },
  fieldLabel: { fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  voiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  voiceOption: { width: '47%', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent' },
  voiceEmoji: { fontSize: 28, marginBottom: 8 },
  voiceLabel: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  voiceDesc: { fontSize: 11, textAlign: 'center' },
  aiNameInput: { borderRadius: 14, padding: 16, fontSize: 16, marginBottom: 20 },
  saveBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
