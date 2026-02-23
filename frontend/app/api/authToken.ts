/**
 * Allows the API layer to attach the Auth0 access token to requests.
 * Set by a component that has access to useAuth0() (e.g. inside Auth0Provider).
 */
let tokenGetter: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  tokenGetter = fn;
}

export async function getToken(): Promise<string | null> {
  if (!tokenGetter) return null;
  try {
    return await tokenGetter();
  } catch {
    return null;
  }
}
