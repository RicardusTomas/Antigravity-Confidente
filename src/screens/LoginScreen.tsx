import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store/useStore';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, register } = useStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; confirm?: string }>({});
  
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
      newErrors.username = 'Digite seu nome';
    } else if (username.trim().length < 2) {
      newErrors.username = 'Nome deve ter pelo menos 2 caracteres';
    }
    if (!password) {
      newErrors.password = 'Digite sua senha';
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

    setTimeout(() => {
      if (isRegistering) {
        const success = register(username, password);
        if (!success) {
          setIsLoading(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Ops!', 'Já existe um usuário com esse nome.');
          return;
        }
      } else {
        const success = login(username, password);
        if (!success) {
          setIsLoading(false);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Ops!', 'Nome ou senha incorretos.');
          return;
        }
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient 
        colors={['#7C6F9B', '#A89CC8', '#D4C8E8']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }}
        style={styles.bgGradient}
      >
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>💜</Text>
          </View>
          <Text style={styles.appName}>Confidente</Text>
          <Text style={styles.tagline}>Seu espaço seguro para se expressar</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {isRegistering ? 'Criar Conta' : 'Bem-vindo'}
            </Text>
            <Text style={styles.formSubtitle}>
              {isRegistering ? 'Junte-se a nós' : 'É bom te ver aqui'}
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#7C6F9B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor="#999"
                value={username}
                onChangeText={(t) => { setUsername(t); setErrors(e => ({ ...e, username: undefined })); }}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#7C6F9B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: undefined })); }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {isRegistering && (
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#7C6F9B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar senha"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); setErrors(e => ({ ...e, confirm: undefined })); }}
                  secureTextEntry={!showPassword}
                />
              </View>
            )}
            {errors.confirm && (
              <Text style={styles.errorText}>{errors.confirm}</Text>
            )}

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit} 
              disabled={isLoading}
            >
              <LinearGradient 
                colors={['#7C6F9B', '#9B8BB8']} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.submitText}>
                  {isLoading ? 'Entrando...' : (isRegistering ? 'Criar conta' : 'Entrar')}
                </Text>
                {!isLoading && <Ionicons name="arrow-forward" size={18} color="#FFF" style={{ marginLeft: 8 }} />}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
              <Text style={styles.toggleText}>
                {isRegistering ? 'Já tem conta? ' : 'Primeiro acesso? '}
                <Text style={styles.toggleLink}>
                  {isRegistering ? 'Entrar' : 'Cadastrar'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Ionicons name="shield-checkmark-outline" size={14} color="#7C6F9B" />
            <Text style={styles.footerText}>Dados apenas no seu dispositivo</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgGradient: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 32, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  tagline: { fontSize: 14, marginTop: 6, color: 'rgba(255,255,255,0.8)' },
  
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 10,
  },
  formHeader: { marginBottom: 24, alignItems: 'center' },
  formTitle: { fontSize: 24, fontWeight: '800', color: '#333', letterSpacing: -0.3 },
  formSubtitle: { fontSize: 14, marginTop: 4, color: '#666' },
  
  inputWrapper: {},
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14, marginBottom: 8, paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#333' },
  eyeBtn: { padding: 6 },
  errorText: { color: '#E74C3C', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  
  submitButton: {
    marginTop: 16,
    shadowColor: '#7C6F9B', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row',
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  
  toggleButton: { marginTop: 20, alignItems: 'center' },
  toggleText: { fontSize: 14, color: '#666' },
  toggleLink: { color: '#7C6F9B', fontWeight: '700' },
  
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 20, gap: 6,
  },
  footerText: { fontSize: 12, color: '#999' },
});