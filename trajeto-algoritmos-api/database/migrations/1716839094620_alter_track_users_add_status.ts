import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'track_users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('status').nullable()
    })
  }

  async down() {}
}
