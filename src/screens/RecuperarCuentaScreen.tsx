import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { AppButton, AppInput, Logo, ShieldIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface RecuperarCuentaScreenProps {
  onNavigate: NavigateFn;
}

export function RecuperarCuentaScreen({ onNavigate }: RecuperarCuentaScreenProps) {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecover = () => {
    if (!email || !confirmEmail) {
      Alert.alert('Error', 'Completa ambos campos');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Enviado', 'Se ha enviado un código de verificación a tu correo');
      onNavigate('login');
    }, 800);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <Logo size={28} />
          <Text style={styles.brand}>Auction Pulse Pro</Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.iconCircle, { marginBottom: 24 }]}>
            <ShieldIcon size={32} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Recuperacion de la cuenta</Text>
          <Text style={styles.subtitle}>
            Por favor escriba su correo para el recupero de su contraseña y se le enviara un codigo
          </Text>

          <View style={styles.card}>
            <AppInput label="CORREO" placeholder="example@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <AppInput label="CONFIRMAR CORREO" placeholder="example@email.com" value={confirmEmail} onChangeText={setConfirmEmail} keyboardType="email-address" />
          </View>

          <AppButton title="Recuperar cuenta" icon="→" onPress={handleRecover} loading={loading} />

          <View style={[styles.infoCard, { marginTop: 24 }]}>
            <ShieldIcon size={20} color={Colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.infoTitle}>Protección de datos</Text>
              <Text style={styles.infoDesc}>Tus datos se cifran para una verificación segura.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, marginBottom: 8 },
  brand: { fontSize: 18, fontWeight: '700', color: Colors.dark, marginLeft: 10 },
  content: { paddingHorizontal: 20, paddingVertical: 20 },
  title: { fontSize: 36, fontWeight: 'bold', color: Colors.dark, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.gray, marginBottom: 28, lineHeight: 22 },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.blueLight, justifyContent: 'center', alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  infoCard: {
    backgroundColor: Colors.gray4, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start',
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: Colors.dark },
  infoDesc: { fontSize: 13, color: Colors.gray, lineHeight: 18, marginTop: 2 },
});
