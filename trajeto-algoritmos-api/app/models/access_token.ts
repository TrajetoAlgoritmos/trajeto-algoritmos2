import { BaseModel } from '@adonisjs/lucid/orm'

export default class AccessToken extends BaseModel {
  declare type: string
  declare name: string | null
  declare token: string | undefined
  declare abilities: string[]
  declare lastUsedAt: Date | null
  declare expiresAt: Date | null
}
