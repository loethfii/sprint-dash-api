import { Controller, Get, Post, Put, Delete, Body, Query, Param, Res, Validate, Auth, Req, ValidateQuery } from "../decorators";
import { Response } from "express";
import { ApiResponse } from "../utils";
import { ProjectService } from "../service";
import { CreateProjectDto, UpdateProjectDto, AssignManagerDto, CommonQueryDTO } from "../dtos";
import { UserRole } from "../enums";

@Controller("projects")
export class ProjectController {
	private projectService: ProjectService;

	constructor() {
		this.projectService = new ProjectService();
	}

	@Get()
	@Auth()
	@ValidateQuery(CommonQueryDTO)
	async getProjects(@Query() query: CommonQueryDTO, @Res() res: Response) {
		const result = await this.projectService.getProjects(query);
		ApiResponse.success(res, result.data, { total: result.total, page: result.page, limit: result.limit });
	}

	@Post()
	@Auth([UserRole.ADMIN])
	@Validate(CreateProjectDto)
	async createProject(@Req() req: any, @Body() body: CreateProjectDto, @Res() res: Response) {
		const result = await this.projectService.createProject(body, req.user);
		ApiResponse.success(res, result);
	}

	@Get(":id")
	@Auth()
	async getProjectById(@Param("id") id: string, @Res() res: Response) {
		const result = await this.projectService.getProjectById(id);
		ApiResponse.success(res, result);
	}

	@Put(":id")
	@Auth([UserRole.ADMIN])
	@Validate(UpdateProjectDto)
	async updateProject(@Param("id") id: string, @Body() body: UpdateProjectDto, @Res() res: Response) {
		const result = await this.projectService.updateProject(id, body);
		ApiResponse.success(res, result);
	}

	@Delete(":id")
	@Auth([UserRole.ADMIN])
	async deleteProject(@Param("id") id: string, @Res() res: Response) {
		const result = await this.projectService.deleteProject(id);
		ApiResponse.success(res, result);
	}

	@Post(":id/assign")
	@Auth([UserRole.ADMIN])
	@Validate(AssignManagerDto)
	async assignManager(@Param("id") id: string, @Body() body: AssignManagerDto, @Res() res: Response) {
		const result = await this.projectService.assignManager(id, body);
		ApiResponse.success(res, result);
	}

	@Delete(":id/assign/:managerId")
	@Auth([UserRole.ADMIN])
	async unassignManager(
		@Param("id") id: string,
		@Param("managerId") managerId: string,
		@Res() res: Response
	) {
		const result = await this.projectService.unassignManager(id, managerId);
		ApiResponse.success(res, result);
	}
}


