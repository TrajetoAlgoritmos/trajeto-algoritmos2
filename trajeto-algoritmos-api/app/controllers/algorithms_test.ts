import AlgorithmTest from '#models/algorithm_test'
import { HttpContext } from '@adonisjs/core/http'
import { ProfileId } from '../models/enums.js'

export default class AlgorithmTestController {
  // Create
  async create({ request, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teachers can create tests')
    }

    const data = request.only(['input', 'output', 'algorithmId'])
    if (!data.input) {
      data.input = ''
    }

    const algorithm = await AlgorithmTest.create({ ...data, userId: user.id })
    return algorithm
  }

  // Read
  async index({ request }: HttpContext) {
    const { page, limit, algorithmId } = request.all()
    const query = AlgorithmTest.query()
    query
      .preload('user', (query) => {
        query.select('id', 'name', 'email')
      })
      .preload('algorithm', (query) => {
        query.select('id', 'title', 'description', 'tag')
      })

    if (algorithmId) {
      query.where('algorithmId', algorithmId)
    }

    query.paginate(page, limit)
    return query
  }

  async show({ params }: HttpContext) {
    return await AlgorithmTest.query()
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

    const algorithm = await AlgorithmTest.findOrFail(params.id)

    const data = request.only(['input', 'output', 'algorithmId'])
    algorithm.merge(data)
    await algorithm.save()
    return algorithm
  }

  // Delete
  async destroy({ params, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.profileId !== ProfileId.teacher) {
      throw new Error('Unauthorized: Only teachers can delete algorithms test')
    }

    const algorithm = await AlgorithmTest.findOrFail(params.id)

    await algorithm.delete()
    return { message: 'Algorithm test deleted successfully' }
  }
}
