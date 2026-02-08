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

export function TrackUsersSummaryService(userId: string | number) {
  return api.post(`/tracks/trackUsersSummary`, { userId });
}

// Já existente — busca todas as trilhas do professor
export async function getProfessorTracksSummaryService() {
  try {
    const response = await api.get('/tracks') // [{ id: 1, title: "..." }]
    return response.data.data
  } catch (error) {
    console.error('Erro ao buscar trilhas:', error)
    throw error
  }
}

// Já existente — busca as notificações de uma trilha específica
export async function getNotificationsService(trackId: string | number) {
  try {
    const response = await api.get(`/tracks/${trackId}/difficulty-notifications`)
    const data = response.data;
    if (Array.isArray(data.notificacoes)) {
      return data.notificacoes;
    }
    // Se não houver notificações ou erro, retorna array vazio
    return [];
  } catch (error) {
    console.error(`Erro ao buscar notificações da trilha ${trackId}:`, error)
    return [];
  }
}

// NOVA FUNÇÃO FINAL: junta tudo
export async function getAllProfessorNotificationsService() {
  try {
    const trilhas = await getProfessorTracksSummaryService()

    const notificacoesPorTrilha = await Promise.all(
      trilhas.map(async (trilha) => {
        try {
          const notificacoes = await getNotificationsService(trilha.id)
          return {
            trilhaId: trilha.id,
            trilhaNome: trilha.title, // <-- troque para trilhaNome
            notificacoes,
          }
        } catch (error) {
          console.error(`Erro ao buscar notificações da trilha ${trilha.id}`, error)
          return null
        }
      })
    )

    return notificacoesPorTrilha.filter(Boolean)
  } catch (error) {
    console.error('Erro geral ao buscar notificações de todas as trilhas:', error)
    throw error
  }
}
