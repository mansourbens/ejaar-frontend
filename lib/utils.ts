import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchWithToken(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('ejaar_token') : null;

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}
 export function rolePipe(role: UserRole) {
  switch(role) {
    case UserRole.SUPER_ADMIN :
      return 'Super admin';
    case UserRole.SUPPLIER_SUPER_ADMIN:
      return 'Fournisseur super admin';
    case UserRole.SUPPLIER_ADMIN:
      return 'Fournisseur admin';
    case UserRole.CLIENT:
      return 'Client';
    default:
      return 'Utilisateur';
  }
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPPLIER_SUPER_ADMIN = 'SUPPLIER_SUPER_ADMIN',
  SUPPLIER_ADMIN = 'SUPPLIER_ADMIN',
  CLIENT = 'CLIENT'
}
// utils/date-utils.ts

export const formatRelativeTime = (date: Date | null | undefined): {
  relativeTime: string;
  fullDate: string;
} => {
  if (!date) {
    return {
      relativeTime: '—',
      fullDate: 'Date inconnue'
    };
  }

  const now = new Date();
  const pastDate = new Date(date);
  const seconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  // Format full French date for tooltip
  const fullDate = pastDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Calculate relative time
  let relativeTime: string;
  if (seconds < 60) {
    relativeTime = `il y a ${seconds} seconde${seconds !== 1 ? 's' : ''}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    relativeTime = `il y a ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    relativeTime = `il y a ${hours} heure${hours !== 1 ? 's' : ''}`;
  } else if (seconds < 2592000) {
    const days = Math.floor(seconds / 86400);
    relativeTime = `il y a ${days} jour${days !== 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(seconds / 2592000);
    relativeTime = `il y a ${months} mois`;
  }

  return { relativeTime, fullDate };
};
