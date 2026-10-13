import { HttpClient } from '../http/client';
import { GetProjectsRequest, GetProjectsResponse } from '../types/projects';

export class ProjectsApi {
  constructor(private readonly httpClient: HttpClient) {}

  async getProjects(request: GetProjectsRequest = {}): Promise<GetProjectsResponse> {
    return this.httpClient.request<GetProjectsResponse>({
      method: 'GET',
      path: '/v1/projects',
      query: {
        projectId: request.projectId,
        projectName: request.projectName,
        clubId: request.clubId,
        status: request.status,
        category: request.category,
        page: request.page,
        size: request.size,
        sortBy: request.sortBy,
        sortDirection: request.sortDirection,
      },
    });
  }
}
