export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresInSeconds: number;
  roles: string[];
}

export interface CurrentUser {
  id: number;
  email: string;
  estado: string;
  personaId: number | null;
  roles: string[];
  categoria?: string | null;
  tieneMetodoPagoVerificado?: boolean;
  mustChangePassword?: boolean;
}

export interface RegisterStage1Payload {
  email: string;
  password: string;
  documento: string;
  nombre: string;
  domicilioLegal: string;
  paisOrigen: string;
}

export interface RegisterStage2Payload {
  email: string;
  numeroTramite: string;
  docFrenteUrl: string;
  docDorsoUrl: string;
}

export interface RegistrationStatus {
  email: string;
  usuarioEstado: string;
  etapa: string;
  requiereVerificacionEmail: boolean;
  puedeCompletarDocumentacion: boolean;
}
