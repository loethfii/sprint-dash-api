import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTableEntity } from "./BaseTableEntity";
import { UserEntity } from "./UserEntity";
import { TaskEntity } from "./TaskEntity";

@Entity({ name: "task_assignments" })
export class TaskAssignmentEntity extends BaseTableEntity {
	@Column({ name: "task_id", nullable: true })
	taskId!: string | null;

	@ManyToOne(() => TaskEntity, { onDelete: "SET NULL", onUpdate: "SET NULL" })
	@JoinColumn({ name: "task_id" })
	task!: TaskEntity | null;

	@Column({ name: "user_id", nullable: true })
	userId!: string | null;

	@ManyToOne(() => UserEntity, { onDelete: "SET NULL", onUpdate: "SET NULL" })
	@JoinColumn({ name: "user_id" })
	user!: UserEntity | null;

	@Column({ name: "assigned_by", nullable: true })
	assignedBy!: string | null;

	@ManyToOne(() => UserEntity, { onDelete: "SET NULL", onUpdate: "SET NULL" })
	@JoinColumn({ name: "assigned_by" })
	assigner!: UserEntity | null;

	@Column({ name: "assigned_at", type: "timestamp" })
	assignedAt!: Date;
}
