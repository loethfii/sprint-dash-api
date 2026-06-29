import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseTableEntity } from "./BaseTableEntity";
import { UserRole } from "../enums";
import { MenuEntity } from "./MenuEntity";

@Entity({ name: "users" })
export class UserEntity extends BaseTableEntity {
	@Column({ type: "varchar", length: 255 })
	name!: string;

	@Column({ type: "varchar", length: 255, unique: true })
	username!: string;

	@Column({ name: "password_hash", type: "varchar", length: 255, select: false })
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

	@ManyToOne(() => MenuEntity, (menu) => menu.users, { nullable: true })
	@JoinColumn({ name: "menu_id" })
	menu: MenuEntity;
}
