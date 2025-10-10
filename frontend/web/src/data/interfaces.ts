import type { Role } from '@/features/auth/api/interfaces';
import type { ReactNode } from 'react';

export type Tag = { label: string; explanation: string };

export interface Nav {
  id: string;
  path: string;
  label: string;
  icon: ReactNode;
  tag: Tag | null;
  hotKey: string | null;
  roles: Role[];
}
