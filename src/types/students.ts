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

/** 수정 API에서 지정할 수 있는 역할입니다. 졸업생/자퇴생으로의 변경은 서버가 400으로 거절합니다. */
export type EnrolledRole = Exclude<Role, 'GRADUATE' | 'WITHDRAWN'>;

/**
 * 학생 생성 요청 (POST /v1/students)
 *
 * - 재학생(`GRADUATE`, `WITHDRAWN` 이외)은 `grade`, `classNum`, `number`가 필수입니다.
 * - 졸업생은 학번, 기숙사, 동아리 정보를 가질 수 없습니다.
 * - 자퇴생은 기숙사, 동아리 정보를 가질 수 없습니다.
 * - 학과(major)는 서버가 반(classNum)으로 결정합니다.
 */
export interface CreateStudentRequest {
  /** 최대 30자 */
  name: string;
  sex: Sex;
  /** 최대 50자 */
  email: string;
  /** 1~3 */
  grade?: number | null;
  /** 1~4 */
  classNum?: number | null;
  /** 1~18 */
  number?: number | null;
  /** 생략하면 `GENERAL_STUDENT` */
  role?: Role;
  /** 기숙사 호실 (201~518) */
  dormitoryRoomNumber?: number | null;
  majorClubId?: number | null;
  autonomousClubId?: number | null;
  /** 전공, 최대 50자 */
  specialty?: string | null;
}

/**
 * 학생 정보 수정 요청 (PUT /v1/students/{studentId})
 *
 * 전체 교체 방식이므로 생략한 선택 필드는 null로 초기화됩니다.
 * 졸업생이나 자퇴생은 이 API로 수정할 수 없습니다.
 */
export interface UpdateStudentRequest {
  /** 최대 30자 */
  name: string;
  sex: Sex;
  /** 최대 50자 */
  email: string;
  /** 1~3 */
  grade: number;
  /** 1~4 */
  classNum: number;
  /** 1~18 */
  number: number;
  role: EnrolledRole;
  /** 기숙사 호실 (201~518) */
  dormitoryRoomNumber?: number | null;
  majorClubId?: number | null;
  autonomousClubId?: number | null;
  /** 전공, 최대 50자 */
  specialty?: string | null;
  /** GitHub 아이디, 최대 39자 */
  githubId?: string | null;
}

export type StudentResponse = ApiResponse<Student>;
