import { Controller, Get, Post, Put, Delete, Body, Query, Param, Res, Auth, Validate, ValidateQuery, Patch, Req } from "../decorators";
import { Response } from "express";
import { UserService } from "../service";
import { ApiResponse } from "../utils";
import { UserRole } from "../enums";
import { CreateUserDto, UpdateUserDto, CommonQueryDTO, UserQuery, ChangePasswordDto } from "../dtos";

@Controller("users")
export class UserController {
	private userService: UserService;
	constructor() {
		this.userService = new UserService();
	}

	@Get()
	// @Auth([UserRole.ADMIN, UserRole.MANAGER, Us])
	@Auth()
	@ValidateQuery(CommonQueryDTO)
	async getAllUsers(@Query() query: UserQuery, @Res() res: Response) {
		const result = await this.userService.getAllUsers(query);
		ApiResponse.success(res, result.data, { total: result.total, page: result.page, limit: result.limit });
	}

	@Post()
	@Auth([UserRole.ADMIN])
	@Validate(CreateUserDto)
	async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
		const result = await this.userService.createUser(body);
		ApiResponse.success(res, result);
	}

	@Get(":id")
	@Auth([UserRole.ADMIN])
	async getUserById(@Param("id") id: string, @Res() res: Response) {
		const result = await this.userService.getUserById(id);
		ApiResponse.success(res, result);
	}

	@Put(":id")
	@Auth([UserRole.ADMIN])
	@Validate(UpdateUserDto)
	async updateUser(@Param("id") id: string, @Body() body: UpdateUserDto, @Res() res: Response) {
		const result = await this.userService.updateUser(id, body);
		ApiResponse.success(res, result);
	}

	@Delete(":id")
	@Auth([UserRole.ADMIN])
	async deleteUser(@Param("id") id: string, @Res() res: Response) {
		const result = await this.userService.deleteUser(id);
		ApiResponse.success(res, result);
	}

	@Patch('change-password')
	@Auth()
	@Validate(ChangePasswordDto)
	async changePassword(@Req() req: any, @Body() body: ChangePasswordDto, @Res() res: Response) {
		const result = await this.userService.changePassword(req.user.id, body);
		ApiResponse.success(res, result);
	}
}


