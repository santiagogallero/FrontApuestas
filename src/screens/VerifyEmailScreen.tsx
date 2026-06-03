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
import { AppButton, AppInput, Logo, CameraIcon, FileIcon, ShieldIcon } from '../components';
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
          <Text style={styles.eyebrow}>VERIFICACIÓN DE IDENTIDAD</Text>
          <Text style={styles.title}>Registro 2/2{'\n'}Auction Pulse Pro.</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Documentación</Text>

            <AppInput
              label="NÚMERO DE TRÁMITE"
              placeholder="Ej. 00123456789"
              value={numeroTramite}
              onChangeText={setNumeroTramite}
              keyboardType="numeric"
            />

            <UploadCard
              icon={<CameraIcon size={22} color={Colors.primary} />}
              title="Cargar Frente de Documento"
              hint="JPG, PNG O PDF (MAX 5MB)"
              filled={!!docFrenteUrl}
            />
            <AppInput placeholder="Pegá la URL del frente" value={docFrenteUrl} onChangeText={setDocFrenteUrl} />

            <UploadCard
              icon={<FileIcon size={22} color={Colors.primary} />}
              title="Cargar Dorso de Documento"
              hint="IMAGEN CLARA Y LEGIBLE"
              filled={!!docDorsoUrl}
            />
            <AppInput placeholder="Pegá la URL del dorso" value={docDorsoUrl} onChangeText={setDocDorsoUrl} />
          </View>

          <AppButton title="Verificar" icon="→" onPress={handleVerify} loading={loading} />

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

interface UploadCardProps {
  icon: React.ReactNode;
  title: string;
  hint: string;
  filled?: boolean;
}

function UploadCard({ icon, title, hint, filled }: UploadCardProps) {
  return (
    <View style={[styles.upload, filled && styles.uploadFilled]}>
      <View style={styles.uploadIcon}>{icon}</View>
      <Text style={styles.uploadTitle}>{title}</Text>
      <Text style={styles.uploadHint}>{filled ? 'URL cargada ✓' : hint}</Text>
    </View>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 20,
  },
  upload: {
    backgroundColor: Colors.blueLight,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.gray3,
    borderStyle: 'dashed',
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadFilled: {
    borderColor: Colors.primary,
    borderStyle: 'solid',
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark },
  uploadHint: { fontSize: 12, color: Colors.gray2, marginTop: 4, letterSpacing: 0.5 },
  infoCard: {
    backgroundColor: Colors.gray4, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start',
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  infoDesc: { fontSize: 13, color: Colors.gray, lineHeight: 18, marginTop: 2 },
});
