export interface School {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSchoolRequest {
  name: string;
}
