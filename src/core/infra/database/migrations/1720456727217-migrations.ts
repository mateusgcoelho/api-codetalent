import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1720456727217 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS loja (
        id SERIAL NOT NULL PRIMARY KEY,
        descricao VARCHAR(60) NOT NULL
      );
    `);

    await queryRunner.query(`
      INSERT INTO loja (id, descricao) VALUES (1, 'LOJA SATURNO');
      INSERT INTO loja (id, descricao) VALUES (2, 'LOJA PLUTÃO');
      INSERT INTO loja (id, descricao) VALUES (3, 'LOJA VR SOFTWARE');
      INSERT INTO loja (id, descricao) VALUES (4, 'LOJA JUPTER');
      INSERT INTO loja (id, descricao) VALUES (5, 'LOJA TERRA');
    `);

    console.log(`
    INSERT INTO loja (id, descricao) VALUES (1, 'LOJA SATURNO');
    INSERT INTO loja (id, descricao) VALUES (2, 'LOJA PLUTÃO');
    INSERT INTO loja (id, descricao) VALUES (3, 'LOJA VR SOFTWARE');
    INSERT INTO loja (id, descricao) VALUES (4, 'LOJA JUPTER');
    INSERT INTO loja (id, descricao) VALUES (5, 'LOJA TERRA');
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS loja;`);
  }
}
