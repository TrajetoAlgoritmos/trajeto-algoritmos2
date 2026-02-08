import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'answers'  // Defina o nome da tabela aqui!

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Adiciona os novos campos
      table.integer('judge_status_code').nullable()
      table.text('error_description').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('judge_status_code')
      table.dropColumn('error_description')
    })
  }
}
