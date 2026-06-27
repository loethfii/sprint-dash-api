import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTableEntity } from "./BaseTableEntity";
import { UserEntity } from "./UserEntity";
import { TaskEntity } from "./TaskEntity";
import { EmailType, EmailStatus } from "../enums";

@Entity({ name: "email_notifications" })
export class EmailNotificationEntity extends BaseTableEntity {
	@Column({ name: "task_id", nullable: true })
	taskId!: string | null;

	@ManyToOne(() => TaskEntity, { onDelete: "SET NULL", onUpdate: "SET NULL" })
	@JoinColumn({ name: "task_id" })
	task!: TaskEntity | null;

	@Column({ name: "recipient_id", nullable: true })
	recipientId!: string | null;

	@ManyToOne(() => UserEntity, { onDelete: "SET NULL", onUpdate: "SET NULL" })
	@JoinColumn({ name: "recipient_id" })
	recipient!: UserEntity | null;

	@Column({
		type: "enum",
		enum: EmailType,
	})
	type!: EmailType;

	@Column({
		type: "enum",
		enum: EmailStatus,
		default: EmailStatus.PENDING,
	})
	status!: EmailStatus;

	@Column({ name: "sent_at", type: "timestamp", nullable: true })
	sentAt?: Date;
}
