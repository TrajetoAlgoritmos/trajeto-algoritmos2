'use client';

import { useState } from 'react';
import SelectAlgorithm from './SelectAlgorithms';
import StudentsTable from './StudentsTable';

function TrackTabs() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className='flex flex-1 flex-col w-full gap-4 rounded-xl shadow-xl bg-white p-4'>
      <div className='flex items-center flex-col md:flex-row gap-4 border-b border-b-gray-300 py-2'>
        <button
          className={`w-full h-[48px] font-semibold text-base px-2 py-1 rounded-lg duration-300 ${selectedTab === 0 ? 'bg-[#1ba48a] text-white' : 'border border-[#1ba48b38]'}`}
          onClick={() => setSelectedTab(0)}
        >
          <span>Algoritmos</span>
        </button>
        <button
          className={`w-full h-[48px] font-semibold text-base px-2 py-1 rounded-lg duration-300 ${selectedTab === 1 ? 'bg-[#1ba48a] text-white' : 'border border-[#1ba48b38]'}`}
          onClick={() => setSelectedTab(1)}
        >
          <span>Alunos</span>
        </button>
      </div>
      {selectedTab === 0 ? <SelectAlgorithm /> : <StudentsTable />}
    </div>
  );
}

export default TrackTabs;
