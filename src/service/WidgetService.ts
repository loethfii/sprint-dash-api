import { entityManager } from "../types";
import { UserEntity, ProjectEntity, TaskEntity } from "../entities";
import { TaskStatus } from "../enums";

export class WidgetService {
	async getDashboardWidgets() {
		// 1. Total Members
		const totalMembers = await entityManager.count(UserEntity);

		// 2. Total Projects
		const totalProjects = await entityManager.count(ProjectEntity);

		// 3. Total Tasks
		const totalTasks = await entityManager.count(TaskEntity);

		// 4. Project Velocity: count of completed (closed) tasks in the last 7 days grouped by weekday
		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const completedTasks = await entityManager.getRepository(TaskEntity)
			.createQueryBuilder("task")
			.where("task.status = :status", { status: TaskStatus.CLOSED })
			.andWhere("task.updatedAt >= :sevenDaysAgo", { sevenDaysAgo })
			.getMany();

		const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const projectVelocity: { [key: string]: number } = {
			Mon: 0,
			Tue: 0,
			Wed: 0,
			Thu: 0,
			Fri: 0,
			Sat: 0,
			Sun: 0
		};

		completedTasks.forEach(task => {
			const dayName = weekdays[new Date(task.updatedAt).getDay()];
			if (projectVelocity[dayName] !== undefined) {
				projectVelocity[dayName]++;
			}
		});

		// 5. Task Status Share: percentage distribution of all tasks by status
		const allTasks = await entityManager.find(TaskEntity);
		const statusCounts: { [key in TaskStatus]?: number } = {};

		allTasks.forEach(t => {
			statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
		});

		const taskStatusShare = Object.values(TaskStatus).map(status => {
			const count = statusCounts[status] || 0;
			const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
			return {
				status,
				count,
				percentage
			};
		});

		return {
			totalMembers,
			totalProjects,
			totalTasks,
			projectVelocity,
			taskStatusShare
		};
	}
}
