// TrackStatsView.tsx
'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

interface Algorithm {
  algorithm_title: string;
  total_attempts: number;
  correct_attempts: number;
  incorrect_attempts: number;
  error_attempts: number;
  running_attempts: number;
  notAnswered: boolean;
  correct_percentage: number;
  incorrect_percentage: number;
  error_percentage: number;
  notAnswered_percentage: number;
}

interface AlgorithmView {
  [key: string]: Algorithm;
}

interface TrackStatsViewProps {
  data: {
    algorithmView: AlgorithmView;
  };
}

function TrackStatsView({ data }: TrackStatsViewProps) {
  const algorithmData = Object.values(data.algorithmView);

  const chartData = {
    labels: algorithmData.map((alg) => alg.algorithm_title),
    datasets: [
      {
        label: 'Submissões aprovadas no teste',
        data: algorithmData.map((alg) => alg.correct_attempts),
        backgroundColor: 'rgba(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Submissões reprovadas no teste',
        data: algorithmData.map((alg) => alg.incorrect_attempts),
        backgroundColor: 'rgba(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Submissões com erros de execução',
        data: algorithmData.map((alg) => alg.error_attempts),
        backgroundColor: 'rgba(255, 206, 86)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Não respondido',
        data: algorithmData.map((alg) => (alg.notAnswered ? 1 : 0)),
        backgroundColor: 'rgba(153, 102, 255)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
        // max bar width
        barPercentage: 0.5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Submissões por exercício',
      },
    },
  };

  return (
    <div className='container mx-auto p-4'>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default TrackStatsView;
