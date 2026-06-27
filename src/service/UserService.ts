import { Response } from "express";
import { UserEntity } from "../entities";
import { entityManager } from "../types";
import { BadRequestException } from "../exceptions";
import { ApiResponse } from "../utils";



export class UserService {
	async getUsers() {
		const users = await entityManager.find(UserEntity);
		return users;
	}

	async getAllUsers(query: any, res: Response) {
		const users = await entityManager.find(UserEntity);
		return ApiResponse.success(res, users, {
			page: 1,
			limit: 22,
			total: 22,
			totalPages: 1
		});
	}

	async createUser(body: any) {
		return null;
	}

	async getUserById(id: string) {
		return null;
	}

	async updateUser(id: string, body: any) {
		return null;
	}

	async deleteUser(id: string) {
		return null;
	}
}
