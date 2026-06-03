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
import { AppButton, AppInput, AppSelect, Logo, MapPinIcon } from '../components';
import { apiRegisterStage1 } from '../api';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

const PAISES = [
  'Argentina',
  'Brasil',
  'Chile',
  'Uruguay',
  'Paraguay',
  'Bolivia',
  'Perú',
  'Colombia',
  'México',
  'España',
  'Estados Unidos',
];

interface RegisterScreenProps {
  onNavigate: NavigateFn;
}

export function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [documento, setDocumento] = useState('');
  const [domicilioLegal, setDomicilioLegal] = useState('');
  const [paisOrigen, setPaisOrigen] = useState('Argentina');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword || !documento || !domicilioLegal || !paisOrigen) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      await apiRegisterStage1({
        email,
        password,
        documento,
        nombre: `${firstName} ${lastName}`,
        domicilioLegal,
        paisOrigen,
      });
      onNavigate('verifyEmail', { email });
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.top}>
          <Logo size={28} />
          <Text style={styles.brand}>Auction Pulse Pro</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.eyebrow}>VERIFICACIÓN DE IDENTIDAD</Text>
          <Text style={styles.title}>Registro 1/2{'\n'}Auction Pulse Pro.</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Datos Personales</Text>

            <AppInput label="NOMBRE" placeholder="Ej. Alejandro" value={firstName} onChangeText={setFirstName} />
            <AppInput label="APELLIDO" placeholder="Ej. Rossi" value={lastName} onChangeText={setLastName} />
            <AppInput label="CORREO ELECTRÓNICO" placeholder="tu@correo.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <AppInput label="CONTRASEÑA" placeholder="••••••••" value={password} onChangeText={setPassword} secure />
            <AppInput label="CONFIRMAR CONTRASEÑA" placeholder="••••••••" value={confirmPassword} onChangeText={setConfirmPassword} secure />
            <AppInput label="DOCUMENTO (DNI / PASAPORTE)" placeholder="Ej. 12345678" value={documento} onChangeText={setDocumento} keyboardType="numeric" />
            <AppInput label="DOMICILIO LEGAL" placeholder="Calle, Número, Ciudad" value={domicilioLegal} onChangeText={setDomicilioLegal} iconLeft={<MapPinIcon size={18} />} />
            <AppSelect label="PAÍS DE ORIGEN" value={paisOrigen} options={PAISES} onChange={setPaisOrigen} />
          </View>

          <AppButton title="Enviar documentacion" icon="→" onPress={handleRegister} loading={loading} />

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <AppButton title="Inicia sesión" variant="outline" onPress={() => onNavigate('login')} />
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
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.dark,
    marginBottom: 24,
    lineHeight: 44,
    textShadowColor: 'rgba(15,23,42,0.18)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 1,
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 20,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, alignItems: 'center' },
  footerText: { color: Colors.gray, fontSize: 14 },
});
