'use client';

import Editor from '@/components/Editor';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import { useTracks } from '@/hooks/useTracks';
import { createTrackSchema } from '@/lib/validators/tracks';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

function formateUTCDateToHookForm(value: string) {
  const utcDate = new Date(value);
  const month = utcDate.getUTCMonth() + 1;

  return `${utcDate.getUTCFullYear()}-${
    month < 10 ? '0' + month : month
  }-${utcDate.getUTCDate()}`;
}

interface TrackFormProps {
  data?: ITrack;
}

function TrackForm({ data }: TrackFormProps) {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<ITrack>({
    resolver: zodResolver(createTrackSchema),
  });

  const { loading, createTrack, updateTrack, currentTrack } = useTracks();

  const onSubmit = useCallback(
    async (values: ITrack) => {
      if (data?.id || currentTrack?.id) {
        await updateTrack({
          ...data,
          ...values,
          id: (data?.id ?? currentTrack?.id) as number,
        });
      } else {
        await createTrack(values);
      }
    },
    [createTrack, data, updateTrack, currentTrack]
  );

  useEffect(() => {
    if (data) {
      const { title, description, startAt, closeAt, codigo } = data;
      setValue('title', title);
      setValue('description', description);
      setValue('startAt', startAt.split('T')[0]);
      setValue('closeAt', closeAt.split('T')[0]);
      setValue('codigo', codigo);
    }
  }, [data, setValue]);

  return (
    <form
      className='flex flex-col w-full gap-4 rounded-xl shadow-xl bg-white p-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className='font-semibold text-base'>Trilha</h1>
      <div className='w-full md:w-1/3 md:pr-3'>
        <Input
          label='Código de inscrição'
          isRequired
          {...register('codigo')}
          error={errors?.codigo?.message}
        />
      </div>
      <div className='flex flex-col md:flex-row  items-center gap-4'>
        <Input
          label='Título da trilha'
          isRequired
          {...register('title')}
          error={errors?.title?.message}
        />
        <Input
          label='Data de abertura'
          type='date'
          isRequired
          {...register('startAt')}
          error={errors?.startAt?.message}
        />
        <Input
          label='Data de fechamento'
          type='date'
          isRequired
          {...register('closeAt')}
          error={errors?.closeAt?.message}
        />
      </div>
      <Editor
        label='Descrição'
        isRequired
        control={control}
        name='description'
        error={errors?.description?.message}
      />
      <div className='w-full flex items-center justify-between'>
        <Link href='/professor/trilhas' className='flex items-center'>
          <Icon name='ArrowLeft' size={24} />
          <span>Voltar</span>
        </Link>
        <button
          type='submit'
          disabled={loading}
          className='btn btn-primary gap-2'
        >
          {loading ? <Loading /> : <Icon name='Check' size={24} color='#fff' />}
          <span>{currentTrack?.id || data?.id ? 'Atualizar' : 'Salvar'}</span>
        </button>
      </div>
    </form>
  );
}

export default TrackForm;
