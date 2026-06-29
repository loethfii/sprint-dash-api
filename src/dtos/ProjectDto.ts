import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString } from "class-validator";
import { ProjectPriority } from "../enums";

export class CreateProjectDto {
	@IsNotEmpty({ message: "Project name is required" })
	@IsString({ message: "Project name must be a string" })
	projectName!: string;

	@IsNotEmpty({ message: "Start date is required" })
	@IsDateString({}, { message: "Start date must be a valid date string" })
	startDate!: string;

	@IsNotEmpty({ message: "End date is required" })
	@IsDateString({}, { message: "End date must be a valid date string" })
	endDate!: string;

	@IsOptional()
	@IsEnum(ProjectPriority, { message: "Invalid priority value" })
	priority?: ProjectPriority;

	@IsOptional()
	@IsString({ message: "Description must be a string" })
	description?: string;

	@IsOptional()
	@IsString({ message: "Scope category must be a string" })
	scopeCategory?: string;
}

export class UpdateProjectDto {
	@IsOptional()
	@IsString({ message: "Project name must be a string" })
	projectName?: string;

	@IsOptional()
	@IsDateString({}, { message: "Start date must be a valid date string" })
	startDate?: string;

	@IsOptional()
	@IsDateString({}, { message: "End date must be a valid date string" })
	endDate?: string;

	@IsOptional()
	@IsEnum(ProjectPriority, { message: "Invalid priority value" })
	priority?: ProjectPriority;

	@IsOptional()
	@IsString({ message: "Description must be a string" })
	description?: string;

	@IsOptional()
	@IsString({ message: "Scope category must be a string" })
	scopeCategory?: string;
}

export class AssignManagerDto {
	@IsNotEmpty({ message: "Manager ID is required" })
	@IsString({ message: "Manager ID must be a string" })
	managerId!: string;
}
