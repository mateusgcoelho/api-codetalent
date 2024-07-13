import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1720456765629 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS produtoloja (
          id SERIAL NOT NULL PRIMARY KEY,
          idProduto INT NOT NULL,
          idLoja INT NOT NULL,
          precoVenda NUMERIC(13,3) NULL
        );
    `);

    await queryRunner.query(`
        ALTER TABLE produtoloja
        ADD CONSTRAINT fk_loja_produtoloja FOREIGN KEY (idLoja) REFERENCES loja(id);    
    `);

    await queryRunner.query(`
        ALTER TABLE produtoloja
        ADD CONSTRAINT fk_produto_produtoloja FOREIGN KEY (idProduto) REFERENCES produto(id);    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS produtoloja;`);
  }
}
