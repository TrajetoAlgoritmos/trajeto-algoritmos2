import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tracks'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('deleted_at').nullable()
      table.timestamp('start_at').nullable()
      table.timestamp('close_at').nullable()
    })
  }

  async down() {}
}
