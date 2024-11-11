'use client';

import Editor from '@/components/Editor';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import { useAlgorithms } from '@/hooks/useAlgorithms';
import { createAlgorithmSchema } from '@/lib/validators/algorithms';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface AlgorithmFormProps {
  data?: IAlgorithm;
}

function AlgorithmForm({ data }: AlgorithmFormProps) {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IAlgorithm>({
    resolver: zodResolver(createAlgorithmSchema),
  });

  const { back } = useRouter();

  const { loading, createAlgorithm, updateAlgorithm, currentAlgorithmId } =
    useAlgorithms();

  const onSubmit = useCallback(
    async (values: IAlgorithm) => {
      if (data?.id || currentAlgorithmId) {
        await updateAlgorithm({
          ...data,
          ...values,
          id: (data?.id ?? currentAlgorithmId) as number,
        });
      } else {
        await createAlgorithm(values);
      }
    },
    [createAlgorithm, data, updateAlgorithm, currentAlgorithmId]
  );

  useEffect(() => {
    if (data) {
      const { title, description, tag } = data;
      setValue('title', title);
      setValue('description', description);
      setValue('tag', tag);
    }
  }, [data, setValue]);

  return (
    <form
      className='flex flex-col w-full gap-4 rounded-xl shadow-xl bg-white p-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className='font-semibold text-base'>Algoritmo</h1>
      <div className='flex flex-col md:flex-row  items-center gap-4'>
        <Input
          label='Título do algoritmo'
          isRequired
          {...register('title')}
          error={errors?.title?.message}
        />
        <Input
          label='Tag'
          isRequired
          {...register('tag')}
          error={errors?.tag?.message}
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
        <button type='button' onClick={back} className='flex items-center'>
          <Icon name='ArrowLeft' size={24} />
          <span>Voltar</span>
        </button>
        <button
          type='submit'
          disabled={loading}
          className='btn btn-primary gap-2'
        >
          {loading ? <Loading /> : <Icon name='Check' size={24} color='#fff' />}
          <span>{currentAlgorithmId || data?.id ? 'Atualizar' : 'Salvar'}</span>
        </button>
      </div>
    </form>
  );
}

export default AlgorithmForm;
