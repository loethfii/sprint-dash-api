import { Controller, Get, Post, Body, Res, Auth, Req, Validate } from "../decorators";
import { Response } from "express";
import { ApiResponse } from "../utils";
import { AuthService } from "../service";
import { LoginDto } from "../dtos";

@Controller("auth")
export class AuthController {
	private authService: AuthService;

	constructor() {
		this.authService = new AuthService();
	}

	@Post("login")
	@Validate(LoginDto)
	async login(@Body() body: LoginDto, @Res() res: Response) {
		const result = await this.authService.login(body);
		ApiResponse.success(res, result);
	}

	@Post("logout")
	async logout(@Res() res: Response) {
		const result = await this.authService.logout();
		ApiResponse.success(res, result);
	}

	@Get("me")
	@Auth()
	async me(@Req() req: any, @Res() res: Response) {
		const result = await this.authService.me(req.user);
		ApiResponse.success(res, result);
	}
}


