import api from '@/config/api';

export function createAlgorithmService(data: IAlgorithm) {
  return api.post<IAlgorithm>('/algorithms', data);
}

export function getAlgorithmsService(params: IAlgorithmGetRequest) {
  return api.get<IAlgorithmGetResponse>('/algorithms', {
    params,
  });
}

export function getAlgorithmByIdService(id: string | number) {
  return api.get<IAlgorithm[]>(`/algorithms/${id}`);
}

export function updateAlgorithmService(data: IAlgorithm) {
  return api.put<IAlgorithm>(`/algorithms/${data.id}`, data);
}

export function createAlgorithmTestService(data: IAlgorithmTest) {
  return api.post('/algorithmTest', data);
}

export function removeAlgorithmTestService(id: number) {
  return api.delete(`/algorithmTest/${id}`);
}

export function getAlgorithmTestsByAlgorithmIdService(algorithmId: number) {
  return api.get<IAlgorithmTest[]>('/algorithmTest', {
    params: {
      page: 1,
      limit: 100,
      algorithmId,
    },
  });
}
