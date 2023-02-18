import { MigrationInterface, QueryRunner } from "typeorm";

export class userMigration1655389347682 implements MigrationInterface {
    name = 'userMigration1655389347682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" nvarchar(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "dateGraduation" datetime`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dateGraduation"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "name" nvarchar(255)`);
    }

}
