import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('provider_id').notNullable()
      table.string('name', 254).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 254).notNullable()
      table.integer('profile_id').notNullable()

      table.timestamp('created_at').notNullable().defaultTo(this.now())
      table.timestamp('updated_at').nullable().defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
