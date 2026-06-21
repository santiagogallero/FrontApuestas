import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { AppHeader, ShieldIcon, ReceiptIcon, AppButton } from '../components';
import { apiGetMisAdjudicaciones, apiSeleccionarEntrega } from '../api';
import type { Adjudicacion } from '../types/cuenta';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface DetalleAdjudicacionScreenProps {
  onNavigate: NavigateFn;
}

export function DetalleAdjudicacionScreen({ onNavigate }: DetalleAdjudicacionScreenProps) {
  const [items, setItems] = useState<Adjudicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    apiGetMisAdjudicaciones()
      .then((data) => mounted && setItems(data))
      .catch((e) => mounted && setError(e?.message || 'No se pudieron cargar las adjudicaciones'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Historial de ofertas" onBack={() => onNavigate('ventas')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.screenTitle, { marginBottom: 4 }]}>Mis adjudicaciones</Text>
          <Text style={[styles.subtitle, { marginBottom: 20 }]}>Piezas que ganaste y el importe a abonar.</Text>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />}

          {!loading && error && <Text style={styles.subtitle}>{error}</Text>}

          {!loading && !error && items.length === 0 && (
            <Text style={styles.subtitle}>Todavía no te adjudicaste ninguna pieza.</Text>
          )}

          {!loading &&
            !error &&
            items.map((adj, index) => (
              <AdjudicacionCard
                key={adj.registroId ?? index}
                adj={adj}
                onNavigate={onNavigate}
                onUpdated={(updated) =>
                  setItems((prev) => prev.map((a) => (a.registroId === updated.registroId ? updated : a)))
                }
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AdjudicacionCard({
  adj,
  onNavigate,
  onUpdated,
}: {
  adj: Adjudicacion;
  onNavigate: NavigateFn;
  onUpdated: (a: Adjudicacion) => void;
}) {
  const [direccion, setDireccion] = useState(adj.direccionEnvio ?? '');
  const [guardando, setGuardando] = useState(false);

  const elegirEntrega = async (opcion: 'SHIPPED' | 'PICKUP') => {
    if (!adj.registroId) return;
    if (opcion === 'SHIPPED' && !direccion.trim()) {
      Alert.alert('Dirección requerida', 'Ingresá la dirección de envío.');
      return;
    }
    setGuardando(true);
    try {
      const updated = await apiSeleccionarEntrega(adj.registroId, {
        deliveryOption: opcion,
        shippingAddress: opcion === 'SHIPPED' ? direccion.trim() : undefined,
      });
      onUpdated(updated);
      Alert.alert('Entrega configurada', opcion === 'PICKUP' ? 'Retiro personal — el seguro deja de aplicar al retirar.' : 'Envío registrado con cobertura de seguro.');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo guardar la modalidad de entrega');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={[styles.adjCard, { marginBottom: 16 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.adjLabel}>{adj.estado}</Text>
          <Text style={[styles.adjStatus, { color: Colors.dark, fontSize: 18 }]} numberOfLines={2}>
            {adj.productoDescripcion ?? `Producto #${adj.productoId ?? '—'}`}
          </Text>
        </View>
        <View style={[styles.badge, styles.certBadge]}>
          <ShieldIcon size={12} color={Colors.primary} />
          <Text style={[styles.badgeText, { color: Colors.primary, marginLeft: 5 }]}>Adjudicado</Text>
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <Text style={styles.offerLabel}>TOTAL A PAGAR</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={styles.bidPrice}>${adj.totalPagar.toLocaleString()}</Text>
          <Text style={{ color: Colors.gray, fontSize: 16, marginLeft: 6 }}>{adj.moneda}</Text>
        </View>
      </View>

      <View style={styles.breakdown}>
        <Row label="Oferta" value={`$${adj.importe.toLocaleString()} ${adj.moneda}`} />
        <Row label="Comisión" value={`$${adj.comision.toLocaleString()} ${adj.moneda}`} />
        <Row label="Envío" value={`$${adj.costoEnvio.toLocaleString()} ${adj.moneda}`} />
      </View>

      {adj.registroId && (
        <View style={styles.entregaBox}>
          <Text style={styles.offerLabel}>MODALIDAD DE ENTREGA</Text>
          {adj.modalidadEntrega ? (
            <Text style={{ color: Colors.dark, fontSize: 14, marginTop: 6 }}>
              {adj.modalidadEntrega === 'PICKUP' ? 'Retiro personal' : `Envío a: ${adj.direccionEnvio}`}
              {adj.seguroVigenteTrasEntrega === false && ' · Sin seguro tras retiro'}
            </Text>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Dirección de envío (si elegís envío)"
                placeholderTextColor={Colors.gray2}
                value={direccion}
                onChangeText={setDireccion}
              />
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <TouchableOpacity style={[styles.entregaBtn, guardando && { opacity: 0.6 }]} onPress={() => elegirEntrega('SHIPPED')} disabled={guardando}>
                  <Text style={styles.entregaBtnText}>Envío</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.entregaBtn, styles.entregaBtnAlt, guardando && { opacity: 0.6 }]} onPress={() => elegirEntrega('PICKUP')} disabled={guardando}>
                  <Text style={[styles.entregaBtnText, { color: Colors.dark }]}>Retiro</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: Colors.gray3 }}>
        <Text style={{ color: Colors.gray, fontSize: 14, flex: 1 }}>{adj.mensaje}</Text>
        <ReceiptIcon size={20} color={Colors.gray} />
      </View>

      {adj.registroId && adj.estado === 'VENDIDO' && (
        <View style={{ marginTop: 14 }}>
          <AppButton
            title="Pagar adjudicación"
            onPress={() => onNavigate('finalizarCompra', { registroId: adj.registroId! })}
          />
        </View>
      )}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
      <Text style={{ color: Colors.gray, fontSize: 14 }}>{label}</Text>
      <Text style={{ color: Colors.dark, fontSize: 14, fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 16 },
  subtitle: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  adjCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  breakdown: { marginTop: 14, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.gray4 },
  adjLabel: { fontSize: 11, color: Colors.gray, fontWeight: '700', letterSpacing: 1 },
  adjStatus: { fontSize: 24, fontWeight: 'bold', marginTop: 4 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  adjImageWrap: { marginTop: 16, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  adjImage: { width: '100%', height: 200 },
  adjImageLabel: { position: 'absolute', bottom: 12, left: 12, color: Colors.white, fontSize: 18, fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  certBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.blueLight },
  badgeText: { fontSize: 11, fontWeight: '700' },
  offerLabel: { fontSize: 10, color: Colors.gray, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  bidPrice: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  entregaBox: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: Colors.gray4 },
  input: { marginTop: 8, backgroundColor: Colors.gray4, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: Colors.dark },
  entregaBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  entregaBtnAlt: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.gray3 },
  entregaBtnText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
});
