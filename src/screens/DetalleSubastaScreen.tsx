import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import { AppHeader, BottomNav, BellIcon, GavelIcon, ShieldIcon } from '../components';
import { useDetalleSubasta } from '../hooks';
import { useAuthContext } from '../context/AuthContext';
import { API_BASE, apiGetCatalogoSubasta, apiGetColeccionPorSubasta, apiGetStreaming, apiGetSubasta, apiGetTiming, apiDesconectarSubasta, apiGetMisAdjudicaciones } from '../api';
import type { SubastaTiming } from '../types/subasta';
import type { CatalogoItem } from '../types/catalogo';
import type { Coleccion } from '../types/coleccion';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface DetalleSubastaScreenProps {
  onNavigate: NavigateFn;
  params?: ScreenParams['detalleSubasta'];
  isGuest?: boolean;
}

export function DetalleSubastaScreen({ onNavigate, params, isGuest }: DetalleSubastaScreenProps) {
  const subasta = (params as any)?.subasta ?? (params as any)?.item ?? { id: 0, fecha: '', hora: '', estado: '', categoria: '', ubicacion: '', capacidadAsistentes: 0 };
  const [catalogItems, setCatalogItems] = useState<CatalogoItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [coleccion, setColeccion] = useState<Coleccion | null>(null);
  const [streamingUrl, setStreamingUrl] = useState<string | null>(subasta.streamingUrl ?? null);
  const [depositoNombre, setDepositoNombre] = useState<string | null>(subasta.depositoNombre ?? null);
  const [depositoDireccion, setDepositoDireccion] = useState<string | null>(subasta.depositoDireccion ?? null);

  const selectedItem = catalogItems.find((i) => i.itemId === selectedItemId) ?? null;
  const itemIdPuja = selectedItemId;
  const {
    conectando,
    conectado,
    pujando,
    error,
    enVivo,
    mejorOferta,
    minimo,
    maximo,
    bids,
    lastPuja,
    conectar,
    pujar,
  } = useDetalleSubasta(subasta.id, itemIdPuja);
  const [saliendo, setSaliendo] = useState(false);
  const { currentUser } = useAuthContext();
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('EMPLEADO');
  const initials = currentUser?.email?.slice(0, 2).toUpperCase() ?? 'JD';
  const [importeManual, setImporteManual] = useState('');
  const [timing, setTiming] = useState<SubastaTiming | null>(null);
  const [segundos, setSegundos] = useState<number | null>(null);
  const [estadoSubasta, setEstadoSubasta] = useState<string>(subasta.estado ?? '');
  const cerrada = estadoSubasta?.toUpperCase() === 'CERRADA';
  const avisoGanasteRef = useRef(false);

  // Si la subasta se cierra mientras la estás mirando, chequeamos si ganaste y avisamos.
  useEffect(() => {
    if (!cerrada || isGuest || isAdmin || avisoGanasteRef.current) return;
    avisoGanasteRef.current = true;
    apiGetMisAdjudicaciones()
      .then((adjudicaciones) => {
        const gane = adjudicaciones.find((a) => a.subastaId === subasta.id);
        if (gane) {
          Alert.alert(
            '🏆 ¡Ganaste la subasta!',
            'Te adjudicaste la pieza. Andá a pagarla antes de que venza el plazo.',
            [{ text: 'Ir a pagar', onPress: () => onNavigate('detalleAdjudicacion') }]
          );
        }
      })
      .catch(() => {});
  }, [cerrada, isGuest, isAdmin, subasta.id, onNavigate]);

  // Polling del timing + estado real de la subasta (puede cerrarse mientras la mirás)
  useEffect(() => {
    if (!subasta.id) return;
    const fetchTiming = () => {
      apiGetTiming(subasta.id)
        .then((t) => {
          setTiming(t);
          setSegundos(t.segundosRestantesItem ?? null);
        })
        .catch(() => {});
      apiGetSubasta(subasta.id)
        .then((s) => setEstadoSubasta(s.estado ?? ''))
        .catch(() => {});
    };
    fetchTiming();
    const interval = setInterval(fetchTiming, 30000);
    return () => clearInterval(interval);
  }, [subasta.id]);

  // Countdown local (decrementa cada segundo)
  useEffect(() => {
    if (segundos === null || segundos <= 0) return;
    const timer = setInterval(() => setSegundos((s) => (s !== null && s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [timing?.itemActualId]); // reinicia cuando cambia el item

  useEffect(() => {
    if (!subasta.id) return;
    apiGetCatalogoSubasta(subasta.id, !isGuest)
      .then((cat) => {
        setCatalogItems(cat.items);
        if (cat.items.length > 0) setSelectedItemId(cat.items[0].itemId);
      })
      .catch(() => {
        setCatalogItems([]);
        setSelectedItemId(0);
      });
    apiGetColeccionPorSubasta(subasta.id)
      .then(setColeccion)
      .catch(() => setColeccion(null));
    apiGetSubasta(subasta.id)
      .then((s) => {
        setDepositoNombre(s.depositoNombre ?? null);
        setDepositoDireccion(s.depositoDireccion ?? null);
        if (s.streamingUrl) setStreamingUrl(s.streamingUrl);
      })
      .catch(() => {});
  }, [subasta.id, isGuest]);

  useEffect(() => {
    if (!subasta.id || isGuest || !conectado) return;
    apiGetStreaming(subasta.id)
      .then((s) => setStreamingUrl(s.streamingUrl))
      .catch(() => {});
  }, [subasta.id, isGuest, conectado]);

  useEffect(() => {
    if (!subasta.id || !itemIdPuja || isGuest || isAdmin) return;
    conectar();
  }, [subasta.id, itemIdPuja, isGuest, isAdmin, conectar]);

  // Deriva a las pantallas de bloqueo según el motivo informado por el backend.
  useEffect(() => {
    if (!error) return;
    const msg = error.toLowerCase();
    if (msg.includes('medio de pago')) {
      onNavigate('faltaMetodoPago');
    } else if (msg.includes('categoria') || msg.includes('categoría')) {
      onNavigate('accesoPlatino');
    }
  }, [error, onNavigate]);

  const handlePujar = async (importe: number) => {
    if (!subasta.id) return;
    try {
      const res = await pujar(itemIdPuja, importe, 'ARS');
      Alert.alert('Puja registrada', `Tu oferta de $${res.ofertaActual} fue aceptada`);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo registrar la puja');
    }
  };

  const handleSalir = () => {
    Alert.alert('Salir de la subasta', '¿Seguro que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          setSaliendo(true);
          try {
            await apiDesconectarSubasta();
            onNavigate('subastas');
          } catch (e: any) {
            Alert.alert('No podés salir', e?.message || 'Ya realizaste una puja en esta subasta.');
          } finally {
            setSaliendo(false);
          }
        },
      },
    ]);
  };

  const currentBid = mejorOferta;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Subastas"
        onBack={() => onNavigate('subastas')}
        right={
          <View style={styles.headerRight}>
            <BellIcon size={22} color={Colors.dark} />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </View>
        }
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.liveIndicator}>
            <View style={[styles.liveDot, { backgroundColor: enVivo ? Colors.red : Colors.gray2 }]} />
            <Text style={[styles.liveText, !enVivo && { color: Colors.gray }]}>
              {conectando
                ? 'CONECTANDO...'
                : enVivo
                ? 'EN VIVO — PUJAS EN TIEMPO REAL'
                : conectado
                ? 'CONECTADO'
                : 'SUBASTA'}
            </Text>
          </View>

          {/* Countdown timer del item actual */}
          {segundos !== null && segundos > 0 && (
            <View style={styles.countdownBox}>
              <Text style={styles.countdownLabel}>TIEMPO RESTANTE ESTE LOTE</Text>
              <Text style={styles.countdownValue}>{formatSegundos(segundos)}</Text>
            </View>
          )}
          {segundos === 0 && timing?.estadoTemporal === 'EN_CURSO' && (
            <View style={[styles.countdownBox, { backgroundColor: Colors.redLight }]}>
              <Text style={[styles.countdownLabel, { color: Colors.red }]}>CERRANDO LOTE...</Text>
            </View>
          )}

          {selectedItem?.fotoUrl ? (
            <Image
              source={{ uri: `${API_BASE}${selectedItem.fotoUrl}` }}
              style={[styles.detailImage, { borderRadius: 16 }]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.detailImage, { backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center', borderRadius: 16 }]}>
              <GavelIcon size={72} color={Colors.primary} strokeWidth={1.5} />
            </View>
          )}

          <Text style={[styles.screenTitle, { marginTop: 20 }]}>
            {coleccion?.nombre ?? selectedItem?.titulo ?? `Subasta #${subasta.id}`}
          </Text>
          {coleccion && (
            <Text style={styles.collectionBanner}>
              Colección de {coleccion.duenioNombre ?? 'consignador'} · {coleccion.cantidadPiezas} piezas
            </Text>
          )}
          <Text style={styles.detailSubtitle}>
            {subasta.fecha} {subasta.hora} · {subasta.ubicacion}
          </Text>

          {depositoNombre && (
            <View style={styles.depositoBox}>
              <Text style={styles.depositoLabel}>DEPÓSITO</Text>
              <Text style={styles.depositoText}>{depositoNombre}</Text>
              {depositoDireccion ? <Text style={styles.depositoSub}>{depositoDireccion}</Text> : null}
            </View>
          )}

          {streamingUrl && !isGuest && (
            <Text style={styles.streamingLink}>Streaming: {streamingUrl}</Text>
          )}

          {catalogItems.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {catalogItems.map((item) => (
                <TouchableOpacity
                  key={item.itemId}
                  style={[styles.itemChip, selectedItemId === item.itemId && styles.itemChipActive]}
                  onPress={() => setSelectedItemId(item.itemId)}
                >
                  <Text style={[styles.itemChipText, selectedItemId === item.itemId && styles.itemChipTextActive]} numberOfLines={1}>
                    {item.titulo ?? `Pieza #${item.itemId}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={styles.basePriceRow}>
            <Text style={styles.basePriceLabel}>PRECIO BASE</Text>
            {selectedItem?.precioBase != null ? (
              <Text style={styles.basePriceValue}>
                ${selectedItem.precioBase.toLocaleString()} {selectedItem.moneda}
              </Text>
            ) : (
              <Text style={styles.basePriceHidden}>
                {isGuest ? 'Registrate para ver el precio base' : 'Precio base no disponible'}
              </Text>
            )}
          </View>

          <View style={styles.bidCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={styles.bidLabel}>OFERTA ACTUAL</Text>
                <Text style={styles.bidPrice}>
                  ${currentBid > 0 ? currentBid.toLocaleString() : '—'} <Text style={{ fontSize: 16, color: Colors.gray }}>ARS</Text>
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: Colors.blueLight }]}>
                <Text style={[styles.badgeText, { color: Colors.primary }]}>CAT. {(subasta.categoria ?? '—').toUpperCase()}</Text>
              </View>
            </View>

            {!isGuest && conectado && (
              <>
                <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
                  <TouchableOpacity
                    style={[styles.bidButton, pujando && { opacity: 0.6 }]}
                    onPress={() => minimo > 0 && handlePujar(minimo)}
                    disabled={pujando || minimo === 0}
                  >
                    <Text style={styles.bidButtonLabel}>APUESTA RÁPIDA +1%</Text>
                    <Text style={styles.bidButtonPrice}>{minimo > 0 ? `$${minimo.toLocaleString()}` : '—'}</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={[styles.inputField, { backgroundColor: Colors.gray4, borderRadius: 12, paddingHorizontal: 12, height: 56 }]}
                      placeholder="Monto manual"
                      placeholderTextColor={Colors.gray2}
                      value={importeManual}
                      onChangeText={setImporteManual}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={[styles.bidButton, { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray3, marginTop: 4 }]}
                      onPress={() => { const v = parseFloat(importeManual); if (!isNaN(v)) handlePujar(v); }}
                      disabled={pujando}
                    >
                      <Text style={[styles.bidButtonLabel, { color: Colors.dark }]}>OFERTAR</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {(minimo > 0 || maximo > 0) && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                    <Text style={{ color: Colors.gray, fontSize: 12 }}>Min: ${minimo.toLocaleString()} | Max: ${maximo.toLocaleString()}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ShieldIcon size={13} color={selectedItem?.tieneSeguro ? Colors.green : Colors.gray2} />
                      <Text style={{ color: selectedItem?.tieneSeguro ? Colors.green : Colors.gray, fontSize: 12, marginLeft: 5 }}>
                        {selectedItem?.tieneSeguro ? 'Seguro: Activo' : 'Sin seguro'}
                      </Text>
                    </View>
                  </View>
                )}
                {!lastPuja && (
                  <TouchableOpacity
                    style={styles.btnSalir}
                    onPress={handleSalir}
                    disabled={saliendo}
                  >
                    <Text style={styles.btnSalirText}>{saliendo ? 'Saliendo...' : 'Salir de la subasta'}</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {isGuest && (
              <Text style={{ color: Colors.primary, marginTop: 12, fontSize: 14, fontWeight: '600' }}>
                Iniciá sesión para participar en la subasta y ver el precio base.
              </Text>
            )}

            {isAdmin && (
              <Text style={{ color: Colors.gray, marginTop: 12, fontSize: 13, fontWeight: '600' }}>
                Modo administrador: vista de solo lectura, no participás de la puja.
              </Text>
            )}

            {!isGuest && !isAdmin && !conectado && !conectando && (
              <Text style={{ color: Colors.gray, marginTop: 12, fontSize: 13 }}>
                {error ?? 'No estás conectado a la subasta.'}
              </Text>
            )}
          </View>

          {!isGuest && conectado && (
            <View style={styles.feedCard}>
              <View style={styles.feedHeader}>
                <Text style={styles.feedTitle}>Pujas en tiempo real</Text>
                <View style={[styles.feedDot, { backgroundColor: enVivo ? Colors.green : Colors.gray2 }]} />
              </View>
              {bids.length === 0 ? (
                <Text style={styles.feedEmpty}>
                  {enVivo ? 'Aún no hay pujas. Sé el primero en ofertar.' : 'Reconectando al canal en vivo...'}
                </Text>
              ) : (
                bids.map((b) => (
                  <View key={b.pujoId} style={styles.feedRow}>
                    <View style={styles.feedPostor}>
                      <Text style={styles.feedPostorNum}>#{b.numeroPostor}</Text>
                      <Text style={styles.feedPostorName} numberOfLines={1}>
                        {b.nombrePostor ?? `Postor ${b.numeroPostor}`}
                      </Text>
                    </View>
                    <Text style={styles.feedImporte}>${b.importe.toLocaleString()}</Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNav active="subastas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

function formatSegundos(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 16 },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  liveDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.red, marginRight: 8 },
  liveText: { color: Colors.red, fontWeight: '700', fontSize: 14, letterSpacing: 0.5 },
  detailImage: { width: '100%', height: 260 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  detailSubtitle: { color: Colors.gray, fontSize: 14, marginBottom: 16 },
  basePriceRow: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: Colors.gray4 },
  basePriceLabel: { fontSize: 11, fontWeight: '700', color: Colors.gray, letterSpacing: 0.5 },
  basePriceValue: { fontSize: 20, fontWeight: '800', color: Colors.dark, marginTop: 4 },
  basePriceHidden: { fontSize: 14, color: Colors.orange, marginTop: 4, fontWeight: '600' },
  collectionBanner: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginBottom: 8 },
  depositoBox: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: Colors.gray4 },
  depositoLabel: { fontSize: 11, fontWeight: '700', color: Colors.gray, letterSpacing: 0.5 },
  depositoText: { fontSize: 15, fontWeight: '600', color: Colors.dark, marginTop: 4 },
  depositoSub: { fontSize: 13, color: Colors.gray, marginTop: 2 },
  streamingLink: { fontSize: 13, color: Colors.primary, marginBottom: 12, fontWeight: '500' },
  itemChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.gray4, marginRight: 8, maxWidth: 180 },
  itemChipActive: { backgroundColor: Colors.primary },
  itemChipText: { fontSize: 13, color: Colors.gray, fontWeight: '600' },
  itemChipTextActive: { color: Colors.white },
  bidCard: { backgroundColor: Colors.gray4, borderRadius: 20, padding: 20 },
  bidLabel: { fontSize: 11, color: Colors.gray, fontWeight: '600', letterSpacing: 0.5 },
  bidPrice: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  bidButton: { flex: 1, backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  bidButtonLabel: { color: Colors.white, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  bidButtonPrice: { color: Colors.white, fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  inputField: { flex: 1, fontSize: 15, color: Colors.dark, paddingRight: 40 },
  btnSalir: { marginTop: 14, paddingVertical: 12, borderRadius: 14, alignItems: 'center', backgroundColor: Colors.redLight },
  btnSalirText: { color: Colors.red, fontSize: 13, fontWeight: '700' },
  feedCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginTop: 16, borderWidth: 1, borderColor: Colors.gray4 },
  feedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  feedTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark },
  feedDot: { width: 8, height: 8, borderRadius: 4 },
  feedEmpty: { color: Colors.gray, fontSize: 13 },
  feedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.gray4 },
  feedPostor: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 12 },
  feedPostorNum: { fontSize: 12, fontWeight: '700', color: Colors.primary, marginRight: 8 },
  feedPostorName: { fontSize: 14, color: Colors.dark, flexShrink: 1 },
  feedImporte: { fontSize: 15, fontWeight: '700', color: Colors.dark },
  countdownBox:   { backgroundColor: Colors.blueLight, borderRadius: 14, padding: 14, marginBottom: 16, alignItems: 'center' },
  countdownLabel: { fontSize: 11, fontWeight: '700', color: Colors.primary, letterSpacing: 0.5 },
  countdownValue: { fontSize: 36, fontWeight: '900', color: Colors.primary, marginTop: 4, fontVariant: ['tabular-nums'] },
});
