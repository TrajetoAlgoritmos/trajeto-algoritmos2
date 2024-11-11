'use client';

import Icon from '@/components/Icon';
import Pagination from '@/components/Pagination';
import { useAlgorithms } from '@/hooks/useAlgorithms';
import { parseHTMLToText } from '@/utils/parseHTMLToText';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const LIMIT = 10;

function AlgorithmsTable() {
  const [page, setPage] = useState(1);
  const { getAlgorithms, algorithms } = useAlgorithms();

  useEffect(() => {
    getAlgorithms({ page, limit: LIMIT });
  }, [getAlgorithms, page]);

  return (
    <div className='relative overflow-auto'>
      <div className='shadow-sm overflow-x-auto my-8'>
        <table className='border-collapse table-auto w-full text-sm'>
          <thead>
            <tr>
              <th className='border-b font-medium p-4 pl-8 pt-0 pb-3 text-left'>
                Título
              </th>
              <th className='border-b font-medium p-4 pt-0 pb-3 text-left'>
                Descrição
              </th>
              <th className='border-b font-medium p-4 pr-8 pt-0 pb-3 text-left'>
                Tag
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
            {algorithms?.data?.map(({ id, title, description, tag }) => (
              <tr key={id}>
                <td className='border-b border-slate-100 p-4 pl-8'>{title}</td>
                <td className='border-b border-slate-100 p-4'>
                  {parseHTMLToText(description)}
                </td>
                <td className='border-b border-slate-100 p-4 pr-8'>
                  <div className='rounded-full px-2 py-[2px] bg-[#20695c] inline-block text-white font-medium'>
                    {tag}
                  </div>
                </td>
                <td
                  align='right'
                  className='border-b border-slate-200 p-4 pr-8'
                >
                  <Link href={`/professor/algoritmos/editar/${id}`}>
                    <Icon name='Edit' />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='w-full'>
        {algorithms?.meta ? (
          <Pagination
            currentPage={algorithms.meta.currentPage}
            total={algorithms.meta.total}
            itemsPerPage={algorithms.meta.perPage}
            onPageChange={(page) => setPage(page)}
          />
        ) : undefined}
      </div>
    </div>
  );
}

export default AlgorithmsTable;
