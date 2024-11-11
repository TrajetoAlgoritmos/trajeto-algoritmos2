import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Algorithm from './algorithm.js'
import User from './user.js'

export default class AlgorithmTest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare algorithmId: number

  @belongsTo(() => Algorithm)
  declare algorithm: BelongsTo<typeof Algorithm>

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare input: string

  @column()
  declare output: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
