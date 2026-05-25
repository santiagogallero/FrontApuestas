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
