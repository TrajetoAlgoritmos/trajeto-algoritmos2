'use client';

import Icon from '@/components/Icon';
import Loading from '@/components/Loading';
import { useTracks } from '@/hooks/useTracks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const joinTrackSchema = z.object({
  code: z.string().trim().min(1, { message: 'Título é obrigatório' }),
});

type JoinTrackForm = z.infer<typeof joinTrackSchema>;

function JoinTrack() {
  const { handleJoinTrack, loading, getJoinedTracks } = useTracks();

  const { register, handleSubmit, reset } = useForm<JoinTrackForm>({
    resolver: zodResolver(joinTrackSchema),
  });

  const onSubmit = useCallback(
    async ({ code }: JoinTrackForm) => {
      await handleJoinTrack(code);
      await getJoinedTracks({ page: 1, limit: 10 });
      reset();
    },
    [handleJoinTrack, reset, getJoinedTracks]
  );

  return (
    <div className='w-full'>
      <form
        className='flex items-center justify-between max-w-md border border-[#1ba48a] pl-2 rounded-l-md rounded-tr-lg rounded-br-lg'
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          placeholder='Código da trilha'
          className='w-full outline-none'
          {...register('code')}
        />
        <button
          disabled={loading}
          className='flex items-center max-w-[100px] h-10 gap-1 rounded-tr-md rounded-br-md px-4 py-2 ml-2 bg-[#1ba48a] text-white'
        >
          <span>Entrar</span>
          {loading ? <Loading /> : <Icon name='ArrowRight' color='white' />}
        </button>
      </form>
    </div>
  );
}

export default JoinTrack;
