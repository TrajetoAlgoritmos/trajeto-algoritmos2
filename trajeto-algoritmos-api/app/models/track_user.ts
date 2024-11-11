import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Track from './track.js'
import User from './user.js'

export default class TrackUser extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare trackId: number

  @hasMany(() => Track)
  declare track: HasMany<typeof Track>

  @column()
  declare userId: number

  @column()
  declare status: string

  @hasMany(() => User)
  declare user: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
