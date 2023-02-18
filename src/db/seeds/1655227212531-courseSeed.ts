import { MigrationInterface, QueryRunner } from 'typeorm';

export class courseSeed1655227212531 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            "INSERT INTO courses(name, description, slotsAvailable, startDate, endDate, teachers, autoConfirm) VALUES ('Flutter', 'Flutter course', 10, '2022-06-10 03:24:00.000', '2022-06-17 03:24:00.000', 'Dmitriy Creed,Insaf Safin', 0)",
        );
        await queryRunner.query(
            'INSERT INTO courses_tags_from_db_tags (coursesId, tagsId) VALUES (1,1)',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
