import { entityManager } from "../types";
import { TaskEntity, UserEntity, ProjectAssignmentEntity, ProjectEntity, TaskAssignmentEntity } from "../entities";
import { CreateTaskDto, QueryTaskDTO, UpdateTaskDto, AssignUserDto, UpdateTaskStatusDto, TaskTree } from "../dtos";
import { UserRole, TaskStatus, TaskPriority } from "../enums";
import { BadRequestException, ForbiddenException, NotFoundException } from "../exceptions";
import { getRedis, setRedis, delRedis, getRedisClient } from "../utils";
import { IsNull, Not } from "typeorm";

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

		queryBuilder.orderBy("task.createdAt", "DESC");
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
		if (!body.projectId) {
			throw new BadRequestException("Project ID is required");
		}
		if (!body.startTime) {
			throw new BadRequestException("Start time is required");
		}
		if (!body.endTime) {
			throw new BadRequestException("End time is required");
		}

		const project = await entityManager.findOne(ProjectEntity, { where: { id: body.projectId } });
		if (!project) {
			throw new NotFoundException("Project not found");
		}

		await this.checkProjectAssignment(body.projectId, user);

		const createdTask = await entityManager.transaction(async (tx) => {
			const saveRecursive = async (taskDto: CreateTaskDto, parentId: string | null, parentTask?: TaskEntity): Promise<any> => {
				const projId = taskDto.projectId || (parentTask ? parentTask.projectId : body.projectId);
				const sTime = taskDto.startTime ? new Date(taskDto.startTime) : (parentTask ? parentTask.startTime : new Date(body.startTime!));
				const eTime = taskDto.endTime ? new Date(taskDto.endTime) : (parentTask ? parentTask.endTime : new Date(body.endTime!));

				const task = tx.create(TaskEntity, {
					projectId: projId,
					parentTaskId: parentId,
					title: taskDto.title,
					description: taskDto.description || "",
					status: taskDto.status || TaskStatus.OPEN,
					startTime: sTime,
					endTime: eTime,
					priority: taskDto.priority || TaskPriority.MEDIUM,
					createdBy: user.id
				});

				await tx.save(TaskEntity, task);

				const childResult: any[] = [];
				if (taskDto.child && taskDto.child.length > 0) {
					for (const childDto of taskDto.child) {
						const childProjId = childDto.projectId || projId;
						if (childProjId !== projId) {
							if (childProjId) {
								const childProject = await tx.findOne(ProjectEntity, { where: { id: childProjId } });
								if (!childProject) {
									throw new NotFoundException(`Project not found for child task: ${childDto.title}`);
								}
								await this.checkProjectAssignment(childProjId, user);
							}
						}
						const savedChild = await saveRecursive(childDto, task.id, task);
						childResult.push(savedChild);
					}
				}

				return {
					...task,
					child: childResult
				};
			};

			return await saveRecursive(body, body.parentTaskId || null);
		});

		await this.clearTaskTreeCache();
		return createdTask;
	}

	private async clearTaskTreeCache() {
		try {
			const client = getRedisClient(1);
			const keys = await client.keys("tree:task:*");
			if (keys.length > 0) {
				await client.del(...keys);
			}
		} catch (error) {
			console.error("Failed to clear Redis cache for task tree:", error);
		}
	}

	async getTasksTree(query: TaskTree) {
		const queryKey = [
			query?.projectId || "all",
			query?.assignedUser || "all",
			query?.priority || "all",
			query?.status || "all"
		].join(":");
		const cacheKey = `tree:task:${queryKey}`;

		const cachedTree = await getRedis(1, cacheKey);
		if (cachedTree) {
			return JSON.parse(cachedTree);
		}

		const whereFilters: any = {};
		if (query?.projectId) {
			whereFilters.projectId = query.projectId;
		}
		if (query?.priority) {
			whereFilters.priority = query.priority;
		}
		if (query?.status) {
			whereFilters.status = query.status;
		}
		if (query?.assignedUser) {
			whereFilters.taskAssignment = { userId: query.assignedUser };
		}

		const tasks = await entityManager.find(TaskEntity, {
			where: {
				parentTaskId: IsNull(),
				...whereFilters
			},
			relations: {
				taskAssignment: {
					user: true
				}
			},
			order: {
				createdAt: 'desc'
			}
		});
		const childTasks = await entityManager.find(TaskEntity, {
			where: {
				parentTaskId: Not(IsNull()),
				...whereFilters
			},
			relations: {
				taskAssignment: {
					user: true
				}
			}
		});
		const buildTree = (task: any): any => {
			const children = childTasks.filter(child => child.parentTaskId === task.id);
			return {
				...task,
				child: children.map(child => buildTree(child))
			};
		};

		const data = tasks.map(task => buildTree(task));
		await setRedis(1, cacheKey, JSON.stringify(data));
		return data;
	}

	async getTaskById(id: string, user: UserEntity) {
		const task = await entityManager.findOne(TaskEntity, {
			where: { id },
			relations: {
				taskAssignment: {
					user: true
				},
				parentTask: {
					taskAssignment: {
						user: true
					}
				}
			}
		});

		if (!task) {
			throw new NotFoundException("Task not found");
		}

		if (task.projectId) {
			await this.checkProjectAssignment(task.projectId, user);
		}

		const { parentTask, ...taskData } = task as any;

		if (!task.parentTaskId) {
			const childTasks = await entityManager.find(TaskEntity, {
				where: { parentTaskId: task.id },
				relations: {
					taskAssignment: {
						user: true
					}
				}
			});
			return {
				...taskData,
				child: childTasks
			};
		}

		return {
			...taskData,
			parent: parentTask || null
		};
	}

	async updateTask(id: string, body: UpdateTaskDto, user: UserEntity) {
		const updatedTask = await entityManager.transaction(async (tx) => {
			const task = await tx.findOne(TaskEntity, { where: { id } });
			if (!task) {
				throw new NotFoundException("Task not found");
			}

			if (task.projectId) {
				await this.checkProjectAssignment(task.projectId, user);
			}

			if (body.projectId && body.projectId !== task.projectId) {
				const project = await tx.findOne(ProjectEntity, { where: { id: body.projectId } });
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

			await tx.save(TaskEntity, task);

			if (body.status !== undefined) {
				const propagateStatus = async (parentId: string, newStatus: TaskStatus) => {
					const children = await tx.find(TaskEntity, { where: { parentTaskId: parentId } });
					for (const child of children) {
						child.status = newStatus;
						await tx.save(TaskEntity, child);
						await propagateStatus(child.id, newStatus);
					}
				};
				await propagateStatus(task.id, body.status);
			}

			const childResult: any[] = [];
			if (body.child !== undefined) {
				const deleteChildrenRecursive = async (parentId: string) => {
					const children = await tx.find(TaskEntity, { where: { parentTaskId: parentId } });
					for (const child of children) {
						await deleteChildrenRecursive(child.id);
						await tx.remove(TaskEntity, child);
					}
				};
				await deleteChildrenRecursive(task.id);

				const saveRecursive = async (taskDto: CreateTaskDto, parentId: string | null): Promise<any> => {
					const childTask = tx.create(TaskEntity, {
						projectId: taskDto.projectId,
						parentTaskId: parentId,
						title: taskDto.title,
						description: taskDto.description,
						status: taskDto.status || TaskStatus.OPEN,
						startTime: taskDto.startTime ? new Date(taskDto.startTime) : undefined,
						endTime: taskDto.endTime ? new Date(taskDto.endTime) : undefined,
						priority: taskDto.priority || TaskPriority.MEDIUM,
						createdBy: user.id
					});

					await tx.save(TaskEntity, childTask);

					const nestedChildren: any[] = [];
					if (taskDto.child && taskDto.child.length > 0) {
						for (const childDto of taskDto.child) {
							if (childDto.projectId !== taskDto.projectId) {
								const childProject = await tx.findOne(ProjectEntity, { where: { id: childDto.projectId } });
								if (!childProject) {
									throw new NotFoundException(`Project not found for child task: ${childDto.title}`);
								}
								await this.checkProjectAssignment(childDto.projectId, user);
							}
							const savedChild = await saveRecursive(childDto, childTask.id);
							nestedChildren.push(savedChild);
						}
					}

					return {
						...childTask,
						child: nestedChildren
					};
				};

				if (body.child.length > 0) {
					for (const childDto of body.child) {
						if (childDto.projectId !== task.projectId) {
							const childProject = await tx.findOne(ProjectEntity, { where: { id: childDto.projectId } });
							if (!childProject) {
								throw new NotFoundException(`Project not found for child task: ${childDto.title}`);
							}
							await this.checkProjectAssignment(childDto.projectId, user);
						}
						const savedChild = await saveRecursive(childDto, task.id);
						childResult.push(savedChild);
					}
				}
			}

			return {
				...task,
				child: body.child !== undefined ? childResult : undefined
			};
		});

		await this.clearTaskTreeCache();
		return updatedTask;
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
		await this.clearTaskTreeCache();
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
		const result = await entityManager.transaction(async (tx) => {
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
					return { message: "Task assignment successfully switched to the new user" };
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
		await this.clearTaskTreeCache();
		return result;
	}

	async unassignUser(id: string, userId: string, user: UserEntity) {
		const result = await entityManager.transaction(async (tx) => {
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
		await this.clearTaskTreeCache();
		return result;
	}

	async updateTaskStatus(id: string, body: UpdateTaskStatusDto, user: UserEntity) {
		const updatedTask = await entityManager.transaction(async (tx) => {
			const task = await tx.findOne(TaskEntity, { where: { id } });
			if (!task) {
				throw new NotFoundException("Task not found");
			}
			if (task.projectId) {
				await this.checkProjectAssignment(task.projectId, user);
			}

			task.status = body.status;
			await tx.save(TaskEntity, task);

			const propagateStatus = async (parentId: string, newStatus: TaskStatus) => {
				const children = await tx.find(TaskEntity, { where: { parentTaskId: parentId } });
				for (const child of children) {
					child.status = newStatus;
					await tx.save(TaskEntity, child);
					await propagateStatus(child.id, newStatus);
				}
			};
			await propagateStatus(task.id, body.status);

			return task;
		});

		await this.clearTaskTreeCache();
		return updatedTask;
	}
}
