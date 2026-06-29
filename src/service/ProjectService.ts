import { In } from "typeorm";
import { pickBy } from "lodash";
import { entityManager } from "../types";
import { ProjectEntity, ProjectAssignmentEntity, UserEntity } from "../entities";
import { BadRequestException, NotFoundException } from "../exceptions";
import { CreateProjectDto, UpdateProjectDto, AssignManagerDto } from "../dtos";
import { CommonQueryDTO } from "../dtos/CommonDto";
import { UserRole } from "../enums";

export class ProjectService {
	async getProjects(query: CommonQueryDTO) {
		const queryBuilder = entityManager.getRepository(ProjectEntity).createQueryBuilder("project");

		// Relations
		queryBuilder.leftJoinAndSelect("project.creator", "creator");

		// Search
		if (query.keyword) {
			queryBuilder.andWhere("LOWER(project.projectName) LIKE LOWER(:keyword)", {
				keyword: `%${query.keyword}%`
			});
		}

		// Filters
		if (query.startDate) {
			queryBuilder.andWhere("project.startDate >= :startDate", { startDate: query.startDate });
		}

		if (query.endDate) {
			queryBuilder.andWhere("project.endDate <= :endDate", { endDate: query.endDate });
		}

		// Pagination
		const page = query.page || 1;
		const limit = query.limit || 10;
		const skip = (page - 1) * limit;

		queryBuilder.orderBy("project.createdAt", "DESC");
		queryBuilder.take(limit).skip(skip);

		const [projects, total] = await queryBuilder.getManyAndCount();

		return {
			data: projects,
			total,
			page,
			limit
		};
	}

	async createProject(body: CreateProjectDto, user: UserEntity) {
		const project = entityManager.create(ProjectEntity, {
			projectName: body.projectName,
			startDate: new Date(body.startDate),
			endDate: new Date(body.endDate),
			priority: body.priority,
			description: body.description,
			scopeCategory: body.scopeCategory,
			createdBy: user.id
		});

		await entityManager.save(ProjectEntity, project);
		return project;
	}

	async getProjectById(id: string) {
		const project = await entityManager.findOne(ProjectEntity, {
			where: { id },
			relations: { creator: true }
		});
		if (!project) {
			throw new NotFoundException("Project not found");
		}
		return project;
	}

	async updateProject(id: string, body: UpdateProjectDto) {
		const project = await entityManager.findOne(ProjectEntity, { where: { id } });
		if (!project) {
			throw new NotFoundException("Project not found");
		}

		const { startDate, endDate, ...rest } = body;

		const updateData: Partial<ProjectEntity> = pickBy(rest, (v) => v !== undefined);

		if (startDate !== undefined) updateData.startDate = new Date(startDate);
		if (endDate !== undefined) updateData.endDate = new Date(endDate);

		Object.assign(project, updateData);

		await entityManager.save(ProjectEntity, project);
		return project;
	}

	async deleteProject(id: string) {
		const project = await entityManager.findOne(ProjectEntity, { where: { id } });
		if (!project) {
			throw new NotFoundException("Project not found");
		}
		await entityManager.softDelete(ProjectEntity, project.id);
		return { message: "Project successfully deleted" };
	}

	async assignManager(id: string, body: AssignManagerDto) {
		return entityManager.transaction(async (tx) => {
			const project = await tx.findOne(ProjectEntity, { where: { id } });
			if (!project) {
				throw new NotFoundException("Project not found");
			}

			const manager = await tx.findOne(UserEntity, { where: { id: body.managerId, role: In([UserRole.MANAGER]) } });
			if (!manager) {
				throw new NotFoundException("Manager not found");
			}

			const existingAssignment = await tx.findOne(ProjectAssignmentEntity, {
				where: { projectId: id, managerId: body.managerId }
			});
			if (existingAssignment) {
				throw new BadRequestException("Manager is already assigned to this project");
			}

			const assignment = tx.create(ProjectAssignmentEntity, {
				projectId: id,
				managerId: body.managerId,
				assignedAt: new Date()
			});

			await tx.save(ProjectAssignmentEntity, assignment);

			return { message: "Manager successfully assigned to project" };
		})
	}

	async unassignManager(id: string, managerId: string) {
		return entityManager.transaction(async (tx) => {
			const project = await tx.findOne(ProjectEntity, { where: { id } });
			if (!project) {
				throw new NotFoundException("Project not found");
			}

			const assignment = await tx.findOne(ProjectAssignmentEntity, {
				where: { projectId: id, managerId }
			});
			if (!assignment) {
				throw new NotFoundException("Assignment not found");
			}
			await tx.delete(ProjectAssignmentEntity, assignment.id);
			return { message: "Manager successfully unassigned from project" };
		});
	}
}
