import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';

export class courseTagSeed1655224693648 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("INSERT INTO tags (name) VALUES ('Devops')");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
