import { MigrationInterface, QueryRunner } from "typeorm"

export class autoConfirmToCourses1656055656818 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD "autoConfirm" bit DEFAULT 0 WITH VALUES`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "autoConfirm"`);
    }

}
