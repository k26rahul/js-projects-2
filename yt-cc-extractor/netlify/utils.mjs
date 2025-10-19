// utils.mjs

import statuses from 'statuses';

// Infer default HTTP message from status code.
export function inferHttpMessage(code) {
  return statuses.message[code] || 'Unknown Status';
}

// Detect Netlify local dev.
export function isLocal() {
  return process.env.NETLIFY_DEV === 'true';
}

// Build consistent JSON responses.
export function jsonResponse({ code, message, data = null, headers = {} }) {
  const resolvedMessage = message || inferHttpMessage(code);
  const status = code >= 200 && code < 300 ? 'success' : 'error';

  const body = { status, code, message: resolvedMessage };
  if (data !== null) body.data = data;

  const mergedHeaders = { 'Content-Type': 'application/json', ...headers };
  const json = isLocal() ? JSON.stringify(body, null, 2) : JSON.stringify(body);
  return new Response(json, { status: code, headers: mergedHeaders });
}

// Check allowed HTTP methods.
export function isAllowedMethod(method, allowedMethods) {
  return allowedMethods.includes(method);
}

// Check allowed origins.
export function isAllowedOrigin(origin, allowedOrigins) {
  return isLocal() || allowedOrigins.includes(origin);
}

// Verify API key.
export function authorizeRequest(providedApiKey, expectedApiKey) {
  if (isLocal()) return true;
  return Boolean(providedApiKey && expectedApiKey && providedApiKey === expectedApiKey);
}

// Build standard CORS headers.
export function buildCorsHeaders(origin, allowedMethods) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': allowedMethods.join(', '),
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
