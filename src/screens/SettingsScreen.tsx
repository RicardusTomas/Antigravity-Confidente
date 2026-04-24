import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../theme/colors';
import { useStore, BackgroundTheme } from '../store/useStore';
import { themeOptions } from '../theme/AppTheme';
import { colorPickerOptions } from '../theme/useTheme';

export default function SettingsScreen({ navigation }: any) {
  const { backgroundTheme, setBackgroundTheme, customBackgroundColor, setCustomBackgroundColor, darkMode, setDarkMode } = useStore();
  const colors = useThemeColors();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const currentTheme = themeOptions.find(t => t.key === backgroundTheme);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: colors.backgroundAlt }]}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Aparência</Text>
        
        <TouchableOpacity style={[styles.settingCard, { backgroundColor: colors.card }]} onPress={() => setShowColorPicker(true)}>
          <View style={styles.settingLeft}>
            <View style={[styles.colorPreview, { backgroundColor: backgroundTheme === 'custom' ? customBackgroundColor : currentTheme?.colors[0], borderColor: colors.divider }]} />
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Cor de fundo</Text>
              <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{backgroundTheme === 'custom' ? 'Personalizado' : currentTheme?.name}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={styles.themeGrid}>
          {themeOptions.map((theme) => (
            <TouchableOpacity
              key={theme.key}
              style={[
                styles.themeOption,
                { backgroundColor: colors.card },
                backgroundTheme === theme.key && [styles.themeOptionActive, { borderColor: colors.primary }],
              ]}
              onPress={() => {
                if (theme.key === 'custom') {
                  setShowColorPicker(true);
                } else {
                  setBackgroundTheme(theme.key);
                }
              }}
            >
              <View style={[styles.themePreview, { backgroundColor: theme.colors[0] }]}>
                <View style={[styles.themeAccent, { backgroundColor: theme.colors[1] }]} />
              </View>
              <Text style={[
                styles.themeName,
                { color: colors.textSecondary },
                backgroundTheme === theme.key && { color: colors.primary, fontWeight: '700' },
              ]}>
                {theme.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Modo Escuro</Text>
        <TouchableOpacity
          style={[styles.settingCard, { backgroundColor: colors.card }]}
          onPress={() => setDarkMode(!darkMode)}
          activeOpacity={0.7}
        >
          <View style={styles.settingLeft}>
            <View style={[styles.iconCircle, { backgroundColor: darkMode ? colors.primaryBg : colors.backgroundAlt }]}>
              <Ionicons name={darkMode ? 'moon' : 'sunny-outline'} size={20} color={darkMode ? colors.primary : colors.textTertiary} />
            </View>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Ativar modo escuro</Text>
          </View>
          <View style={[styles.toggle, darkMode && [styles.toggleActive, { backgroundColor: colors.primary }]]}>
            <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]}>
              <Ionicons name={darkMode ? 'moon' : 'sunny'} size={13} color={darkMode ? colors.primary : colors.textTertiary} />
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Color Picker Modal */}
      <Modal visible={showColorPicker} animationType="slide" transparent>
        <Pressable style={styles.modalOverlay} onPress={() => setShowColorPicker(false)}>
          <Pressable style={[styles.modalContent, { backgroundColor: colors.card }]} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Escolha a cor de fundo</Text>
              <TouchableOpacity onPress={() => setShowColorPicker(false)} style={[styles.closeBtn, { backgroundColor: colors.backgroundAlt }]}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.colorGrid}>
              {colorPickerOptions.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color.color, borderColor: colors.divider },
                    customBackgroundColor === color.color && [styles.colorOptionActive, { borderColor: colors.primary }],
                  ]}
                  onPress={() => {
                    setCustomBackgroundColor(color.color);
                    setBackgroundTheme('custom');
                    setShowColorPicker(false);
                  }}
                >
                  {customBackgroundColor === color.color && (
                    <Ionicons name="checkmark" size={22} color={color.color === '#FFFFFF' || color.color === '#F5F5F5' ? '#666' : '#FFF'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.colorName, { color: colors.textSecondary }]}>{colorPickerOptions.find(c => c.color === customBackgroundColor)?.name || 'Cor'}</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.3 },
  sectionTitle: { fontSize: 12, fontWeight: '700', paddingHorizontal: 20, marginTop: 24, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  settingCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 16, borderRadius: 18, padding: 16, marginBottom: 10 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  settingValue: { fontSize: 13, marginTop: 2, fontWeight: '400' },
  colorPreview: { width: 42, height: 42, borderRadius: 14, borderWidth: 2 },
  iconCircle: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10 },
  themeOption: { width: '30%', alignItems: 'center', padding: 10, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  themeOptionActive: { borderWidth: 2 },
  themePreview: { width: 52, height: 52, borderRadius: 14, overflow: 'hidden' },
  themeAccent: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderTopLeftRadius: 8 },
  themeName: { fontSize: 11, marginTop: 8, textAlign: 'center', fontWeight: '500' },
  divider: { height: 1, marginHorizontal: 16, marginTop: 24 },
  toggle: { width: 52, height: 30, borderRadius: 15, backgroundColor: '#DDD', padding: 2, justifyContent: 'center' },
  toggleActive: {},
  toggleThumb: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 2 },
  toggleThumbActive: { marginLeft: 22 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  colorOption: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  colorOptionActive: { borderWidth: 3 },
  colorName: { textAlign: 'center', marginTop: 18, fontSize: 14, fontWeight: '500' },
});