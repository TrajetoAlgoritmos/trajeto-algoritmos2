import db from '@adonisjs/lucid/services/db'

const sql = `
WITH latest_attempts AS (
    SELECT
        ans.user_id,
        ta.track_id,
        ans.track_algorithm_id,
        MAX(ans.created_at) AS last_attempt_time
    FROM
        answers ans
        JOIN track_algorithms ta ON ans.track_algorithm_id = ta.id
    WHERE
        ta.track_id = ?
    GROUP BY
        ans.user_id,
        ta.track_id,
        ans.track_algorithm_id
),
attempts_summary AS (
    SELECT
        u.id AS user_id,
        u.name AS user_name,
        t.id AS track_id,
        t.title AS track_title,
        a.id AS algorithm_id,
        a.title AS algorithm_title,
        ta.id AS track_algorithm_id,
        ans.content AS answer_content,
        ans.status AS answer_status,
        ans.created_at AS answer_date,
        COUNT(ans.id) AS total_attempts,
        SUM(CASE WHEN ans.status = 1 THEN 1 ELSE 0 END) AS correct_attempts,
        SUM(CASE WHEN ans.status = 2 THEN 1 ELSE 0 END) AS incorrect_attempts,
        SUM(CASE WHEN ans.status = 3 THEN 1 ELSE 0 END) AS error_attempts,
        SUM(CASE WHEN ans.status = 4 THEN 1 ELSE 0 END) AS running_attempts,
        CASE
            WHEN MAX(ans.user_id) IS NULL THEN 1
            ELSE 0
        END AS notAnswered
    FROM
        users u
        JOIN track_users tu ON u.id = tu.user_id
        JOIN tracks t ON tu.track_id = t.id
        JOIN track_algorithms ta ON t.id = ta.track_id
        JOIN algorithms a ON ta.algorithm_id = a.id
        LEFT JOIN answers ans ON ans.user_id = u.id AND ans.track_algorithm_id = ta.id
    WHERE
        t.id = ?
    GROUP BY
        u.id, u.name, t.id, t.title, a.id, a.title, ta.id, ans.content, ans.status, ans.created_at
)
SELECT
    user_id,
    user_name,
    track_id,
    track_title,
    algorithm_id,
    algorithm_title,
    track_algorithm_id,
    answer_content,
    answer_status,
    answer_date,
    CAST(COALESCE(total_attempts, 0) AS UNSIGNED) AS total_attempts,
    CAST(COALESCE(correct_attempts, 0) AS UNSIGNED) AS correct_attempts,
    CAST(COALESCE(incorrect_attempts, 0) AS UNSIGNED) AS incorrect_attempts,
    CAST(COALESCE(error_attempts, 0) AS UNSIGNED) AS error_attempts,
    CAST(COALESCE(running_attempts, 0) AS UNSIGNED) AS running_attempts,
    notAnswered,
    CASE
        WHEN COALESCE(correct_attempts, 0) > 0 THEN
            CONCAT(
                'O usuário respondeu corretamente o algoritmo após ',
                COALESCE(incorrect_attempts, 0) + COALESCE(error_attempts, 0), ' tentativas sem sucesso, sendo ',
                COALESCE(error_attempts, 0), ' tentativas com erro e ',
                COALESCE(incorrect_attempts, 0), ' tentativas incorretas.'
            )
        WHEN COALESCE(incorrect_attempts, 0) > 0 THEN
            CONCAT(
                'O usuário respondeu incorretamente nas ',
                COALESCE(incorrect_attempts, 0), ' tentativas, sendo ',
                COALESCE(error_attempts, 0), ' delas com erro.'
            )
        ELSE 'O usuário ainda não respondeu corretamente.'
    END AS progress_description
FROM
    attempts_summary
ORDER BY
    user_id, algorithm_id, answer_date DESC;
`

interface SelectResult {
  user_id: number
  user_name: string
  track_id: number
  track_title: string
  algorithm_id: number
  algorithm_title: string
  track_algorithm_id: number
  answer_content: string
  answer_status: number
  answer_date: string
  total_attempts: number
  correct_attempts: number
  incorrect_attempts: number
  error_attempts: number
  running_attempts: number
  notAnswered: boolean
  progress_description: string
}

interface AlgorithmDetails {
  algorithm_id: number
  algorithm_title: string
  track_algorithm_id: number
  total_attempts: number
  correct_attempts: number
  incorrect_attempts: number
  error_attempts: number
  running_attempts: number
  notAnswered: boolean
  progress_description: string
  correct_percentage: number
  incorrect_percentage: number
  error_percentage: number
  notAnswered_percentage: number
  completed: boolean
  answers: { content: string; status: number; date: string }[]
}

interface StudentDetails {
  user_id: number
  user_name: string
  total_attempts: number
  correct_attempts: number
  incorrect_attempts: number
  error_attempts: number
  running_attempts: number
  notAnswered: boolean
  progress_description: string
  correct_percentage: number
  incorrect_percentage: number
  error_percentage: number
  notAnswered_percentage: number
  answers: { content: string; status: number; date: string }[]
}

interface StudentView {
  [userId: number]: {
    user_name: string
    total_attempts: number
    correct_attempts: number
    incorrect_attempts: number
    error_attempts: number
    running_attempts: number
    notAnswered: boolean
    correct_percentage: number
    incorrect_percentage: number
    error_percentage: number
    notAnswered_percentage: number
    completed: boolean
    algorithms: AlgorithmDetails[]
  }
}

interface AlgorithmView {
  [algorithmId: number]: {
    algorithm_title: string
    total_attempts: number
    correct_attempts: number
    incorrect_attempts: number
    error_attempts: number
    running_attempts: number
    notAnswered: boolean
    correct_percentage: number
    incorrect_percentage: number
    error_percentage: number
    notAnswered_percentage: number
    students: StudentDetails[]
  }
}

interface GetStudentAlgorithmReturn {
  studentView: StudentView
  algorithmView: AlgorithmView
}

const getStudentAlgorithm = function (selectResults: Array<SelectResult>) {
  const studentView: StudentView = {}
  const algorithmView: AlgorithmView = {}

  selectResults.forEach((result) => {
    // Processamento para a visão do aluno
    if (!studentView[result.user_id]) {
      studentView[result.user_id] = {
        user_name: result.user_name,
        total_attempts: 0,
        correct_attempts: 0,
        incorrect_attempts: 0,
        error_attempts: 0,
        running_attempts: 0,
        notAnswered: false,
        correct_percentage: 0,
        incorrect_percentage: 0,
        error_percentage: 0,
        notAnswered_percentage: 0,
        completed: false,
        algorithms: [],
      }
    }
    const studentAlg = studentView[result.user_id]

    let existingAlgorithm = studentAlg.algorithms.find(
      (alg) => alg.algorithm_id === result.algorithm_id
    )
    if (!existingAlgorithm) {
      existingAlgorithm = {
        algorithm_id: result.algorithm_id,
        algorithm_title: result.algorithm_title,
        track_algorithm_id: result.track_algorithm_id,
        total_attempts: 0,
        correct_attempts: 0,
        incorrect_attempts: 0,
        error_attempts: 0,
        running_attempts: 0,
        notAnswered: false,
        progress_description: '',
        correct_percentage: 0,
        incorrect_percentage: 0,
        error_percentage: 0,
        notAnswered_percentage: 0,
        completed: false,
        answers: [],
      }
      studentAlg.algorithms.push(existingAlgorithm)
    }

    existingAlgorithm.total_attempts += result.total_attempts
    existingAlgorithm.correct_attempts += result.correct_attempts
    existingAlgorithm.incorrect_attempts += result.incorrect_attempts
    existingAlgorithm.error_attempts += result.error_attempts
    existingAlgorithm.running_attempts += result.running_attempts
    existingAlgorithm.notAnswered = existingAlgorithm.notAnswered || result.notAnswered
    existingAlgorithm.progress_description = result.progress_description
    if (result.answer_status)
      existingAlgorithm.answers.push({
        content: result.answer_content,
        status: result.answer_status,
        date: result.answer_date,
      })

    // Processamento para a visão do algoritmo
    if (!algorithmView[result.algorithm_id]) {
      algorithmView[result.algorithm_id] = {
        algorithm_title: result.algorithm_title,
        total_attempts: 0,
        correct_attempts: 0,
        incorrect_attempts: 0,
        error_attempts: 0,
        running_attempts: 0,
        notAnswered: false,
        correct_percentage: 0,
        incorrect_percentage: 0,
        error_percentage: 0,
        notAnswered_percentage: 0,
        students: [],
      }
    }
    const algorithm = algorithmView[result.algorithm_id]

    let existingStudent = algorithm.students.find((student) => student.user_id === result.user_id)
    if (!existingStudent) {
      existingStudent = {
        user_id: result.user_id,
        user_name: result.user_name,
        total_attempts: 0,
        correct_attempts: 0,
        incorrect_attempts: 0,
        error_attempts: 0,
        running_attempts: 0,
        notAnswered: false,
        progress_description: '',
        correct_percentage: 0,
        incorrect_percentage: 0,
        error_percentage: 0,
        notAnswered_percentage: 0,
        answers: [],
      }
      algorithm.students.push(existingStudent)
    }

    existingStudent.total_attempts += result.total_attempts
    existingStudent.correct_attempts += result.correct_attempts
    existingStudent.incorrect_attempts += result.incorrect_attempts
    existingStudent.error_attempts += result.error_attempts
    existingStudent.running_attempts += result.running_attempts
    existingStudent.notAnswered = existingStudent.notAnswered || result.notAnswered
    existingStudent.progress_description = result.progress_description

    if (result.answer_status)
      existingStudent.answers.push({
        content: result.answer_content,
        status: result.answer_status,
        date: result.answer_date,
      })
  })

  // Ordenar as respostas do mais recente para o mais antigo
  for (const userId in studentView) {
    const student = studentView[userId]
    student.algorithms.forEach((alg) => {
      alg.answers.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    })
  }
  for (const algorithmId in algorithmView) {
    const algorithm = algorithmView[algorithmId]
    algorithm.students.forEach((student) => {
      student.answers.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    })
  }

  return {
    studentView: studentView,
    algorithmView: algorithmView,
  } as GetStudentAlgorithmReturn
}

const getUsersSummaryByTrack = async function (trackId: number) {
  try {
    const r = await db.rawQuery(sql, [trackId, trackId])

    const selectResults = r[0] as SelectResult[]
    const { studentView, algorithmView } = getStudentAlgorithm(selectResults)

    // Atualizar as porcentagens totais dos alunos e verificação de conclusão da trilha
    for (const userId in studentView) {
      const student = studentView[userId]
      student.total_attempts = student.algorithms.reduce((acc, alg) => acc + alg.total_attempts, 0)
      student.correct_attempts = student.algorithms.reduce(
        (acc, alg) => acc + alg.correct_attempts,
        0
      )
      student.incorrect_attempts = student.algorithms.reduce(
        (acc, alg) => acc + alg.incorrect_attempts,
        0
      )
      student.error_attempts = student.algorithms.reduce((acc, alg) => acc + alg.error_attempts, 0)
      student.running_attempts = student.algorithms.reduce(
        (acc, alg) => acc + alg.running_attempts,
        0
      )

      student.correct_percentage = student.total_attempts
        ? (student.correct_attempts / student.total_attempts) * 100
        : 0
      student.incorrect_percentage = student.total_attempts
        ? (student.incorrect_attempts / student.total_attempts) * 100
        : 0
      student.error_percentage = student.total_attempts
        ? (student.error_attempts / student.total_attempts) * 100
        : 0
      student.notAnswered_percentage =
        (student.algorithms.reduce((acc, alg) => acc + (alg.notAnswered ? 1 : 0), 0) /
          student.algorithms.length) *
        100
      student.completed = student.algorithms.every((alg) => alg.completed)
    }

    // Atualizar as porcentagens totais dos algoritmos
    for (const algorithmId in algorithmView) {
      const algorithm = algorithmView[algorithmId]
      algorithm.total_attempts = algorithm.students.reduce(
        (acc, student) => acc + student.total_attempts,
        0
      )
      algorithm.correct_attempts = algorithm.students.reduce(
        (acc, student) => acc + student.correct_attempts,
        0
      )
      algorithm.incorrect_attempts = algorithm.students.reduce(
        (acc, student) => acc + student.incorrect_attempts,
        0
      )
      algorithm.error_attempts = algorithm.students.reduce(
        (acc, student) => acc + student.error_attempts,
        0
      )
      algorithm.running_attempts = algorithm.students.reduce(
        (acc, student) => acc + student.running_attempts,
        0
      )

      algorithm.correct_percentage = algorithm.total_attempts
        ? (algorithm.correct_attempts / algorithm.total_attempts) * 100
        : 0
      algorithm.incorrect_percentage = algorithm.total_attempts
        ? (algorithm.incorrect_attempts / algorithm.total_attempts) * 100
        : 0
      algorithm.error_percentage = algorithm.total_attempts
        ? (algorithm.error_attempts / algorithm.total_attempts) * 100
        : 0
      algorithm.notAnswered_percentage =
        (algorithm.students.reduce((acc, student) => acc + (student.notAnswered ? 1 : 0), 0) /
          algorithm.students.length) *
        100
    }

    // Convertendo para JSON
    return {
      studentView,
      algorithmView,
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export { getUsersSummaryByTrack }
