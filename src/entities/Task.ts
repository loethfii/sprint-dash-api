import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTable } from "./BaseTable";
import { User } from "./User";
import { Project } from "./Project";
import { TaskStatus, TaskPriority } from "../enums";

@Entity({ name: "tasks" })
export class Task extends BaseTable {
	@Column({ name: "project_id" })
	projectId!: number;

	@ManyToOne(() => Project)
	@JoinColumn({ name: "project_id" })
	project!: Project;

	@Column({ name: "parent_task_id", nullable: true })
	parentTaskId?: number;

	@ManyToOne(() => Task, { nullable: true })
	@JoinColumn({ name: "parent_task_id" })
	parentTask?: Task;

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

	@Column({ name: "created_by" })
	createdBy!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "created_by" })
	creator!: User;
}
