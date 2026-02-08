'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AlgorithmStats {
  track_name: string;
  algorithm_title: string;
  total_attempts: number;
  correct_attempts: number;
  incorrect_attempts: number;
  error_attempts: number;
  notAnswered: number; 
}

interface AlunoData {
  user_name: string;
  total_attempts: number;
  error_attempts: number;
  incorrect_attempts: number;
  algorithms: AlgorithmStats[];
  total_exercises: number;
  correct_exercises: number;
  incorrect_exercises: number;
}

interface AlunoStatsViewProps {
  aluno: AlunoData;
  enrolledTracks: string[]; // Trilhas inscritas/iniciadas do aluno
  chartRef?: any;
}

function AlunoStatsView({ aluno, enrolledTracks, chartRef }: AlunoStatsViewProps) {
  console.log('Dados do aluno:', aluno)
  const averageIncorrectPerExercise =
    aluno.total_exercises > 0
      ? ((aluno.incorrect_attempts + aluno.error_attempts) / aluno.total_exercises).toFixed(1)
      : '0.0';

  // Separar algoritmos com acertos e só erros
  const correct: Record<string, AlgorithmStats[]> = {};
  const incorrect: Record<string, AlgorithmStats[]> = {};

  for (const alg of aluno.algorithms) {
    const target = alg.correct_attempts > 0 ? correct : incorrect;
    if (!target[alg.track_name]) target[alg.track_name] = [];
    target[alg.track_name].push(alg);
  }

  const totalErrors = aluno.error_attempts;
  const totalIncorrect = aluno.incorrect_attempts;
  const totalCorrects = aluno.correct_exercises;
  const totalAttempts = totalErrors + totalIncorrect + totalCorrects;

  // Dados para gráfico de evolução
  const dataPoints: number[] = [];
  let cumulative = 0;
  for (let i = 0; i < totalCorrects; i++) {
    cumulative += 1;
    dataPoints.push(cumulative);
  }
  for (let i = 0; i < totalIncorrect + totalErrors; i++) {
    cumulative -= 1;
    dataPoints.push(cumulative);
  }
  while (dataPoints.length < totalAttempts) {
    dataPoints.push(cumulative);
  }

  const labels = Array.from({ length: totalAttempts }, () => '');

  const data = {
    labels,
    datasets: [
      {
        label: 'Evolução do Aluno',
        data: dataPoints,
        fill: false,
        borderColor: 'blue',
        backgroundColor: 'blue',
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: {
        display: true,
        text: 'Evolução das Tentativas - Acertos e Erros',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y;
            if (val > 0) return `Acertos acumulados: ${val}`;
            else if (val < 0) return `Erros acumulados: ${-val}`;
            return 'Neutro';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: Math.min(...dataPoints) - 1,
        max: Math.max(...dataPoints) + 1,
        title: {
          display: true,
          text: 'Acertos / Erros acumulados',
        },
      },
      x: {
        ticks: { display: false },
        grid: { display: false },
        title: { display: false },
      },
    },
  };

  // --- Trilhas respondidas (com algum algoritmo respondido) ---
  const tracksWithResponses = new Set(aluno.algorithms.map((alg) => alg.track_name.trim()));

  // Limpar espaços das trilhas inscritas para evitar falhas na comparação
  const enrolledTracksClean = (enrolledTracks ?? []).map(t => t.trim());

  // Filtrar trilhas inscritas que o aluno NÃO respondeu — exercícios não feitos
  const notStartedTracks = enrolledTracksClean.filter(
    (track) => !tracksWithResponses.has(track)
  );

  // Função para renderizar o cartão do algoritmo
  const renderAlgorithmCard = (alg: AlgorithmStats, key: string | number) => (
    <div key={key} className="border rounded-lg p-4 bg-white shadow">
      <h5 className="font-semibold mb-2">{alg.algorithm_title}</h5>
      <table className="w-full text-sm">
        <tbody>
          <tr>
            <td className="pr-2">Tentativas Totais:</td>
            <td className="text-right font-semibold">{alg.correct_attempts + alg.incorrect_attempts + alg.error_attempts}</td>
          </tr>
          <tr>
            <td className="pr-2">Corretas:</td>
            <td className="text-right text-green-600 font-semibold">{alg.correct_attempts}</td>
          </tr>
          <tr>
            <td className="pr-2">Incorretas:</td>
            <td className="text-right text-red-600 font-semibold">{alg.incorrect_attempts}</td>
          </tr>
          <tr>
            <td className="pr-2">Com Erro:</td>
            <td className="text-right text-yellow-600 font-semibold">{alg.error_attempts}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Função para renderizar seção de trilhas com seus algoritmos
  const renderTrackSection = (
    title: string,
    trackMap: Record<string, AlgorithmStats[]>,
    bgColor: string,
    textColor: string,
  ) => (
    <div className={`${bgColor} rounded-2xl p-4`}>
      <h3 className={`text-lg font-bold ${textColor} mb-4`}>{title}</h3>
      {Object.entries(trackMap).map(([trackName, algs]) => (
        <div key={trackName} className="mb-6">
          <h4 className="font-semibold text-md mb-2">{trackName}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {algs.map((alg, idx) => renderAlgorithmCard(alg, idx))}
          </div>
        </div>
      ))}
    </div>
  );

  // Renderizar lista de trilhas não feitas (exercícios não respondidos)
  const renderNotStartedTracks = (tracks: string[]) => (
    <div className="bg-gray-100 rounded-2xl p-4">
      <h3 className="text-lg font-bold text-gray-700 mb-4">Trilhas não feitas</h3>
      <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
        {tracks.map((track, idx) => (
          <li key={idx}>{track}</li>
        ))}
      </ul>
    </div>
  );

  // Agrupa algoritmos por trilha
  const trilhas: Record<string, AlgorithmStats[]> = {};
  for (const alg of aluno.algorithms) {
    if (!trilhas[alg.track_name]) trilhas[alg.track_name] = [];
    trilhas[alg.track_name].push(alg);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Estatísticas de {aluno.user_name}</h1>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="p-4 flex flex-col items-center justify-center rounded-xl shadow bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Total de exercícios respondidos corretamente</h3>
          <p className="text-2xl font-bold text-gray-800">{aluno.total_exercises}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center rounded-xl shadow bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Total de exercícios respondidos com erro</h3>
          <p className="text-2xl font-bold text-red-600">{aluno.incorrect_exercises}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center rounded-xl shadow bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Submissões que o código passou no teste</h3>
          <p className="text-2xl font-bold text-green-600">{aluno.correct_exercises}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center rounded-xl shadow bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Submissões que contém erro de execução</h3>
          <p className="text-2xl font-bold text-yellow-600">{totalErrors}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center rounded-xl shadow bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Submissões reprovadas no teste</h3>
          <p className="text-2xl font-bold text-red-500">{totalIncorrect}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center rounded-xl shadow bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Média de submissões com erros</h3>
          <p className="text-2xl font-bold text-blue-600">{averageIncorrectPerExercise}</p>
        </div>
        <div className="p-4 flex flex-col items-center justify-center rounded-xl shadow bg-white">
          <h3 className="text-xs font-semibold text-gray-600 mb-2 text-center">Submissões Totais</h3>
          <p className="text-2xl font-bold text-gray-800">{ totalCorrects +totalIncorrect + totalErrors}</p>
        </div>
      </div>

      {/* Gráfico de evolução */}
      <div className="bg-white rounded-lg p-6 shadow mb-8">
        <Line ref={chartRef} data={data} options={options} />
      </div>

      <div className="flex gap-4 items-center mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#B4EEB4' }} />
          <span className="text-sm">Resolvido corretamente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFB4B4' }} />
          <span className="text-sm">Submetido com erro</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFF59D' }} />
          <span className="text-sm">Não enviado</span>
        </div>
      </div>

      {/* Texto indicativo das trilhas */}
      <div className="mb-4">
        <span className="text-base font-semibold text-gray-700">
          Exercícios por trilha:
        </span>
      </div>

      {/* Algoritmos agrupados por trilha */}
      <div className="space-y-8">
        {Object.entries(trilhas).map(([trilha, algoritmos]) => (
          <div
            key={trilha}
            className="mb-8 bg-white rounded-lg shadow-md border-l-4 border-blue-300 p-4"
          >
            <h2 className="text-lg font-bold mb-3">Nome da tilha: {trilha}</h2>
            <div className="flex flex-wrap gap-4">
              {algoritmos.map((alg, idx) => (
                <div
                  key={alg.algorithm_title + idx}
                  className={`rounded-lg shadow p-4 w-64 border
                    ${
                      alg.notAnswered === 1
                        ? 'bg-yellow-50 border-yellow-200'
                        : alg.correct_attempts > 0
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }
                  `}
                >
                  <div className="font-semibold mb-2">Exercício: {alg.algorithm_title}</div>
                  <div className="text-xs">
                    Submissões Totais: {alg.correct_attempts + alg.incorrect_attempts + alg.error_attempts}
                  </div>
                  <div className="text-xs">
                    Submissões aprovadas no teste: {alg.correct_attempts}
                  </div>
                  <div className="text-xs">
                    Submissões reprovadas no teste: {alg.incorrect_attempts}
                  </div>
                  <div className="text-xs">
                    Submissões com erro de execução: {alg.error_attempts}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trilhas não feitas (exercícios não respondidos) */}
      {notStartedTracks.length > 0 && (
        <div className="mt-10">
          {renderNotStartedTracks(notStartedTracks)}
        </div>
      )}
    </div>
  );
}

export default AlunoStatsView;
