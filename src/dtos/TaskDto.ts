import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString, IsUUID, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { TaskStatus, TaskPriority } from "../enums";
import { CommonQueryDTO } from "./CommonDto";


export class QueryTaskDTO extends CommonQueryDTO {
	@IsOptional()
	@IsUUID()
	projectId: string
}
export class CreateTaskDto {
	@IsOptional()
	@IsString({ message: "Project ID must be a string" })
	projectId?: string;

	@IsOptional()
	@IsString({ message: "Parent Task ID must be a string" })
	parentTaskId?: string;

	@IsNotEmpty({ message: "Title is required" })
	@IsString({ message: "Title must be a string" })
	title!: string;

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

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateTaskDto)
	child?: CreateTaskDto[];
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

export class TaskTree {
	@IsOptional()
	@IsUUID()
	projectId?: string;

	@IsOptional()
	@IsUUID()
	assignedUser?: string;

	@IsOptional()
	@IsEnum(TaskPriority)
	priority?: TaskPriority

	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus
}