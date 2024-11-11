'use client';

import Icon from '@/components/Icon';
import Input from '@/components/Input';
import { useAlgorithms } from '@/hooks/useAlgorithms';
import { useTracks } from '@/hooks/useTracks';
import { parseHTMLToText } from '@/utils/parseHTMLToText';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

function SelectAlgorithm() {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { getAlgorithms, algorithms } = useAlgorithms();
  const {
    loading,
    currentTrack,
    handleAddAlgorithmToTrack,
    handleRemoveAlgorithmToTrack,
  } = useTracks();

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => {
    setSearch('');
    setOpen(false);
  }, []);

  const handleAlgorithmSelect = (id: number) => {
    if (!currentTrack?.id) return;
    const isSelected = selectedAlgorithms.includes(id);
    setSelectedAlgorithms((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    if (isSelected) {
      handleRemoveAlgorithmToTrack(currentTrack.id, id);
    } else {
      handleAddAlgorithmToTrack(currentTrack.id, id);
    }
  };

  const handleRemoveAlgorithmTest = useCallback(
    (id: number) => {
      if (!currentTrack?.id) return;
      handleRemoveAlgorithmToTrack(currentTrack.id, id);
    },
    [currentTrack?.id, handleRemoveAlgorithmToTrack]
  );

  useEffect(() => {
    getAlgorithms({ page: 1, limit: 1000 });
  }, [getAlgorithms]);

  useEffect(() => {
    if (currentTrack?.algorithms) {
      setSelectedAlgorithms(() =>
        currentTrack.algorithms.map((item) => item.id)
      );
    }
  }, [currentTrack]);

  return (
    <>
      {open ? (
        <Modal
          open={open}
          onClose={closeModal}
          classNames={{
            modal: 'md:w-full md:max-w-[480px]',
          }}
        >
          <h1 className='font-semibold text-base'>
            Selecionar Algoritmos (<span>{selectedAlgorithms.length}</span>)
          </h1>
          <div className='my-5'>
            <Input
              type='text'
              placeholder='Buscar'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-4 w-full max-h-[50vh] overflow-auto'>
            {algorithms?.data
              ?.filter((item) => {
                if (!search) return true;
                return item.title.toLowerCase().includes(search.toLowerCase());
              })
              ?.map((item) => (
                <button
                  key={item.id}
                  data-selected={selectedAlgorithms.includes(item.id)}
                  onClick={() => handleAlgorithmSelect(item.id)}
                  className='flex items-center justify-between p-4 rounded-md border border-gray-300 data-[selected=true]:text-white data-[selected=true]:bg-[#1ba48aac] hover:bg-gray-200 cursor-pointer duration-300'
                >
                  <h1 className='font-bold'>{item.title}</h1>
                  <p className='font-medium text-sm text-gray-500'>
                    {parseHTMLToText(item.description)}
                  </p>
                </button>
              ))}
          </div>
          <div className='w-full flex items-center justify-end mt-4'>
            <button
              disabled={loading}
              className='btn btn-secondary text-white flex justify-center items-center gap-2 w-full max-w-[200px]'
              onClick={closeModal}
            >
              <Icon name='Check' size={24} color='#fff' />
              <span>Concluir</span>
            </button>
          </div>
        </Modal>
      ) : undefined}
      <div className='flex flex-1 flex-col w-full gap-4 mt-4'>
        <button
          disabled={!currentTrack?.id}
          className='btn btn-secondary text-white flex justify-center items-center gap-2 w-full max-w-[200px]'
          onClick={openModal}
        >
          <Icon name='Search' size={24} color='#fff' />
          <span>Buscar</span>
        </button>
        {currentTrack?.algorithms?.map((item) => (
          <div
            key={item.id}
            className='relative flex flex-col w-full p-4 rounded-md border border-gray-300'
          >
            <h1 className='font-bold'>{item.title}</h1>
            <p className='font-medium text-sm text-gray-500'>
              {parseHTMLToText(item.description)}
            </p>
            <div className='flex items-center gap-4'>
              <Link
                href={`/professor/algoritmos/editar/${item.id}`}
                className='cursor-pointer mt-2 text-[#1ba48a] font-medium flex items-center gap-1'
              >
                <span>Editar</span>
                <Icon name='ExternalLink' size={15} color='#1ba48a' />
              </Link>
              <button
                className='cursor-pointer mt-2 text-[#f00] font-medium flex items-center gap-1'
                onClick={() => handleRemoveAlgorithmTest(item.id)}
              >
                <span>Remover da trilha</span>
                <Icon name='Trash' size={15} color='#f00' />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SelectAlgorithm;
