import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import { AppHeader, FileIcon, CheckCircleIcon, AlertCircleIcon } from '../components';
import { apiGetArticulosPendientes, apiInspeccionarArticulo } from '../api';
import { Colors } from '../theme/colors';
import type { Articulo } from '../types/producto';
import type { NavigateFn } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

export function InspeccionScreen({ onNavigate }: Props) {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rechazandoId, setRechazandoId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  const [procesando, setProcesando] = useState<number | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setArticulos(await apiGetArticulosPendientes());
    } catch (e: any) {
      setError(e?.message || 'No se pudo cargar la cola de inspección');
      setArticulos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const aprobar = async (a: Articulo) => {
    setProcesando(a.id);
    try {
      await apiInspeccionarArticulo(a.id, { aprobado: true });
      setArticulos((prev) => prev.filter((x) => x.id !== a.id));
      Alert.alert('Artículo aprobado', `"${a.titulo}" quedó disponible para subastar.`);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo aprobar el artículo.');
    } finally {
      setProcesando(null);
    }
  };

  const confirmarRechazo = async (a: Articulo) => {
    if (!motivo.trim()) {
      Alert.alert('Falta el motivo', 'Indicá por qué se rechaza el artículo.');
      return;
    }
    setProcesando(a.id);
    try {
      await apiInspeccionarArticulo(a.id, { aprobado: false, motivo: motivo.trim() });
      setArticulos((prev) => prev.filter((x) => x.id !== a.id));
      setRechazandoId(null);
      setMotivo('');
      Alert.alert('Artículo rechazado', `Se notificará al dueño el motivo del rechazo.`);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo rechazar el artículo.');
    } finally {
      setProcesando(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Inspección de artículos" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Cola de inspección</Text>
          <Text style={styles.subtitle}>
            Revisá la procedencia y el estado declarado de cada artículo. Aprobá los que cumplan o rechazá indicando el motivo.
          </Text>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />}

          {!loading && error && (
            <Text style={[styles.empty, { color: Colors.red }]}>{error}</Text>
          )}

          {!loading && !error && articulos.length === 0 && (
            <View style={styles.emptyCard}>
              <CheckCircleIcon size={32} color={Colors.green} />
              <Text style={styles.emptyTitle}>No hay artículos pendientes</Text>
              <Text style={styles.empty}>Cuando un postor publique un artículo, aparecerá acá para su inspección.</Text>
            </View>
          )}

          {articulos.map((a) => {
            const enRechazo = rechazandoId === a.id;
            const busy = procesando === a.id;
            return (
              <View key={a.id} style={styles.card}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>{a.titulo || `Artículo #${a.id}`}</Text>
                  {a.categoria ? <Text style={styles.categoria}>{a.categoria}</Text> : null}
                </View>

                <Text style={styles.fieldLabel}>DESCRIPCIÓN</Text>
                <Text style={styles.fieldValue}>{a.descripcionCompleta || '—'}</Text>

                <View style={styles.historiaBox}>
                  <View style={styles.historiaHeader}>
                    <FileIcon size={16} color={Colors.primary} />
                    <Text style={styles.historiaTitle}>Procedencia / historia</Text>
                  </View>
                  <Text style={styles.fieldValue}>{a.historia || 'Sin datos de procedencia.'}</Text>
                </View>

                <View style={styles.metaRow}>
                  <Text style={styles.meta}>Dueño: {a.duenioNombre || '—'}</Text>
                  <Text style={styles.meta}>{a.cantidadFotos} foto(s)</Text>
                </View>

                <View style={styles.declaraciones}>
                  <Text style={styles.declLabel}>
                    {a.declaraPropiedad ? '✓ Declara ser dueño legítimo' : '✗ Sin declaración de propiedad'}
                  </Text>
                  <Text style={styles.declLabel}>
                    {a.origenLicit ? '✓ Declara origen lícito' : '✗ Sin declaración de origen lícito'}
                  </Text>
                </View>

                {enRechazo ? (
                  <View style={styles.rechazoForm}>
                    <Text style={styles.fieldLabel}>MOTIVO DEL RECHAZO</Text>
                    <TextInput
                      style={styles.textarea}
                      placeholder="Ej. La documentación de procedencia no es verificable..."
                      placeholderTextColor={Colors.gray2}
                      value={motivo}
                      onChangeText={setMotivo}
                      multiline
                      textAlignVertical="top"
                    />
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        style={[styles.btn, styles.btnGhost]}
                        onPress={() => { setRechazandoId(null); setMotivo(''); }}
                        disabled={busy}
                      >
                        <Text style={styles.btnGhostText}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => confirmarRechazo(a)} disabled={busy}>
                        {busy ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnDangerText}>Confirmar rechazo</Text>}
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={[styles.btn, styles.btnDangerOutline]}
                      onPress={() => { setRechazandoId(a.id); setMotivo(''); }}
                      disabled={busy}
                    >
                      <AlertCircleIcon size={18} color={Colors.red} />
                      <Text style={styles.btnDangerOutlineText}>Rechazar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => aprobar(a)} disabled={busy}>
                      {busy ? <ActivityIndicator color={Colors.white} /> : (
                        <>
                          <CheckCircleIcon size={18} color={Colors.white} />
                          <Text style={styles.btnPrimaryText}>Aprobar</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.dark, marginBottom: 6 },
  subtitle: { fontSize: 14, color: Colors.gray, lineHeight: 20, marginBottom: 20 },
  empty: { fontSize: 14, color: Colors.gray, lineHeight: 20, textAlign: 'center' },
  emptyCard: { alignItems: 'center', backgroundColor: Colors.white, borderRadius: 18, padding: 28, marginTop: 16 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: Colors.dark, marginTop: 10, marginBottom: 4 },
  card: {
    backgroundColor: Colors.white, borderRadius: 18, padding: 18, marginBottom: 16,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.dark, flex: 1, marginRight: 8 },
  categoria: { fontSize: 11, fontWeight: '800', color: Colors.primary, backgroundColor: Colors.blueLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  fieldLabel: { fontSize: 11, fontWeight: '800', color: Colors.gray, letterSpacing: 0.8, marginBottom: 4, marginTop: 8 },
  fieldValue: { fontSize: 14, color: Colors.dark, lineHeight: 20 },
  historiaBox: { backgroundColor: Colors.blueLight, borderRadius: 12, padding: 12, marginTop: 10 },
  historiaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  historiaTitle: { fontSize: 13, fontWeight: '800', color: Colors.dark, marginLeft: 8 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  meta: { fontSize: 12, color: Colors.gray },
  declaraciones: { marginTop: 10, gap: 4 },
  declLabel: { fontSize: 12, color: Colors.dark, fontWeight: '600' },
  rechazoForm: { marginTop: 14 },
  textarea: { backgroundColor: Colors.gray4, borderRadius: 12, padding: 12, fontSize: 14, color: Colors.dark, minHeight: 80, marginBottom: 12 },
  actionsRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 13, borderRadius: 14, gap: 6 },
  btnPrimary: { backgroundColor: Colors.green },
  btnPrimaryText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  btnDanger: { backgroundColor: Colors.red },
  btnDangerText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  btnDangerOutline: { backgroundColor: Colors.redLight },
  btnDangerOutlineText: { color: Colors.red, fontWeight: '800', fontSize: 14 },
  btnGhost: { backgroundColor: Colors.gray4 },
  btnGhostText: { color: Colors.gray, fontWeight: '800', fontSize: 14 },
});
