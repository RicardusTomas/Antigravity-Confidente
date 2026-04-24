import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store/useStore';
import { useThemeColors, GRADIENTS } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, register, currentUser } = useStore();
  const colors = useThemeColors();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; confirm?: string }>({});
  
  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const validateInputs = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) {
      newErrors.username = 'Por favor, digite seu nome';
    } else if (username.trim().length < 2) {
      newErrors.username = 'Nome deve ter pelo menos 2 caracteres';
    }
    if (!password) {
      newErrors.password = 'Por favor, digite sua senha';
    } else if (password.length < 4) {
      newErrors.password = 'Senha deve ter pelo menos 4 caracteres';
    }
    if (isRegistering && password !== confirmPassword) {
      newErrors.confirm = 'As senhas não coincidem';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setIsLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      if (isRegistering) {
        const success = register(username, password);
        if (!success) {
          setIsLoading(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Ops!', 'Já existe um usuário com esse nome. Escolha outro.');
          return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        const success = login(username, password);
        if (!success) {
          setIsLoading(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Ops!', 'Nome ou senha incorretos. Tente novamente.');
          return;
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      setIsLoading(false);
    }, 300);
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRegistering(!isRegistering);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled" 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoContainer}>
                <LinearGradient colors={GRADIENTS.primary as any} style={styles.logoCircle}>
                  <Text style={styles.logoEmoji}>💜</Text>
                </LinearGradient>
                <Text style={[styles.appName, { color: colors.text }]}>Confidente</Text>
                <Text style={[styles.tagline, { color: colors.textSecondary }]}>Seu espaço seguro para se expressar</Text>
              </View>

              <View style={[styles.form, { backgroundColor: colors.card, shadowColor: colors.primary }]}>
                <View style={styles.formHeader}>
                  <Text style={[styles.formTitle, { color: colors.text }]}>
                    {isRegistering ? 'Criar Conta' : 'Bem-vindo'}
                  </Text>
                  <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
                    {isRegistering ? 'Junte-se a nós' : 'É bom te ver aqui'}
                  </Text>
                </View>

                <View style={[styles.inputContainer, { backgroundColor: colors.backgroundAlt, borderColor: errors.username ? colors.error : 'transparent' }]}>
                  <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Seu nome"
                    placeholderTextColor={colors.textTertiary}
                    value={username}
                    onChangeText={(t) => { setUsername(t); setErrors(e => ({ ...e, username: undefined })); }}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                  />
                </View>
                {errors.username && (
                  <View style={styles.errorRow}>
                    <Ionicons name="alert-circle" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.username}</Text>
                  </View>
                )}

                <View style={[styles.inputContainer, { backgroundColor: colors.backgroundAlt, borderColor: errors.password ? colors.error : 'transparent' }]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Sua senha"
                    placeholderTextColor={colors.textTertiary}
                    value={password}
                    onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
                    secureTextEntry={!showPassword}
                    autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  />
                  <TouchableOpacity onPress={() => { setShowPassword(!showPassword); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} style={styles.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textTertiary} />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <View style={styles.errorRow}>
                    <Ionicons name="alert-circle" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.password}</Text>
                  </View>
                )}

                {isRegistering && (
                  <View style={[styles.inputContainer, { backgroundColor: colors.backgroundAlt, borderColor: errors.confirm ? colors.error : 'transparent' }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Confirmar senha"
                      placeholderTextColor={colors.textTertiary}
                      value={confirmPassword}
                      onChangeText={(t) => { setConfirmPassword(t); setErrors(e => ({ ...e, confirm: undefined })); }}
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
                    />
                  </View>
                )}
                {errors.confirm && (
                  <View style={styles.errorRow}>
                    <Ionicons name="alert-circle" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error }]}>{errors.confirm}</Text>
                  </View>
                )}

                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.9} disabled={isLoading}>
                    <LinearGradient colors={GRADIENTS.primary as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
                      {isLoading ? (
                        <View style={styles.spinnerContainer}>
                          <Animated.Text style={styles.submitText}>Entrando...</Animated.Text>
                        </View>
                      ) : (
                        <View style={styles.buttonContent}>
                          <Text style={styles.submitText}>
                            {isRegistering ? 'Criar conta' : 'Entrar'}
                          </Text>
                          <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
                  <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
                    {isRegistering ? 'Já tem conta? ' : 'Primeiro acesso? '}
                    <Text style={{ color: colors.primary, fontWeight: '700' }}>
                      {isRegistering ? 'Entrar' : 'Cadastrar'}
                    </Text>
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerContainer}>
                <View style={[styles.footerPill, { backgroundColor: colors.primaryBg }]}>
                  <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
                  <Text style={[styles.footer, { color: colors.textTertiary }]}>
                    Dados apenas no seu dispositivo
                  </Text>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  container: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: '#7C6F9B', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { fontSize: 14, marginTop: 6, fontWeight: '500', textAlign: 'center' },
  form: {
    width: '100%', maxWidth: 380,
    borderRadius: 24, padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 6,
  },
  formHeader: { marginBottom: 20 },
  formTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  formSubtitle: { fontSize: 14, marginTop: 4, fontWeight: '500' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, marginBottom: 8, paddingHorizontal: 14,
    borderWidth: 1.5,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 15 },
  eyeBtn: { padding: 6 },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginLeft: 4, gap: 4 },
  errorText: { fontSize: 12, fontWeight: '500' },
  submitButton: {
    marginTop: 12,
    shadowColor: '#7C6F9B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  gradient: {
    paddingVertical: 16, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
  },
  buttonContent: { flexDirection: 'row', alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  spinnerContainer: { flexDirection: 'row', alignItems: 'center' },
  toggleButton: { marginTop: 18, alignItems: 'center' },
  toggleText: { fontSize: 14, fontWeight: '500' },
  footerContainer: { alignItems: 'center', marginTop: 24 },
  footerPill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 16, gap: 6,
  },
  footer: { fontSize: 12, fontWeight: '500' },
});