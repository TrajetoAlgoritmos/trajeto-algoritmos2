import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tracks'

  async up() {
    this.schema.raw(`
    UPDATE tracks t1
    JOIN tracks t2 ON t1.id = t2.id
    SET t1.codigo = t2.title;
    `)

    this.schema.raw(`
    ALTER TABLE tracks
MODIFY COLUMN codigo VARCHAR(255) NOT NULL,
ADD CONSTRAINT unique_codigo UNIQUE (codigo);
    `)
  }

  async down() {}
}
