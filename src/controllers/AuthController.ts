import { Controller, Get, Post, Body, Res } from "../decorators";
import { Response } from "express";
import { ApiResponse } from "../utils";
import { AuthService } from "../service"

@Controller("auth")
export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	@Post("login")
	async login(@Body() body: any, @Res() res: Response) {
		const result = await this.authService.login(body);
		ApiResponse.success(res, result);
	}

	@Post("logout")
	async logout(@Res() res: Response) {
		const result = await this.authService.logout();
		ApiResponse.success(res, result);
	}

	@Get("me")
	async me(@Res() res: Response) {
		const result = await this.authService.me();
		ApiResponse.success(res, result);
	}
}
