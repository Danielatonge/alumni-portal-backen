import { MigrationInterface, QueryRunner } from "typeorm"

export class addedRoleToUser1655916854869 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "role" nvarchar(255) DEFAULT 'ALUMNI' WITH VALUES`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }
}
