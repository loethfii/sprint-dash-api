import { Response } from "express";
import bcrypt from "bcryptjs";
import { UserEntity } from "../entities";
import { entityManager } from "../types";
import { BadRequestException, NotFoundException } from "../exceptions";
import { ApiResponse } from "../utils";

export class UserService {
	async getUsers() {
		const users = await entityManager.find(UserEntity);
		return users.map(({ passwordHash, ...user }) => user);
	}

	async getAllUsers(query: any, res: Response) {
		const users = await entityManager.find(UserEntity);
		const sanitizedUsers = users.map(({ passwordHash, ...user }) => user);
		return ApiResponse.success(res, sanitizedUsers, {
			page: 1,
			limit: 22,
			total: 22,
			totalPages: 1
		});
	}

	async createUser(body: any) {
		const { name, username, password, email, phoneNumber, role } = body;

		const existingUser = await entityManager.findOne(UserEntity, {
			where: [{ username }, { email }]
		});
		if (existingUser) {
			throw new BadRequestException("Username or email already exists");
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const user = entityManager.create(UserEntity, {
			name,
			username,
			passwordHash,
			email,
			phoneNumber,
			role
		});

		await entityManager.save(UserEntity, user);
		const { passwordHash: _, ...userResponse } = user;
		return userResponse;
	}

	async getUserById(id: string) {
		const user = await entityManager.findOne(UserEntity, { where: { id } });
		if (!user) {
			throw new NotFoundException("User not found");
		}
		const { passwordHash, ...userResponse } = user;
		return userResponse;
	}

	async updateUser(id: string, body: any) {
		const user = await entityManager.findOne(UserEntity, { where: { id } });
		if (!user) {
			throw new NotFoundException("User not found");
		}

		const { name, username, password, email, phoneNumber, role } = body;
		if (username && username !== user.username) {
			const checkUsername = await entityManager.findOne(UserEntity, { where: { username } });
			if (checkUsername) {
				throw new BadRequestException("Username already exists");
			}
			user.username = username;
		}

		if (email && email !== user.email) {
			const checkEmail = await entityManager.findOne(UserEntity, { where: { email } });
			if (checkEmail) {
				throw new BadRequestException("Email already exists");
			}
			user.email = email;
		}

		if (name) user.name = name;
		if (phoneNumber) user.phoneNumber = phoneNumber;
		if (role) user.role = role;
		if (password) {
			user.passwordHash = await bcrypt.hash(password, 10);
		}

		await entityManager.save(UserEntity, user);
		const { passwordHash: _, ...userResponse } = user;
		return userResponse;
	}

	async deleteUser(id: string) {
		const user = await entityManager.findOne(UserEntity, { where: { id } });
		if (!user) {
			throw new NotFoundException("User not found");
		}
		await entityManager.remove(UserEntity, user);
		return { message: "User successfully deleted" };
	}
}
