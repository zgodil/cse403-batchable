import type {HttpMethods} from 'msw';
import {apiFetch} from './fetch';
import {getToken} from './auth_token';

export type Resource = `/${string}`;

export async function fetchEndpoint(
  method: `${HttpMethods}`,
  path: Resource,
  body?: unknown,
  options: {includeAuth?: boolean} = {},
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const includeAuth = options.includeAuth ?? true;
  if (includeAuth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  const response = await apiFetch(path, {
    body: body !== undefined ? JSON.stringify(body) : undefined,
    method,
    headers,
  });
  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(
      `[${method} ${path}] ${response.status} (${response.statusText}): ${bodyText}`,
    );
  }
  return response;
}

export async function fetchJSON(
  method: `${HttpMethods}`,
  path: Resource,
  body?: unknown,
  options: {includeAuth?: boolean} = {},
) {
  return await (await fetchEndpoint(method, path, body, options)).json();
}
