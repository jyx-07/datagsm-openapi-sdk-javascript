import type { ApiResponse, ClubSummary, Major, Sex, SortDirection } from './index';

export type Role =
  | 'STUDENT_COUNCIL'
  | 'DORMITORY_MANAGER'
  | 'GENERAL_STUDENT'
  | 'GRADUATE'
  | 'WITHDRAWN';
export type SortBy =
  | 'ID'
  | 'NAME'
  | 'EMAIL'
  | 'STUDENT_NUMBER'
  | 'GRADE'
  | 'CLASS_NUM'
  | 'NUMBER'
  | 'MAJOR'
  | 'ROLE'
  | 'SEX'
  | 'DORMITORY_ROOM';

export interface Student {
  id: number;
  name: string;
  sex: Sex;
  email: string;
  grade: number | null;
  classNum: number | null;
  number: number | null;
  studentNumber: number | null;
  major: Major | null;
  specialty: string | null;
  role: Role;
  dormitoryFloor: number | null;
  dormitoryRoom: number | null;
  majorClub: ClubSummary | null;
  autonomousClub: ClubSummary | null;
  githubId: string | null;
  githubUrl: string | null;
}

export interface GetStudentsRequest {
  studentId?: number;
  name?: string;
  email?: string;
  grade?: number;
  classNum?: number;
  number?: number;
  sex?: Sex;
  role?: Role;
  dormitoryRoom?: number;
  specialty?: string;
  major?: Major;
  githubId?: string;
  includeGraduates?: boolean;
  includeWithdrawn?: boolean;
  onlyEnrolled?: boolean;
  page?: number;
  size?: number;
  sortBy?: SortBy;
  sortDirection?: SortDirection;
}

export type GetStudentsResponse = ApiResponse<{
  totalPages: number;
  totalElements: number;
  students: Student[];
}>;
