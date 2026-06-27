import { Controller, Get, Post, Put, Delete, Body, Query, Param, Res } from "../decorators";
import { Response } from "express";
import { UserService } from "../service";
import { ApiResponse } from "../utils";

@Controller("users")
export class UserController {
	private userService: UserService;
	constructor() {
		this.userService = new UserService();
	}

	@Get()
	async getAllUsers(@Query() query: any, @Res() res: Response) {
		const result = await this.userService.getAllUsers(query, res);
		return result
	}

	@Post()
	async createUser(@Body() body: any, @Res() res: Response) {
		const result = await this.userService.createUser(body);
		ApiResponse.success(res, result);
	}

	@Get(":id")
	async getUserById(@Param("id") id: string, @Res() res: Response) {
		const result = await this.userService.getUserById(id);
		ApiResponse.success(res, result);
	}

	@Put(":id")
	async updateUser(@Param("id") id: string, @Body() body: any, @Res() res: Response) {
		const result = await this.userService.updateUser(id, body);
		ApiResponse.success(res, result);
	}

	@Delete(":id")
	async deleteUser(@Param("id") id: string, @Res() res: Response) {
		const result = await this.userService.deleteUser(id);
		ApiResponse.success(res, result);
	}
}
