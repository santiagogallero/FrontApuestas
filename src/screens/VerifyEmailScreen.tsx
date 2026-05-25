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
import { apiRegisterStage2 } from '../api';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface VerifyEmailScreenProps {
  onNavigate: NavigateFn;
  params?: ScreenParams['verifyEmail'];
}

export function VerifyEmailScreen({ onNavigate, params }: VerifyEmailScreenProps) {
  const email = params?.email ?? '';
  const [numeroTramite, setNumeroTramite] = useState('');
  const [docFrenteUrl, setDocFrenteUrl] = useState('');
  const [docDorsoUrl, setDocDorsoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!numeroTramite || !docFrenteUrl || !docDorsoUrl) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await apiRegisterStage2({ email, numeroTramite, docFrenteUrl, docDorsoUrl });
      onNavigate('accountPending');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo completar el registro');
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
            <Text style={{ fontSize: 32 }}>🛡️</Text>
          </View>

          <Text style={styles.title}>Registro 2/2</Text>
          <Text style={styles.subtitle}>
            Completá los datos del trámite y adjuntá las URLs de las fotos de tu documento (frente y dorso).
          </Text>

          <AppInput label="NÚMERO DE TRÁMITE" placeholder="Ej. 00123456789" value={numeroTramite} onChangeText={setNumeroTramite} keyboardType="numeric" />
          <AppInput label="FOTO DOCUMENTO (FRENTE) — URL" placeholder="https://..." value={docFrenteUrl} onChangeText={setDocFrenteUrl} />
          <AppInput label="FOTO DOCUMENTO (DORSO) — URL" placeholder="https://..." value={docDorsoUrl} onChangeText={setDocDorsoUrl} />

          <AppButton title="Completar registro" icon="▶" onPress={handleVerify} loading={loading} />

          <View style={[styles.infoCard, { marginTop: 24 }]}>
            <Text style={{ fontSize: 20 }}>🛡️</Text>
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
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center',
  },
  infoCard: {
    backgroundColor: Colors.gray4, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start',
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  infoDesc: { fontSize: 13, color: Colors.gray, lineHeight: 18, marginTop: 2 },
});
