import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTable } from "./BaseTable";
import { User } from "./User";
import { ProjectPriority } from "../enums";

@Entity({ name: "projects" })
export class Project extends BaseTable {
	@Column({ name: "project_name", type: "varchar", length: 255 })
	projectName!: string;

	@Column({ name: "start_date", type: "date" })
	startDate!: Date;

	@Column({ name: "end_date", type: "date" })
	endDate!: Date;

	@Column({
		type: "enum",
		enum: ProjectPriority,
		default: ProjectPriority.MEDIUM,
	})
	priority!: ProjectPriority;

	@Column({ name: "created_by" })
	createdBy!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "created_by" })
	creator!: User;
}
