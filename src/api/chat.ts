import { apiGet, apiPost } from './client';

export interface ConversacionDto {
  id: number;
  duenioUsuarioId: number;
  empleadoUsuarioId: number | null;
  estado: string;
  updatedAt: string;
  productoId: number | null;
  productoTitulo: string | null;
  productoEstadoInspeccion: string | null;
  productoMotivoRechazo: string | null;
  primeraFotoBase64: string | null;
}

export interface MensajeChatDto {
  id: number;
  conversacionId: number;
  remitenteUsuarioId: number;
  remitenteEmail: string;
  texto: string;
  enviadoAt: string;
}

export async function apiGetConversacionPorProducto(productoId: number): Promise<ConversacionDto> {
  return apiGet<ConversacionDto>(`/api/verificacion-chat/productos/${productoId}/conversacion`);
}

export async function apiGetMensajes(conversacionId: number): Promise<MensajeChatDto[]> {
  return apiGet<MensajeChatDto[]>(`/api/verificacion-chat/conversaciones/${conversacionId}/mensajes`);
}

export async function apiEnviarMensaje(conversacionId: number, texto: string): Promise<MensajeChatDto> {
  return apiPost<MensajeChatDto>(`/api/verificacion-chat/conversaciones/${conversacionId}/mensajes`, { texto }, true);
}
