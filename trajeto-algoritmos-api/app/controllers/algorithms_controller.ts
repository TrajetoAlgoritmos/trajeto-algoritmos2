import { HttpContext } from '@adonisjs/core/http'
import Algorithm from '../models/algorithm.js'
import { ProfileId } from '../models/enums.js'

export default class AlgorithmController {
  // Create
  async create({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teachers can create algorithms')
    }

    const data = request.only(['title', 'description', 'tag'])
    const algorithm = await Algorithm.create({ ...data, userId: user.id })
    return algorithm
  }

  // Read
  async index({ request }: HttpContext) {
    const { page, limit } = request.all()
    return await Algorithm.query()
      .preload('user', (query) => {
        query.select('id', 'name', 'email')
      })
      .paginate(page, limit)
  }

  async show({ params }: HttpContext) {
    return await Algorithm.query()
      .where('id', params.id)
      .preload('user', (query) => {
        query.select('id', 'name', 'email')
      })
  }

  // Update
  async update({ request, params, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teachers can update algorithms')
    }

    const algorithm = await Algorithm.findOrFail(params.id)

    const data = request.only(['title', 'description', 'tag'])
    algorithm.merge(data)
    await algorithm.save()
    return algorithm
  }

  // Delete
  async destroy({ params, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teachers can delete algorithms')
    }

    const algorithm = await Algorithm.findOrFail(params.id)

    await algorithm.delete()
    return { message: 'Algorithm deleted successfully' }
  }
}
