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
import { AppButton, AppInput, Logo, ShieldIcon } from '../components';
import { Colors } from '../theme/colors';
import { apiPost } from '../api/client';
import type { NavigateFn } from '../types/navigation';

interface RecuperarCuentaScreenProps {
  onNavigate: NavigateFn;
}

export function RecuperarCuentaScreen({ onNavigate }: RecuperarCuentaScreenProps) {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Segunda etapa: ingresar código y nueva contraseña
  const [etapa, setEtapa] = useState<'email' | 'codigo'>('email');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const handleSolicitarCodigo = async () => {
    if (!email || !confirmEmail) {
      Alert.alert('Error', 'Completá ambos campos');
      return;
    }
    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      Alert.alert('Error', 'Los correos no coinciden');
      return;
    }
    setLoading(true);
    try {
      await apiPost('/api/auth/password/forgot', { email: email.trim().toLowerCase() }, false);
      Alert.alert('Código enviado', 'Revisá tu correo y escribí el código que recibiste.');
      setEtapa('codigo');
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleResetearPassword = async () => {
    if (!codigo || !nuevaPassword || !confirmarPassword) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }
    if (nuevaPassword !== confirmarPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await apiPost('/api/auth/password/reset', {
        email: email.trim().toLowerCase(),
        code: codigo.trim(),
        newPassword: nuevaPassword,
      }, false);
      Alert.alert('Contraseña restablecida', 'Ya podés iniciar sesión con tu nueva contraseña.', [
        { text: 'Ir al login', onPress: () => onNavigate('login') },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Código inválido o expirado');
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
          <View style={[styles.iconCircle, { marginBottom: 24 }]}>
            <ShieldIcon size={32} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Recuperación de cuenta</Text>

          {etapa === 'email' ? (
            <>
              <Text style={styles.subtitle}>
                Ingresá tu correo y te enviaremos un código para restablecer tu contraseña.
              </Text>
              <View style={styles.card}>
                <AppInput label="CORREO" placeholder="example@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
                <AppInput label="CONFIRMAR CORREO" placeholder="example@email.com" value={confirmEmail} onChangeText={setConfirmEmail} keyboardType="email-address" />
              </View>
              <AppButton title="Enviar código" icon="→" onPress={handleSolicitarCodigo} loading={loading} />
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>
                Ingresá el código que llegó a <Text style={{ color: Colors.primary, fontWeight: '700' }}>{email}</Text> y tu nueva contraseña.
              </Text>
              <View style={styles.card}>
                <AppInput label="CÓDIGO" placeholder="123456" value={codigo} onChangeText={setCodigo} keyboardType="number-pad" />
                <AppInput label="NUEVA CONTRASEÑA" placeholder="••••••••" value={nuevaPassword} onChangeText={setNuevaPassword} secure />
                <AppInput label="CONFIRMAR CONTRASEÑA" placeholder="••••••••" value={confirmarPassword} onChangeText={setConfirmarPassword} secure />
              </View>
              <AppButton title="Restablecer contraseña" icon="→" onPress={handleResetearPassword} loading={loading} />
              <AppButton title="Volver" onPress={() => setEtapa('email')} loading={false} />
            </>
          )}

          <View style={[styles.infoCard, { marginTop: 24 }]}>
            <ShieldIcon size={20} color={Colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.infoTitle}>Protección de datos</Text>
              <Text style={styles.infoDesc}>Tus datos se cifran para una verificación segura.</Text>
            </View>
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
  title: { fontSize: 36, fontWeight: 'bold', color: Colors.dark, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.gray, marginBottom: 28, lineHeight: 22 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 24, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 24, elevation: 4, marginBottom: 20 },
  infoCard: { backgroundColor: Colors.gray4, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start' },
  infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  infoDesc: { fontSize: 13, color: Colors.gray, lineHeight: 18, marginTop: 2 },
});
