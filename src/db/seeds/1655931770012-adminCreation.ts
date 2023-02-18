import { MigrationInterface, QueryRunner } from "typeorm"

export class adminCreation1655931770012 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(
            `INSERT INTO users (email, passwordHash, firstName, lastName, role) VALUES ('admin@innopolis.ru', '$2b$10$X4kv7j5ZcG39WgogSl16auDSLMN8gkWIeR3V4AEov75rkugiQysk2', 'admin', 'adminovich', 'ADMIN')`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
