'use client';

import { provider } from '@/config/firebase';
import { authenticateService } from '@/services/auth';
import { setCookie } from 'cookies-next';
import { getAuth, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useState } from 'react';

export const AuthContext = createContext({} as IAuthContextProps);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<IUser | undefined>(undefined);

  const router = useRouter();

  const handleSignIn = useCallback(async () => {
    const auth = getAuth();
    await signInWithPopup(auth, provider);
    const verifyToken = await auth?.currentUser?.getIdToken();
    if (verifyToken) {
      const response = await authenticateService(verifyToken);
      if (response?.data?.data) {
        const { user, accessToken } = response.data.data;
        if (!accessToken) return;
        setCookie('token', JSON.stringify(accessToken));
        setUser(user);
        if (user?.profileId === 1) {
          setCookie('profile', 'professor');
          router.push('/professor');
        } else {
          setCookie('profile', 'aluno');
          router.push('/aluno');
        }
      }
    }
  }, [router]);

  const devSignInWithToken = useCallback(
    async (token: string) => {
      const response = await authenticateService(token);
      if (response?.data?.data) {
        const { user, accessToken } = response.data.data;
        if (!accessToken) return;
        setCookie('token', JSON.stringify(accessToken));
        setUser(user);
        if (user?.profileId === 1) {
          setCookie('profile', 'professor');
          router.push('/professor');
        } else {
          setCookie('profile', 'aluno');
          router.push('/aluno');
        }
      }
    },
    [router]
  );

  return (
    <AuthContext.Provider value={{ user, handleSignIn, devSignInWithToken }}>
      {children}
    </AuthContext.Provider>
  );
}
