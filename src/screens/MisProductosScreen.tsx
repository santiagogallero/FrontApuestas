import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { AppHeader, BottomNav, StatusBadge, PackageIcon, PlusIcon } from '../components';
import { apiGetMisArticulos, apiCrearConversacion } from '../api';
import { Colors } from '../theme/colors';
import type { Articulo, EstadoInspeccion } from '../types/producto';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface MisProductosScreenProps {
  onNavigate: NavigateFn;
  params?: ScreenParams['misProductos'];
}

const FILTERS = ['Todos', 'Aprobados', 'Pendientes', 'Rechazados'];

const ESTADO_STYLE: Record<EstadoInspeccion, { label: string; color: string; bg: string }> = {
  APROBADO: { label: 'APROBADO', color: Colors.green, bg: Colors.greenLight },
  PENDIENTE: { label: 'EN INSPECCIÓN', color: Colors.orange, bg: Colors.blueLight },
  RECHAZADO: { label: 'RECHAZADO', color: Colors.red, bg: Colors.redLight },
};

export function MisProductosScreen({ onNavigate, params }: MisProductosScreenProps) {
  const [filter, setFilter] = useState('Todos');
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setArticulos(await apiGetMisArticulos());
    } catch (e: any) {
      setError(e?.message || 'No se pudieron cargar tus artículos');
      setArticulos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const filtered = articulos.filter((a) => {
    if (filter === 'Aprobados') return a.estadoInspeccion === 'APROBADO';
    if (filter === 'Pendientes') return a.estadoInspeccion === 'PENDIENTE';
    if (filter === 'Rechazados') return a.estadoInspeccion === 'RECHAZADO';
    return true;
  });

  const aprobados = articulos.filter((a) => a.estadoInspeccion === 'APROBADO').length;
  const pendientes = articulos.filter((a) => a.estadoInspeccion === 'PENDIENTE').length;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Mis productos"
        onBack={() => {
            if (params?.backTo === 'chatSoporte' && params.chatParams) {
              onNavigate('chatSoporte', params.chatParams);
            } else {
              onNavigate('cuenta');
            }
          }}
        right={
          <TouchableOpacity style={styles.addBtn} onPress={() => onNavigate('publicarArticulo')}>
            <PlusIcon size={20} color={Colors.white} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>MIS PRODUCTOS</Text>
              <Text style={styles.statValue}>{articulos.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>APROBADOS</Text>
              <Text style={[styles.statValue, { color: Colors.green }]}>{aprobados}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>EN INSPECCIÓN</Text>
              <Text style={[styles.statValue, { color: Colors.orange }]}>{pendientes}</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.chip, filter === f && styles.chipActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />}

          {!loading && error && (
            <Text style={[styles.empty, { textAlign: 'center', marginTop: 32, color: Colors.red }]}>{error}</Text>
          )}

          {!loading && !error && filtered.length === 0 && (
            <Text style={[styles.empty, { textAlign: 'center', marginTop: 32 }]}>
              No tenés artículos {filter !== 'Todos' ? `en estado "${filter}"` : 'publicados'}.
            </Text>
          )}

          {filtered.map((item) => {
            const estado = ESTADO_STYLE[item.estadoInspeccion] ?? ESTADO_STYLE.PENDIENTE;
            const esRechazado = item.estadoInspeccion === 'RECHAZADO';
            return (
              <View key={item.id} style={styles.offerCard}>
                <View style={[styles.offerImage, { backgroundColor: Colors.gray4, justifyContent: 'center', alignItems: 'center' }]}>
                  <PackageIcon size={30} color={Colors.gray2} strokeWidth={1.7} />
                </View>
                <View style={styles.offerBody}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={styles.offerTitle}>{item.titulo || item.descripcionCatalogo || `Producto #${item.id}`}</Text>
                    <StatusBadge text={estado.label} color={estado.color} bg={estado.bg} />
                  </View>
                  <View style={{ marginTop: 8 }}>
                    {item.categoria ? (
                      <Text style={{ color: Colors.primary, fontSize: 12, fontWeight: '700' }}>{item.categoria}</Text>
                    ) : null}
                    {item.descripcionCompleta ? (
                      <Text style={{ color: Colors.gray2, fontSize: 12, marginTop: 2 }} numberOfLines={2}>{item.descripcionCompleta}</Text>
                    ) : null}
                    {item.cantidadFotos > 0 ? (
                      <Text style={{ color: Colors.gray, fontSize: 11, marginTop: 4 }}>{item.cantidadFotos} foto(s)</Text>
                    ) : null}
                  </View>
                  {esRechazado && item.motivoRechazo ? (
                    <View style={styles.rechazoBox}>
                      <Text style={styles.rechazoLabel}>Motivo del rechazo</Text>
                      <Text style={styles.rechazoText}>{item.motivoRechazo}</Text>
                    </View>
                  ) : null}
                  {item.estadoInspeccion === 'PENDIENTE' ? (
                    <Text style={styles.pendienteHint}>Esperando inspección de un especialista.</Text>
                  ) : null}
                  {(esRechazado || item.estadoInspeccion === 'PENDIENTE') ? (
                    <TouchableOpacity
                      style={styles.chatBtn}
                      activeOpacity={0.8}
                      onPress={async () => {
                        try {
                          const conv = await apiCrearConversacion(item.id);
                          onNavigate('chatSoporte', { conversacionId: conv.conversacionId, titulo: item.titulo ?? 'Soporte' });
                        } catch (e: any) {
                          Alert.alert('Error', e?.message ?? 'No se pudo abrir el chat');
                        }
                      }}
                    >
                      <Text style={styles.chatBtnText}>Consultar con soporte</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <BottomNav active="ventas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: Colors.white, borderRadius: 16, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  statLabel: { fontSize: 10, color: Colors.gray, fontWeight: '700', letterSpacing: 0.5, marginBottom: 6 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: Colors.dark },
  chip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, backgroundColor: Colors.gray4, marginRight: 10 },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { color: Colors.gray, fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  empty: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  offerCard: { flexDirection: 'row', backgroundColor: Colors.white, borderRadius: 20, padding: 12, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  offerImage: { width: 80, height: 80, borderRadius: 14 },
  offerBody: { flex: 1, marginLeft: 14 },
  offerTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark, flex: 1, marginRight: 8 },
  rechazoBox: { backgroundColor: Colors.redLight, borderRadius: 10, padding: 8, marginTop: 8 },
  rechazoLabel: { fontSize: 10, fontWeight: '800', color: Colors.red, letterSpacing: 0.5 },
  rechazoText: { fontSize: 12, color: Colors.dark, marginTop: 2 },
  pendienteHint: { fontSize: 12, color: Colors.orange, marginTop: 8, fontWeight: '600' },
  chatBtn: { marginTop: 10, backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 9, paddingHorizontal: 14, alignSelf: 'flex-start' },
  chatBtnText: { color: Colors.white, fontSize: 13, fontWeight: '700' },
  addBtn: { width: 36, height: 36, borderRadius: 12, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});
