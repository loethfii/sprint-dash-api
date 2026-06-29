import { entityManager } from "../types";
import { TaskEntity, UserEntity, ProjectAssignmentEntity, ProjectEntity, TaskAssignmentEntity } from "../entities";
import { CreateTaskDto, QueryTaskDTO, UpdateTaskDto, AssignUserDto, UpdateTaskStatusDto } from "../dtos";
import { UserRole, TaskStatus, TaskPriority } from "../enums";
import { BadRequestException, ForbiddenException, NotFoundException } from "../exceptions";

export class TaskService {
	private async checkProjectAssignment(projectId: string, user: UserEntity) {
		if (user.role === UserRole.ADMIN) {
			return;
		}

		if (user.role !== UserRole.MANAGER) {
			throw new ForbiddenException("Only managers and admins can perform this action");
		}

		const assignment = await entityManager.findOne(ProjectAssignmentEntity, {
			where: { projectId, managerId: user.id }
		});

		if (!assignment) {
			throw new ForbiddenException("You are not assigned to this project");
		}
	}

	async getTasks(query: QueryTaskDTO, user: UserEntity) {
		const queryBuilder = entityManager.getRepository(TaskEntity).createQueryBuilder("task");
		if (user.role === UserRole.MANAGER) {
			const assignments = await entityManager.findOne(ProjectAssignmentEntity, {
				where: { managerId: user.id, projectId: query.projectId }
			});
			if (!assignments) {
				throw new BadRequestException("You are not assigned to this project")
			}
		}

		if (query.projectId) {
			queryBuilder.andWhere("task.projectId = :projectId", { projectId: query.projectId });
		}

		queryBuilder.andWhere("task.parentTaskId IS NULL");

		if (query.keyword) {
			queryBuilder.andWhere(
				"(LOWER(task.title) LIKE LOWER(:keyword) OR LOWER(task.description) LIKE LOWER(:keyword))",
				{ keyword: `%${query.keyword}%` }
			);
		}

		if (query.startDate) {
			queryBuilder.andWhere("task.startTime >= :startDate", { startDate: query.startDate });
		}

		if (query.endDate) {
			queryBuilder.andWhere("task.endTime <= :endDate", { endDate: query.endDate });
		}

		const page = query.page || 1;
		const limit = query.limit || 10;
		const skip = (page - 1) * limit;

		queryBuilder.take(limit).skip(skip);

		const [tasks, total] = await queryBuilder.getManyAndCount();

		let childTasks: TaskEntity[] = [];
		if (tasks.length > 0) {
			const parentIds = tasks.map(t => t.id);
			childTasks = await entityManager.getRepository(TaskEntity)
				.createQueryBuilder("child")
				.where("child.parentTaskId IN (:...parentIds)", { parentIds })
				.getMany();
		}

		const data = tasks.map(task => ({
			...task,
			child: childTasks.filter(child => child.parentTaskId === task.id)
		}));

		return {
			data,
			total,
			page,
			limit
		};
	}

	async createTask(body: CreateTaskDto, user: UserEntity) {
		const project = await entityManager.findOne(ProjectEntity, { where: { id: body.projectId } });
		if (!project) {
			throw new NotFoundException("Project not found");
		}

		await this.checkProjectAssignment(body.projectId, user);

		const task = entityManager.create(TaskEntity, {
			projectId: body.projectId,
			parentTaskId: body.parentTaskId || null,
			title: body.title,
			description: body.description,
			status: body.status || TaskStatus.OPEN,
			startTime: new Date(body.startTime),
			endTime: new Date(body.endTime),
			priority: body.priority || TaskPriority.MEDIUM,
			createdBy: user.id
		});

		await entityManager.save(TaskEntity, task);
		return task;
	}

	async getTasksTree() {
		return null;
	}

	async getTaskById(id: string, user: UserEntity) {
		const task = await entityManager.findOne(TaskEntity, { where: { id } });
		if (!task) {
			throw new NotFoundException("Task not found");
		}
		if (task.projectId) {
			await this.checkProjectAssignment(task.projectId, user);
		}
		return task;
	}

	async updateTask(id: string, body: UpdateTaskDto, user: UserEntity) {
		const task = await entityManager.findOne(TaskEntity, { where: { id } });
		if (!task) {
			throw new NotFoundException("Task not found");
		}

		if (task.projectId) {
			await this.checkProjectAssignment(task.projectId, user);
		}

		if (body.projectId && body.projectId !== task.projectId) {
			const project = await entityManager.findOne(ProjectEntity, { where: { id: body.projectId } });
			if (!project) {
				throw new NotFoundException("New project not found");
			}
			await this.checkProjectAssignment(body.projectId, user);
			task.projectId = body.projectId;
		}

		if (body.parentTaskId !== undefined) {
			task.parentTaskId = body.parentTaskId || null;
		}
		if (body.title !== undefined) task.title = body.title;
		if (body.description !== undefined) task.description = body.description;
		if (body.status !== undefined) task.status = body.status;
		if (body.startTime !== undefined) task.startTime = new Date(body.startTime);
		if (body.endTime !== undefined) task.endTime = new Date(body.endTime);
		if (body.priority !== undefined) task.priority = body.priority;

		await entityManager.save(TaskEntity, task);
		return task;
	}

	async deleteTask(id: string, user: UserEntity) {
		const task = await entityManager.findOne(TaskEntity, { where: { id } });
		if (!task) {
			throw new NotFoundException("Task not found");
		}

		if (task.projectId) {
			await this.checkProjectAssignment(task.projectId, user);
		}

		await entityManager.remove(TaskEntity, task);
		return { message: "Task successfully deleted" };
	}

	async getSubtasks(id: string, user: UserEntity) {
		const task = await entityManager.findOne(TaskEntity, { where: { id } });
		if (!task) {
			throw new NotFoundException("Task not found");
		}
		if (task.projectId) {
			await this.checkProjectAssignment(task.projectId, user);
		}
		return await entityManager.find(TaskEntity, { where: { parentTaskId: id } });
	}

	async assignUser(id: string, body: AssignUserDto, user: UserEntity) {
		return entityManager.transaction(async (tx) => {
			const task = await tx.findOne(TaskEntity, { where: { id } });
			if (!task) {
				throw new NotFoundException("Task not found");
			}
			if (task.projectId) {
				await this.checkProjectAssignment(task.projectId, user);
			}

			const targetUser = await tx.findOne(UserEntity, { where: { id: body.userId } });
			if (!targetUser) {
				throw new NotFoundException("User not found");
			}

			const existingAssignment = await tx.findOne(TaskAssignmentEntity, {
				where: { taskId: id }
			});

			if (existingAssignment) {
				if (existingAssignment.userId === body.userId) {
					throw new BadRequestException("User is already assigned to this task");
				}
				// Switch user / update existing assignment
				existingAssignment.userId = body.userId;
				existingAssignment.assignedBy = user.id;
				existingAssignment.assignedAt = new Date();
				await tx.save(TaskAssignmentEntity, existingAssignment);
				return { message: "Task assignment successfully switched to the new user" };
			}

			const assignment = tx.create(TaskAssignmentEntity, {
				taskId: id,
				userId: body.userId,
				assignedBy: user.id,
				assignedAt: new Date()
			});

			await tx.save(TaskAssignmentEntity, assignment);
			return { message: "User successfully assigned to task" };
		});
	}

	async unassignUser(id: string, userId: string, user: UserEntity) {
		return entityManager.transaction(async (tx) => {
			const task = await tx.findOne(TaskEntity, { where: { id } });
			if (!task) {
				throw new NotFoundException("Task not found");
			}
			if (task.projectId) {
				await this.checkProjectAssignment(task.projectId, user);
			}

			const assignment = await tx.findOne(TaskAssignmentEntity, {
				where: { taskId: id, userId }
			});
			if (!assignment) {
				throw new NotFoundException("Assignment not found");
			}

			await tx.delete(TaskAssignmentEntity, assignment.id);
			return { message: "User successfully unassigned from task" };
		});
	}

	async updateTaskStatus(id: string, body: UpdateTaskStatusDto, user: UserEntity) {
		const task = await entityManager.findOne(TaskEntity, { where: { id } });
		if (!task) {
			throw new NotFoundException("Task not found");
		}
		if (task.projectId) {
			await this.checkProjectAssignment(task.projectId, user);
		}

		task.status = body.status;
		await entityManager.save(TaskEntity, task);
		return task;
	}
}
