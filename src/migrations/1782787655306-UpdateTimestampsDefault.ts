import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTimestampsDefault1782787655306 implements MigrationInterface {
    name = 'UpdateTimestampsDefault1782787655306'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menus" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "menus" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ALTER COLUMN "updated_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_assignments" ALTER COLUMN "created_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project_assignments" ALTER COLUMN "updated_at" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_assignments" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "project_assignments" ALTER COLUMN "created_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ALTER COLUMN "created_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "created_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ALTER COLUMN "created_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "created_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "menus" ALTER COLUMN "updated_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
        await queryRunner.query(`ALTER TABLE "menus" ALTER COLUMN "created_at" SET DEFAULT '2026-06-29 02:03:22.552682+00'`);
    }

}
