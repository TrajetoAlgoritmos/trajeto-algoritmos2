import { Bar } from 'react-chartjs-2';

interface StudentData {
  user_name: string;
  total_attempts: number;
  correct_attempts: number;
  incorrect_attempts: number;
  error_attempts: number;
  notAnswered: boolean;
}

interface StudentStatsViewProps {
  data: {
    studentView: Record<string, StudentData>;
  };
}

function StudentStatsView({ data }: StudentStatsViewProps) {
  const studentData = Object.values(data.studentView);

  const studentNames: string[] = [];
  const correctPercentageData: number[] = [];
  const incorrectPercentageData: number[] = [];
  const errorPercentageData: number[] = [];
  const notAnsweredPercentageData: number[] = [];

  studentData.forEach((student) => {
    studentNames.push(student.user_name);

    const totalAttempts = student.total_attempts;
    const correctPercentage =
      (student.correct_attempts / totalAttempts) * 100 || 0;
    correctPercentageData.push(correctPercentage);

    const incorrectPercentage =
      (student.incorrect_attempts / totalAttempts) * 100 || 0;
    incorrectPercentageData.push(incorrectPercentage);

    const errorPercentage = (student.error_attempts / totalAttempts) * 100 || 0;
    errorPercentageData.push(errorPercentage);

    const notAnsweredCount = student.notAnswered ? 1 : 0;
    notAnsweredPercentageData.push((notAnsweredCount / totalAttempts) * 100);

  });

  const chartData = {
    labels: studentNames,
    datasets: [
      {
        label: 'Submissões aprovadas no teste',
        data: correctPercentageData,
        backgroundColor: 'rgba(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Submissões reprovadas no teste',
        data: incorrectPercentageData,
        backgroundColor: 'rgba(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Submissões com erro de execução',
        data: errorPercentageData,
        backgroundColor: 'rgba(255, 206, 86)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Não respondido',
        data: notAnsweredPercentageData,
        backgroundColor: 'rgba(153, 102, 255)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            const percentage = context.parsed.y.toFixed(2) + '%';
            label += `${percentage}`;
            return label;
          },
        },
      },
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Submissões por aluno (%)',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: function (value: number) {
            return value + '%';
          },
        },
      },
    },
  };

  return (
    <div className='container mx-auto p-4'>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default StudentStatsView;
