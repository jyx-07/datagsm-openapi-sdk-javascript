import { HttpClient } from '../http/client';
import { toPathId } from '../http/path';
import {
  CreateProjectRequest,
  EndProjectRequest,
  GetProjectsRequest,
  GetProjectsResponse,
  ProjectResponse,
  UpdateProjectRequest,
} from '../types/projects';

const BASE_PATH = '/v1/projects';

export class ProjectsApi {
  constructor(private readonly httpClient: HttpClient) {}

  /** 프로젝트를 조회합니다. `status`를 생략하면 운영 중(`ACTIVE`)인 프로젝트만 조회됩니다. */
  async getProjects(request: GetProjectsRequest = {}): Promise<GetProjectsResponse> {
    return this.httpClient.get<GetProjectsResponse>(BASE_PATH, {
      projectId: request.projectId,
      projectName: request.projectName,
      clubId: request.clubId,
      status: request.status,
      category: request.category,
      page: request.page,
      size: request.size,
      sortBy: request.sortBy,
      sortDirection: request.sortDirection,
    });
  }

  /** 프로젝트를 생성합니다. 이름이 중복되면 `ConflictError`가 발생합니다. 필요 스코프: PROJECT_WRITE */
  async createProject(request: CreateProjectRequest): Promise<ProjectResponse> {
    return this.httpClient.post<ProjectResponse>(BASE_PATH, request);
  }

  /** 프로젝트 정보를 수정합니다. 상태는 바뀌지 않습니다. 필요 스코프: PROJECT_WRITE */
  async updateProject(projectId: number, request: UpdateProjectRequest): Promise<ProjectResponse> {
    return this.httpClient.put<ProjectResponse>(`${BASE_PATH}/${toPathId(projectId)}`, request);
  }

  /** 프로젝트를 삭제합니다. 응답 본문은 없습니다. 필요 스코프: PROJECT_WRITE */
  async deleteProject(projectId: number): Promise<void> {
    await this.httpClient.requestVoid({
      method: 'DELETE',
      path: `${BASE_PATH}/${toPathId(projectId)}`,
    });
  }

  /** 운영 중인 프로젝트를 종료(`ENDED`) 처리합니다. 응답 본문은 없습니다. 필요 스코프: PROJECT_WRITE */
  async endProject(projectId: number, request: EndProjectRequest): Promise<void> {
    await this.httpClient.requestVoid({
      method: 'POST',
      path: `${BASE_PATH}/${toPathId(projectId)}/end`,
      body: request,
    });
  }

  /** 종료된 프로젝트를 다시 운영 중(`ACTIVE`)으로 변경합니다. 응답 본문은 없습니다. 필요 스코프: PROJECT_WRITE */
  async reactivateProject(projectId: number): Promise<void> {
    await this.httpClient.requestVoid({
      method: 'POST',
      path: `${BASE_PATH}/${toPathId(projectId)}/reactivate`,
    });
  }
}
