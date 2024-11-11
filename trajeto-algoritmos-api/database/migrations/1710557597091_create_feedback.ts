import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'feedbacks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('value').unsigned().notNullable()
      table.integer('algorithm_id').unsigned().nullable()
      table.integer('track_id').unsigned().nullable()
      table.integer('user_id').unsigned().notNullable()
      table.string('group').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users')
      table.foreign('algorithm_id').references('id').inTable('algorithms')
      table.foreign('track_id').references('id').inTable('tracks')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
