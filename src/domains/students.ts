import { HttpClient } from '../http/client';
import { toPathId } from '../http/path';
import {
  CreateStudentRequest,
  GetStudentsRequest,
  GetStudentsResponse,
  StudentResponse,
  UpdateStudentRequest,
} from '../types/students';

const BASE_PATH = '/v1/students';

export class StudentsApi {
  constructor(private readonly httpClient: HttpClient) {}

  async getStudents(request: GetStudentsRequest = {}): Promise<GetStudentsResponse> {
    return this.httpClient.get<GetStudentsResponse>(BASE_PATH, {
      studentId: request.studentId,
      name: request.name,
      email: request.email,
      grade: request.grade,
      classNum: request.classNum,
      number: request.number,
      sex: request.sex,
      role: request.role,
      dormitoryRoom: request.dormitoryRoom,
      specialty: request.specialty,
      major: request.major,
      githubId: request.githubId,
      includeGraduates: request.includeGraduates,
      includeWithdrawn: request.includeWithdrawn,
      onlyEnrolled: request.onlyEnrolled,
      page: request.page,
      size: request.size,
      sortBy: request.sortBy,
      sortDirection: request.sortDirection,
    });
  }

  /** 학생을 생성합니다. 이메일이나 학번이 중복되면 `ConflictError`가 발생합니다. 필요 스코프: STUDENT_WRITE */
  async createStudent(request: CreateStudentRequest): Promise<StudentResponse> {
    return this.httpClient.post<StudentResponse>(BASE_PATH, request);
  }

  /** 학생 정보를 전체 교체합니다. 필요 스코프: STUDENT_WRITE */
  async updateStudent(studentId: number, request: UpdateStudentRequest): Promise<StudentResponse> {
    return this.httpClient.put<StudentResponse>(`${BASE_PATH}/${toPathId(studentId)}`, request);
  }
}
