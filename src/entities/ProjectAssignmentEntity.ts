import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTableEntity } from "./BaseTableEntity";
import { UserEntity } from "./UserEntity";
import { ProjectEntity } from "./ProjectEntity";

@Entity({ name: "project_assignments" })
export class ProjectAssignmentEntity extends BaseTableEntity {
	@Column({ name: "project_id", nullable: true })
	projectId!: string | null;

	@ManyToOne(() => ProjectEntity, { onDelete: "SET NULL", onUpdate: "SET NULL" })
	@JoinColumn({ name: "project_id" })
	project!: ProjectEntity | null;

	@Column({ name: "manager_id", nullable: true })
	managerId!: string | null;

	@ManyToOne(() => UserEntity, { onDelete: "SET NULL", onUpdate: "SET NULL" })
	@JoinColumn({ name: "manager_id" })
	manager!: UserEntity | null;

	@Column({ name: "assigned_at", type: "timestamp" })
	assignedAt!: Date;
}
