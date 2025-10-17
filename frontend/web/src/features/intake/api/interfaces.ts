export type IntakeType =
  | 'ACCESS'
  | 'ROLE_CHANGE'
  | 'DATA_UPDATE'
  | 'COURSE_ASSIGNMENT'
  | 'COMPLAIN'
  | 'FEEDBACK'
  | 'LEAVE'
  | 'GRADE_REVIEW'
  | 'OTHER';

export type IntakeStatus = 'PENDING' | 'REJECTED' | 'APPROVED';

export interface Intake {
  id: string;
  user: string;
  subject: string;
  course?: string | null;
  content?: string | null;
  type: IntakeType;
  status: IntakeStatus;
  created_at: string;
  updated_at: string;
  full_name?: string | null;
  phone_number?: string | null;
  staff_id?: string | null;
  student_id?: string | null;
  department?: string | null;
  description?: string | null;
}
