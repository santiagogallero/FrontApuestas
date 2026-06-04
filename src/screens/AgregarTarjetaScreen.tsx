import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import { AppHeader, AppButton, AppInput } from '../components';
import { Colors } from '../theme/colors';
import { apiRegisterPaymentMethods } from '../api';
import type { NavigateFn } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

export function AgregarTarjetaScreen({ onNavigate }: Props) {
  const [titular, setTitular] = useState('');
  const [numero, setNumero] = useState('');
  const [caducidad, setCaducidad] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const guardar = async () => {
    const ultimos4 = numero.replace(/\s/g, '').slice(-4) || '****';
    const alias = `Tarjeta terminada en ${ultimos4}`;
    setLoading(true);
    try {
      await apiRegisterPaymentMethods([{ tipo: 'CREDIT_CARD', aliasDescripcion: alias, moneda: 'ARS' }]);
      Alert.alert('Listo', 'Tarjeta enviada para verificación');
      onNavigate('billetera');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo registrar la tarjeta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Auction Pulse Pro" onBack={() => onNavigate('agregarMetodoPago')} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Agregar Tarjeta</Text>

            {/* Tarjeta visual */}
            <View style={styles.cardVisual}>
              <View style={styles.cardTop}>
                <View style={styles.cardChip} />
                <Text style={styles.cardBrand}>VISA</Text>
              </View>
              <Text style={styles.cardNumber}>{numero || '4242  ••••  ••••  4242'}</Text>
              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.cardCaption}>NOMBRE DEL TITULAR DE LA TARJETA</Text>
                  <Text style={styles.cardValue}>{titular || 'ADAM SMITH'}</Text>
                </View>
                <View>
                  <Text style={styles.cardCaption}>VENCE</Text>
                  <Text style={styles.cardValue}>{caducidad || '05 / 28'}</Text>
                </View>
              </View>
            </View>

            <AppInput label="NOMBRE DEL TITULAR DE LA TARJETA" placeholder="Nombre completo tal como aparece en la tarjeta." value={titular} onChangeText={setTitular} />
            <AppInput label="NÚMERO DE TARJETA" placeholder="0000 0000 0000 0000" value={numero} onChangeText={setNumero} keyboardType="numeric" />
            <AppInput label="FECHA DE CADUCIDAD (MM/AA)" placeholder="MM/YY" value={caducidad} onChangeText={setCaducidad} />
            <AppInput label="CVV" placeholder="•••" value={cvv} onChangeText={setCvv} keyboardType="numeric" secure />

            <AppButton title={loading ? 'Enviando...' : 'Verificar y guardar la tarjeta'} icon="→" onPress={guardar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  title: { fontSize: 34, fontWeight: '900', color: Colors.dark, marginBottom: 20 },
  cardVisual: {
    backgroundColor: Colors.primary, borderRadius: 20, padding: 22, marginBottom: 28,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 5,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardChip: { width: 44, height: 34, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.25)' },
  cardBrand: { color: Colors.white, fontSize: 20, fontWeight: '800', letterSpacing: 1 },
  cardNumber: { color: Colors.white, fontSize: 20, fontWeight: '700', letterSpacing: 2, marginTop: 24 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  cardCaption: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  cardValue: { color: Colors.white, fontSize: 15, fontWeight: '700', marginTop: 4 },
});
