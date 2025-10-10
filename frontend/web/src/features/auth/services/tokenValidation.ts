import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

export function isExpired(access_token?: string): boolean {
  if (!access_token) return true;
  try {
    const decoded = jwtDecode<JwtPayload>(access_token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
