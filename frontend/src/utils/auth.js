import { jwtDecode } from 'jwt-decode';

export function getToken(role) {
  if (role === 'admin') return localStorage.getItem('adminToken');
  if (role === 'ngo') return localStorage.getItem('ngoToken');
  if (role === 'resort') return localStorage.getItem('resortToken');
  return null;
}

export function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export function isTokenValid(token, expectedRole) {
  if (!token) return false;
  const decoded = decodeToken(token);
  if (!decoded) return false;
  if (expectedRole && decoded.role && decoded.role !== expectedRole) return false;
  if (decoded.exp && Date.now() >= decoded.exp * 1000) return false;
  return true;
}

export function logoutAll() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('ngoToken');
  localStorage.removeItem('resortToken');
  localStorage.removeItem('adminId');
  localStorage.removeItem('ngoId');
  localStorage.removeItem('resortId');
  localStorage.removeItem('adminName');
  localStorage.removeItem('ngoName');
  localStorage.removeItem('resortName');
} 