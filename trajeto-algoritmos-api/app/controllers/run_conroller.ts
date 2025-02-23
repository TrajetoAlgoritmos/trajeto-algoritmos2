import env from '#start/env';
import { HttpContext } from '@adonisjs/core/http';
import axios from 'axios';

export default class JudgeController {
  async submissions({ request }: HttpContext) {
    const { sourceCode, languageId, stdin } = request.all()
    console.log("label host: ", env.get('JUDGE_HOST') + '/submissions?base64_encoded=true&wait=true',);

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

    return {
      data: response.data,
    }
  }
}
