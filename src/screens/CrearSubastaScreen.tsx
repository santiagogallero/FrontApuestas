import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  SafeAreaView, StyleSheet, ActivityIndicator, Alert, Keyboard,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { AppHeader } from '../components';
import { Colors } from '../theme/colors';
import { apiGetTodosArticulos, apiCrearSubasta } from '../api';
import type { Articulo } from '../types/producto';
import type { NavigateFn } from '../types/navigation';

interface Props { onNavigate: NavigateFn }

const CATEGORIAS = ['COMUN', 'ESPECIAL', 'PLATA', 'ORO', 'PLATINO'];

export function CrearSubastaScreen({ onNavigate }: Props) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [creando, setCreando] = useState(false);

  const UBICACION = 'Salón de Subastas - Recoleta, CABA';
  const [categoria, setCategoria] = useState('COMUN');
  const [seleccionados, setSeleccionados] = useState<Record<number, string>>({});

  const cargar = useCallback(async () => {
    try {
      const todos = await apiGetTodosArticulos();
      setArticulos(todos.filter((a) => a.estadoInspeccion === 'APROBADO'));
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const toggleProducto = (id: number) => {
    setSeleccionados((prev) => {
      const next = { ...prev };
      if (next[id] !== undefined) {
        delete next[id];
      } else {
        next[id] = '';
      }
      return next;
    });
  };

  const crear = async () => {
    const ids = Object.keys(seleccionados).map(Number);
    if (ids.length === 0) { Alert.alert('Sin productos', 'Seleccioná al menos un producto.'); return; }

    setCreando(true);
    try {
      const items = ids.map((id) => ({
        productoId: id,
        precioBase: parseFloat(seleccionados[id]) || 1,
      }));
      const res = await apiCrearSubasta({ ubicacion: UBICACION, categoria, items });
      Alert.alert(
        'Subasta creada',
        `Subasta #${res.subastaId} con ${res.productos.length} producto(s).\nCada producto dura ${res.duracionItemMinutos} minuto.\n\nIniciala desde Gestión de subastas.`,
        [{ text: 'OK', onPress: () => onNavigate('subastas') }],
      );
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo crear la subasta');
    } finally {
      setCreando(false);
    }
  };

  const idsSeleccionados = Object.keys(seleccionados).map(Number);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Nueva subasta" onBack={() => onNavigate('subastas')} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <Text style={styles.sectionTitle}>Configuración</Text>

          <Text style={styles.label}>UBICACIÓN</Text>
          <View style={styles.ubicacionBox}>
            <Text style={styles.ubicacionText}>{UBICACION}</Text>
          </View>

          <Text style={styles.label}>CATEGORÍA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
            {CATEGORIAS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.chip, categoria === c && styles.chipActive]}
                onPress={() => setCategoria(c)}
              >
                <Text style={[styles.chipText, categoria === c && styles.chipTextActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.infoBanner}>
            <Text style={styles.infoText}>Cada producto dura 1 minuto. Si nadie puja, se cierra automáticamente.</Text>
          </View>

          <Text style={styles.sectionTitle}>
            Productos aprobados{idsSeleccionados.length > 0 ? ` (${idsSeleccionados.length} seleccionados)` : ''}
          </Text>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />}

          {!loading && articulos.length === 0 && (
            <Text style={styles.empty}>No hay productos aprobados disponibles para subastar.</Text>
          )}

          {articulos.map((a) => {
            const selected = seleccionados[a.id] !== undefined;
            return (
              <View
                key={a.id}
                style={[styles.card, selected && styles.cardSelected]}
              >
                <TouchableOpacity
                  style={styles.cardHeader}
                  activeOpacity={0.8}
                  onPress={() => toggleProducto(a.id)}
                >
                  <View style={[styles.checkbox, selected && styles.checkboxActive]}>
                    {selected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{a.titulo || `Producto #${a.id}`}</Text>
                    {a.categoria ? <Text style={styles.cardSub}>{a.categoria}</Text> : null}
                  </View>
                </TouchableOpacity>

                {selected && (
                  <View style={styles.precioRow}>
                    <Text style={styles.precioLabel}>Precio base (ARS):</Text>
                    <TextInput
                      style={styles.precioInput}
                      placeholder="0.00"
                      placeholderTextColor={Colors.gray2}
                      keyboardType="numeric"
                      value={seleccionados[a.id]}
                      onChangeText={(v) => setSeleccionados((prev) => ({ ...prev, [a.id]: v }))}
                    />
                    <TouchableOpacity style={styles.btnListo} onPress={() => Keyboard.dismiss()}>
                      <Text style={styles.btnListoText}>Listo</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}

          <TouchableOpacity
            style={[styles.btnCrear, (creando || idsSeleccionados.length === 0) && styles.btnCrearDisabled]}
            onPress={crear}
            disabled={creando || idsSeleccionados.length === 0}
          >
            {creando
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.btnCrearText}>Crear subasta con {idsSeleccionados.length} producto(s)</Text>}
          </TouchableOpacity>

        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: Colors.bg },
  scroll:           { flex: 1 },
  content:          { paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 40 },
  sectionTitle:     { fontSize: 18, fontWeight: '800', color: Colors.dark, marginBottom: 12, marginTop: 8 },
  label:            { fontSize: 11, fontWeight: '800', color: Colors.gray, letterSpacing: 0.5, marginBottom: 6 },
  input:            { backgroundColor: Colors.white, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: Colors.dark, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  ubicacionBox:     { backgroundColor: Colors.gray4, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 16 },
  ubicacionText:    { fontSize: 15, color: Colors.dark, fontWeight: '600' },
  chip:             { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.gray4, marginRight: 8 },
  chipActive:       { backgroundColor: Colors.primary },
  chipText:         { fontSize: 13, fontWeight: '600', color: Colors.gray },
  chipTextActive:   { color: Colors.white },
  infoBanner:       { backgroundColor: Colors.blueLight, borderRadius: 12, padding: 12, marginBottom: 20 },
  infoText:         { color: Colors.primary, fontSize: 13, fontWeight: '600' },
  empty:            { color: Colors.gray, fontSize: 14, textAlign: 'center', marginTop: 20 },
  card:             { backgroundColor: Colors.white, borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1, borderWidth: 2, borderColor: 'transparent' },
  cardSelected:     { borderColor: Colors.primary },
  cardHeader:       { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox:         { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: Colors.gray2, alignItems: 'center', justifyContent: 'center' },
  checkboxActive:   { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark:        { color: Colors.white, fontSize: 14, fontWeight: '800' },
  cardTitle:        { fontSize: 15, fontWeight: '700', color: Colors.dark },
  cardSub:          { fontSize: 12, color: Colors.gray, marginTop: 2 },
  precioRow:        { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 },
  precioLabel:      { fontSize: 13, color: Colors.gray, fontWeight: '600' },
  precioInput:      { flex: 1, height: 40, backgroundColor: Colors.gray4, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, color: Colors.dark },
  btnListo:         { paddingHorizontal: 14, height: 40, borderRadius: 10, backgroundColor: Colors.blueLight, alignItems: 'center', justifyContent: 'center' },
  btnListoText:     { color: Colors.primary, fontWeight: '800', fontSize: 13 },
  btnCrear:         { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  btnCrearDisabled: { opacity: 0.5 },
  btnCrearText:     { color: Colors.white, fontWeight: '800', fontSize: 16 },
});
