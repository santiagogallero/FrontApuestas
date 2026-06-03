import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import { AppHeader, BottomNav, BellIcon, GavelIcon, ShieldIcon } from '../components';
import { useDetalleSubasta } from '../hooks';
import { useAuthContext } from '../context/AuthContext';
import { Colors } from '../theme/colors';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface DetalleSubastaScreenProps {
  onNavigate: NavigateFn;
  params?: ScreenParams['detalleSubasta'];
}

export function DetalleSubastaScreen({ onNavigate, params }: DetalleSubastaScreenProps) {
  const subasta = (params as any)?.subasta ?? (params as any)?.item ?? { id: 0, fecha: '', hora: '', estado: '', categoria: '', ubicacion: '', capacidadAsistentes: 0 };
  const { conectando, conectado, pujando, lastPuja, conectar, pujar } = useDetalleSubasta(subasta.id);
  const { currentUser } = useAuthContext();
  const initials = currentUser?.email?.slice(0, 2).toUpperCase() ?? 'JD';
  const [importeManual, setImporteManual] = useState('');
  const [itemIdPuja] = useState(1);

  useEffect(() => {
    if (!subasta.id) return;
    conectar();
  }, [subasta.id, conectar]);

  const handlePujar = async (importe: number) => {
    if (!subasta.id) return;
    try {
      const res = await pujar(itemIdPuja, importe, 'ARS');
      Alert.alert('Puja registrada', `Tu oferta de $${res.ofertaActual} fue aceptada`);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo registrar la puja');
    }
  };

  const currentBid = lastPuja?.ofertaActual ?? 0;
  const minimo = lastPuja?.minimoPermitido ?? 0;
  const maximo = lastPuja?.maximoPermitido ?? 0;

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
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{conectando ? 'CONECTANDO...' : conectado ? 'CONECTADO — SUBASTA EN VIVO' : 'SUBASTA'}</Text>
          </View>

          <View style={[styles.detailImage, { backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center', borderRadius: 16 }]}>
            <GavelIcon size={72} color={Colors.primary} strokeWidth={1.5} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gallery}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.thumb}>
                <GavelIcon size={24} color={Colors.gray2} strokeWidth={1.6} />
              </View>
            ))}
          </ScrollView>

          <Text style={[styles.screenTitle, { marginTop: 20 }]}>Subasta #{subasta.id}</Text>
          <Text style={styles.detailSubtitle}>
            {subasta.fecha} {subasta.hora} · {subasta.ubicacion}
          </Text>

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

            {conectado && (
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
                      <ShieldIcon size={13} color={Colors.green} />
                      <Text style={{ color: Colors.green, fontSize: 12, marginLeft: 5 }}>Seguro: Activo</Text>
                    </View>
                  </View>
                )}
              </>
            )}

            {!conectado && !conectando && (
              <Text style={{ color: Colors.gray, marginTop: 12, fontSize: 13 }}>No conectado — necesitás un medio de pago verificado para pujar.</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <BottomNav active="subastas" onNavigate={onNavigate} />
    </SafeAreaView>
  );
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
  gallery: { marginTop: 12 },
  thumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: Colors.gray4, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },
  detailSubtitle: { color: Colors.gray, fontSize: 14, marginBottom: 16 },
  bidCard: { backgroundColor: Colors.gray4, borderRadius: 20, padding: 20 },
  bidLabel: { fontSize: 11, color: Colors.gray, fontWeight: '600', letterSpacing: 0.5 },
  bidPrice: { fontSize: 32, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  bidButton: { flex: 1, backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  bidButtonLabel: { color: Colors.white, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  bidButtonPrice: { color: Colors.white, fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  inputField: { flex: 1, fontSize: 15, color: Colors.dark, paddingRight: 40 },
});
