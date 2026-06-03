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
import { AppHeader, AppButton, AppInput, CameraIcon, FileIcon, InfoIcon, ShieldIcon } from '../components';
import { Colors } from '../theme/colors';
import type { NavigateFn } from '../types/navigation';

interface Props {
  onNavigate: NavigateFn;
}

export function VerificarChequeScreen({ onNavigate }: Props) {
  const [paso, setPaso] = useState<1 | 2>(1);
  const [monto, setMonto] = useState('');
  const [numero, setNumero] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="Auction Pulse Pro" onBack={() => (paso === 2 ? setPaso(1) : onNavigate('agregarMetodoPago'))} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView style={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>Verificacion de Cheque {paso}/2</Text>

            {paso === 1 ? (
              <>
                <Text style={styles.subtitle}>
                  Sube una foto de tu cheque certificado para establecer tu límite de puja. Este paso garantiza la seguridad institucional y verifica tu liquidez para adquisiciones de alto valor.
                </Text>

                <View style={styles.upload}>
                  <View style={styles.uploadIcon}><CameraIcon size={22} color={Colors.primary} /></View>
                  <Text style={styles.uploadTitle}>Frente del cheque</Text>
                  <Text style={styles.uploadHint}>ASEGURA QUE LOS DATOS SEAN VISIBLES</Text>
                </View>
                <View style={styles.upload}>
                  <View style={styles.uploadIcon}><FileIcon size={22} color={Colors.primary} /></View>
                  <Text style={styles.uploadTitle}>Dorso del cheque</Text>
                  <Text style={styles.uploadHint}>ASEGURA QUE LOS DATOS SEAN VISIBLES</Text>
                </View>

                <AppButton title="Continuar" icon="→" onPress={() => setPaso(2)} />
              </>
            ) : (
              <>
                <View style={styles.infoCard}>
                  <InfoIcon size={20} color={Colors.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.infoTitle}>Capacidad Garantizada</Text>
                    <Text style={styles.infoText}>
                      Esta cantidad definirá su capacidad máxima de puja. Una vez verificada, su cuenta se habilitará para pujas de hasta 10 veces el valor de este cheque certificado.
                    </Text>
                  </View>
                </View>

                <AppInput label="CHECK AMOUNT (GUARANTEE)" placeholder="$ 0.00" value={monto} onChangeText={setMonto} keyboardType="numeric" />
                <AppInput label="CHECK NUMBER" placeholder="E.g. 1002345098" value={numero} onChangeText={setNumero} keyboardType="numeric" />

                <View style={styles.hintRow}>
                  <ShieldIcon size={14} color={Colors.gray2} />
                  <Text style={styles.hintText}>La verificación suele tardar entre 2 y 4 horas hábiles durante las sesiones de mercado.</Text>
                </View>

                <AppButton title="Submit for Verification" icon="→" onPress={() => { Alert.alert('Cheque', 'Enviado para verificación'); onNavigate('billetera'); }} />

                <View style={styles.footer}>
                  <View style={styles.footerLeft}>
                    <View style={styles.greenDot} />
                    <Text style={styles.footerText}>SECURE LINK ACTIVE</Text>
                  </View>
                  <Text style={styles.footerRef}>REF: CC-REG-0992</Text>
                </View>
              </>
            )}
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
  title: { fontSize: 24, fontWeight: '900', color: Colors.dark, marginBottom: 16 },
  subtitle: { fontSize: 14, color: Colors.gray, lineHeight: 22, marginBottom: 24 },
  upload: {
    backgroundColor: Colors.blueLight, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.gray3, borderStyle: 'dashed',
    paddingVertical: 24, alignItems: 'center', marginBottom: 16,
  },
  uploadIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  uploadTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark },
  uploadHint: { fontSize: 11, color: Colors.gray2, marginTop: 4, letterSpacing: 0.5 },
  infoCard: {
    flexDirection: 'row', backgroundColor: Colors.blueLight, borderRadius: 14, padding: 16,
    borderLeftWidth: 4, borderLeftColor: Colors.primary, marginBottom: 24,
  },
  infoTitle: { fontSize: 15, fontWeight: '800', color: Colors.dark, marginBottom: 4 },
  infoText: { fontSize: 14, color: Colors.primary, lineHeight: 21 },
  hintRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, marginTop: 4 },
  hintText: { flex: 1, marginLeft: 8, fontSize: 12, color: Colors.gray, lineHeight: 18 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  footerLeft: { flexDirection: 'row', alignItems: 'center' },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green, marginRight: 8 },
  footerText: { fontSize: 11, fontWeight: '700', color: Colors.gray, letterSpacing: 0.5 },
  footerRef: { fontSize: 11, fontWeight: '700', color: Colors.gray2, letterSpacing: 0.5 },
});
