import { Controller, Get, Post, Put, Delete, Body, Query, Param, Res, Validate } from "../decorators";
import { Response } from "express";
import { ApiResponse } from "../utils";
import { ProjectService } from "../service";
import { CreateProjectDto, UpdateProjectDto, AssignManagerDto } from "../dtos";

@Controller("projects")
export class ProjectController {
	private projectService: ProjectService;

	constructor() {
		this.projectService = new ProjectService();
	}

	@Get()
	async getProjects(@Query() query: any, @Res() res: Response) {
		const result = await this.projectService.getProjects(query);
		ApiResponse.success(res, result);
	}

	@Post()
	@Validate(CreateProjectDto)
	async createProject(@Body() body: CreateProjectDto, @Res() res: Response) {
		const result = await this.projectService.createProject(body);
		ApiResponse.success(res, result);
	}

	@Get(":id")
	async getProjectById(@Param("id") id: string, @Res() res: Response) {
		const result = await this.projectService.getProjectById(id);
		ApiResponse.success(res, result);
	}

	@Put(":id")
	@Validate(UpdateProjectDto)
	async updateProject(@Param("id") id: string, @Body() body: UpdateProjectDto, @Res() res: Response) {
		const result = await this.projectService.updateProject(id, body);
		ApiResponse.success(res, result);
	}

	@Delete(":id")
	async deleteProject(@Param("id") id: string, @Res() res: Response) {
		const result = await this.projectService.deleteProject(id);
		ApiResponse.success(res, result);
	}

	@Post(":id/assign")
	@Validate(AssignManagerDto)
	async assignManager(@Param("id") id: string, @Body() body: AssignManagerDto, @Res() res: Response) {
		const result = await this.projectService.assignManager(id, body);
		ApiResponse.success(res, result);
	}

	@Delete(":id/assign/:managerId")
	async unassignManager(
		@Param("id") id: string,
		@Param("managerId") managerId: string,
		@Res() res: Response
	) {
		const result = await this.projectService.unassignManager(id, managerId);
		ApiResponse.success(res, result);
	}
}

