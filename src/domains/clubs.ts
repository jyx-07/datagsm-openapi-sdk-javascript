import { HttpClient } from '../http/client';
import { toPathId } from '../http/path';
import { ClubRequest, ClubResponse, GetClubsRequest, GetClubsResponse } from '../types/clubs';

const BASE_PATH = '/v1/clubs';

export class ClubsApi {
  constructor(private readonly httpClient: HttpClient) {}

  async getClubs(request: GetClubsRequest = {}): Promise<GetClubsResponse> {
    return this.httpClient.get<GetClubsResponse>(BASE_PATH, {
      clubId: request.clubId,
      clubName: request.clubName,
      clubType: request.clubType,
      clubStatus: request.clubStatus,
      foundedYear: request.foundedYear,
      page: request.page,
      size: request.size,
      includeLeaderInParticipants: request.includeLeaderInParticipants,
      sortBy: request.sortBy,
      sortDirection: request.sortDirection,
    });
  }

  /** 동아리를 생성합니다. 이름이 중복되면 `ConflictError`가 발생합니다. 필요 스코프: CLUB_WRITE */
  async createClub(request: ClubRequest): Promise<ClubResponse> {
    return this.httpClient.post<ClubResponse>(BASE_PATH, request);
  }

  /** 동아리 정보를 전체 교체합니다. 필요 스코프: CLUB_WRITE */
  async updateClub(clubId: number, request: ClubRequest): Promise<ClubResponse> {
    return this.httpClient.put<ClubResponse>(`${BASE_PATH}/${toPathId(clubId)}`, request);
  }

  /** 동아리를 삭제합니다. 응답 본문은 없습니다. 필요 스코프: CLUB_WRITE */
  async deleteClub(clubId: number): Promise<void> {
    await this.httpClient.requestVoid({
      method: 'DELETE',
      path: `${BASE_PATH}/${toPathId(clubId)}`,
    });
  }
}
