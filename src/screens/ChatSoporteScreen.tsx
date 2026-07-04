import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  SafeAreaView, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { AppHeader, SendIcon } from '../components';
import { Colors } from '../theme/colors';
import {
  apiGetMensajes,
  apiEnviarMensaje,
  apiCerrarConversacion,
  type MensajeChatDto,
} from '../api';
import { useAuthContext } from '../context/AuthContext';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface ChatSoporteScreenProps {
  onNavigate: NavigateFn;
  params: ScreenParams['chatSoporte'];
}

const ESTADO_COLOR: Record<string, { color: string; bg: string }> = {
  PENDIENTE:  { color: Colors.orange, bg: Colors.orangeLight },
  APROBADO:   { color: Colors.green,  bg: Colors.greenLight },
  RECHAZADO:  { color: Colors.red,    bg: Colors.redLight },
};

export function ChatSoporteScreen({ onNavigate, params }: ChatSoporteScreenProps) {
  const { currentUser } = useAuthContext();
  const [mensajes, setMensajes] = useState<MensajeChatDto[]>([]);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const [cerrada, setCerrada] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const isAdmin = currentUser?.roles?.includes('ADMIN') || currentUser?.roles?.includes('EMPLEADO');

  const cargar = useCallback(async () => {
    try {
      const msgs = await apiGetMensajes(params.conversacionId);
      setMensajes(msgs);
    } catch {
      // silent poll
    } finally {
      setLoading(false);
    }
  }, [params.conversacionId]);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    const interval = setInterval(cargar, 5000);
    return () => clearInterval(interval);
  }, [cargar]);

  useEffect(() => {
    if (mensajes.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [mensajes]);

  const enviar = async () => {
    if (!texto.trim() || enviando || cerrada) return;
    setEnviando(true);
    try {
      const nuevo = await apiEnviarMensaje(params.conversacionId, texto.trim());
      setMensajes((prev) => [...prev, nuevo]);
      setTexto('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e: any) {
      Alert.alert('Error al enviar', e?.message ?? 'No se pudo enviar el mensaje');
    } finally {
      setEnviando(false);
    }
  };

  const cerrar = () => {
    Alert.alert(
      'Cerrar consulta',
      '¿Estás seguro? Se enviará un mensaje automático al dueño y no podrán seguir escribiendo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar consulta',
          style: 'destructive',
          onPress: async () => {
            setCerrando(true);
            try {
              await apiCerrarConversacion(params.conversacionId);
              setCerrada(true);
              await cargar();
            } catch (e: any) {
              Alert.alert('Error', e?.message ?? 'No se pudo cerrar la consulta');
            } finally {
              setCerrando(false);
            }
          },
        },
      ],
    );
  };

  const estadoProd = params.productoEstado;
  const estadoColors = estadoProd ? (ESTADO_COLOR[estadoProd] ?? { color: Colors.gray, bg: Colors.gray4 }) : null;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={params.titulo ?? 'Chat'}
        onBack={() => onNavigate(isAdmin ? 'adminChats' : 'misProductos')}
        right={
          isAdmin && !cerrada ? (
            cerrando ? (
              <ActivityIndicator size="small" color={Colors.red} />
            ) : (
              <TouchableOpacity style={styles.cerrarBtn} onPress={cerrar}>
                <Text style={styles.cerrarBtnText}>Cerrar</Text>
              </TouchableOpacity>
            )
          ) : undefined
        }
      />

      {/* Banner del producto */}
      {params.productoId != null && (
        <TouchableOpacity
          style={styles.productBanner}
          activeOpacity={0.75}
          onPress={() => {
            const chatParams = {
              conversacionId: params.conversacionId,
              titulo: params.titulo,
              productoId: params.productoId,
              productoTitulo: params.productoTitulo,
              productoEstado: params.productoEstado,
              productoMotivo: params.productoMotivo,
            };
            if (isAdmin) {
              onNavigate('inspeccion', { backTo: 'chatSoporte', chatParams });
            } else {
              onNavigate('misProductos', { backTo: 'chatSoporte', chatParams });
            }
          }}
        >
          <View style={styles.productBannerLeft}>
            <Text style={styles.productBannerLabel}>PRODUCTO VINCULADO</Text>
            <Text style={styles.productBannerTitle} numberOfLines={1}>
              {params.productoTitulo ?? `Producto #${params.productoId}`}
            </Text>
            {params.productoMotivo ? (
              <Text style={styles.productBannerMotivo} numberOfLines={1}>
                Motivo: {params.productoMotivo}
              </Text>
            ) : null}
          </View>
          {estadoColors && estadoProd ? (
            <View style={[styles.estadoBadge, { backgroundColor: estadoColors.bg }]}>
              <Text style={[styles.estadoBadgeText, { color: estadoColors.color }]}>{estadoProd}</Text>
            </View>
          ) : null}
          <Text style={styles.productBannerArrow}>›</Text>
        </TouchableOpacity>
      )}

      {cerrada && (
        <View style={styles.cerradaBanner}>
          <Text style={styles.cerradaText}>Esta consulta está cerrada</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {mensajes.length === 0 && (
                <Text style={{ color: Colors.gray, textAlign: 'center', fontSize: 13, marginTop: 16 }}>
                  Aún no hay mensajes. Escribí para iniciar la conversación.
                </Text>
              )}
              {mensajes.map((m) => {
                const esPropio = m.remitenteEmail === currentUser?.email;
                return (
                  <View key={m.id}>
                    {!esPropio && (
                      <Text style={styles.senderLabel}>
                        {m.remitenteNombre ?? m.remitenteEmail}{'  '}
                        {new Date(m.enviadoAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    )}
                    <View style={[styles.bubble, esPropio ? styles.bubblePropio : styles.bubbleAjeno]}>
                      <Text style={{ color: esPropio ? Colors.white : Colors.dark, fontSize: 14, lineHeight: 20 }}>
                        {m.texto}
                      </Text>
                    </View>
                    {esPropio && (
                      <Text style={[styles.senderLabel, { textAlign: 'right', marginTop: 2, marginBottom: 4 }]}>
                        {new Date(m.enviadoAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>

          {!cerrada && (
            <View style={styles.inputBar}>
              <TextInput
                style={styles.input}
                placeholder="Escribe tu mensaje aquí..."
                placeholderTextColor={Colors.gray2}
                value={texto}
                onChangeText={setTexto}
                onSubmitEditing={enviar}
                returnKeyType="send"
              />
              <TouchableOpacity style={styles.sendBtn} onPress={enviar} disabled={enviando}>
                {enviando
                  ? <ActivityIndicator size="small" color={Colors.white} />
                  : <SendIcon size={18} color={Colors.white} />}
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1, backgroundColor: Colors.bg },
  cerrarBtn:           { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: Colors.redLight },
  cerrarBtnText:       { color: Colors.red, fontWeight: '800', fontSize: 13 },
  productBanner:       {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.white, marginHorizontal: 16, marginTop: 8, marginBottom: 4,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  productBannerLeft:   { flex: 1 },
  productBannerLabel:  { fontSize: 10, fontWeight: '800', color: Colors.gray, letterSpacing: 0.5, marginBottom: 2 },
  productBannerTitle:  { fontSize: 14, fontWeight: '700', color: Colors.dark },
  productBannerMotivo: { fontSize: 11, color: Colors.red, marginTop: 2 },
  productBannerArrow:  { fontSize: 20, color: Colors.gray2, marginLeft: 8 },
  estadoBadge:         { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginLeft: 8 },
  estadoBadgeText:     { fontSize: 11, fontWeight: '800' },
  cerradaBanner:       { backgroundColor: Colors.gray4, marginHorizontal: 16, marginVertical: 4, borderRadius: 10, padding: 10, alignItems: 'center' },
  cerradaText:         { color: Colors.gray, fontSize: 13, fontWeight: '600' },
  scroll:              { flex: 1 },
  content:             { paddingHorizontal: 20, paddingVertical: 20 },
  senderLabel:         { color: Colors.primary, fontSize: 11, fontWeight: '700', marginTop: 8, marginBottom: 2 },
  bubble:              { maxWidth: '80%', borderRadius: 18, padding: 14, marginBottom: 4 },
  bubbleAjeno:         { alignSelf: 'flex-start', backgroundColor: Colors.gray4 },
  bubblePropio:        { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  inputBar:            { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 12 },
  input:               { flex: 1, height: 44, backgroundColor: Colors.gray4, borderRadius: 22, paddingHorizontal: 16, fontSize: 15, color: Colors.dark, marginRight: 8 },
  sendBtn:             { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});
