import { HttpContext } from '@adonisjs/core/http'
import Answer from '../models/answer.js'
import TrackAlgorithm from '#models/track_algorithm'
import AlgorithmTest from '#models/algorithm_test'
import { AnswerStatus, ProfileId } from '#models/enums'
import { runAlgorithm } from '#services/judge_service'
import { JudgeStatusCode } from '#services/judge_status'
import { DateTime } from 'luxon'
import AnswerAlgorithmTest from '#models/answer_algorithm_tests'
import Track from '#models/track'
import TrackUser from '#models/track_user'

export default class AnswerController {
  // Create
  async create({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    const userId = user.id
    const data = request.only(['track_algorithms_id', 'content', 'languageId'])

    const trackAlgorithms = await TrackAlgorithm.findOrFail(data.track_algorithms_id)

    const track = await Track.findOrFail(trackAlgorithms.trackId)

    const trackUsers = await TrackUser.query()
      .where('user_id', userId)
      .where('track_id', track.id)
      .first()

    if (!trackUsers) {
      throw new Error('User is not enrolled in the track')
    }

    if (track.closeAt < DateTime.now()) {
      throw new Error('Track is closed')
    }

    if (track.startAt > DateTime.now()) {
      throw new Error('Track has not started yet')
    }

    if (track.deletedAt) {
      throw new Error('Track has been deleted')
    }

    let answer = await Answer.create({
      trackAlgorithmId: data.track_algorithms_id,
      content: data.content,
      user_id: userId,
      status: AnswerStatus.running,
    })

    const tests = await AlgorithmTest.query().where('algorithm_id', trackAlgorithms.algorithmId)

    if (!tests.length) {
      answer.merge({
        status: AnswerStatus.error,
      })
      await answer.save()
      return {
        success: false,
        message: 'Nenhum teste encontrado',
        answer: answer,
      }
    }

    // eslint-disable-next-line no-array-constructor
    let results = new Array<AnswerAlgorithmTest>()

    for (const test of tests) {
      let aat = await AnswerAlgorithmTest.create({
        user_id: userId,
        answerId: answer.id,
        algorithmTestsId: test.id,
        content: data.content,
        status: AnswerStatus.running,
      })

      const newLength = results.push(aat)
      const index = newLength - 1

      const result = await runAlgorithm(
        data.content,
        data.languageId,
        Buffer.from(test.input).toString('base64')
      )

      if (result.status.id !== JudgeStatusCode.ACEITO) {
        answer.merge({
          status: AnswerStatus.error,
        })
        aat.merge({
          status: AnswerStatus.error,
          result: result.message,
        })

        await answer.save()
        await aat.save()
        results[index] = aat

        continue
      }

      const output = Buffer.from(result.stdout, 'base64').toString('utf-8')

      const outputStatus = output === test.output ? AnswerStatus.correct : AnswerStatus.incorrect

      aat.merge({
        status: outputStatus,
        result: output,
      })

      await aat.save()

      results[index] = aat
    }

    const answerStatus = results.every((result) => result.status === AnswerStatus.correct)
      ? AnswerStatus.correct
      : AnswerStatus.incorrect

    const hasError = results.some((result) => result.status === AnswerStatus.error)

    answer.merge({
      status: hasError ? AnswerStatus.error : answerStatus,
    })

    await answer.save()

    return {
      success: true,
      message: 'Resposta criada com sucesso',
      qtdTests: tests.length,
      corrects: [...results.filter((result) => result.status === AnswerStatus.correct)],
      incorrects: [...results.filter((result) => result.status === AnswerStatus.incorrect)],
      erros: [...results.filter((result) => result.status === AnswerStatus.error)],
    }
  }

  async getLastAnswer({ auth, request }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.student) {
      throw new Error('Unauthorized: Only students can access this route')
    }

    const { trackAlgorithmId } = request.all()

    if (trackAlgorithmId === undefined) {
      throw new Error('trackAlgorithmId is required')
    }

    const answers = await Answer.query()
      .where('user_id', user.id)
      .where('track_algorithm_id', trackAlgorithmId)
      .orderBy('created_at', 'desc')

    return {
      success: true,
      data: answers,
    }
  }
}
