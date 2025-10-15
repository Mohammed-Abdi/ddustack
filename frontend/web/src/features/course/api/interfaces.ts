export type CourseStatus = 'COMPULSORY' | 'SUPPORTIVE' | 'COMMON' | 'ELECTIVE';

export interface Course {
  id: string;
  code: string;
  name: string;
  abbreviation: string;
  description?: string | null;
  status: CourseStatus;
  credit_points?: number | null;
  lecture_hours?: number | null;
  lab_hours?: number | null;
  tutorial_hours?: number | null;
  homework_hours?: number | null;
  credit_hours?: number | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CourseOffering {
  id: string;
  course: string;
  department: string;
  year: number;
  semester: number;
  created_at: string;
  updated_at: string;
}

export interface CourseAssignment {
  id: string;
  user: string;
  course: string;
  created_at: string;
  updated_at: string;
}

export interface SavedCourse {
  id: string;
  user: string;
  course: string;
  saved_at: string;
}
