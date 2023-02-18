import { MigrationInterface, QueryRunner } from "typeorm"

export class addedHistoryToUser1655922513710 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "history" nvarchar(512)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "history"`);
    }

}
