import { AlgorithmRunResponse } from '#interfaces/index'
import env from '#start/env'
import axios from 'axios'

const runAlgorithm = async (
  sourceCode: string,
  languageId: string,
  stdin: string
): Promise<AlgorithmRunResponse> => {
  const response = await axios.post(
    env.get('JUDGE_HOST') + '/submissions?base64_encoded=true&wait=true',
    {
      source_code: sourceCode,
      language_id: languageId,
      stdin: stdin,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-judge-token': env.get('JUDGE_HEADER_VALUE'),
      },
    }
  )

  return response.data as AlgorithmRunResponse
}

export { runAlgorithm }
