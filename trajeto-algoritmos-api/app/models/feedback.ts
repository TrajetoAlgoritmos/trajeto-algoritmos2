import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Track from './track.js'
import User from './user.js'
import Algorithm from './algorithm.js'

export default class Feedback extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare value: string

  @column()
  declare algorithmId: number

  @column()
  declare userId: number

  @column()
  declare trackId: number

  @column()
  declare group: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Track)
  declare track: BelongsTo<typeof Track>

  @belongsTo(() => Algorithm)
  declare algorithm: BelongsTo<typeof Algorithm>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
