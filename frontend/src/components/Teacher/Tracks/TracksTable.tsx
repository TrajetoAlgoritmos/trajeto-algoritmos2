'use client';

import Icon from '@/components/Icon';
import Pagination from '@/components/Pagination';
import { useTracks } from '@/hooks/useTracks';
import { parseHTMLToText } from '@/utils/parseHTMLToText';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const LIMIT = 10;

function TracksTable() {
  const [page, setPage] = useState(1);
  const { getTracks, tracks } = useTracks();

  function parseDate(dateValue: string) {
    const date = new Date(dateValue).toISOString().split('T')[0];
    // format date DD/MM/YYYY
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    getTracks({ page, limit: LIMIT });
  }, [getTracks, page]);

  return (
    <div className='relative overflow-auto'>
      <div className='shadow-sm overflow-x-auto my-8'>
        <table className='border-collapse table-auto w-full text-sm'>
          <thead>
            <tr>
              <th className='border-b font-medium p-4 pl-8 pt-0 pb-3 text-left'>
                Código de inscrição
              </th>
              <th className='border-b font-medium p-4 pl-8 pt-0 pb-3 text-left'>
                Título
              </th>
              <th className='border-b font-medium p-4 pt-0 pb-3 text-left'>
                Descrição
              </th>
              <th className='border-b font-medium p-4 pr-8 pt-0 pb-3 text-left'>
                Abertura
              </th>
              <th className='border-b font-medium p-4 pr-8 pt-0 pb-3 text-left'>
                Fechamento
              </th>
              <th
                align='center'
                className='border-b font-medium p-4 pr-8 pt-0 pb-3 text-center'
              >
                Estatísticas da trilha
              </th>
              <th
                align='center'
                className='border-b font-medium p-4 pr-8 pt-0 pb-3 text-center'
              >
                Relatório
              </th>
              <th
                align='right'
                className='border-b font-medium p-4 pr-8 pt-0 pb-3 text-right'
              >
                Opções
              </th>
            </tr>
          </thead>
          <tbody>
            {tracks?.data?.map(
              ({ id, codigo, title, description, startAt, closeAt }) => (
                <tr key={id}>
                  <td className='border-b border-slate-100 p-4 pl-8'>
                    {codigo}
                  </td>
                  <td className='border-b border-slate-100 p-4 pl-8'>
                    {title}
                  </td>
                  <td className='border-b border-slate-100 p-4'>
                    {parseHTMLToText(description)}
                  </td>
                  <td className='border-b border-slate-100 p-4 pr-8'>
                    <div className='rounded-full px-2 py-[2px] bg-[#20695c] inline-block text-white font-medium'>
                      {parseDate(startAt)}
                    </div>
                  </td>
                  <td className='border-b border-slate-100 p-4 pr-8'>
                    <div className='rounded-full px-2 py-[2px] bg-[#20695c] inline-block text-white font-medium'>
                      {parseDate(closeAt)}
                    </div>
                  </td>
                  <td
                    align='center'
                    className='border-b border-slate-200 p-4 pr-8'
                  >
                    <Link href={`/professor/trilhas/estatisticas/${id}`}>
                      <Icon name='ExternalLink' />
                    </Link>
                  </td>
                  <td
                    align='center'
                    className='border-b border-slate-200 p-4 pr-8'
                  >
                    <Link href={`/professor/trilhas/estatisticas/${id}/relatorio`}>
                      <Icon name='FileText' />
                    </Link>
                  </td>
                  <td
                    align='right'
                    className='border-b border-slate-200 p-4 pr-8'
                  >
                    <Link href={`/professor/trilhas/editar/${id}`}>
                      <Icon name='Edit' />
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className='w-full'>
        {tracks?.meta ? (
          <Pagination
            currentPage={tracks.meta.currentPage}
            total={tracks.meta.total}
            itemsPerPage={tracks.meta.perPage}
            onPageChange={(page) => setPage(page)}
          />
        ) : undefined}
      </div>
    </div>
  );
}

export default TracksTable;
