import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { AppHeader, ShieldIcon } from '../components';
import { apiGetMisSeguros } from '../api';
import { Colors } from '../theme/colors';
import type { SeguroPoliza } from '../types/seguro';
import type { NavigateFn } from '../types/navigation';

interface SegurosScreenProps {
  onNavigate: NavigateFn;
}

export function SegurosScreen({ onNavigate }: SegurosScreenProps) {
  const [polizas, setPolizas] = useState<SeguroPoliza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPolizas(await apiGetMisSeguros());
    } catch (e: any) {
      setError(e?.message || 'No se pudieron cargar tus pólizas');
      setPolizas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Seguros y Seguridad" onBack={() => onNavigate('cuenta')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, { alignSelf: 'center', marginBottom: 20 }]}>
            <ShieldIcon size={36} color={Colors.primary} />
          </View>
          <Text style={[styles.screenTitle, { textAlign: 'center' }]}>Tu confianza, asegurada</Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>
            Cada pieza asegurada incluye datos de contacto de la compañía para ampliar la cobertura pagando la diferencia del premio.
          </Text>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />}

          {!loading && error && (
            <Text style={[styles.subtitle, { textAlign: 'center', color: Colors.red, marginTop: 24 }]}>{error}</Text>
          )}

          {!loading && !error && polizas.length === 0 && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Sin pólizas activas</Text>
              <Text style={styles.subtitle}>
                Cuando tengas artículos asegurados en depósito, aparecerán acá con el detalle de la póliza.
              </Text>
            </View>
          )}

          {polizas.map((p) => (
            <View key={p.nroPoliza} style={styles.polizaCard}>
              <Text style={styles.polizaTitulo}>{p.productoTitulo}</Text>
              <Text style={styles.polizaMeta}>Póliza {p.nroPoliza} · {p.compania}</Text>
              <Text style={styles.polizaImporte}>
                Cubierto: ${p.importeAsegurado.toLocaleString()} {p.polizaCombinada ? '(combinada)' : ''}
              </Text>
              {(p.contactoTelefono || p.contactoEmail) && (
                <View style={styles.contactoBox}>
                  <Text style={styles.contactoLabel}>CONTACTO ASEGURADORA</Text>
                  {p.contactoTelefono ? (
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${p.contactoTelefono}`)}>
                      <Text style={styles.contactoLink}>{p.contactoTelefono}</Text>
                    </TouchableOpacity>
                  ) : null}
                  {p.contactoEmail ? (
                    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${p.contactoEmail}`)}>
                      <Text style={styles.contactoLink}>{p.contactoEmail}</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
            </View>
          ))}
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
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  emptyCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 20, marginTop: 24 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: Colors.dark, marginBottom: 8, textAlign: 'center' },
  polizaCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  polizaTitulo: { fontSize: 16, fontWeight: '800', color: Colors.dark },
  polizaMeta: { fontSize: 13, color: Colors.gray, marginTop: 4 },
  polizaImporte: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginTop: 8 },
  contactoBox: { backgroundColor: Colors.blueLight, borderRadius: 12, padding: 12, marginTop: 12 },
  contactoLabel: { fontSize: 10, fontWeight: '800', color: Colors.gray, letterSpacing: 0.8, marginBottom: 6 },
  contactoLink: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginTop: 2 },
});
