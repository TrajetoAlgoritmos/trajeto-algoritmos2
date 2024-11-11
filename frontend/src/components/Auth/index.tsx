import Image from 'next/image';
import { Suspense } from 'react';
import Logo from '../Logo';
import GoogleAuth from './GoogleAuth';

function Auth() {
  return (
    <div className='w-full h-screen flex justify-center items-stretch'>
      <div className='flex flex-1 bg-[#1b2b34] relative'>
        <div className='w-full h-full absolute top- right-0 bottom-0 left-0 z-10 bg-[#1b2b34] opacity-50' />
        <Image
          src='/backgrounds/auth-bg.jpg'
          width={1920}
          height={1080}
          layout='responsive'
          className='object-cover w-full h-full flex-1 z-0'
          alt='Auth background image'
        />
      </div>
      <div className='w-full max-w-[600px] flex flex-col justify-center items-center p-4 relative'>
        <div className='absolute w-full flex justify-center top-8'>
          <Image
            src='/logos/ufdg.png'
            width={150}
            height={150}
            layout='fixed'
            alt='Trajeto Algoritmos logo'
          />
        </div>
        <Logo />
        <div className='w-full flex flex-col items-center justify-center mt-8 gap-2'>
          <Suspense fallback={<div>Carregando...</div>}>
            <GoogleAuth />
          </Suspense>
          <span className='text-xs text-gray-500 font-medium'>
            Entre com sua conta acadêmica
          </span>
        </div>
        <div className='absolute w-full flex justify-center items-center flex-col bottom-8 gap-2 p-2'>
          <span className='text-xs text-gray-500 font-medium'>
            2024 Trajeto Algoritmos
          </span>
          <span className='text-xs text-gray-500 text-center'>
            Desenvolvidor por:{' '}
            <a
              href='https://github.com/'
              target='_blank'
              className='font-medium hover:underline duration-300'
            >
              Eduardo Freitas
            </a>
            ,{' '}
            <a
              href='https://github.com/'
              target='_blank'
              className='font-medium hover:underline duration-300'
            >
              Emerson Murilo
            </a>
            ,{' '}
            <a
              href='https://github.com/'
              target='_blank'
              className='font-medium hover:underline duration-300'
            >
              Professora Carla
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Auth;
