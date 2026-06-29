import { MigrationInterface, QueryRunner } from "typeorm";

export class Project1782701546661 implements MigrationInterface {
    name = 'Project1782701546661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "description" text`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "scope_category" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "scope_category"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "description"`);
    }
}
