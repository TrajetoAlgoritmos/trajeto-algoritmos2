'use client';
import FeedbackStatsView from '@/components/StatsView/FeedbackStatsView';
import StudentStatsView from '@/components/StatsView/StudentStatsView';
import TrackStatsView from '@/components/StatsView/TrackStatsView';
import { getFeedbackByTrackService, getTrackUsersSummaryService } from '@/services/tracks';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function ViewTrackDataPage({ params: { id } }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [studentViewData, setStudentViewData] = useState<any>();
  const [trackViewData, setTrackViewData] = useState<any>();
  const [feedbackData, setFeedbackData] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const response = await getTrackUsersSummaryService(id);
      const response2 = await getFeedbackByTrackService(id);
      setFeedbackData(response2.data);
      if (response?.data?.data) {
        setStudentViewData({
          studentView: response.data.data['studentView'] ?? {},
        });
        setTrackViewData({
          algorithmView: response.data.data['algorithmView'] ?? {},
        });
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className='flex flex-1 flex-col w-full gap-4 rounded-xl shadow-xl bg-white p-4'>
      <h1 className='text-2xl font-bold md:hidden text-center'>
        Use a versão desktop para visualização dos dados
      </h1>

      {/* Botão de link para o relatório */}
      <div className='hidden md:flex justify-end'>
        <Link
          href={`/professor/trilhas/estatisticas/${id}/relatorio`}
          className='bg-[#1ba48a] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#168f76] transition-colors'
        >
          Ver Relatório
        </Link>
      </div>

      {/* Botões de navegação */}
      <div className='hidden md:flex items-center gap-4 border-b border-b-gray-300 py-2'>
        <button
          className={`font-semibold text-base px-2 py-1 rounded-lg duration-300 ${selectedTab === 0 ? 'bg-[#1ba48a] text-white' : 'hover:bg-[#1ba48b38]'}`}
          onClick={() => setSelectedTab(0)}
        >
          <span>Estatísticas dos exercícios</span>
        </button>
        <button
          className={`font-semibold text-base px-2 py-1 rounded-lg duration-300 ${selectedTab === 1 ? 'bg-[#1ba48a] text-white' : 'hover:bg-[#1ba48b38]'}`}
          onClick={() => setSelectedTab(1)}
        >
          <span>Estatísticas dos alunos</span>
        </button>
        <button
          className={`font-semibold text-base px-2 py-1 rounded-lg duration-300 ${selectedTab === 2 ? 'bg-[#1ba48a] text-white' : 'hover:bg-[#1ba48b38]'}`}
          onClick={() => setSelectedTab(2)}
        >
          <span>Estatísticas de afetividade</span>
        </button>
      </div>

      {/* Conteúdo das tabs */}
      <div className='w-full hidden md:block'>
        {selectedTab === 0 && trackViewData ? (
          <TrackStatsView data={trackViewData} />
        ) : undefined}
        {selectedTab === 1 && studentViewData ? (
          <StudentStatsView data={studentViewData} />
        ) : undefined}
        {selectedTab === 2 ? (
          <FeedbackStatsView feedbackData={feedbackData} />
        ) : undefined}
      </div>
    </div>
  );
}

export default ViewTrackDataPage;
