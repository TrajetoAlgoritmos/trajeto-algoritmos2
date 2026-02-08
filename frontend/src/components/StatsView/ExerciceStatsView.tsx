interface Student {
  name: string;
  correct: boolean;
  wrong: boolean;
  error: boolean;
  notAnswered: boolean;
}

interface Exercise {
  id: string;
  name: string;
  totalAttempts: number;
  correctAttempts: number;
  wrongAttempts: number;
  executionErrors: number;
  notAnswered: boolean;
  students: Student[];
}

interface Props {
  data: Record<string, any>;
}

function ExerciseStatsView({ data }: Props) {
  const exerciseList: Exercise[] = Object.entries(data).map(([key, value]) => {
    const students: Student[] = (value.students ?? []).map((s: any) => ({
      name: s.user_name,
      correct: s.correct_attempts > 0,
      wrong: s.incorrect_attempts > 0,
      error: s.error_attempts > 0,
      notAnswered: s.total_attempts === 0,
    }));

    return {
      id: key,
      name: value.algorithm_title,
      totalAttempts: value.total_attempts,
      correctAttempts: value.correct_attempts,
      wrongAttempts: value.incorrect_attempts,
      executionErrors: value.error_attempts,
      notAnswered: value.notAnswered,
      students,
    };
  });

  if (exerciseList.length === 0) {
    return <p className="text-center text-gray-500">Nenhum dado de exercício disponível.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Estatísticas por Exercício</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exerciseList.map((exercise) => {
          const correct = exercise.students.filter((s) => s.correct);
          const wrong = exercise.students.filter((s) => s.wrong);
          const error = exercise.students.filter((s) => s.error);
          const notAnswered = exercise.students.filter((s) => s.notAnswered);

          const totalCalculated = exercise.correctAttempts + exercise.wrongAttempts + exercise.executionErrors;

          return (
            <div
              key={exercise.id}
              className="p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
            >
              <h3 className="text-lg font-bold mb-2">{exercise.name}</h3>
              <ul className="text-sm text-gray-700 space-y-1 mb-2">
                <li><strong>Submissões totais:</strong> {totalCalculated}</li>
                <li><strong>Submissões aprovadas no teste:</strong> {exercise.correctAttempts}</li>
                <li><strong>Submissões reprovadas no teste:</strong> {exercise.wrongAttempts}</li>
                <li><strong>Submissões com erros de execução:</strong> {exercise.executionErrors}</li>
                <li><strong>Não respondido (geral):</strong> {exercise.notAnswered ? '-' : '0'}</li>
              </ul>

              <div className="text-sm text-gray-800 space-y-2">
                <div>
                  <strong>Alunos cujo o código foi aprovado ({correct.length}):</strong>{" "}
                  {correct.length > 0 ? correct.map((s) => s.name).join(', ') : 'Nenhum'}
                </div>
                <div>
                  <strong>Alunos cujo o código foi reprovado ({wrong.length}):</strong>{" "}
                  {wrong.length > 0 ? wrong.map((s) => s.name).join(', ') : 'Nenhum'}
                </div>
                <div>
                  <strong>Alunos cujo o código contém erro de execução ({error.length}):</strong>{" "}
                  {error.length > 0 ? error.map((s) => s.name).join(', ') : 'Nenhum'}
                </div>
                <div>
                  <strong>Alunos que não respondeu o exercício ({notAnswered.length}):</strong>{" "}
                  {notAnswered.length > 0 ? notAnswered.map((s) => s.name).join(', ') : 'Nenhum'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExerciseStatsView;
