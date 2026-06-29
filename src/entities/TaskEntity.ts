import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTableEntity } from "./BaseTableEntity";
import { UserEntity } from "./UserEntity";
import { ProjectEntity } from "./ProjectEntity";
import { TaskStatus, TaskPriority } from "../enums";

@Entity({ name: "tasks" })
export class TaskEntity extends BaseTableEntity {
	@Column({ name: "project_id", nullable: true })
	projectId!: string | null;

	@Column({ name: "scope_category", type: "varchar", nullable: true })
	scopeCategory?: string;

	@ManyToOne(() => ProjectEntity, { onDelete: "SET NULL", onUpdate: "SET NULL" })
	@JoinColumn({ name: "project_id" })
	project!: ProjectEntity | null;

	@Column({ name: "parent_task_id", nullable: true })
	parentTaskId?: string | null;

	@ManyToOne(() => TaskEntity, { onDelete: "SET NULL", onUpdate: "SET NULL", nullable: true })
	@JoinColumn({ name: "parent_task_id" })
	parentTask?: TaskEntity | null;

	@Column({ type: "varchar", length: 255 })
	title!: string;

	@Column({ type: "text" })
	description!: string;

	@Column({
		type: "enum",
		enum: TaskStatus,
		default: TaskStatus.OPEN,
	})
	status!: TaskStatus;

	@Column({ name: "start_time", type: "timestamp" })
	startTime!: Date;

	@Column({ name: "end_time", type: "timestamp" })
	endTime!: Date;

	@Column({
		type: "enum",
		enum: TaskPriority,
		default: TaskPriority.MEDIUM,
	})
	priority!: TaskPriority;

	@Column({ name: "created_by", nullable: true })
	createdBy!: string | null;

	@ManyToOne(() => UserEntity, { onDelete: "SET NULL", onUpdate: "SET NULL" })
	@JoinColumn({ name: "created_by" })
	creator!: UserEntity | null;
}
