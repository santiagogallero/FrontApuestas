import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { AppButton, AppInput, Logo } from '../components';
import { useAuth } from '../hooks';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface LoginScreenProps {
  onNavigate: NavigateFn;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      onNavigate('subastas');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <Logo size={28} />
          <Text style={styles.brand}>Auction Pulse Pro</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Inicia sesion para ver tu dashboard profesional de subastas</Text>

          <AppInput
            label="CORREO"
            placeholder="name@firm.com"
            value={email}
            onChangeText={setEmail}
            iconLeft="@"
            keyboardType="email-address"
          />
          <AppInput
            label="CONTRASEÑA"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secure
            iconLeft="🔒"
            iconRight="👁"
          />

          <AppButton title="Iniciar Sesión" icon="→" onPress={handleLogin} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Eres nuevo? </Text>
            <AppButton title="Registrate" variant="outline" onPress={() => onNavigate('register')} />
          </View>
          <AppButton title="Continuar sin logearte" variant="outline" onPress={() => onNavigate('subastas')} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, marginBottom: 8 },
  brand: { fontSize: 18, fontWeight: '700', color: Colors.dark, marginLeft: 10 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: Colors.dark, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.gray, marginBottom: 28, lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, alignItems: 'center' },
  footerText: { color: Colors.gray, fontSize: 14 },
});
