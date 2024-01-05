import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserContry1704472948365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "country" varchar(255)`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
  }
}
