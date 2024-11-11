import api from '@/config/api';

export function createTrackService(data: ITrack) {
  return api.post<ITrack>('/tracks', data);
}

export function getTracksService(params: ITrackGetRequest) {
  return api.get<ITrackGetResponse>('/tracks', {
    params,
  });
}

export function getTrackByIdService(id: string | number) {
  return api.get<ITrack>(`/tracks/${id}`);
}

export function updateTrackService(data: ITrack) {
  return api.put<ITrack>(`/tracks/${data.id}`, data);
}

export function deleteTrackService(id: string | number) {
  return api.delete(`/tracks/${id}`);
}

export function addAlgorithmToTrackService(
  trackId: number,
  algorithmId: number
) {
  return api.post('/tracks/algorithm/add', { algorithmId, trackId });
}

export function removeAlgorithmToTrackService(
  trackId: number,
  algorithmId: number
) {
  return api.post('/tracks/algorithm/remove', { algorithmId, trackId });
}

export function joinTrackService(code: string) {
  return api.post('/tracks/join', {
    codigo: code,
  });
}

export function getJoinedTracksService(params: ITrackGetRequest) {
  return api.get<ITrackGetResponse>('/student/joinedTracks', { params });
}

export async function getStudentTrackService(
  id: string | number
): Promise<{ data: ITrack | null }> {
  try {
    const response = await api.get<ITrack[]>(`/student/tracks/${id}`);
    return {
      data: response.data[0],
    };
  } catch {
    return { data: null };
  }
}

export async function getLastAnswerService(
  trackAlgorithmId: number
): Promise<IAnswer | null> {
  try {
    const response = await api.get<{ data: IAnswer[] }>(
      '/student/getLastAnswer',
      {
        params: { trackAlgorithmId },
      }
    );
    if (!response?.data?.data?.length) {
      return null;
    }
    return response.data.data[0];
  } catch {
    return null;
  }
}

export function startTrackService(id: string | number) {
  return api.post(`/student/tracks/start/${id}`);
}

export function finishTrackService(id: string | number) {
  return api.post(`/student/tracks/finish/${id}`);
}

export function getTrackUsersSummaryService(trackId: string | number) {
  return api.post(`/tracks/trackUsersSummary`, { trackId });
}

export function getFeedbackByTrackService(trackId: string | number) {
  return api.get('/feedback/getByTrack', {
    params: { trackId },
  });
}
