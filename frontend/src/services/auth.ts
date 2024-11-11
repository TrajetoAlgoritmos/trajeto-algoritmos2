import api from '@/config/api';

export function authenticateService(tokenId: string) {
  return api.post<IAuthResponse>('/auth', { tokenId });
}
