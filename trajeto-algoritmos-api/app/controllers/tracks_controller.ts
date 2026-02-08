/* eslint-disable unicorn/no-for-loop */
import Algorithm from '#models/algorithm'
import Answer from '#models/answer'
import { AnswerStatus, ProfileId } from '#models/enums'
import TrackAlgorithm from '#models/track_algorithm'
import TrackUser from '#models/track_user'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import Track from '../models/track.js'
import { getUsersSummaryByTrack } from '../usecases/get_users_summary_by_track.js'
export default class TrackController {
  async join({ auth, request }: HttpContext) {
    const { codigo } = request.all()
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.student) {
      throw new Error('Unauthorized: Only teachers can create tracks')
    }

    const userId = user.id

    const track = await Track.findBy('codigo', codigo)

    if (!track) {
      throw new Error('Track not found')
    }

    const trackUser = await TrackUser.query()
      .where('trackId', track.id)
      .where('userId', userId)
      .first()

    if (trackUser) {
      return {
        message: 'User already joined the track',
      }
    }

    return TrackUser.create({ trackId: track.id, userId: userId })
  }

  async findTrackByCodigo({ request }: HttpContext) {
    let { codigo } = request.all()
    const track = await Track.findBy('codigo', codigo)

    if (track) {
      return {
        data: {
          exists: true,
          track,
        },
      }
    } else {
      return {
        data: {
          exists: false,
        },
      }
    }
  }

  async addAlgorithm({ auth, request }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teachers can create tracks')
    }

    const { algorithmId, trackId } = request.only(['algorithmId', 'trackId'])

    const track = await Track.findOrFail(trackId)
    const algorithm = await Algorithm.findOrFail(algorithmId)

    const trackAlgorithm = await TrackAlgorithm.query()
      .where('trackId', track.id)
      .where('algorithmId', algorithm.id)
      .first()

    if (trackAlgorithm) {
      return {
        message: 'Algorithm already added to the track',
      }
    }

    return await TrackAlgorithm.create({ trackId: track.id, algorithmId: algorithm.id })
  }

  async removeAlgorithm({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teachers can create tracks')
    }

    const { algorithmId, trackId } = request.only(['algorithmId', 'trackId'])

    const track = await Track.findOrFail(trackId)
    const algorithm = await Algorithm.findOrFail(algorithmId)

    const trackAlgorithm = await TrackAlgorithm.query()
      .where('trackId', track.id)
      .where('algorithmId', algorithm.id)
      .first()

    if (!trackAlgorithm) {
      return response.status(404).json({
        message: 'TrackAlgorithm not found',
      })
    }

    await trackAlgorithm.delete()
    return { message: 'TrackAlgorithm deleted successfully' }
  }

  // Create
  async create({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teachers can create tracks')
    }

    const userId = user.id

    const data = request.only(['title', 'description', 'startAt', 'closeAt', 'codigo'])

    const track = await Track.create({ ...data, userId: userId })

    return track
  }

  // Read
  async index({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teachers can create tracks')
    }

    const { page, limit } = request.all()
    return await Track.query()
      .whereNull('deleted_at')
      .preload('user', (query) => {
        query.select('id', 'name', 'email')
      })
      .paginate(page, limit)
  }

  async show({ params, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teacher can create tracks')
    }

    let rtrack = await Track.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .preload('user', (query) => {
        query.select('id', 'name', 'email')
      })
      .preload('students', (query) => {
        query.select('id', 'name', 'email')
      })
      .preload('algorithms', (query) => {
        query.select('id', 'title', 'description', 'tag')
      })
      .first()

    if (!rtrack) {
      throw new Error('Track not found')
    }

    let track = rtrack.toJSON()

    let students = track.students
    let algorithms = track.algorithms

    for (let i = 0; i < students.length; i++) {
      students[i].answers = {
        correct: 0,
        incorrect: 0,
        error: 0,
        running: 0,
        notAnswered: 0,
      }

      for (let j = 0; j < algorithms.length; j++) {
        const trackAlgorithm = await TrackAlgorithm.query()
          .where('trackId', track.id)
          .where('algorithmId', algorithms[j].id)
          .first()
        if (trackAlgorithm === null) {
          continue
        }

        const lastAnswer = await Answer.query()
          .where('track_algorithm_id', trackAlgorithm.id)
          .where('user_id', students[i].id)
          .orderBy('createdAt', 'desc')
          .first()

        if (!lastAnswer) {
          students[i].answers.notAnswered++
          continue
        } else {
          switch (lastAnswer.status) {
            case AnswerStatus.correct:
              students[i].answers.correct++
              break
            case AnswerStatus.incorrect:
              students[i].answers.incorrect++
              break
            case AnswerStatus.error:
              students[i].answers.error++
              break
            case AnswerStatus.running:
              students[i].answers.running++
              break
            default:
              students[i].answers.notAnswered++
              break
          }
        }
      }
    }

    track.students = students

    return track
  }

  // Update
  async update({ request, params, auth }: HttpContext) {
    const user = await auth.authenticate()

    const userId = user.id
    const track = await Track.findOrFail(params.id)

    // Verifica se o usuário tem permissão para atualizar a faixa
    if (track.userId !== userId) {
      throw new Error('Unauthorized: User cannot update this track')
    }

    const data = request.only(['title', 'description', 'startAt', 'closeAt', 'codigo'])
    track.merge(data)
    await track.save()
    return track
  }

  // Delete
  async destroy({ params, auth }: HttpContext) {
    const user = await auth.authenticate()

    const userId = user.id
    let track = await Track.findOrFail(params.id)

    // Verifica se o usuário tem permissão para excluir a faixa
    if (track.userId !== userId) {
      throw new Error('Unauthorized: User cannot delete this track')
    }

    track.merge({ deletedAt: DateTime.now() })
    await track.save()
    return { message: 'Track deleted successfully' }
  }

  async tracksJoined({ auth, request }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.student) {
      throw new Error('Unauthorized: Only student can create tracks')
    }

    const { page, limit } = request.all()

    const trackUser = await TrackUser.query().where('user_id', user.id)

    const trackIds = trackUser.map((tu) => tu.trackId)

    let rTrack = await Track.query()
      .whereIn('id', trackIds)
      .preload('algorithms', (query) => {
        query.select('id', 'title', 'description', 'tag')
      })
      .whereNull('deleted_at')
      .paginate(page, limit)

    let track = JSON.parse(JSON.stringify(rTrack.toJSON()))

    for (let i = 0; i < track.data.length; i++) {
      for (let j = 0; j < track.data[i].algorithms.length; j++) {
        const trackAlgorithm = await TrackAlgorithm.query()
          .where('track_id', track.data[i].id)
          .where('algorithm_id', track.data[i].algorithms[j].id)
          .first()

        const lastAnswer = await Answer.query()
          .where('track_algorithm_id', trackAlgorithm!.id!)
          .where('user_id', user.id)
          .orderBy('createdAt', 'desc')
          .first()

        if (!lastAnswer) {
          track.data[i].algorithms[j]['status'] = AnswerStatus.notAnswered
        } else {
          track.data[i].algorithms[j]['status'] = lastAnswer.status
        }
      }
    }

    return {
      ...(track || {}),
      data: track?.data?.map((track: Track) => {
        return {
          id: track.id,
          title: track.title,
          description: track.description,
          startAt: track.startAt,
          closeAt: track.closeAt,
          algorithms: track.algorithms,
          status: trackUser.find((tu) => tu.trackId === track.id)?.status,
          userTrackId: trackUser.find((tu) => tu.trackId === track.id)?.id,
        }
      }),
    }
  }

  async showByStudent({ auth, params }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.student) {
      throw new Error('Unauthorized: Only student can create tracks')
    }
    const trackUser = await TrackUser.query().where('user_id', user.id)

    const trackIds = trackUser.map((tu) => tu.trackId)

    const trackAlg = await Track.query()
      .where('id', params.id)
      .whereIn('id', trackIds)
      .whereNull('deleted_at')
      .preload('algorithms', (query) => {
        query.select('id', 'title', 'description', 'tag')
      })

    let array = []
    for (let i = 0; i < trackAlg.length; i++) {
      array.push(trackAlg[i].toJSON())
    }

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].algorithms.length; j++) {
        const trackAlgorithm = await TrackAlgorithm.query()
          .where('track_id', array[i].id)
          .where('algorithm_id', array[i].algorithms[j].id)
          .first()

        const lastAnswer = await Answer.query()
          .where('track_algorithm_id', trackAlgorithm!.id!)
          .where('user_id', user.id)
          .orderBy('createdAt', 'desc')
          .first()

        array[i].algorithms[j].track_algorithm_id = trackAlgorithm!.id!

        if (!lastAnswer) {
          array[i].algorithms[j]['status'] = AnswerStatus.notAnswered
        } else {
          array[i].algorithms[j]['status'] = lastAnswer.status
        }
      }
    }

    return array?.map((track) => {
      return {
        id: track.id,
        title: track.title,
        description: track.description,
        startAt: track.startAt,
        closeAt: track.closeAt,
        algorithms: track.algorithms,
        status: trackUser.find((tu) => tu.trackId === track.id)?.status,
        userTrackId: trackUser.find((tu) => tu.trackId === track.id)?.id,
      }
    })
  }

  async trackStartByStudent({ auth, params }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.student) {
      throw new Error('Unauthorized: Only student can start tracks')
    }

    const trackUser = await TrackUser.query()
      .where('user_id', user.id)
      .where('id', params.id)
      .first()

    if (!trackUser) {
      throw new Error('Unauthorized: User not joined the track')
    }

    trackUser.merge({ status: 'started' })

    await trackUser.save()

    return trackUser
  }

  async trackFinishByStudent({ auth, params }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.student) {
      throw new Error('Unauthorized: Only student can finish tracks')
    }

    const trackUser = await TrackUser.query()
      .where('user_id', user.id)
      .where('id', params.id)
      .first()

    if (!trackUser) {
      throw new Error('Unauthorized: User not joined the track')
    }

    trackUser.merge({ status: 'finished' })

    await trackUser.save()

    return trackUser
  }

  async trackUsersSummary({ auth, request }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teacher can see track users summary')
    }

    const { trackId } = request.all()

    return {
      data: await getUsersSummaryByTrack(trackId),
    }
  }
  async totaltrilhas({}: HttpContext) {
    const tracks = await Track.query().select(['id', 'title'])

    return {
      data: tracks,
    }
  }

   async getTrackDifficultyNotification({ params, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teacher can get notifications')
    }

    try {
      const rtrack = await Track.query()
        .where('tracks.id', params.id)
        .where('tracks.user_id', user.id)
        .whereNull('tracks.deleted_at')
        .preload('students', (query) => {
          query.select('id', 'name', 'email')
        })
        .preload('algorithms', (query) => {
          query.select('id', 'title')
        })
        .first()

      if (!rtrack) {
        return {
          error: 'Track not found or not linked to this teacher',
        }
      }

      const track = rtrack.toJSON()
      const notificacoes = []

      for (const student of track.students) {
        let totalTentativas = 0
        let totalErrosExecucao = 0
        let totalErrosLogico = 0
        let ultimaTentativa: Date | null = null


        for (const algorithm of track.algorithms) {
          const trackAlgorithm = await TrackAlgorithm.query()
            .where('trackId', track.id)
            .where('algorithmId', algorithm.id)
            .first()

          if (!trackAlgorithm) {
            console.log(`[WARN] trackAlgorithm não encontrado para algoritmo ${algorithm.id} na trilha ${track.id}`)
            continue
          }

          const answers = await Answer.query()
            .where('track_algorithm_id', trackAlgorithm.id)
            .where('user_id', student.id)


          for (const answer of answers) {
            totalTentativas++

            if (answer.status === AnswerStatus.error) {
              totalErrosExecucao++
            }

            if (answer.status === AnswerStatus.incorrect) {
              totalErrosLogico++
            }

            const respostaDate = answer.createdAt.toJSDate()
            if (!ultimaTentativa || respostaDate > ultimaTentativa) {
              ultimaTentativa = respostaDate
            }
          }
        }

        const totalErros = totalErrosExecucao + totalErrosLogico

        const mediaErroExecucaoPercentual =
          totalTentativas > 0 ? (totalErrosExecucao / totalTentativas) * 100 : 0

        const mediaErroLogicoPercentual =
          totalTentativas > 0 ? (totalErrosLogico / totalTentativas) * 100 : 0

        const mediaErroPercentual =
          totalTentativas > 0 ? (totalErros / totalTentativas) * 100 : 0

        function getDificuldade(media: number) {
          if (media <= 33) return 'Nenhuma'
          else if (media <= 50) return 'Leve'
          else if (media <= 70) return 'Moderada'
          else return 'Avançada'
        }

        notificacoes.push({
          alunoId: student.id,
          nome: student.name,
          mediaErroExecucaoPercentual: mediaErroExecucaoPercentual.toFixed(2),
          dificuldadeExecucao: getDificuldade(mediaErroExecucaoPercentual),
          mediaErroLogicoPercentual: mediaErroLogicoPercentual.toFixed(2),
          dificuldadeLogico: getDificuldade(mediaErroLogicoPercentual),
          mediaErroPercentual: mediaErroPercentual.toFixed(2),
          ultimaTentativa: ultimaTentativa?.toISOString() ?? null,
        })
      }

      return {
        trackId: track.id,
        trackTitle: track.title,
        notificacoes,
      }
    } catch (error) {
      console.error('Erro ao gerar notificações de dificuldade:', error)
      return {
        error: 'Erro interno ao processar as notificações',
        message: error.message,
      }
    }
  }



 async getProfessorTracks({ auth, response }: HttpContext) {
  const user = auth.user

  if (!user) {
    return response.unauthorized({ message: 'Usuário não autenticado' })
  }

  const tracks = await db
    .from('tracks')
    .innerJoin('tracks', 'tracks.id', 'tracks.track_id')
    .where('tracks.user_id', user.id)
    .select('tracks.id', 'tracks.nome')

  return response.ok(tracks)
}


}
