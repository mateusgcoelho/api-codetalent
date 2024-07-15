import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1720456727217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS loja (
        id SERIAL NOT NULL PRIMARY KEY,
        descricao VARCHAR(60) NOT NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS loja;`);
  }
}
