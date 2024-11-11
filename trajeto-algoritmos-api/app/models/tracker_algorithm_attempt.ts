import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import TrackAlgorithm from './track_algorithm.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class TrackerAlgorithmAttempt extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare track_algorithm_id: number

  @belongsTo(() => TrackAlgorithm)
  declare trackAlgorithm: BelongsTo<typeof TrackAlgorithm>

  @column()
  declare content: string

  @column()
  declare result: string | null

  @column()
  declare status: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
