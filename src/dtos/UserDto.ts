import { IsNotEmpty, IsString, IsEmail, IsOptional, IsEnum } from "class-validator";
import { UserRole } from "../enums";

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
