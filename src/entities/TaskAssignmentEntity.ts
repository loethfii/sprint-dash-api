import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTableEntity } from "./BaseTableEntity";
import { UserEntity } from "./UserEntity";
import { TaskEntity } from "./TaskEntity";

@Entity({ name: "task_assignments" })
export class TaskAssignmentEntity extends BaseTableEntity {
	@Column({ name: "task_id" })
	taskId!: number;

	@ManyToOne(() => TaskEntity)
	@JoinColumn({ name: "task_id" })
	task!: TaskEntity;

	@Column({ name: "user_id" })
	userId!: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "user_id" })
	user!: UserEntity;

	@Column({ name: "assigned_by" })
	assignedBy!: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "assigned_by" })
	assigner!: UserEntity;

	@Column({ name: "assigned_at", type: "timestamp" })
	assignedAt!: Date;
}
