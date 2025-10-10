export type Role = 'STUDENT' | 'ADMIN' | 'MODERATOR' | 'LECTURER';

export interface UserMetadata {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | UserMetadata
    | Array<string | number | boolean | null | UserMetadata>;
}

export interface User {
  id: string;
  username?: string | null;
  first_name: string;
  last_name: string;
  email: string | null;
  avatar?: string | null;
  metadata?: UserMetadata | null;
  provider?: string | null;
  provider_id?: string | null;
  role: Role;
  user_id: string | null;
  is_active: boolean;
  is_verified: boolean;
  department: string | null;
  year: number | null;
  semester: number | null;
  date_joined?: string;
  updated_at?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
