type Role = 'STUDENT' | 'ADMIN' | 'MODERATOR';

export interface User {
  id: string;
  username?: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  provider?: string | null;
  provider_id?: string | null;
  role: Role;
  is_active: boolean;
  department_id: string | null;
  year: number | null;
  semester: number | null;
  date_joined?: string;
  updated_at?: string;
}
