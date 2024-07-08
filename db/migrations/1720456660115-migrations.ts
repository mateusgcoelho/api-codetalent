import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1720456660115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS produto (
        id SERIAL NOT NULL PRIMARY KEY,
        descricao VARCHAR(60) NOT NULL,
        custo NUMERIC(13,3) DEFAULT(0)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS produto;`);
  }
}
