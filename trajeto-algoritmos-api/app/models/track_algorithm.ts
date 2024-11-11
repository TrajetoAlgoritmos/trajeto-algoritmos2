import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { column, BaseModel, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import Track from './track.js'
import Algorithm from './algorithm.js'
import Answer from './answer.js'
import TrackerAlgorithmAttempt from './tracker_algorithm_attempt.js'

export default class TrackAlgorithm extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare trackId: number

  @belongsTo(() => Track)
  declare track: BelongsTo<typeof Track>

  @column()
  declare algorithmId: number

  @belongsTo(() => Algorithm)
  declare algorithm: BelongsTo<typeof Algorithm>

  @hasMany(() => Answer)
  declare answers: HasMany<typeof Answer>

  @hasMany(() => TrackerAlgorithmAttempt)
  declare attempts: HasMany<typeof TrackerAlgorithmAttempt>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
