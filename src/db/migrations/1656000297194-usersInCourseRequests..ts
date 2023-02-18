import { MigrationInterface, QueryRunner } from "typeorm"

export class usersInCourseRequests1656000297194 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "REL_72a7ade6d2dc186d33f3986241" ON "courseRequests"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "REL_72a7ade6d2dc186d33f3986241" ON "courseRequests" ("userId") WHERE ([userId] IS NOT NULL)`);
    }
}
