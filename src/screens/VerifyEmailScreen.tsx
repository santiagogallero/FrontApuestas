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
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppButton, AppInput, Logo, CameraIcon, FileIcon, ShieldIcon } from '../components';
import { apiRegisterStage2 } from '../api';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface VerifyEmailScreenProps {
  onNavigate: NavigateFn;
  params?: ScreenParams['verifyEmail'];
}

async function pickImage(source: 'camera' | 'gallery'): Promise<string | null> {
  if (source === 'camera') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara para sacar la foto del DNI.');
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 2],
    });
    if (result.canceled) return null;
    return result.assets[0].uri;
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería para seleccionar la imagen.');
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [3, 2],
    });
    if (result.canceled) return null;
    return result.assets[0].uri;
  }
}

function showImageSourcePicker(onPick: (uri: string) => void) {
  Alert.alert(
    'Subir imagen',
    '¿Cómo querés agregar la foto?',
    [
      {
        text: 'Sacar foto',
        onPress: async () => {
          const uri = await pickImage('camera');
          if (uri) onPick(uri);
        },
      },
      {
        text: 'Elegir de galería',
        onPress: async () => {
          const uri = await pickImage('gallery');
          if (uri) onPick(uri);
        },
      },
      { text: 'Cancelar', style: 'cancel' },
    ]
  );
}

export function VerifyEmailScreen({ onNavigate, params }: VerifyEmailScreenProps) {
  const email = params?.email ?? '';
  const [numeroTramite, setNumeroTramite] = useState('');
  const [docFrenteUri, setDocFrenteUri] = useState('');
  const [docDorsoUri, setDocDorsoUri] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!numeroTramite || !docFrenteUri || !docDorsoUri) {
      Alert.alert('Error', 'Completa todos los campos y cargá ambas fotos del documento.');
      return;
    }
    setLoading(true);
    try {
      await apiRegisterStage2({
        email,
        numeroTramite,
        docFrenteUrl: docFrenteUri,
        docDorsoUrl: docDorsoUri,
      });
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
              hint="Tocá para sacar o elegir foto"
              imageUri={docFrenteUri}
              onPress={() => showImageSourcePicker(setDocFrenteUri)}
            />

            <UploadCard
              icon={<FileIcon size={22} color={Colors.primary} />}
              title="Cargar Dorso de Documento"
              hint="Tocá para sacar o elegir foto"
              imageUri={docDorsoUri}
              onPress={() => showImageSourcePicker(setDocDorsoUri)}
            />
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
  imageUri?: string;
  onPress: () => void;
}

function UploadCard({ icon, title, hint, imageUri, onPress }: UploadCardProps) {
  return (
    <TouchableOpacity
      style={[styles.upload, !!imageUri && styles.uploadFilled]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      ) : (
        <>
          <View style={styles.uploadIcon}>{icon}</View>
          <Text style={styles.uploadTitle}>{title}</Text>
          <Text style={styles.uploadHint}>{hint}</Text>
        </>
      )}
      {imageUri && (
        <View style={styles.previewOverlay}>
          <Text style={styles.previewLabel}>{title}</Text>
          <Text style={styles.previewChange}>Tocá para cambiar</Text>
        </View>
      )}
    </TouchableOpacity>
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
    marginBottom: 16,
    overflow: 'hidden',
  },
  uploadFilled: {
    borderColor: Colors.primary,
    borderStyle: 'solid',
    paddingVertical: 0,
    height: 140,
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
  preview: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: { fontSize: 12, color: Colors.white, fontWeight: '600' },
  previewChange: { fontSize: 11, color: Colors.white, opacity: 0.85 },
  infoCard: {
    backgroundColor: Colors.gray4, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start',
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  infoDesc: { fontSize: 13, color: Colors.gray, lineHeight: 18, marginTop: 2 },
});
