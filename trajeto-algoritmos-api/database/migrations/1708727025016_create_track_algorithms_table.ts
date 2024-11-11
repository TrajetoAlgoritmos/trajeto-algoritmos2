import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'track_algorithms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('track_id').unsigned().notNullable()
      table.integer('algorithm_id').unsigned().notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.foreign('track_id').references('id').inTable('tracks').onDelete('CASCADE')
      table.foreign('algorithm_id').references('id').inTable('algorithms').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
