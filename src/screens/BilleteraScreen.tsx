import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import { AppHeader, AppButton, BottomNav, CreditCardIcon, BankIcon, CheckCircleIcon } from '../components';
import { apiGetPaymentMethods } from '../api';
import type { MedioPago } from '../types/cuenta';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface BilleteraScreenProps {
  onNavigate: NavigateFn;
}

function isBancario(tipo: string): boolean {
  const t = tipo.toUpperCase();
  return t.includes('BANCO') || t.includes('CUENTA') || t.includes('CHEQUE');
}

export function BilleteraScreen({ onNavigate }: BilleteraScreenProps) {
  const [medios, setMedios] = useState<MedioPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGetPaymentMethods();
        if (mounted) setMedios(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'No se pudieron cargar los métodos de pago');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Mi billetera" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Métodos de pago registrados</Text>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />}

          {!loading && error && <Text style={styles.empty}>{error}</Text>}

          {!loading && !error && medios.length === 0 && (
            <Text style={styles.empty}>Todavía no registraste métodos de pago.</Text>
          )}

          {!loading &&
            !error &&
            medios.map((m, index) => {
              const banco = isBancario(m.tipo);
              return (
                <View
                  key={m.id}
                  style={[
                    styles.paymentCard,
                    { backgroundColor: index === 0 ? Colors.primary : Colors.gray4, marginTop: index === 0 ? 0 : 12 },
                  ]}
                >
                  <View style={[styles.paymentIconBox, index !== 0 && { backgroundColor: Colors.white }]}>
                    {banco ? (
                      <BankIcon size={20} color={index === 0 ? Colors.white : Colors.primary} />
                    ) : (
                      <CreditCardIcon size={20} color={index === 0 ? Colors.white : Colors.primary} />
                    )}
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={[styles.paymentTitle, { color: index === 0 ? Colors.white : Colors.dark }]}>
                      {m.aliasDescripcion}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <CheckCircleIcon
                        size={13}
                        color={m.verificado ? (index === 0 ? '#BFDBFE' : Colors.green) : Colors.gray2}
                      />
                      <Text
                        style={[
                          styles.paymentSub,
                          { color: index === 0 ? '#BFDBFE' : Colors.gray, marginLeft: 5 },
                        ]}
                      >
                        {m.moneda} · {m.verificado ? 'VERIFICADO' : 'PENDIENTE DE VERIFICACIÓN'}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}

          <View style={{ marginTop: 24 }}>
            <AppButton title="+ Agregar método de pago" onPress={() => onNavigate('agregarMetodoPago')} />
          </View>
        </View>
      </ScrollView>
      <BottomNav active="billetera" onNavigate={onNavigate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark },
  paymentCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 16 },
  paymentIconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  paymentInfo: { flex: 1, marginLeft: 14 },
  paymentTitle: { fontSize: 15, fontWeight: '600' },
  paymentSub: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  empty: { fontSize: 14, color: Colors.gray, lineHeight: 22, marginTop: 8 },
});
