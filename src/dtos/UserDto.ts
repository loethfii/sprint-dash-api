import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "../enums";
import { CommonQueryDTO } from "./CommonDto";

export class CreateUserDto {
	@IsNotEmpty({ message: "Name is required" })
	@IsString({ message: "Name must be a string" })
	name!: string;

	@IsNotEmpty({ message: "Username is required" })
	@IsString({ message: "Username must be a string" })
	username!: string;

	@IsNotEmpty({ message: "Password is required" })
	@IsString({ message: "Password must be a string" })
	password!: string;

	@IsNotEmpty({ message: "Email is required" })
	@IsEmail({}, { message: "Invalid email address" })
	email!: string;

	@IsOptional()
	@IsString({ message: "Phone number must be a string" })
	phoneNumber?: string;

	@IsNotEmpty({ message: "Role is required" })
	@IsEnum(UserRole, { message: "Invalid role value" })
	role!: UserRole;
}

export class UpdateUserDto {
	@IsOptional()
	@IsString({ message: "Name must be a string" })
	name?: string;

	@IsOptional()
	@IsString({ message: "Username must be a string" })
	username?: string;

	@IsOptional()
	@IsString({ message: "Password must be a string" })
	password?: string;

	@IsOptional()
	@IsEmail({}, { message: "Invalid email address" })
	email?: string;

	@IsOptional()
	@IsString({ message: "Phone number must be a string" })
	phoneNumber?: string;

	@IsOptional()
	@IsEnum(UserRole, { message: "Invalid role value" })
	role?: UserRole;
}

export class UserQuery extends CommonQueryDTO {
	@IsOptional()
	@IsEnum(UserRole, { message: "Invalid role value" })
	role?: UserRole;
}

export class ChangePasswordDto {
	@IsNotEmpty({ message: "Old password is required" })
	@IsString({ message: "Old password must be a string" })
	oldPassword!: string;

	@IsNotEmpty({ message: "New password is required" })
	@IsString({ message: "New password must be a string" })
	password!: string;

	@IsNotEmpty({ message: "Confirm password is required" })
	@IsString({ message: "Confirm password must be a string" })
	confirmPassword!: string;
}