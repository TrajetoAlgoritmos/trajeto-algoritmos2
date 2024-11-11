import { HttpContext } from '@adonisjs/core/http'
import { ProfileId } from '../models/enums.js'
import Feedback from '#models/feedback'

export default class FeedbackController {
  // Create
  async send({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.student) {
      throw new Error('Unauthorized: Only student can send feedback')
    }

    const data = request.only(['value', 'algorithmId', 'trackId', 'group'])

    const feedback = await Feedback.create({
      ...data,
      userId: user.id,
    })

    return feedback
  }

  async feedbackByTrack({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teacher can send feedback')
    }

    const { trackId } = request.all()

    return await Feedback.query().where('trackId', trackId)
  }

  async feedbackByAlgorithm({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teacher can send feedback')
    }

    const { algorithmId } = request.all()

    return await Feedback.query().where('algorithmId', algorithmId)
  }

  async feedbackByStudent({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teacher can send feedback')
    }

    const { userId } = request.all()

    return await Feedback.query().where('userId', userId)
  }

  async feedbackByGroup({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teacher can send feedback')
    }

    const { group } = request.all()

    return await Feedback.query().where('group', group)
  }
}
