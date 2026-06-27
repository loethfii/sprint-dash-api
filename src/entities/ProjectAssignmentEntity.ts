import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTableEntity } from "./BaseTableEntity";
import { UserEntity } from "./UserEntity";
import { ProjectEntity } from "./ProjectEntity";

@Entity({ name: "project_assignments" })
export class ProjectAssignmentEntity extends BaseTableEntity {
	@Column({ name: "project_id" })
	projectId!: number;

	@ManyToOne(() => ProjectEntity)
	@JoinColumn({ name: "project_id" })
	project!: ProjectEntity;

	@Column({ name: "manager_id" })
	managerId!: number;

	@ManyToOne(() => UserEntity)
	@JoinColumn({ name: "manager_id" })
	manager!: UserEntity;

	@Column({ name: "assigned_at", type: "timestamp" })
	assignedAt!: Date;
}
