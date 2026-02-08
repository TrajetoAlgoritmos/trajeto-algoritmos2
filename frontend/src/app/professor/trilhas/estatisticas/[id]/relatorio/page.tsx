'use client';
import ExerciseStatsView from '@/components/StatsView/ExerciceStatsView';
import ReportStatsView from '@/components/StatsView/ReportStatsView';
import api from '@/config/api'; // Adicione esta importação
import { getTrackUsersSummaryService } from '@/services/tracks';
import { useEffect, useState } from 'react';

// Adicione as importações:
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ViewTrackReportPage({ params: { id } }) {
  const [studentViewData, setStudentViewData] = useState<any>();
  const [trackName, setTrackName] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const response = await getTrackUsersSummaryService(id);
      if (response?.data?.data) {
        setStudentViewData({
          studentView: response.data.data['studentView'] ?? {},
          algorithmView: response.data.data['algorithmView'] ?? [],
        });
      }
      // Buscar nome da trilha
      try {
        const tracks = (await api.get('/tracks'))?.data?.data || [];
        const found = tracks.find((t: any) => String(t.id) === String(id));
        setTrackName(found?.title || id);
      } catch {
        setTrackName(id);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);

  // Função para exportar PDF usando jsPDF e autoTable
  const handleExportPDF = () => {
    if (!studentViewData) return;

    const doc = new jsPDF();
    let y = 20;

    // Data de criação
    const dataCriacao = new Date().toLocaleDateString();

    // Título principal com nome da trilha
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`Relatório da Trilha: ${trackName}`, 14, y);
    y += 12;

    // Título da seção dos alunos
    doc.setFontSize(15);
    doc.setFont(undefined, 'bold');
    doc.text('Relatório das Tentativas dos Alunos', 14, y);
    y += 10;

    // --- Acertos ---
    const correctStudents = Object.values(studentViewData.studentView)
      .filter((s: any) => s.correct_attempts > 0);
    const totalCorrect = correctStudents.reduce((sum: number, s: any) => sum + s.correct_attempts, 0);

    autoTable(doc, {
      startY: y,
      head: [[
        { content: 'Alunos cujo código passou no teste', styles: { halign: 'left' } },
        { content: 'Submissões totais', styles: { halign: 'center' } }
      ]],
      body: [
        ...correctStudents.map((s: any) => [
          s.user_name,
          { content: s.correct_attempts, styles: { halign: 'center' } }
        ]),
        [
          { content: 'Total', styles: { fontStyle: 'bold', halign: 'left' } },
          { content: totalCorrect.toString(), styles: { fontStyle: 'bold', halign: 'center' } }
        ]
      ],
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [46, 204, 113] },
      columnStyles: {
        0: { cellWidth: '85%' },
        1: { cellWidth: '15%' }
      }
    });
    y = doc.lastAutoTable.finalY + 8;

    // --- Incorretas ---
    const incorrectStudents = Object.values(studentViewData.studentView)
      .filter((s: any) => s.incorrect_attempts > 0);
    const totalIncorrect = incorrectStudents.reduce((sum: number, s: any) => sum + s.incorrect_attempts, 0);

    autoTable(doc, {
      startY: y,
      head: [[
        { content: 'Alunos cujo código não passou no teste', styles: { halign: 'left' } },
        { content: 'Submissões totais', styles: { halign: 'center' } }
      ]],
      body: [
        ...incorrectStudents.map((s: any) => [
          s.user_name,
          { content: s.incorrect_attempts, styles: { halign: 'center' } }
        ]),
        [
          { content: 'Total', styles: { fontStyle: 'bold', halign: 'left' } },
          { content: totalIncorrect.toString(), styles: { fontStyle: 'bold', halign: 'center' } }
        ]
      ],
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [231, 76, 60] },
      columnStyles: {
        0: { cellWidth: '85%' },
        1: { cellWidth: '15%' }
      }
    });
    y = doc.lastAutoTable.finalY + 8;

    // --- Erros de execução ---
    const errorStudents = Object.values(studentViewData.studentView)
      .filter((s: any) => s.error_attempts > 0);
    const totalError = errorStudents.reduce((sum: number, s: any) => sum + s.error_attempts, 0);

    autoTable(doc, {
      startY: y,
      head: [[
        { content: 'Alunos cujo código está com erro de sintaxe', styles: { halign: 'left' } },
        { content: 'Submissões totais', styles: { halign: 'center' } }
      ]],
      body: [
        ...errorStudents.map((s: any) => [
          s.user_name,
          { content: s.error_attempts, styles: { halign: 'center' } }
        ]),
        [
          { content: 'Total', styles: { fontStyle: 'bold', halign: 'left' } },
          { content: totalError.toString(), styles: { fontStyle: 'bold', halign: 'center' } }
        ]
      ],
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [241, 196, 15] },
      columnStyles: {
        0: { cellWidth: '85%' },
        1: { cellWidth: '15%' }
      }
    });
    y = doc.lastAutoTable.finalY + 8;

    // --- Não respondido ---
    const notAnsweredStudents = Object.values(studentViewData.studentView)
      .filter((s: any) => s.notAnswered);
    const totalNotAnswered = notAnsweredStudents.length;

    autoTable(doc, {
      startY: y,
      head: [['Alunos que não fizeram nenhum exercício da trilha']],
      body: [
        ...notAnsweredStudents.map((s: any) => [s.user_name]),
        [{ content: `Total: ${totalNotAnswered}`, colSpan: 1, styles: { fontStyle: 'bold', halign: 'right' } }]
      ],
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [149, 165, 166] },
    });

    // --- Quebra de página para Estatísticas por Exercício ---
    doc.addPage();
    y = 20;

    // Título novamente no topo da nova página
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`Relatório da Trilha: ${trackName}`, 14, y);
    y += 12;

    // Título da seção de exercícios
    doc.setFontSize(15);
    doc.setFont(undefined, 'bold');
    doc.text('Estatísticas por Exercício', 14, y);
    y += 10;

    Object.values(studentViewData.algorithmView).forEach((exercise: any, idx: number) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(`Relatório da Trilha: ${trackName}`, 14, y);
        y += 12;
        doc.setFontSize(15);
        doc.setFont(undefined, 'bold');
        doc.text('Estatísticas por Exercício', 14, y);
        y += 10;
      }
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text(`Exercício: ${exercise.algorithm_title}`, 14, y += 10);

      // Tabela de estatísticas gerais do exercício
      autoTable(doc, {
        startY: y + 2,
        head: [['Submissões Totais', 'Passou no teste (submetido)', 'Não passou no teste (submetido)', 'Contém erros de execução', 'Não respondido']],
        body: [[
          exercise.correct_attempts + exercise.incorrect_attempts + exercise.error_attempts,
          exercise.correct_attempts,
          exercise.incorrect_attempts,
          exercise.error_attempts,
          exercise.notAnswered ? ' - ' : ' 0 ',
        ]],
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [52, 152, 219] },
      });
      y = doc.lastAutoTable.finalY + 2;

      // Tabela de alunos por categoria, um aluno por linha, "Nenhum" se vazio
      const students = exercise.students || [];
      const correct = students.filter((s: any) => s.correct_attempts > 0).map((s: any) => s.user_name);
      const wrong = students.filter((s: any) => s.incorrect_attempts > 0).map((s: any) => s.user_name);
      const error = students.filter((s: any) => s.error_attempts > 0).map((s: any) => s.user_name);
      const notAnswered = students.filter((s: any) => s.total_attempts === 0).map((s: any) => s.user_name);

      const maxRows = Math.max(
        correct.length || 1,
        wrong.length || 1,
        error.length || 1,
        notAnswered.length || 1
      );

      autoTable(doc, {
        startY: y,
        head: [['Aluno(s) cujo o código submetido passou no teste', 'Aluno(s) cujo o código submetido não passou no teste', 'Aluno(s) cujo o código submetido contém erros de execução', 'Aluno(s) que não Responderam']],
        body: Array.from({ length: maxRows }).map((_, i) => [
          correct[i] || (i === 0 ? 'Nenhum' : ''),
          wrong[i] || (i === 0 ? 'Nenhum' : ''),
          error[i] || (i === 0 ? 'Nenhum' : ''),
          notAnswered[i] || (i === 0 ? 'Nenhum' : ''),
        ]),
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [200, 200, 200] },
      });
      y = doc.lastAutoTable.finalY + 8;
    });

    // Rodapé: número da página e data de criação
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      // Data à esquerda
      doc.text(
        `${dataCriacao}`,
        14,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'left' }
      );
      // Página à direita
      doc.text(
        `${i}/${pageCount}`,
        doc.internal.pageSize.getWidth() - 14,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'right' }
      );
    }

    doc.save(`relatorio-trilha-${trackName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="flex flex-1 flex-col w-full gap-4 rounded-xl shadow-xl bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center">Relatório da Trilha: {trackName}</h1>
        <button
          onClick={handleExportPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Exportar PDF
        </button>
      </div>

      {/* Exibindo o componente ReportStatsView */}
      {studentViewData ? (
        <ReportStatsView data={studentViewData} />
      ) : (
        <p>Carregando dados...</p>
      )}

      {studentViewData ? (
        <ExerciseStatsView data={Object.values(studentViewData.algorithmView)} />
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
}

export default ViewTrackReportPage;