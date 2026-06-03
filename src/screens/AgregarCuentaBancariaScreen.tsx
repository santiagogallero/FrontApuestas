import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';
import { AppHeader, AppButton, AppInput, AppSelect, InfoIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

const BANCOS = ['Seleccionar Institución', 'Banco Nación', 'Banco Galicia', 'BBVA', 'Santander', 'Chase'];
const PAISES = ['Argentina', 'Brasil', 'Chile', 'Uruguay', 'Estados Unidos', 'España'];
const DIVISAS = ['USD ($)', 'ARS ($)', 'EUR (€)'];

export function AgregarCuentaBancariaScreen({ onNavigate }: Props) {
  const [titular, setTitular] = useState('');
  const [banco, setBanco] = useState('Seleccionar Institución');
  const [tipo, setTipo] = useState<'corriente' | 'ahorro'>('corriente');
  const [cbu, setCbu] = useState('');
  const [pais, setPais] = useState('Argentina');
  const [divisa, setDivisa] = useState('USD ($)');

  const guardar = () => {
    Alert.alert('Cuenta bancaria', 'Cuenta enviada para verificación');
    onNavigate('billetera');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Auction Pulse Pro" onBack={() => onNavigate('agregarMetodoPago')} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Agregar cuenta bancaria</Text>
            <Text style={styles.subtitle}>Vincula tu institución financiera para asegurar tu poder de puja.</Text>

            <View style={styles.infoCard}>
              <InfoIcon size={20} color={Colors.primary} />
              <Text style={styles.infoText}>Para participar en la subasta, se requiere al menos un método de pago verificado.</Text>
            </View>

            <AppInput label="NOMBRE DEL TITULAR DE LA CUENTA" placeholder="Johnathan Doe" value={titular} onChangeText={setTitular} />
            <AppSelect label="NOMBRE DEL BANCO" value={banco} options={BANCOS} onChange={setBanco} />

            <Text style={styles.label}>TIPO DE CUENTA</Text>
            <View style={styles.radioRow}>
              <TouchableOpacity style={styles.radioOpt} onPress={() => setTipo('corriente')} activeOpacity={0.7}>
                <View style={[styles.radio, tipo === 'corriente' && styles.radioActive]}>
                  {tipo === 'corriente' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>Cuenta corriente</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioOpt} onPress={() => setTipo('ahorro')} activeOpacity={0.7}>
                <View style={[styles.radio, tipo === 'ahorro' && styles.radioActive]}>
                  {tipo === 'ahorro' && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>Caja de ahorro</Text>
              </TouchableOpacity>
            </View>

            <AppInput label="NÚMERO DE CUENTA / CBU" placeholder="GB82 WBSB 2020 1512 3456 78" value={cbu} onChangeText={setCbu} />
            <AppSelect label="PAIS" value={pais} options={PAISES} onChange={setPais} />
            <AppSelect label="DIVISA" value={divisa} options={DIVISAS} onChange={setDivisa} />

            <AppButton title="Agregar cuenta bancaria" onPress={guardar} />
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
  title: { fontSize: 30, fontWeight: '900', color: Colors.dark, marginBottom: 6 },
  subtitle: { fontSize: 15, color: Colors.gray, lineHeight: 22, marginBottom: 20 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.blueLight, borderRadius: 14, padding: 16,
    borderLeftWidth: 4, borderLeftColor: Colors.primary, marginBottom: 24,
  },
  infoText: { flex: 1, marginLeft: 12, color: Colors.dark, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  label: { fontSize: 12, fontWeight: '700', color: Colors.gray, letterSpacing: 1, marginBottom: 10 },
  radioRow: { flexDirection: 'row', marginBottom: 16 },
  radioOpt: { flexDirection: 'row', alignItems: 'center', marginRight: 28 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.gray3, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: Colors.primary },
  radioLabel: { fontSize: 15, fontWeight: '700', color: Colors.dark },
});
