import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Algorithm from './algorithm.js'
import User from './user.js'

export default class Track extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare userId: number

  @column()
  declare codigo: string

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Algorithm, {
    pivotTable: 'track_algorithms',
  })
  declare algorithms: ManyToMany<typeof Algorithm>

  @manyToMany(() => User, {
    pivotTable: 'track_users',
  })
  declare students: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare deletedAt: DateTime | null | undefined

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare closeAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare startAt: DateTime
}
