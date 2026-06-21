import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_PC_IP = '192.168.1.11';
const DEFAULT_PORT = '8080';

function resolveHost(): string {
  const extra = Constants.expoConfig?.extra as { apiHost?: string; apiPort?: string } | undefined;
  const envHost = process.env.EXPO_PUBLIC_API_HOST;
  const envPort = process.env.EXPO_PUBLIC_API_PORT;

  const host = envHost || extra?.apiHost || DEFAULT_PC_IP;
  const port = envPort || extra?.apiPort || DEFAULT_PORT;

  if (Platform.OS === 'android') {
    const androidHost = envHost || extra?.apiHost || '10.0.2.2';
    return `http://${androidHost}:${port}`;
  }
  return `http://${host}:${port}`;
}

export const API_BASE = resolveHost();

export const WS_BASE = API_BASE.replace(/^http/, 'ws');

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

async function authHeaders(auth: boolean): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = await loadToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function apiPost<T>(path: string, body: unknown, auth = false): Promise<T> {
  const headers = await authHeaders(auth);
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

export async function apiGet<T>(path: string, auth = true): Promise<T> {
  const headers = await authHeaders(auth);
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }
  return res.json() as Promise<T>;
}

export async function apiPatch<T>(path: string, body: unknown, auth = true): Promise<T> {
  const headers = await authHeaders(auth);
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }
  const text = await res.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
}

export async function apiDelete(path: string, auth = true): Promise<void> {
  const headers = await authHeaders(auth);
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers });
  if (!res.ok) {
    throw new Error(await extractErrorMessage(res));
  }
}

async function extractErrorMessage(res: Response): Promise<string> {
  try {
    const json = await res.json();
    return json.message || json.error || `Error ${res.status}`;
  } catch {
    return `Error ${res.status}`;
  }
}
