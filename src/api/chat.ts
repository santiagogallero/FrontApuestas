import { apiGet, apiPost } from './client';

export interface ConversacionDto {
  id: number;
  duenioUsuarioId: number;
  duenioEmail: string;
  duenioNombre: string;
  empleadoUsuarioId: number | null;
  empleadoEmail: string | null;
  estado: string;
  createdAt: string;
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
  remitenteNombre: string;
  texto: string;
  enviadoAt: string;
}

export interface CrearConversacionResponse {
  conversacionId: number;
  estado: string;
}

export async function apiCrearConversacion(productoId?: number): Promise<CrearConversacionResponse> {
  const body = productoId != null ? { productoId } : {};
  return apiPost<CrearConversacionResponse>('/api/verificacion-chat/conversaciones', body, true);
}

export async function apiListarConversaciones(): Promise<ConversacionDto[]> {
  return apiGet<ConversacionDto[]>('/api/verificacion-chat/conversaciones');
}

export async function apiTomarConversacion(conversacionId: number): Promise<ConversacionDto> {
  return apiPost<ConversacionDto>(`/api/verificacion-chat/conversaciones/${conversacionId}/tomar`, {}, true);
}

export async function apiGetMensajes(conversacionId: number): Promise<MensajeChatDto[]> {
  return apiGet<MensajeChatDto[]>(`/api/verificacion-chat/conversaciones/${conversacionId}/mensajes`);
}

export async function apiEnviarMensaje(conversacionId: number, texto: string): Promise<MensajeChatDto> {
  return apiPost<MensajeChatDto>(`/api/verificacion-chat/conversaciones/${conversacionId}/mensajes`, { texto }, true);
}

export async function apiCerrarConversacion(conversacionId: number): Promise<ConversacionDto> {
  return apiPost<ConversacionDto>(`/api/verificacion-chat/conversaciones/${conversacionId}/cerrar`, {}, true);
}
