import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'algorithms'
  // TODO: relacionar com o usuário que criou o algoritmo, para ele filtrar
  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title', 254).notNullable()
      table.text('description').notNullable()
      table.string('tag', 124).notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
