import type {HttpMethods} from 'msw';
import {apiFetch} from './fetch';
import {getToken} from './auth_token';

export type Resource = `/${string}`;

/**
 * Sends a request to a given endpoint, but doesn't try to parse the response body.
 * @throws If the request has a non-`ok` response code.
 * @param method The HTTP method for the request
 * @param path The path (starting with a /) of the request
 * @param body The body for the request, or undefined for none
 * @param options Configuration options
 * @returns The response object from the request, with the body unawaited
 */
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

/**
 * Exactly like {@link fetchEndpoint}, but it awaits the resulting response's body and parses it as JSON.
 * @throws If the body is not valid JSON, or if the request fails
 */
export async function fetchJSON(
  method: `${HttpMethods}`,
  path: Resource,
  body?: unknown,
  options: {includeAuth?: boolean} = {},
) {
  return await (await fetchEndpoint(method, path, body, options)).json();
}
