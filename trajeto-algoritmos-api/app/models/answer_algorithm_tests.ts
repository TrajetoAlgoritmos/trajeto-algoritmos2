import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import AlgorithmTest from './algorithm_test.js'
import Answer from './answer.js'

export default class AnswerAlgorithmTest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare answerId: number

  @belongsTo(() => Answer)
  declare answer: BelongsTo<typeof Answer>

  @column()
  declare algorithmTestsId: number

  @belongsTo(() => AlgorithmTest)
  declare algorithmTest: BelongsTo<typeof AlgorithmTest>

  @column()
  declare content: String

  @column()
  declare result: String | null | undefined

  @column()
  declare status: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
