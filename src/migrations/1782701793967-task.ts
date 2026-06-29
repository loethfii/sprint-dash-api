import { MigrationInterface, QueryRunner } from "typeorm";

export class Task1782701793967 implements MigrationInterface {
    name = 'Task1782701793967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" ADD "scope_category" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "scope_category"`);
    }

}
