import api from '@/config/api';

export function sendFeedbackService(data: ISendFeedback) {
  return api.post('/feedback/send', data);
}
