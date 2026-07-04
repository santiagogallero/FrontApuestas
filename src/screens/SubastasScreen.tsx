import React, { useEffect, useState } from 'react';
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
import { AppHeader, BottomNav, GavelIcon, CalendarIcon, MapPinIcon } from '../components';
import { useAuthContext } from '../context/AuthContext';
import { useSubastas } from '../hooks';
import { apiGetColecciones, apiIniciarSubasta, apiCerrarSubasta } from '../api';
import type { ColeccionResumen } from '../types/coleccion';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface SubastasScreenProps {
  onNavigate: NavigateFn;
  isGuest?: boolean;
}

const FILTERS = ['Todas', 'Común', 'Plata', 'Oro', 'Platino'];

export function SubastasScreen({ onNavigate, isGuest }: SubastasScreenProps) {
  const { currentUser } = useAuthContext();
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('EMPLEADO');
  const { filtered, loading, filter, setFilter } = useSubastas();
  const [colecciones, setColecciones] = useState<ColeccionResumen[]>([]);
  const [accionando, setAccionando] = useState<number | null>(null);

  useEffect(() => {
    apiGetColecciones()
      .then(setColecciones)
      .catch(() => setColecciones([]));
  }, []);

  const coleccionPorSubasta = (subastaId: number) =>
    colecciones.find((c) => c.subastaId === subastaId);

  const iniciar = async (subastaId: number) => {
    setAccionando(subastaId);
    try {
      await apiIniciarSubasta(subastaId);
      Alert.alert('Subasta iniciada', `Subasta #${subastaId} iniciada correctamente.`);
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'No se pudo iniciar la subasta');
    } finally {
      setAccionando(null);
    }
  };

  const cerrar = async (subastaId: number) => {
    Alert.alert('Cerrar subasta', `¿Cerrás la subasta #${subastaId}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar', style: 'destructive', onPress: async () => {
          setAccionando(subastaId);
          try {
            await apiCerrarSubasta(subastaId);
            Alert.alert('Subasta cerrada', `Subasta #${subastaId} cerrada.`);
          } catch (e: any) {
            Alert.alert('Error', e?.message ?? 'No se pudo cerrar la subasta');
          } finally {
            setAccionando(null);
          }
        },
      },
    ]);
  };

  const liveEstados = ['ACTIVA', 'EN_CURSO', 'ABIERTA'];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={isAdmin ? 'Gestión de subastas' : 'Subastas'}
        right={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {isAdmin && (
              <TouchableOpacity
                style={styles.newBtn}
                onPress={() => onNavigate('crearSubasta')}
              >
                <Text style={styles.newBtnText}>+ Nueva</Text>
              </TouchableOpacity>
            )}
            <View style={[styles.avatar, isAdmin && styles.avatarAdmin]}>
              <Text style={[styles.avatarText, isAdmin && styles.avatarTextAdmin]}>
                {currentUser?.email?.slice(0, 2).toUpperCase() ?? 'AS'}
              </Text>
            </View>
          </View>
        }
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.screenTitle}>
            {isAdmin ? 'Todas las subastas' : 'Subastas disponibles'}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
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

          {!loading && filtered.length === 0 && (
            <Text style={[styles.empty, { textAlign: 'center', marginTop: 32 }]}>No hay subastas disponibles.</Text>
          )}

          {filtered.map((item) => {
            const isLive = liveEstados.includes(item.estado);
            const isPendiente = !isLive && item.estado !== 'CERRADA';
            const coleccion = coleccionPorSubasta(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => onNavigate('detalleSubasta', { subasta: item })}
                activeOpacity={0.9}
              >
                <View style={styles.imageWrap}>
                  <View style={[styles.image, { backgroundColor: isAdmin ? '#1E293B' : Colors.blueLight, justifyContent: 'center', alignItems: 'center' }]}>
                    <GavelIcon size={56} color={isAdmin ? Colors.primary : Colors.primary} strokeWidth={1.6} />
                  </View>
                  <View style={styles.badges}>
                    <View style={[styles.badge, isLive ? styles.badgeLive : styles.badgeUpcoming]}>
                      <Text style={[styles.badgeText, isLive ? styles.badgeLiveText : styles.badgeUpcomingText]}>
                        {isLive ? '● LIVE' : item.estado ?? 'PENDIENTE'}
                      </Text>
                    </View>
                    <View style={styles.badgeCategory}>
                      <Text style={styles.badgeCategoryText}>CATEGORÍA {(item.categoria ?? '—').toUpperCase()}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.body}>
                  <Text style={styles.cardTitle}>
                    {coleccion ? coleccion.nombre : `Subasta #${item.id}`}
                  </Text>
                  {coleccion && (
                    <Text style={styles.collectionHint}>
                      Colección · {coleccion.cantidadPiezas} piezas · {coleccion.duenioNombre ?? 'Consignador'}
                    </Text>
                  )}
                  <View style={styles.meta}>
                    <CalendarIcon size={14} color={Colors.gray} />
                    <Text style={styles.metaText}>{item.fecha} {item.hora}</Text>
                  </View>
                  {item.ubicacion ? (
                    <View style={styles.meta}>
                      <MapPinIcon size={14} color={Colors.gray} />
                      <Text style={styles.metaText}>{item.ubicacion}</Text>
                    </View>
                  ) : null}

                  {isAdmin ? (
                    /* ── Controles admin ── */
                    <View style={styles.adminActions}>
                      <TouchableOpacity
                        style={styles.btnGestionar}
                        onPress={() => onNavigate('detalleSubasta', { subasta: item })}
                      >
                        <Text style={styles.btnGestionarText}>Ver detalle</Text>
                      </TouchableOpacity>
                      {isPendiente && (
                        <TouchableOpacity
                          style={[styles.btnAccion, { backgroundColor: Colors.greenLight }]}
                          onPress={() => iniciar(item.id)}
                          disabled={accionando === item.id}
                        >
                          {accionando === item.id
                            ? <ActivityIndicator size="small" color={Colors.green} />
                            : <Text style={[styles.btnAccionText, { color: Colors.green }]}>Iniciar</Text>}
                        </TouchableOpacity>
                      )}
                      {isLive && (
                        <TouchableOpacity
                          style={[styles.btnAccion, { backgroundColor: Colors.redLight }]}
                          onPress={() => cerrar(item.id)}
                          disabled={accionando === item.id}
                        >
                          {accionando === item.id
                            ? <ActivityIndicator size="small" color={Colors.red} />
                            : <Text style={[styles.btnAccionText, { color: Colors.red }]}>Cerrar</Text>}
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    /* ── CTA postor ── */
                    <View style={styles.footer}>
                      <View />
                      <TouchableOpacity style={styles.button} onPress={() => onNavigate('detalleSubasta', { subasta: item })}>
                        <Text style={styles.buttonText}>{isLive ? 'Ingresar a la subasta' : 'Ver detalles'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <BottomNav active="subastas" onNavigate={onNavigate} isGuest={isGuest} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 16 },
  empty: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  chip: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 24, backgroundColor: Colors.gray4, marginRight: 10,
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { color: Colors.gray, fontSize: 14, fontWeight: '500' },
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  card: {
    backgroundColor: Colors.white, borderRadius: 20, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  imageWrap: { position: 'relative', height: 200 },
  image: { width: '100%', height: 200 },
  badges: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeLive: { backgroundColor: Colors.red },
  badgeUpcoming: { backgroundColor: Colors.primary },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeLiveText: { color: Colors.white },
  badgeUpcomingText: { color: Colors.white },
  badgeCategory: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeCategoryText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  body: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark },
  collectionHint: { fontSize: 13, color: Colors.primary, marginTop: 4, fontWeight: '600' },
  meta: { marginTop: 6, flexDirection: 'row', alignItems: 'center' },
  metaText: { color: Colors.gray, fontSize: 13, marginLeft: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  button: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  buttonText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
  avatarAdmin: { backgroundColor: '#1E293B' },
  avatarTextAdmin: { color: Colors.white },
  newBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  newBtnText: { color: Colors.white, fontWeight: '800', fontSize: 13 },
  adminActions: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9', flexWrap: 'wrap' },
  btnGestionar: { backgroundColor: Colors.blueLight, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  btnGestionarText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
  btnAccion: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  btnAccionText: { fontSize: 13, fontWeight: '700' },
});
