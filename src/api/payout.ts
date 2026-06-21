import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { CuentaCobro, CuentaCobroRequest } from '../types/cuenta';

export async function apiGetPayoutAccounts(): Promise<CuentaCobro[]> {
  return apiGet<CuentaCobro[]>('/api/payout-accounts');
}

export async function apiCreatePayoutAccount(body: CuentaCobroRequest): Promise<CuentaCobro> {
  return apiPost<CuentaCobro>('/api/payout-accounts', body, true);
}

export async function apiUpdatePayoutAccount(id: number, body: CuentaCobroRequest): Promise<CuentaCobro> {
  return apiPatch<CuentaCobro>(`/api/payout-accounts/${id}`, body, true);
}

export async function apiDeletePayoutAccount(id: number): Promise<void> {
  return apiDelete(`/api/payout-accounts/${id}`, true);
}
