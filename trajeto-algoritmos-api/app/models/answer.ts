import { DateTime } from 'luxon'
import User from './user.js'
import TrackAlgorithm from './track_algorithm.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { column, BaseModel, belongsTo } from '@adonisjs/lucid/orm'

export default class Answer extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare trackAlgorithmId: number

  @belongsTo(() => TrackAlgorithm)
  declare trackAlgorithm: BelongsTo<typeof TrackAlgorithm>

  @column()
  declare content: string

  @column()
  declare status: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
