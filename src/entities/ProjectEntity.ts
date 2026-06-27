import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTableEntity } from "./BaseTableEntity";
import { UserEntity } from "./UserEntity";
import { ProjectPriority } from "../enums";

@Entity({ name: "projects" })
export class ProjectEntity extends BaseTableEntity {
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

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "created_by" })
	creator!: UserEntity;
}
