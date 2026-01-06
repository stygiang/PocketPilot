export const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

import { getAuthToken } from './auth';

export const apiFetch = async (
  path: string,
  token?: string | null,
  init?: RequestInit,
) => {
  const headers = new Headers(init?.headers || {});
  const resolvedToken = token ?? (await getAuthToken());
  if (resolvedToken) {
    headers.set('Authorization', `Bearer ${resolvedToken}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Request failed');
  }

  return res.json();
};
