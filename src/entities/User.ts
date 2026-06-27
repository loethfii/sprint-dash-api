import { Entity, Column } from "typeorm";
import { BaseTable } from "./BaseTable";
import { UserRole } from "../enums";

@Entity({ name: "users" })
export class User extends BaseTable {
	@Column({ type: "varchar", length: 255 })
	name!: string;

	@Column({ type: "varchar", length: 255, unique: true })
	username!: string;

	@Column({ name: "password_hash", type: "varchar", length: 255 })
	passwordHash!: string;

	@Column({ type: "varchar", length: 255, unique: true })
	email!: string;

	@Column({ name: "phone_number", type: "varchar", length: 50, nullable: true })
	phoneNumber?: string;

	@Column({
		type: "enum",
		enum: UserRole,
		default: UserRole.STAFF,
	})
	role!: UserRole;
}
