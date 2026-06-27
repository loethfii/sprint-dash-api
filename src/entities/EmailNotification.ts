import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTable } from "./BaseTable";
import { User } from "./User";
import { Task } from "./Task";
import { EmailType, EmailStatus } from "../enums";

@Entity({ name: "email_notifications" })
export class EmailNotification extends BaseTable {
	@Column({ name: "task_id" })
	taskId!: number;

	@ManyToOne(() => Task)
	@JoinColumn({ name: "task_id" })
	task!: Task;

	@Column({ name: "recipient_id" })
	recipientId!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "recipient_id" })
	recipient!: User;

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
