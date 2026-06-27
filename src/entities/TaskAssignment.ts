import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTable } from "./BaseTable";
import { User } from "./User";
import { Task } from "./Task";

@Entity({ name: "task_assignments" })
export class TaskAssignment extends BaseTable {
	@Column({ name: "task_id" })
	taskId!: number;

	@ManyToOne(() => Task)
	@JoinColumn({ name: "task_id" })
	task!: Task;

	@Column({ name: "user_id" })
	userId!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "user_id" })
	user!: User;

	@Column({ name: "assigned_by" })
	assignedBy!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "assigned_by" })
	assigner!: User;

	@Column({ name: "assigned_at", type: "timestamp" })
	assignedAt!: Date;
}
