import { Controller, Get, Post, Put, Delete, Patch, Body, Query, Param, Res } from "../decorators";
import { Response } from "express";
import { ApiResponse } from "../utils";
import { TaskService } from "../service";

@Controller("tasks")
export class TaskController {
	private taskService: TaskService;

	constructor() {
		this.taskService = new TaskService();
	}

	@Get()
	async getTasks(@Query() query: any, @Res() res: Response) {
		const result = await this.taskService.getTasks(query);
		ApiResponse.success(res, result);
	}

	@Post()
	async createTask(@Body() body: any, @Res() res: Response) {
		const result = await this.taskService.createTask(body);
		ApiResponse.success(res, result);
	}

	@Get("tree")
	async getTasksTree(@Res() res: Response) {
		const result = await this.taskService.getTasksTree();
		ApiResponse.success(res, result);
	}

	@Get(":id")
	async getTaskById(@Param("id") id: string, @Res() res: Response) {
		const result = await this.taskService.getTaskById(id);
		ApiResponse.success(res, result);
	}

	@Put(":id")
	async updateTask(@Param("id") id: string, @Body() body: any, @Res() res: Response) {
		const result = await this.taskService.updateTask(id, body);
		ApiResponse.success(res, result);
	}

	@Delete(":id")
	async deleteTask(@Param("id") id: string, @Res() res: Response) {
		const result = await this.taskService.deleteTask(id);
		ApiResponse.success(res, result);
	}

	@Get(":id/subtasks")
	async getSubtasks(@Param("id") id: string, @Res() res: Response) {
		const result = await this.taskService.getSubtasks(id);
		ApiResponse.success(res, result);
	}

	@Post(":id/assign")
	async assignUser(@Param("id") id: string, @Body() body: any, @Res() res: Response) {
		const result = await this.taskService.assignUser(id, body);
		ApiResponse.success(res, result);
	}

	@Delete(":id/assign/:userId")
	async unassignUser(
		@Param("id") id: string,
		@Param("userId") userId: string,
		@Res() res: Response
	) {
		const result = await this.taskService.unassignUser(id, userId);
		ApiResponse.success(res, result);
	}

	@Patch(":id/status")
	async updateTaskStatus(@Param("id") id: string, @Body() body: any, @Res() res: Response) {
		const result = await this.taskService.updateTaskStatus(id, body);
		ApiResponse.success(res, result);
	}
}
