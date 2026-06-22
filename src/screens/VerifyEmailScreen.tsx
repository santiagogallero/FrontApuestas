import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { AppButton, AppInput, Logo, MailIcon } from '../components';
import { apiSendEmailCode, apiVerifyEmailCode } from '../api';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface VerifyEmailScreenProps {
  onNavigate: NavigateFn;
  params?: ScreenParams['verifyEmail'];
}

export function VerifyEmailScreen({ onNavigate, params }: VerifyEmailScreenProps) {
  const email = params?.email ?? '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    const trimmed = code.trim();
    if (!trimmed || trimmed.length < 6) {
      Alert.alert('Error', 'Ingresá el código de 6 dígitos que recibiste por correo.');
      return;
    }
    setLoading(true);
    try {
      await apiVerifyEmailCode(email, trimmed);
      onNavigate('registerStage2', { email });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Código inválido o expirado');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await apiSendEmailCode(email);
      Alert.alert('Código reenviado', 'Revisá tu bandeja de entrada y spam.');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo reenviar el código');
    } finally {
      setResending(false);
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
          <Text style={styles.eyebrow}>VERIFICACIÓN DE CORREO</Text>
          <Text style={styles.title}>Confirmá tu{'\n'}email.</Text>

          <View style={styles.card}>
            <View style={styles.iconRow}>
              <MailIcon size={28} color={Colors.primary} />
            </View>
            <Text style={styles.cardTitle}>Te enviamos un código</Text>
            <Text style={styles.cardDesc}>
              Revisá <Text style={styles.emailHighlight}>{email || 'tu correo'}</Text> e ingresá el código de 6
              dígitos para continuar con el registro.
            </Text>

            <AppInput
              label="CÓDIGO DE VERIFICACIÓN"
              placeholder="000000"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
            />

            <AppButton title="Verificar código" icon="→" onPress={handleVerify} loading={loading} />

            <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendWrap}>
              <Text style={styles.resendText}>
                {resending ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
              </Text>
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
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.dark,
    marginBottom: 24,
    lineHeight: 44,
    textShadowColor: 'rgba(15,23,42,0.18)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 1,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  iconRow: { alignItems: 'center', marginBottom: 16 },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  emailHighlight: {
    fontWeight: '700',
    color: Colors.dark,
  },
  resendWrap: { marginTop: 16, alignItems: 'center' },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
