import api from '@/config/api';

export function submissionService(data: ISubmissionRequest) {
  return api.post<ISubmissionResponse>('/submissions', data);
}

export function evaluationService(data: IEvaluationRequest) {
  return api.post<IEvaluationResponse>('/answers', data);
}
