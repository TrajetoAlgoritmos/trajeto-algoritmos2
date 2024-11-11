import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'answer_algorithm_tests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('algorithm_tests_id').unsigned().notNullable()
      table.integer('answer_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.text('content').notNullable()
      table.text('result').nullable()
      table.integer('status').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

      table.foreign('answer_id').references('id').inTable('answers').onDelete('CASCADE')

      table
        .foreign('algorithm_tests_id')
        .references('id')
        .inTable('algorithm_tests')
        .onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
