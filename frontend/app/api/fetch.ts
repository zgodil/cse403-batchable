/** A simple wrapper around `window.fetch`. Exists to be mocked. */
export const apiFetch = (url: string, init: RequestInit) =>
  window.fetch(url, init);
