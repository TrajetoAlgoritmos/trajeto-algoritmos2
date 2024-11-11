import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tracks'

  async up() {
    this.schema.alterTable(this.tableName, async (table) => {
      table.string('codigo')
    })
  }

  async down() {}
}
