'use client';

import Icon from '@/components/Icon';
import Input from '@/components/Input';
import { useAlgorithms } from '@/hooks/useAlgorithms';
import { createAlgorithmTestSchema } from '@/lib/validators/algorithms';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-responsive-modal';

function AlgorithmTestForm() {
  const [open, setOpen] = useState(false);

  const {
    currentAlgorithmId,
    handleAddAlgorithmTest,
    algorithmTests,
    handleRemoveAlgorithmTest,
  } = useAlgorithms();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setFocus,
  } = useForm<IAlgorithmTest>({
    resolver: zodResolver(createAlgorithmTestSchema),
  });

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const onSubmit = useCallback(
    async ({ input = '', ...rest }: IAlgorithmTest) => {
      if (!currentAlgorithmId) return;
      await handleAddAlgorithmTest({
        ...rest,
        input,
        algorithmId: currentAlgorithmId,
      });
      reset();
      setFocus('input');
    },
    [currentAlgorithmId, handleAddAlgorithmTest, reset, setFocus]
  );

  return (
    <>
      <Modal
        open={open}
        onClose={closeModal}
        center
        classNames={{
          modal: 'md:w-full md:max-w-[480px]',
        }}
      >
        <h1 className='font-semibold text-base'>Testes do Algoritmo</h1>
        <form
          className='flex flex-col gap-4 w-full'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label='Entrada'
            placeholder='Entradas separadas por espaço. Ex: 2 4 6 0, onde 0 é a condição de parada.'
            {...register('input')}
            error={errors?.input?.message}
          />
          <Input
            label='Saída Esperada'
            {...register('output')}
            error={errors?.output?.message}
          />
          <div className='w-full flex items-center justify-end'>
            <button
              className='btn btn-secondary text-white flex justify-center items-center gap-2 w-full max-w-[200px]'
              type='submit'
            >
              <Icon name='Check' size={24} color='#fff' />
              <span>Salvar</span>
            </button>
          </div>
        </form>
      </Modal>

      <div className='flex flex-1 flex-col w-full gap-4 rounded-xl shadow-xl bg-white p-4'>
        <h1 className='font-semibold text-base'>
          Testes do Algoritmo{' '}
          <span className='text-gray-400 text-xs'>Opcional</span>
        </h1>
        <button
          disabled={!currentAlgorithmId}
          className='btn btn-secondary text-white flex justify-center items-center gap-2 w-full max-w-[200px]'
          onClick={openModal}
        >
          <Icon name='Plus' size={24} color='#fff' />
          <span> Adicionar teste</span>
        </button>
        {algorithmTests?.map((item) => (
          <div
            key={item.id}
            className='relative flex flex-col w-full p-4 rounded-md border border-gray-300'
          >
            <div className='flex gap-2'>
              <span className='font-bold'>Entrada:</span>
              <span className='text-gray-600'>
                {item.input || 'Sem entrada definida'}
              </span>
            </div>
            <div className='flex gap-2'>
              <span className='font-bold'>Saída:</span>
              <span className='text-gray-600'>{item.output}</span>
            </div>
            <button
              className='btn absolute top-0 right-0'
              onClick={() => handleRemoveAlgorithmTest(item.id)}
            >
              <Icon name='Trash' size={20} color='#f00' />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default AlgorithmTestForm;
