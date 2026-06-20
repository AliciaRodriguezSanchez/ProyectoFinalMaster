export function decodeJwtPayload<T>(token: string): T {
  const payload = token.split('.')[1];
  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(
    normalizedPayload.length + (4 - normalizedPayload.length % 4) % 4,
    '='
  );

  return JSON.parse(atob(paddedPayload)) as T;
}
