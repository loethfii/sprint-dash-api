import { Controller, Get, Post, Body, Query, Res } from "../decorators";
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
	getAllUsers(@Query() query: any, @Res() res: Response) {
		const users = this.userService.getUsers();
		ApiResponse.success(res, users);
	}

	@Post()
	createUser(@Body() body: any, @Res() res: Response) {
		console.log("Body received:", body);
		ApiResponse.success(res, { created: true, data: body }, 201);
	}
}
