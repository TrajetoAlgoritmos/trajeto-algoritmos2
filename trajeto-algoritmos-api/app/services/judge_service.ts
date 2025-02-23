import { AlgorithmRunResponse } from '#interfaces/index'
import env from '#start/env'
import axios from 'axios'

const runAlgorithm = async (
  sourceCode: string,
  languageId: string,
  stdin: string
): Promise<AlgorithmRunResponse | null>  => {
  try {
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
  } catch (error) {
    console.log("erro jugde 0: ", error);
    return null;
  }
  
}

export { runAlgorithm }
