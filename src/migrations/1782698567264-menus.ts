import { MigrationInterface, QueryRunner } from "typeorm";

export class Menus1782698567264 implements MigrationInterface {
    name = 'Menus1782698567264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menus" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()', "deleted_at" TIMESTAMP WITH TIME ZONE, "metadata" jsonb, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "menu_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "email_notifications" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "email_notifications" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "email_notifications" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "project_assignments" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "project_assignments" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "project_assignments" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "project_assignments" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "project_assignments" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "project_assignments" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "task_assignments" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "task_assignments" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT 'now()'`);
        await queryRunner.query(`ALTER TABLE "task_assignments" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_5da755acaae4237420ac4da27d3" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_5da755acaae4237420ac4da27d3"`);
        await queryRunner.query(`ALTER TABLE "task_assignments" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "task_assignments" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "task_assignments" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ADD "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "project_assignments" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "project_assignments" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "project_assignments" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "project_assignments" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "project_assignments" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "project_assignments" ADD "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "email_notifications" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "email_notifications" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "email_notifications" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "email_notifications" ADD "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27 17:02:28.25'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "menu_id"`);
        await queryRunner.query(`DROP TABLE "menus"`);
    }

}
