import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1782571186297 implements MigrationInterface {
	name = "FirstMigration1782571186297";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'manager', 'staff')`
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "deleted_at" TIMESTAMP, "metadata" jsonb, "name" character varying(255) NOT NULL, "username" character varying(255) NOT NULL, "password_hash" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone_number" character varying(50), "role" "public"."users_role_enum" NOT NULL DEFAULT 'staff', CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."projects_priority_enum" AS ENUM('low', 'medium', 'high', 'critical')`
		);
		await queryRunner.query(
			`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "deleted_at" TIMESTAMP, "metadata" jsonb, "project_name" character varying(255) NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "priority" "public"."projects_priority_enum" NOT NULL DEFAULT 'medium', "created_by" integer NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."tasks_status_enum" AS ENUM('open', 'working', 'closed', 'overdue')`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('low', 'medium', 'high', 'critical')`
		);
		await queryRunner.query(
			`CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "deleted_at" TIMESTAMP, "metadata" jsonb, "project_id" integer NOT NULL, "parent_task_id" integer, "title" character varying(255) NOT NULL, "description" text NOT NULL, "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'open', "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'medium', "created_by" integer NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."email_notifications_type_enum" AS ENUM('task_assigned', 'overdue_warning')`
		);
		await queryRunner.query(
			`CREATE TYPE "public"."email_notifications_status_enum" AS ENUM('pending', 'sent', 'failed')`
		);
		await queryRunner.query(
			`CREATE TABLE "email_notifications" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "deleted_at" TIMESTAMP, "metadata" jsonb, "task_id" integer NOT NULL, "recipient_id" integer NOT NULL, "type" "public"."email_notifications_type_enum" NOT NULL, "status" "public"."email_notifications_status_enum" NOT NULL DEFAULT 'pending', "sent_at" TIMESTAMP, CONSTRAINT "PK_f4d8ce5003f1ce04365090df2d2" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "project_assignments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "deleted_at" TIMESTAMP, "metadata" jsonb, "project_id" integer NOT NULL, "manager_id" integer NOT NULL, "assigned_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_045df8f32ae1d54810b39b9c7bd" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`CREATE TABLE "task_assignments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "updated_at" TIMESTAMP NOT NULL DEFAULT '2026-06-27T14:39:47.931Z', "deleted_at" TIMESTAMP, "metadata" jsonb, "task_id" integer NOT NULL, "user_id" integer NOT NULL, "assigned_by" integer NOT NULL, "assigned_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_b68f42cf36d807d8a19a96066d7" PRIMARY KEY ("id"))`
		);
		await queryRunner.query(
			`ALTER TABLE "projects" ADD CONSTRAINT "FK_8a7ccdb94bcc8635f933c8f8080" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "tasks" ADD CONSTRAINT "FK_54fc42a253a8338488ec1f960ad" FOREIGN KEY ("parent_task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "tasks" ADD CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "email_notifications" ADD CONSTRAINT "FK_a25643a0612863bb6292cfbf762" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "email_notifications" ADD CONSTRAINT "FK_f3539d36fd72bfde1abc709c656" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "project_assignments" ADD CONSTRAINT "FK_55de07519449f4031e4a3a89714" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "project_assignments" ADD CONSTRAINT "FK_57e2da16dbe6e138212389700a0" FOREIGN KEY ("manager_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_b389f4488d0a8241c3c98273966" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_1673eab025dbc14e188bd4df67c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
		await queryRunner.query(
			`ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_69edf4d835d0e50fdad8d155d5f" FOREIGN KEY ("assigned_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_69edf4d835d0e50fdad8d155d5f"`
		);
		await queryRunner.query(
			`ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_1673eab025dbc14e188bd4df67c"`
		);
		await queryRunner.query(
			`ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_b389f4488d0a8241c3c98273966"`
		);
		await queryRunner.query(
			`ALTER TABLE "project_assignments" DROP CONSTRAINT "FK_57e2da16dbe6e138212389700a0"`
		);
		await queryRunner.query(
			`ALTER TABLE "project_assignments" DROP CONSTRAINT "FK_55de07519449f4031e4a3a89714"`
		);
		await queryRunner.query(
			`ALTER TABLE "email_notifications" DROP CONSTRAINT "FK_f3539d36fd72bfde1abc709c656"`
		);
		await queryRunner.query(
			`ALTER TABLE "email_notifications" DROP CONSTRAINT "FK_a25643a0612863bb6292cfbf762"`
		);
		await queryRunner.query(
			`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9fc727aef9e222ebd09dc8dac08"`
		);
		await queryRunner.query(
			`ALTER TABLE "tasks" DROP CONSTRAINT "FK_54fc42a253a8338488ec1f960ad"`
		);
		await queryRunner.query(
			`ALTER TABLE "tasks" DROP CONSTRAINT "FK_9eecdb5b1ed8c7c2a1b392c28d4"`
		);
		await queryRunner.query(
			`ALTER TABLE "projects" DROP CONSTRAINT "FK_8a7ccdb94bcc8635f933c8f8080"`
		);
		await queryRunner.query(`DROP TABLE "task_assignments"`);
		await queryRunner.query(`DROP TABLE "project_assignments"`);
		await queryRunner.query(`DROP TABLE "email_notifications"`);
		await queryRunner.query(`DROP TYPE "public"."email_notifications_status_enum"`);
		await queryRunner.query(`DROP TYPE "public"."email_notifications_type_enum"`);
		await queryRunner.query(`DROP TABLE "tasks"`);
		await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
		await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
		await queryRunner.query(`DROP TABLE "projects"`);
		await queryRunner.query(`DROP TYPE "public"."projects_priority_enum"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
	}
}
