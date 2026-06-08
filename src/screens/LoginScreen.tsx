import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { AppButton, AppInput, Logo, AtIcon, LockIcon, EyeIcon } from '../components';
import { useAuth } from '../hooks';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface LoginScreenProps {
  onNavigate: NavigateFn;
  onNavigateAsGuest: NavigateFn;
}

function friendlyLoginError(message: string): string {
  if (!message) return 'Ocurrió un error inesperado. Intentá de nuevo.';
  const m = message.toLowerCase();
  if (m.includes('credenciales') || m.includes('unauthorized') || m.includes('401'))
    return 'El email o la contraseña son incorrectos.';
  if (m.includes('pendiente') || m.includes('aprobacion') || m.includes('forbidden') || m.includes('403'))
    return 'Tu cuenta está pendiente de aprobación. Te avisaremos cuando esté activa.';
  if (m.includes('network') || m.includes('failed to fetch') || m.includes('connection'))
    return 'No se pudo conectar al servidor. Verificá tu conexión a internet.';
  if (m.includes('500') || m.includes('interno'))
    return 'Hubo un problema en el servidor. Intentá de nuevo en unos minutos.';
  return message;
}

export function LoginScreen({ onNavigate, onNavigateAsGuest }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError('Completá el email y la contraseña para continuar.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      onNavigate('subastas');
    } catch (e: any) {
      setError(friendlyLoginError(e.message));
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
          <View style={styles.card}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>Inicia sesion para ver tu dashboard profesional de subastas</Text>

            <AppInput
              label="CORREO"
              placeholder="name@firm.com"
              value={email}
              onChangeText={setEmail}
              iconLeft={<AtIcon size={18} />}
              keyboardType="email-address"
            />
            <AppInput
              label="CONTRASEÑA"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secure={!showPassword}
              iconLeft={<LockIcon size={18} />}
              iconRight={<EyeIcon size={18} color={showPassword ? Colors.primary : Colors.gray2} />}
              onIconRightPress={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity onPress={() => onNavigate('recuperarCuenta')}>
              <Text style={styles.forgot}>¿OLVIDASTE TU CONTRASEÑA?</Text>
            </TouchableOpacity>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorIcon}>⚠</Text>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <AppButton title="Iniciar Sesión" icon="→" onPress={handleLogin} loading={loading} />

            <View style={styles.divider} />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Eres nuevo? </Text>
              <TouchableOpacity onPress={() => onNavigate('register')}>
                <Text style={styles.link}>Registrate</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.guestWrap} onPress={() => onNavigateAsGuest('subastas')}>
              <Text style={styles.guestLink}>Continuar sin logearte</Text>
            </TouchableOpacity>
          </View>
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  title: { fontSize: 34, fontWeight: '800', color: Colors.dark, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.gray, textAlign: 'center', marginBottom: 28, lineHeight: 22, paddingHorizontal: 8 },
  forgot: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
    marginTop: 4,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray4,
    marginTop: 24,
    marginBottom: 20,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: Colors.gray, fontSize: 14 },
  link: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
  guestWrap: { alignItems: 'center', marginTop: 14 },
  guestLink: { color: Colors.primary, fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.redLight,
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  errorIcon: { fontSize: 15, color: Colors.red, lineHeight: 20 },
  errorText: { flex: 1, fontSize: 14, color: Colors.red, lineHeight: 20, fontWeight: '500' },
});
