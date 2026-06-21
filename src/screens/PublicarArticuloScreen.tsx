import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppHeader, AppButton, AppInput, AppSelect, FileIcon, CameraIcon, PlusIcon } from '../components';
import { apiPublicarArticulo } from '../api';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

const CATEGORIAS = ['Relojería de Lujo', 'Arte', 'Vehículos', 'Joyería', 'Coleccionables', 'Inmuebles'];
const MIN_FOTOS = 6;
const MAX_FOTOS = 10;

interface FotoSel {
  uri: string;
  dataUri: string;
}

function Checkbox({
  checked,
  onToggle,
  label,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <TouchableOpacity style={styles.checkRow} onPress={onToggle} activeOpacity={0.7}>
      <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
        {checked ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PublicarArticuloScreen({ onNavigate }: Props) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Relojería de Lujo');
  const [descripcion, setDescripcion] = useState('');
  const [historia, setHistoria] = useState('');
  const [fotos, setFotos] = useState<FotoSel[]>([]);
  const [declaraPropiedad, setDeclaraPropiedad] = useState(false);
  const [origenLicit, setOrigenLicit] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const agregarFoto = async () => {
    if (fotos.length >= MAX_FOTOS) {
      Alert.alert('Límite alcanzado', `Podés subir hasta ${MAX_FOTOS} fotos.`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería para seleccionar las fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.6,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert('Error', 'No se pudo leer la imagen seleccionada.');
      return;
    }
    const mime = asset.mimeType ?? 'image/jpeg';
    setFotos((prev) => [...prev, { uri: asset.uri, dataUri: `data:${mime};base64,${asset.base64}` }]);
  };

  const quitarFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const publicar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Falta el título', 'Ingresá un título para el artículo.');
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert('Falta la descripción', 'Ingresá la descripción completa del artículo.');
      return;
    }
    if (fotos.length < MIN_FOTOS) {
      Alert.alert('Faltan fotos', `La consigna exige al menos ${MIN_FOTOS} fotos del artículo.`);
      return;
    }
    if (!declaraPropiedad) {
      Alert.alert('Declaración requerida', 'Debés declarar que sos el dueño legítimo del artículo.');
      return;
    }
    if (!origenLicit) {
      Alert.alert('Declaración requerida', 'Debés declarar que el artículo tiene origen lícito.');
      return;
    }
    setEnviando(true);
    try {
      await apiPublicarArticulo({
        titulo: titulo.trim(),
        categoria,
        descripcionCompleta: descripcion.trim(),
        historia: historia.trim(),
        fotos: fotos.map((f) => f.dataUri),
        declaraPropiedad: true,
        origenLicit: true,
      });
      Alert.alert(
        'Enviado a inspección',
        'Tu artículo quedó pendiente de inspección. Un especialista lo revisará y te avisaremos el resultado.'
      );
      onNavigate('misProductos');
    } catch (e: any) {
      Alert.alert('No se pudo publicar', e?.message || 'Intentá nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Auction Pulse Pro" onBack={() => onNavigate('misProductos')} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Publicar artículo</Text>
            <Text style={styles.subtitle}>
              Complete los detalles técnicos y de procedencia para iniciar el proceso de inspección de Sentinel.
            </Text>

            <AppInput label="TÍTULO DEL ARTÍCULO" placeholder="Ej. Cronógrafo Suizo de Oro 18K" value={titulo} onChangeText={setTitulo} />
            <AppSelect label="CATEGORÍA" value={categoria} options={CATEGORIAS} onChange={setCategoria} />

            <Text style={styles.label}>DESCRIPCIÓN COMPLETA</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Resumen de 1000 caracteres para los resultados de búsqueda..."
              placeholderTextColor={Colors.gray2}
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.label}>
              FOTOS DEL ARTÍCULO ({fotos.length}/{MIN_FOTOS} mín.)
            </Text>
            <View style={styles.fotosRow}>
              {fotos.map((f, i) => (
                <View key={f.uri} style={styles.fotoBox}>
                  <Image source={{ uri: f.uri }} style={styles.fotoImg} />
                  <TouchableOpacity style={styles.fotoRemove} onPress={() => quitarFoto(i)}>
                    <Text style={styles.fotoRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {fotos.length < MAX_FOTOS && (
                <TouchableOpacity style={styles.fotoAdd} onPress={agregarFoto} activeOpacity={0.7}>
                  <CameraIcon size={22} color={Colors.primary} />
                  <PlusIcon size={14} color={Colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <FileIcon size={20} color={Colors.primary} />
                <Text style={styles.cardTitle}>Información adicional</Text>
              </View>
              <Text style={styles.label}>HISTORIA Y CONTEXTO</Text>
              <TextInput
                style={[styles.textarea, { backgroundColor: Colors.white }]}
                placeholder="Procedencia, dueños anteriores destacados, exposiciones o certificados de autenticidad..."
                placeholderTextColor={Colors.gray2}
                value={historia}
                onChangeText={setHistoria}
                multiline
                textAlignVertical="top"
              />
            </View>

            <View style={styles.declarations}>
              <Text style={styles.label}>DECLARACIONES OBLIGATORIAS</Text>
              <Checkbox
                checked={declaraPropiedad}
                onToggle={() => setDeclaraPropiedad((v) => !v)}
                label="Declaro ser el dueño legítimo de este artículo."
              />
              <Checkbox
                checked={origenLicit}
                onToggle={() => setOrigenLicit((v) => !v)}
                label="Declaro que el artículo tiene origen lícito y no proviene de actividades ilícitas."
              />
            </View>

            {enviando ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 8 }} />
            ) : (
              <AppButton title="Enviar a inspección" icon="→" onPress={publicar} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  title: { fontSize: 34, fontWeight: '900', color: Colors.dark, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.gray, lineHeight: 22, marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '700', color: Colors.gray, letterSpacing: 1, marginBottom: 6 },
  textarea: {
    backgroundColor: Colors.gray4, borderRadius: 12, padding: 14, fontSize: 15, color: Colors.dark, minHeight: 110, marginBottom: 16,
  },
  fotosRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  fotoBox: { width: 76, height: 76, borderRadius: 12, position: 'relative' },
  fotoImg: { width: 76, height: 76, borderRadius: 12 },
  fotoRemove: {
    position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.red, justifyContent: 'center', alignItems: 'center',
  },
  fotoRemoveText: { color: Colors.white, fontSize: 16, fontWeight: '700', lineHeight: 18 },
  fotoAdd: {
    width: 76, height: 76, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.primary, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: Colors.blueLight,
  },
  card: { backgroundColor: Colors.blueLight, borderRadius: 18, padding: 18, marginBottom: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: Colors.dark, marginLeft: 10 },
  declarations: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.gray4 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10 },
  checkBox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.gray3,
    marginRight: 10, justifyContent: 'center', alignItems: 'center', marginTop: 1,
  },
  checkBoxOn: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkMark: { color: Colors.white, fontSize: 14, fontWeight: '800' },
  checkLabel: { flex: 1, fontSize: 14, color: Colors.dark, lineHeight: 20 },
});
