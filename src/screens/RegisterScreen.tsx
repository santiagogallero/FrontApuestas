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
import { AppButton, AppInput, Logo } from '../components';
import { apiRegisterStage1 } from '../api';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

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
  const [paisOrigen, setPaisOrigen] = useState('');
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
          <Text style={[styles.title, { fontSize: 32 }]}>Registro 1/2</Text>
          <Text style={styles.subtitle}>Auction Pulse Pro.</Text>

          <AppInput label="NOMBRE" placeholder="Ej. Alejandro" value={firstName} onChangeText={setFirstName} />
          <AppInput label="APELLIDO" placeholder="Ej. Rossi" value={lastName} onChangeText={setLastName} />
          <AppInput label="CORREO ELECTRÓNICO" placeholder="tu@correo.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <AppInput label="CONTRASEÑA" placeholder="••••••••" value={password} onChangeText={setPassword} secure />
          <AppInput label="CONFIRMAR CONTRASEÑA" placeholder="••••••••" value={confirmPassword} onChangeText={setConfirmPassword} secure />
          <AppInput label="DOCUMENTO (DNI / PASAPORTE)" placeholder="Ej. 12345678" value={documento} onChangeText={setDocumento} keyboardType="numeric" />
          <AppInput label="DOMICILIO LEGAL" placeholder="Calle 123, Ciudad" value={domicilioLegal} onChangeText={setDomicilioLegal} />
          <AppInput label="PAÍS DE ORIGEN" placeholder="Ej. Argentina" value={paisOrigen} onChangeText={setPaisOrigen} />

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
  title: { fontSize: 36, fontWeight: 'bold', color: Colors.dark, marginBottom: 8 },
  subtitle: { fontSize: 15, color: Colors.gray, marginBottom: 28, lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, alignItems: 'center' },
  footerText: { color: Colors.gray, fontSize: 14 },
});
