import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// El backend corre en la PC (localhost:8080). Desde el emulador de Android,
// "localhost" es el propio emulador, no la PC: hay que usar la IP especial 10.0.2.2.
// En web/iOS-simulador, localhost sí apunta a la PC.
export const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

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
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
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
    const text = await res.text();
    throw new Error(text || `Error ${res.status}`);
  }
  return res.json() as Promise<T>;
}
