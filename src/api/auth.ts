import { apiPost, apiGet, saveToken } from './client';
import type {
  LoginResponse,
  CurrentUser,
  RegisterStage1Payload,
  RegisterStage2Payload,
} from '../types/auth';

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const data = await apiPost<LoginResponse>('/api/auth/login', { email, password }, false);
  await saveToken(data.token);
  return data;
}

export async function apiRegisterStage1(payload: RegisterStage1Payload): Promise<string> {
  return apiPost<string>('/api/auth/register/stage1', payload, false);
}

export async function apiRegisterStage2(payload: RegisterStage2Payload): Promise<string> {
  return apiPost<string>('/api/auth/register/stage2', payload, false);
}

export async function apiSendEmailCode(email: string): Promise<string> {
  return apiPost<string>('/api/auth/email/send-code', { email }, false);
}

export async function apiVerifyEmailCode(email: string, code: string): Promise<string> {
  return apiPost<string>('/api/auth/email/verify-code', { email, code }, false);
}

export async function apiGetMe(): Promise<CurrentUser> {
  return apiGet<CurrentUser>('/api/auth/me');
}

export async function apiRegisterPaymentMethods(
  mediosDePago: Array<{ tipo: string; aliasDescripcion: string; moneda: string; montoGarantia?: number }>
): Promise<string> {
  return apiPost<string>('/api/auth/payment-methods', { mediosPago: mediosDePago }, true);
}
