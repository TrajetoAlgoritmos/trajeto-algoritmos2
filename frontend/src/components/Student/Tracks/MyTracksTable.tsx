'use client';

import Icon from '@/components/Icon';
import Pagination from '@/components/Pagination';
import { useTracks } from '@/hooks/useTracks';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const percent = 30;
const LIMIT = 10;

const statusColor = {
  finished: 'bg-green-500',
  started: 'bg-blue-500',
};

function MyTracksTable() {
  const [page, setPage] = useState(1);
  const { joinedTracks, getJoinedTracks } = useTracks();

  useEffect(() => {
    getJoinedTracks({ page, limit: LIMIT });
  }, [getJoinedTracks, page]);

  return (
    <div className='w-full flex flex-col mt-4'>
      <h1 className='font-semibold text-base'>Minhas trilhas</h1>
      <div className='w-full overflow-x-auto'>
        <table className='w-full mt-4'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='text-left min-w-[250px]'>Nome</th>
              <th className='text-left min-w-[150px]'>Status</th>
              <th className='text-left min-w-[150px]'>Prazo</th>
              <th className='text-right'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {joinedTracks?.data?.map((track) => (
              <tr key={track.id} className='border-b border-gray-200'>
                <td className='py-2'>{track.title}</td>
                {track.status === 'finished' ? (
                  <td className='py-2 text-green-500 font-medium'>Concluído</td>
                ) : undefined}
                {track.status === 'started' ? (
                  <td className='py-2 text-blue-500 font-medium'>Iniciado</td>
                ) : undefined}
                {!track.status ? (
                  <td className='py-2 text-red-500 font-medium'>
                    Não iniciado
                  </td>
                ) : undefined}
                <td className='py-2'>
                  {new Date(track.closeAt).toLocaleDateString('pt-BR')}
                </td>
                <td className='py-2 flex justify-end'>
                  <Link
                    href={`/aluno/trilhas/${track.id}`}
                    className={`flex flex-row btn items-center gap-1 text-white px-2 py-1 rounded-md font-bold w-[130px] ${track.status ? statusColor[track.status] : 'bg-red-500'}`}
                  >
                    <Icon name='ExternalLink' color='white' />
                    {track.status === 'finished' ? <span>Ver</span> : undefined}
                    {track.status === 'started' ? (
                      <span>Continuar</span>
                    ) : undefined}
                    {!track.status ? <span>Abrir</span> : undefined}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='w-full'>
        {joinedTracks?.meta ? (
          <Pagination
            currentPage={joinedTracks.meta.currentPage}
            total={joinedTracks.meta.total}
            itemsPerPage={joinedTracks.meta.perPage}
            onPageChange={(page) => setPage(page)}
          />
        ) : undefined}
      </div>
    </div>
  );
}

export default MyTracksTable;
