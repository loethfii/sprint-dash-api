import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	Column,
} from "typeorm";

export abstract class BaseTableEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt!: Date;

	@UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt!: Date;

	// @DeleteDateColumn mendukung fitur soft-delete bawaan TypeORM
	@DeleteDateColumn({ name: "deleted_at", nullable: true, type: 'timestamptz' })
	deletedAt!: Date | null;

	@Column({
		name: "metadata",
		type: "jsonb",
		nullable: true,
	})
	metadata?: any;
}
