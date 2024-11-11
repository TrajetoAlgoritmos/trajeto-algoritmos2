'use client';

import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function GoogleAuth() {
  const [token, setToken] = useState('');
  const [showDevSignIn, setShowDevSignIn] = useState(false);
  const { handleSignIn, devSignInWithToken } = useAuth();

  const env = useSearchParams().get('env');

  const handleDevSignIn = async () => {
    if (!token) return;
    await devSignInWithToken(token);
  };

  useEffect(() => {
    if (env === 'dev') setShowDevSignIn(true);
  }, [env]);

  return (
    <div className='w-full max-w-[320px] flex flex-col gap-4'>
      {showDevSignIn ? (
        <div className='w-full flex flex-col gap-2'>
          <input
            placeholder='token'
            className='w-full h-[48px] rounded-md border-2 border-gray-600 px-4'
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button
            className='w-full h-[48px] rounded-md flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 duration-300'
            onClick={handleDevSignIn}
          >
            <span>Entrar com token</span>
          </button>
        </div>
      ) : undefined}
      <button
        className='w-full h-[48px] rounded-md flex items-center justify-center border-2 border-gray-600 hover:bg-gray-100 duration-300'
        onClick={handleSignIn}
      >
        <Image src='/icons/google.png' alt='Google' width={20} height={20} />
        <span className='ml-2'>Entrar com Google</span>
      </button>
    </div>
  );
}

export default GoogleAuth;
