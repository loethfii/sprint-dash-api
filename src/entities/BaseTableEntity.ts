import {
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	Column,
} from "typeorm";

export abstract class BaseTableEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@CreateDateColumn({ name: "created_at", default: new Date().toISOString() })
	createdAt!: string;

	@UpdateDateColumn({ name: "updated_at", default: new Date().toISOString() })
	updatedAt!: string;

	// @DeleteDateColumn mendukung fitur soft-delete bawaan TypeORM
	@DeleteDateColumn({ name: "deleted_at", nullable: true })
	deletedAt!: Date | null;

	@Column({
		name: "metadata",
		type: "jsonb",
		nullable: true,
	})
	metadata?: any;
}
