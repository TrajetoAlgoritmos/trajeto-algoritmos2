import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tracker_algorithm_attempts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.integer('track_algorithm_id').unsigned().notNullable()
      table.text('content').notNullable()
      table.text('result').nullable()
      table.integer('status').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table
        .foreign('track_algorithm_id')
        .references('id')
        .inTable('track_algorithms')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
