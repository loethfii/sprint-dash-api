import { Controller, Get, Post, Put, Delete, Patch, Body, Query, Param, Res, Validate, ValidateQuery, Auth, Req } from "../decorators";
import { query, Response } from "express";
import { ApiResponse } from "../utils";
import { TaskService } from "../service";
import { CreateTaskDto, UpdateTaskDto, AssignUserDto, UpdateTaskStatusDto, CommonQueryDTO, QueryTaskDTO, TaskTree } from "../dtos";
import { UserRole } from "../enums";

@Controller("tasks")
export class TaskController {
	private taskService: TaskService;

	constructor() {
		this.taskService = new TaskService();
	}

	@Get()
	@Auth([UserRole.ADMIN, UserRole.MANAGER])
	@ValidateQuery(QueryTaskDTO)
	async getTasks(@Req() req: any, @Query() query: QueryTaskDTO, @Res() res: Response) {
		const result = await this.taskService.getTasks(query, req.user);
		ApiResponse.success(res, result.data, { total: result.total, page: result.page, limit: result.limit });
	}

	@Post()
	@Auth([UserRole.ADMIN, UserRole.MANAGER])
	@Validate(CreateTaskDto)
	async createTask(@Req() req: any, @Body() body: CreateTaskDto, @Res() res: Response) {
		const result = await this.taskService.createTask(body, req.user);
		ApiResponse.success(res, result);
	}

	@Get("tree")
	@ValidateQuery(TaskTree)
	async getTasksTree(@Query() query: TaskTree, @Res() res: Response) {
		const result = await this.taskService.getTasksTree(query);
		ApiResponse.success(res, result);
	}

	@Get(":id")
	@Auth([UserRole.ADMIN, UserRole.MANAGER])
	async getTaskById(@Req() req: any, @Param("id") id: string, @Res() res: Response) {
		const result = await this.taskService.getTaskById(id, req.user);
		ApiResponse.success(res, result);
	}

	@Put(":id")
	@Auth([UserRole.ADMIN, UserRole.MANAGER])
	@Validate(UpdateTaskDto)
	async updateTask(@Req() req: any, @Param("id") id: string, @Body() body: UpdateTaskDto, @Res() res: Response) {
		const result = await this.taskService.updateTask(id, body, req.user);
		ApiResponse.success(res, result);
	}

	@Delete(":id")
	@Auth([UserRole.ADMIN, UserRole.MANAGER])
	async deleteTask(@Req() req: any, @Param("id") id: string, @Res() res: Response) {
		const result = await this.taskService.deleteTask(id, req.user);
		ApiResponse.success(res, result);
	}

	@Get(":id/subtasks")
	@Auth([UserRole.ADMIN, UserRole.MANAGER])
	async getSubtasks(@Req() req: any, @Param("id") id: string, @Res() res: Response) {
		const result = await this.taskService.getSubtasks(id, req.user);
		ApiResponse.success(res, result);
	}

	@Post(":id/assign")
	@Auth([UserRole.ADMIN, UserRole.MANAGER])
	@Validate(AssignUserDto)
	async assignUser(@Req() req: any, @Param("id") id: string, @Body() body: AssignUserDto, @Res() res: Response) {
		const result = await this.taskService.assignUser(id, body, req.user);
		ApiResponse.success(res, result);
	}

	@Delete(":id/assign/:userId")
	@Auth([UserRole.ADMIN, UserRole.MANAGER])
	async unassignUser(
		@Req() req: any,
		@Param("id") id: string,
		@Param("userId") userId: string,
		@Res() res: Response
	) {
		const result = await this.taskService.unassignUser(id, userId, req.user);
		ApiResponse.success(res, result);
	}

	@Patch(":id/status")
	@Auth([UserRole.ADMIN, UserRole.MANAGER])
	@Validate(UpdateTaskStatusDto)
	async updateTaskStatus(@Req() req: any, @Param("id") id: string, @Body() body: UpdateTaskStatusDto, @Res() res: Response) {
		const result = await this.taskService.updateTaskStatus(id, body, req.user);
		ApiResponse.success(res, result);
	}
}
