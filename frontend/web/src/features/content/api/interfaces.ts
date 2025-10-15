import type { User } from '@/features/auth';

export type ContentType = 'LECTURE' | 'ASSIGNMENT' | 'LAB' | 'TUTORIAL';

export interface ContentFile {
  extension: string;
  size: number;
  unit: string;
}

export interface Content {
  id: string;
  course: string;
  title: string;
  type: ContentType;
  path: string;
  chapter?: string | null;
  file: ContentFile;
  tags: string[];
  uploaded_by: Partial<User>;
  created_at: string;
  updated_at: string;
}
