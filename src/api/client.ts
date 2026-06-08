import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// IP de la PC en la red local. En Android emulador se usa la IP especial 10.0.2.2.
// En dispositivo físico (iOS o Android real) hay que usar la IP de la PC en la red.
const PC_IP = '192.168.1.11';
export const API_BASE = Platform.OS === 'android' ? `http://10.0.2.2:8080` : `http://${PC_IP}:8080`;

const TOKEN_KEY = 'auth_token';

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function loadToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

async function authHeaders(): Promise<Record<string, string>> {
  const base: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = await loadToken();
  if (token) base['Authorization'] = `Bearer ${token}`;
  return base;
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  auth = false
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = await loadToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }
  const text = await res.text();
  if (!text) return null as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await authHeaders();
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }
  return res.json() as Promise<T>;
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const json = await res.json();
    return json.message || json.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}
