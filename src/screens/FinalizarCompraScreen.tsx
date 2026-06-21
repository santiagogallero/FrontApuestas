import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  AppHeader,
  AppButton,
  CreditCardIcon,
  BankIcon,
  FileIcon,
  CheckCircleIcon,
} from '../components';
import { apiEjecutarPago, apiGetCheckout, apiGetPaymentMethods } from '../api';
import type { PagoEstado } from '../types/compliance';
import type { MedioPago } from '../types/cuenta';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface FinalizarCompraScreenProps {
  onNavigate: NavigateFn;
  params: ScreenParams['finalizarCompra'];
}

function iconForTipo(tipo: string) {
  const t = tipo.toUpperCase();
  if (t.includes('TARJETA') || t.includes('CARD')) return CreditCardIcon;
  if (t.includes('CHEQUE')) return FileIcon;
  return BankIcon;
}

export function FinalizarCompraScreen({ onNavigate, params }: FinalizarCompraScreenProps) {
  const [checkout, setCheckout] = useState<PagoEstado | null>(null);
  const [medios, setMedios] = useState<MedioPago[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([apiGetCheckout(params.registroId), apiGetPaymentMethods()])
      .then(([ck, mp]) => {
        if (!mounted) return;
        setCheckout(ck);
        const verificados = mp.filter((m) => m.verificado && m.activo);
        setMedios(verificados);
        if (verificados.length > 0) setSelectedId(verificados[0].id);
        if (ck.estadoPago === 'PAGADO') {
          setError('Esta adjudicación ya fue pagada.');
        }
      })
      .catch((e) => mounted && setError(e?.message || 'No se pudo cargar el checkout'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [params.registroId]);

  const pagar = async () => {
    if (!selectedId || !checkout || paying) return;
    if (checkout.estadoPago === 'PAGADO') {
      Alert.alert('Ya pagado', 'Esta adjudicación ya fue abonada.');
      return;
    }
    setPaying(true);
    try {
      const result = await apiEjecutarPago({
        registroSubastaId: params.registroId,
        medioPagoId: selectedId,
      });
      onNavigate('pagoExitoso', {
        registroId: params.registroId,
        transaccionId: result.transaccionId,
        montoPagado: result.montoPagado,
        moneda: result.moneda,
        productoDescripcion: result.productoDescripcion,
        medioPagoAlias: result.medioPagoAlias,
      });
    } catch (e: any) {
      onNavigate('pagoFallido', {
        registroId: params.registroId,
        multaPotencial: checkout.multaPotencial,
        moneda: checkout.moneda,
        mensaje: e?.message || 'No se pudo procesar el pago',
      });
    } finally {
      setPaying(false);
    }
  };

  const totalAPagar =
    checkout && checkout.estadoPago === 'VENCIDO'
      ? checkout.montoTotal + checkout.montoMulta
      : checkout?.montoTotal ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Finalizar Compra" onBack={() => onNavigate('detalleAdjudicacion')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.screenTitle, { marginBottom: 4 }]}>Finalizar Compra</Text>
          <Text style={[styles.subtitle, { marginBottom: 20 }]}>Elige un método de pago verificado</Text>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />}
          {!loading && error && <Text style={styles.subtitle}>{error}</Text>}

          {!loading && checkout && checkout.estadoPago !== 'PAGADO' && (
            <>
              <View style={styles.summaryCard}>
                <Text style={styles.offerLabel}>PIEZA</Text>
                <Text style={styles.productTitle}>{checkout.productoDescripcion ?? `Registro #${params.registroId}`}</Text>
                <Text style={styles.offerLabel}>TOTAL A PAGAR</Text>
                <Text style={styles.totalPrice}>
                  ${totalAPagar.toLocaleString()} {checkout.moneda}
                </Text>
                {checkout.estadoPago === 'VENCIDO' && checkout.montoMulta > 0 && (
                  <Text style={styles.multaNote}>Incluye multa por mora: ${checkout.montoMulta.toLocaleString()}</Text>
                )}
              </View>

              {medios.length === 0 ? (
                <Text style={styles.subtitle}>No tenés métodos de pago verificados. Agregá uno en Billetera.</Text>
              ) : (
                medios.map((medio, index) => {
                  const Icon = iconForTipo(medio.tipo);
                  const selected = selectedId === medio.id;
                  return (
                    <TouchableOpacity
                      key={medio.id}
                      style={[
                        styles.paymentCard,
                        { backgroundColor: selected ? Colors.primary : Colors.gray4, marginTop: index === 0 ? 0 : 12 },
                      ]}
                      onPress={() => setSelectedId(medio.id)}
                      activeOpacity={0.85}
                    >
                      <View style={[styles.paymentIconBox, !selected && { backgroundColor: Colors.white }]}>
                        <Icon size={20} color={selected ? Colors.white : Colors.primary} />
                      </View>
                      <View style={styles.paymentInfo}>
                        <Text style={[styles.paymentTitle, { color: selected ? Colors.white : Colors.dark }]}>
                          {medio.aliasDescripcion}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                          <CheckCircleIcon size={13} color={selected ? '#BFDBFE' : Colors.green} />
                          <Text
                            style={[
                              styles.paymentSub,
                              { color: selected ? '#BFDBFE' : Colors.gray, marginLeft: 5 },
                            ]}
                          >
                            VERIFICADA · {medio.moneda}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}

              <View style={[styles.warningCard, { marginTop: 24 }]}>
                <Text style={[styles.sectionTitle, { color: Colors.red, marginBottom: 8 }]}>Política de pago</Text>
                <Text style={{ color: Colors.red, fontSize: 14, lineHeight: 20, opacity: 0.9 }}>
                  Si no se realiza el pago dentro de las 72 horas, se aplicará una penalización del 10% sobre el monto ofertado.
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 12 }}>
                  <Text style={{ color: Colors.red, fontSize: 24, fontWeight: 'bold' }}>
                    ${checkout.multaPotencial.toLocaleString()}
                  </Text>
                  <Text style={{ color: Colors.red, fontSize: 14, marginLeft: 8, opacity: 0.8 }}>
                    (10% del monto ofertado)
                  </Text>
                </View>
              </View>

              <AppButton title="Pagar" icon="🔒" onPress={pagar} loading={paying} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 16 },
  subtitle: { fontSize: 15, color: Colors.gray, lineHeight: 22 },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  offerLabel: { fontSize: 10, color: Colors.gray, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  productTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark, marginBottom: 12 },
  totalPrice: { fontSize: 28, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  multaNote: { color: Colors.red, fontSize: 13, marginTop: 8 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16 },
  paymentIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentInfo: { flex: 1, marginLeft: 14 },
  paymentTitle: { fontSize: 15, fontWeight: '600' },
  paymentSub: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  warningCard: {
    backgroundColor: Colors.redLight,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.red,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark },
});
