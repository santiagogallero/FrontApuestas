import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  Image, SafeAreaView, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { AppHeader, MicIcon, SendIcon } from '../components';
import { Colors } from '../theme/colors';
import {
  apiGetConversacionPorProducto,
  apiGetMensajes,
  apiEnviarMensaje,
  type ConversacionDto,
  type MensajeChatDto,
} from '../api';
import { useAuthContext } from '../context/AuthContext';
import type { NavigateFn, ScreenParams } from '../types/navigation';

interface ChatSoporteScreenProps {
  onNavigate: NavigateFn;
  params: ScreenParams['chatSoporte'];
}

const ESTADO_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  PENDIENTE:  { label: 'EN INSPECCIÓN',      color: Colors.orange, bg: Colors.blueLight },
  APROBADO:   { label: 'APROBADO',           color: Colors.green,  bg: Colors.greenLight },
  RECHAZADO:  { label: 'INSPECCIÓN RECHAZADA', color: Colors.red,  bg: Colors.redLight },
};

export function ChatSoporteScreen({ onNavigate, params }: ChatSoporteScreenProps) {
  const { currentUser } = useAuthContext();
  const [conversacion, setConversacion] = useState<ConversacionDto | null>(null);
  const [mensajes, setMensajes] = useState<MensajeChatDto[]>([]);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const cargar = useCallback(async () => {
    try {
      const conv = await apiGetConversacionPorProducto(params.productoId);
      setConversacion(conv);
      const msgs = await apiGetMensajes(conv.id);
      setMensajes(msgs);
    } catch (e) {
      // silent
    } finally {
      setLoading(false);
    }
  }, [params.productoId]);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    if (mensajes.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [mensajes]);

  const enviar = async () => {
    if (!texto.trim() || !conversacion || enviando) return;
    setEnviando(true);
    try {
      const nuevo = await apiEnviarMensaje(conversacion.id, texto.trim());
      setMensajes((prev) => [...prev, nuevo]);
      setTexto('');
    } catch {
      // silent
    } finally {
      setEnviando(false);
    }
  };

  const badge = ESTADO_BADGE[conversacion?.productoEstadoInspeccion ?? ''] ?? ESTADO_BADGE.PENDIENTE;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Soporte"
        onBack={() => onNavigate('misProductos')}
      />
      <View style={styles.subtitleRow}>
        <View style={styles.statusDot} />
        <Text style={styles.subtitleText}>UNIDAD DE AUTENTICACIÓN</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              {/* Producto card */}
              <View style={{ alignItems: 'center', marginBottom: 20 }}>
                {conversacion?.primeraFotoBase64 ? (
                  <Image source={{ uri: conversacion.primeraFotoBase64 }} style={styles.productoImg} />
                ) : (
                  <View style={[styles.productoImg, { backgroundColor: Colors.gray4, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: Colors.gray, fontSize: 12 }}>Sin foto</Text>
                  </View>
                )}
                <Text style={styles.productoTitulo}>{conversacion?.productoTitulo ?? '—'}</Text>
                <View style={[styles.badge, { backgroundColor: badge.bg, marginTop: 8 }]}>
                  <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                </View>
              </View>

              {/* Mensajes */}
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
                        SOPORTE  {new Date(m.enviadoAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    )}
                    <View style={[styles.bubble, esPropio ? styles.bubblePropio : styles.bubbleAjeno]}>
                      <Text style={{ color: esPropio ? Colors.white : Colors.dark, fontSize: 14, lineHeight: 20 }}>
                        {m.texto}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>

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
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  subtitleRow:  { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 8 },
  subtitleText: { color: Colors.gray, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  statusDot:    { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.green, marginRight: 8 },
  scroll:       { flex: 1 },
  content:      { paddingHorizontal: 20, paddingVertical: 20 },
  productoImg:  { width: 140, height: 100, borderRadius: 12 },
  productoTitulo: { fontSize: 18, fontWeight: '700', color: Colors.dark, marginTop: 10, textAlign: 'center' },
  badge:        { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  badgeText:    { fontSize: 11, fontWeight: '700' },
  senderLabel:  { color: Colors.primary, fontSize: 11, fontWeight: '700', marginTop: 8, marginBottom: 2 },
  bubble:       { maxWidth: '80%', borderRadius: 18, padding: 14, marginBottom: 8 },
  bubbleAjeno:  { alignSelf: 'flex-start', backgroundColor: Colors.gray4 },
  bubblePropio: { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  inputBar:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: 12 },
  input:        { flex: 1, height: 44, backgroundColor: Colors.gray4, borderRadius: 22, paddingHorizontal: 16, fontSize: 15, color: Colors.dark, marginRight: 8 },
  sendBtn:      { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
});
