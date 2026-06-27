import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTable } from "./BaseTable";
import { User } from "./User";
import { Project } from "./Project";

@Entity({ name: "project_assignments" })
export class ProjectAssignment extends BaseTable {
	@Column({ name: "project_id" })
	projectId!: number;

	@ManyToOne(() => Project)
	@JoinColumn({ name: "project_id" })
	project!: Project;

	@Column({ name: "manager_id" })
	managerId!: number;

	@ManyToOne(() => User)
	@JoinColumn({ name: "manager_id" })
	manager!: User;

	@Column({ name: "assigned_at", type: "timestamp" })
	assignedAt!: Date;
}
