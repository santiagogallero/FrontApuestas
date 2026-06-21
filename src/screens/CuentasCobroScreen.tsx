import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { AppHeader, AppButton, AppInput } from '../components';
import {
  apiCreatePayoutAccount,
  apiDeletePayoutAccount,
  apiGetPayoutAccounts,
} from '../api';
import type { CuentaCobro } from '../types/cuenta';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface CuentasCobroScreenProps {
  onNavigate: NavigateFn;
}

export function CuentasCobroScreen({ onNavigate }: CuentasCobroScreenProps) {
  const [cuentas, setCuentas] = useState<CuentaCobro[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [alias, setAlias] = useState('');
  const [currency, setCurrency] = useState('ARS');
  const [foreignAccount, setForeignAccount] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [holderName, setHolderName] = useState('');

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      setCuentas(await apiGetPayoutAccounts());
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudieron cargar las cuentas de cobro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const guardar = async () => {
    if (!alias.trim() || !bankName.trim() || !accountNumber.trim() || !holderName.trim()) {
      Alert.alert('Datos incompletos', 'Completá alias, banco, número de cuenta y titular.');
      return;
    }
    if (foreignAccount && !swiftCode.trim()) {
      Alert.alert('SWIFT requerido', 'Las cuentas del exterior requieren código SWIFT.');
      return;
    }
    setSaving(true);
    try {
      await apiCreatePayoutAccount({
        alias: alias.trim(),
        currency: currency.trim().toUpperCase(),
        foreignAccount,
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        swiftCode: foreignAccount ? swiftCode.trim() : undefined,
        holderName: holderName.trim(),
      });
      setShowForm(false);
      setAlias('');
      setBankName('');
      setAccountNumber('');
      setSwiftCode('');
      setHolderName('');
      await cargar();
      Alert.alert('Listo', 'Cuenta de cobro registrada.');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo registrar la cuenta');
    } finally {
      setSaving(false);
    }
  };

  const eliminar = (cuenta: CuentaCobro) => {
    Alert.alert('Eliminar cuenta', `¿Eliminar "${cuenta.alias}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await apiDeletePayoutAccount(cuenta.id);
            await cargar();
          } catch (e: any) {
            Alert.alert('Error', e?.message || 'No se pudo eliminar');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Cuentas de cobro" onBack={() => onNavigate('misProductos')} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.screenTitle}>Cuentas de cobro</Text>
          <Text style={styles.subtitle}>
            Declaración de la cuenta (local o del exterior) donde recibirás los fondos de tus ventas.
          </Text>

          {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 24 }} />}

          {!loading && cuentas.length === 0 && !showForm && (
            <Text style={[styles.subtitle, { marginTop: 16 }]}>Todavía no registraste cuentas de cobro.</Text>
          )}

          {cuentas.map((cuenta) => (
            <View key={cuenta.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{cuenta.alias}</Text>
                <Text style={styles.cardSub}>
                  {cuenta.bankName} · {cuenta.accountNumberMasked} · {cuenta.currency}
                </Text>
                <Text style={styles.cardSub}>
                  {cuenta.foreignAccount ? `Exterior · SWIFT ${cuenta.swiftCode ?? '—'}` : 'Cuenta local'} · {cuenta.holderName}
                </Text>
              </View>
              <TouchableOpacity onPress={() => eliminar(cuenta)}>
                <Text style={styles.deleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}

          {showForm ? (
            <View style={styles.form}>
              <AppInput label="ALIAS" placeholder="Chase USD personal" value={alias} onChangeText={setAlias} />
              <AppInput label="MONEDA" placeholder="ARS o USD" value={currency} onChangeText={setCurrency} />
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Cuenta del exterior</Text>
                <Switch value={foreignAccount} onValueChange={setForeignAccount} />
              </View>
              <AppInput label="BANCO" placeholder="Galicia / Chase" value={bankName} onChangeText={setBankName} />
              <AppInput label="NÚMERO DE CUENTA" placeholder="123456789" value={accountNumber} onChangeText={setAccountNumber} />
              {foreignAccount && (
                <AppInput label="SWIFT" placeholder="CHASUS33" value={swiftCode} onChangeText={setSwiftCode} />
              )}
              <AppInput label="TITULAR" placeholder="Nombre del titular" value={holderName} onChangeText={setHolderName} />
              <AppButton title={saving ? 'Guardando…' : 'Guardar cuenta'} onPress={guardar} />
              <AppButton title="Cancelar" variant="secondary" onPress={() => setShowForm(false)} />
            </View>
          ) : (
            <AppButton title="+ Agregar cuenta de cobro" onPress={() => setShowForm(true)} />
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
  screenTitle: { fontSize: 28, fontWeight: 'bold', color: Colors.dark, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.gray, lineHeight: 22, marginBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.dark },
  cardSub: { fontSize: 13, color: Colors.gray, marginTop: 4 },
  deleteText: { color: Colors.red, fontWeight: '700', fontSize: 13 },
  form: { marginTop: 8, gap: 4 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  switchLabel: { fontSize: 14, color: Colors.dark, fontWeight: '600' },
});
