import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

interface FeedbackStatsViewProps {
  feedbackData: IFeedbackByTrack[];
}

const feelings = [
  { emoji: '😞', alt: 'Culpado', value: 1, color: '#D32F2F' },
  { emoji: '😔', alt: 'Triste', value: 2, color: '#1976D2' },
  { emoji: '🫤', alt: 'Insatisfeito', value: 3, color: '#FBC989' },
  { emoji: '😰', alt: 'Medo', value: 4, color: '#FFA711' },
  { emoji: '🤢', alt: 'Enojado', value: 5, color: '#388E3C' },
  { emoji: '😠', alt: 'Irritado', value: 6, color: '#7B1FA2' },
  { emoji: '😲', alt: 'Surpreso', value: 7, color: '#C2185B' },
  { emoji: '😌', alt: 'Sereno', value: 8, color: '#0288D1' },
  { emoji: '🙂', alt: 'Interessado', value: 9, color: '#F57F17' },
  { emoji: '😊', alt: 'Feliz', value: 10, color: '#F57Cff' },
  { emoji: '😃', alt: 'Muito Feliz', value: 11, color: '#00796B' },
  { emoji: '🤩', alt: 'Animado', value: 12, color: '#512DA8' },
];


function reduceGroup(array: IFeedbackByTrack[]) {

  return array.reduce(
    (acc, feedback) => {
      acc[feedback.value] = (acc[feedback.value] || 0) + 1;
      return acc;
    },
    {} as { [key: number]: number }
  );
}

function FeedbackStatsView({ feedbackData }: FeedbackStatsViewProps) {

  const valueCountsStart = reduceGroup(
    feedbackData.filter((item) => item.group === 'START')
  );

  const valueCountsEnd = reduceGroup(
    feedbackData.filter((item) => item.group === 'END')
  );

  const labels = feelings.map((feeling) => `${feeling.emoji} ${feeling.alt}`);
  const combinedData = feelings.map(
    (feeling) => valueCountsStart[feeling.value] || 0
  );

  const combinedDataEnd = feelings.map(
    (feeling) => valueCountsEnd[feeling.value] || 0
  );

  const barData = {
    labels,
    datasets: [
      {
        label: 'Início',
        data: combinedData,
        backgroundColor: feelings.map((feeling) => feeling.color),
      },
    ],
  };


  const barDataEnd = {
    labels,
    datasets: [
      {
        label: 'Final',
        data: combinedDataEnd,
        backgroundColor: feelings.map((feeling) => feeling.color),
      },
    ],
  };

  if (barData.datasets[0].data.every((value) => value === 0)) {
    return <div className='flex items-center justify-center'>Sem dados</div>;
  }
  console.log("FeedbackStatsView linha 108");

  return (
    <div className='w-full flex flex-col gap-2'>
      <div className='w-full flex items-center justify-center mx-auto mt-8 gap-8 max-h-[75vh]'>
        <div className='w-full'>
          <Bar
            data={barData}
            options={{
              indexAxis: 'y',
              scales: {
                y: {
                  beginAtZero: true,
                  min: 1,
                  suggestedMax: Math.max(...combinedData),
                },
                x: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Início da trilha',
                },
              },
            }}
          />
        </div>
        <div className='w-full'>
          <Bar
            data={barDataEnd}
            options={{
              indexAxis: 'y',
              scales: {
                y: {
                  beginAtZero: true,
                  min: 1,
                  suggestedMax: Math.max(...combinedDataEnd),
                  ticks: {
                    display: false,
                  },
                },
                x: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: 'Final da trilha',
                },
              },
            }}
          />
        </div>
      </div>
      <p className='text-slate-600 text-sm'>
        <strong>Obs</strong>: Alunos que responderam no início da trilha, não
        necessariamente responderão ao final. Portanto, os dados de início e fim
        de trilhas podem ter contagens diferentes.
      </p>
    </div>
  );
}

export default FeedbackStatsView;
