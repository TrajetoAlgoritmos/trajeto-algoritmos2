import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'algorithm_tests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('algorithm_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.text('input').notNullable()
      table.text('output').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.foreign('algorithm_id').references('id').inTable('algorithms').onDelete('CASCADE')
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
