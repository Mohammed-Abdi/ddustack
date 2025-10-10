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
  user_id: string;
  type: IntakeType;
  status: IntakeStatus;
  created_at: string;
  updated_at: string;
  full_name?: string | null;
  phone_number?: string | null;
  staff_id?: string | null;
  student_id?: string | null;
  department_id?: string | null;
  description?: string | null;
}
