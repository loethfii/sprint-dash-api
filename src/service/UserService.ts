import { Response } from "express";
import bcrypt from "bcryptjs";
import { UserEntity } from "../entities";
import { entityManager } from "../types";
import { BadRequestException, NotFoundException } from "../exceptions";
import { CreateUserDto, UpdateUserDto, UserQuery } from "../dtos";

export class UserService {
	async getUsers() {
		const users = await entityManager.find(UserEntity, {
			order: { createdAt: "DESC" }
		});
		return users;
	}

	async getAllUsers(query: UserQuery) {
		const queryBuilder = entityManager.getRepository(UserEntity).createQueryBuilder("user");

		if (query.keyword) {
			queryBuilder.andWhere(
				"(LOWER(user.name) LIKE LOWER(:keyword) OR LOWER(user.username) LIKE LOWER(:keyword) OR LOWER(user.email) LIKE LOWER(:keyword))",
				{ keyword: `%${query.keyword}%` }
			);
		}

		if (query.role) {
			queryBuilder.andWhere("user.role = :role", { role: query.role });
		}

		const page = query.page || 1;
		const limit = query.limit || 10;
		const skip = (page - 1) * limit;

		queryBuilder.orderBy("user.createdAt", "DESC");
		queryBuilder.take(limit).skip(skip);

		const [users, total] = await queryBuilder.getManyAndCount();

		return {
			data: users,
			total,
			page,
			limit
		};
	}

	async createUser(body: CreateUserDto) {
		const existingUsername = await entityManager.findOne(UserEntity, {
			where: { username: body.username }
		});
		if (existingUsername) {
			throw new BadRequestException("Username already exists");
		}

		const existingEmail = await entityManager.findOne(UserEntity, {
			where: { email: body.email }
		});
		if (existingEmail) {
			throw new BadRequestException("Email already exists");
		}

		const passwordHash = await bcrypt.hash(body.password, 10);
		const menuId = body.role === "admin" ? "0a58f456-43b8-4072-8c96-ad1e54632605" : "4c524510-48f9-47ee-853b-d95af5f1c2f4";
		const user = entityManager.create(UserEntity, {
			name: body.name,
			username: body.username,
			passwordHash,
			email: body.email,
			phoneNumber: body.phoneNumber,
			role: body.role,
			menu: { id: menuId } as any
		});

		await entityManager.save(UserEntity, user);
		return user;
	}

	async getUserById(id: string) {
		const user = await entityManager.findOne(UserEntity, { where: { id } });
		if (!user) {
			throw new NotFoundException("User not found");
		}
		return user;
	}

	async updateUser(id: string, body: UpdateUserDto) {
		const user = await entityManager.findOne(UserEntity, { where: { id } });
		if (!user) {
			throw new NotFoundException("User not found");
		}

		// const { name, username, password, email, phoneNumber, role } = body;
		if (body.username && body.username !== user.username) {
			const checkUsername = await entityManager.findOne(UserEntity, { where: { username: body.username } });
			if (checkUsername) {
				throw new BadRequestException("Username already exists");
			}
			user.username = body.username;
		}

		if (body.email && body.email !== user.email) {
			const checkEmail = await entityManager.findOne(UserEntity, { where: { email: body.email } });
			if (checkEmail) {
				throw new BadRequestException("Email already exists");
			}
			user.email = body.email;
		}

		if (body.name) user.name = body.name;
		if (body.phoneNumber) user.phoneNumber = body.phoneNumber;
		if (body.role) {
			user.role = body.role;
			const menuId = body.role === "admin" ? "0a58f456-43b8-4072-8c96-ad1e54632605" : "4c524510-48f9-47ee-853b-d95af5f1c2f4";
			user.menu = { id: menuId } as any;
		}
		if (body.password) {
			user.passwordHash = await bcrypt.hash(body.password, 10);
		}

		await entityManager.save(UserEntity, user);
		return user;
	}

	async deleteUser(id: string) {
		const user = await entityManager.findOne(UserEntity, { where: { id } });
		if (!user) {
			throw new NotFoundException("User not found");
		}
		await entityManager.softDelete(UserEntity, user.id);
		return { message: "User successfully deleted" };
	}
}
