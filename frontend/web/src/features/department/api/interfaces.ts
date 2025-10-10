export interface Department {
  id: string;
  name: string;
  code: string;
  school: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentRequest {
  name: string;
  code: string;
  years: number;
  school: string;
}
