import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString } from "class-validator";
import { TaskStatus, TaskPriority } from "../enums";

export class CreateTaskDto {
	@IsNotEmpty({ message: "Project ID is required" })
	@IsString({ message: "Project ID must be a string" })
	projectId!: string;

	@IsOptional()
	@IsString({ message: "Parent Task ID must be a string" })
	parentTaskId?: string;

	@IsNotEmpty({ message: "Title is required" })
	@IsString({ message: "Title must be a string" })
	title!: string;

	@IsNotEmpty({ message: "Description is required" })
	@IsString({ message: "Description must be a string" })
	description!: string;

	@IsOptional()
	@IsEnum(TaskStatus, { message: "Invalid status value" })
	status?: TaskStatus;

	@IsNotEmpty({ message: "Start time is required" })
	@IsDateString({}, { message: "Start time must be a valid date string" })
	startTime!: string;

	@IsNotEmpty({ message: "End time is required" })
	@IsDateString({}, { message: "End time must be a valid date string" })
	endTime!: string;

	@IsOptional()
	@IsEnum(TaskPriority, { message: "Invalid priority value" })
	priority?: TaskPriority;
}

export class UpdateTaskDto {
	@IsOptional()
	@IsString({ message: "Project ID must be a string" })
	projectId?: string;

	@IsOptional()
	@IsString({ message: "Parent Task ID must be a string" })
	parentTaskId?: string;

	@IsOptional()
	@IsString({ message: "Title must be a string" })
	title?: string;

	@IsOptional()
	@IsString({ message: "Description must be a string" })
	description?: string;

	@IsOptional()
	@IsEnum(TaskStatus, { message: "Invalid status value" })
	status?: TaskStatus;

	@IsOptional()
	@IsDateString({}, { message: "Start time must be a valid date string" })
	startTime?: string;

	@IsOptional()
	@IsDateString({}, { message: "End time must be a valid date string" })
	endTime?: string;

	@IsOptional()
	@IsEnum(TaskPriority, { message: "Invalid priority value" })
	priority?: TaskPriority;
}

export class AssignUserDto {
	@IsNotEmpty({ message: "User ID is required" })
	@IsString({ message: "User ID must be a string" })
	userId!: string;
}

export class UpdateTaskStatusDto {
	@IsNotEmpty({ message: "Status is required" })
	@IsEnum(TaskStatus, { message: "Invalid status value" })
	status!: TaskStatus;
}
