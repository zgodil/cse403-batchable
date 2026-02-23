import type {HttpMethods} from 'msw';
import {apiFetch} from './fetch';
import {getToken} from './authToken';

export type Resource = `/${string}`;

export async function fetchEndpoint(
  method: `${HttpMethods}`,
  path: Resource,
  body?: unknown,
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = await getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await apiFetch(path, {
    body: body !== undefined ? JSON.stringify(body) : undefined,
    method,
    headers,
  });
  if (!response.ok) throw new Error(response.statusText);
  return response;
}

export async function fetchJSON(
  method: `${HttpMethods}`,
  path: Resource,
  body?: unknown,
) {
  return await (await fetchEndpoint(method, path, body)).json();
}
