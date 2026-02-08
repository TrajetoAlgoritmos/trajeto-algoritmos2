import Link from "next/link";

interface StudentData {
  user_id: string;
  user_name: string;
  total_attempts: number;
  correct_attempts: number;
  incorrect_attempts: number;
  error_attempts: number;
  notAnswered: boolean;
}

interface ReportStatsViewProps {
  data: {
    studentView: Record<string, StudentData>;
    allStudents: { user_id: string; user_name: string }[];
  };
}

function ReportStatsView({ data }: ReportStatsViewProps) {
  // Alunos presentes no studentView
  const studentData = Object.entries(data?.studentView ?? {}).map(
    ([userId, student]) => {
      const total = student.total_attempts ?? 0;
      return {
        ...student,
        user_id: userId,
        notAnswered: total === 0, // Marca como não respondeu se total_attempts for 0
      };
    }
  );

  // Alunos que nem aparecem no studentView
  const missingStudents = (data.allStudents ?? [])
    .filter((student) => !data.studentView?.[student.user_id])
    .map((student) => ({
      ...student,
      user_id: student.user_id,
      total_attempts: 0,
      correct_attempts: 0,
      incorrect_attempts: 0,
      error_attempts: 0,
      notAnswered: true,
    }));

  // Combina todos os alunos
  const allStudentData: StudentData[] = [...studentData, ...missingStudents];

  // Filtragens
  const correctStudents = allStudentData.filter((s) => s.correct_attempts > 0);
  const incorrectStudents = allStudentData.filter((s) => s.incorrect_attempts > 0);
  const errorStudents = allStudentData.filter((s) => s.error_attempts > 0);
  const notAnsweredStudents = allStudentData.filter((s) => s.notAnswered);

  // Totais
  const totalCorrect = correctStudents.reduce((sum, s) => sum + s.correct_attempts, 0);
  const totalIncorrect = incorrectStudents.reduce((sum, s) => sum + s.incorrect_attempts, 0);
  const totalError = errorStudents.reduce((sum, s) => sum + s.error_attempts, 0);
  const totalNotAnswered = notAnsweredStudents.length;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Relatório de submissões dos alunos</h1>

      {/* Seção de Acertos */}
      <SectionTable
        title="Alunos que o código foi aprovado no teste"
        students={correctStudents}
        label="Sumissões totais"
        getValue={(s) => s.correct_attempts}
        total={totalCorrect}
      />

      {/* Seção de Incorretas */}
      <SectionTable
        title="Alunos que o código foi reprovado no teste"
        students={incorrectStudents}
        label="Submissões totais"
        getValue={(s) => s.incorrect_attempts}
        total={totalIncorrect}
      />

      {/* Seção de Erros */}
      <SectionTable
        title="Alunos com submissões que contém erros de execução"
        students={errorStudents}
        label="Submissões totais"
        getValue={(s) => s.error_attempts}
        total={totalError}
      />

      {/* Seção de Não Respondido */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Alunos que não responderam nenhum exercício da trilha</h2>
        {notAnsweredStudents.length > 0 ? (
          <table className="table-auto w-full text-sm mb-4">
            <thead>
              <tr>
                <th className="border-b font-medium p-4 text-left">Aluno</th>
              </tr>
            </thead>
            <tbody>
              {notAnsweredStudents.map((student) => (
                <tr key={student.user_id}>
                  <td className="border-b p-4 text-left">
                    <Link
                      href={`/professor/trilhas/estatisticas/aluno/${student.user_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {student.user_name}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-600 mb-2">
            Todos os alunos tentaram pelo menos uma vez.
          </p>
        )}
        <div className="font-semibold p-4">
          Total: {totalNotAnswered}
        </div>
      </div>
    </div>
  );
}

function SectionTable({
  title,
  students,
  label,
  getValue,
  total,
}: {
  title: string;
  students: StudentData[];
  label: string;
  getValue: (s: StudentData) => number;
  total: number;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {students.length > 0 ? (
        <>
          <table className="table-auto w-full text-sm mb-4">
            <thead>
              <tr>
                <th className="border-b font-medium p-4 text-left">Aluno</th>
                <th className="border-b font-medium p-4 text-center">{label}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.user_id}>
                  <td className="border-b p-4 text-left">
                    <Link
                      href={`/professor/trilhas/estatisticas/aluno/${student.user_id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {student.user_name}
                    </Link>
                  </td>
                  <td className="border-b p-4 text-center">{getValue(student)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="font-semibold p-4">Total: {total}</div>
        </>
      ) : (
        <p className="text-sm text-gray-600 mb-2">Nenhum aluno nessa categoria.</p>
      )}
    </div>
  );
}

export default ReportStatsView;
