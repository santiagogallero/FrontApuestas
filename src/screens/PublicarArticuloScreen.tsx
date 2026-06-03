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
  StyleSheet,
} from 'react-native';
import { AppHeader, AppButton, AppInput, AppSelect, FileIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

const CATEGORIAS = ['Relojería de Lujo', 'Arte', 'Vehículos', 'Joyería', 'Coleccionables', 'Inmuebles'];

export function PublicarArticuloScreen({ onNavigate }: Props) {
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Relojería de Lujo');
  const [descripcion, setDescripcion] = useState('');
  const [historia, setHistoria] = useState('');

  const publicar = () => {
    if (!titulo) {
      Alert.alert('Error', 'Ingresá un título');
      return;
    }
    Alert.alert('Publicado', 'Tu artículo fue enviado a inspección de Sentinel');
    onNavigate('misProductos');
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

            <AppButton title="Publicar artículo" icon="→" onPress={publicar} />
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
  card: { backgroundColor: Colors.blueLight, borderRadius: 18, padding: 18, marginBottom: 8 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: Colors.dark, marginLeft: 10 },
});
