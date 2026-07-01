import { EmailNotificationEntity } from "../entities";
import { entityManager } from "../types";
import { NotificationQueryDTO } from "../dtos";

export class NotificationService {
	async getAllNotifications(query: NotificationQueryDTO, userId: string) {
		const queryBuilder = entityManager.getRepository(EmailNotificationEntity).createQueryBuilder("notification");

		// Filter by recipientId if provided
		if (userId) {
			queryBuilder.andWhere("notification.recipientId = :recipientId", { recipientId: userId });
		}

		// Apply pagination
		const page = query.page || 1;
		const limit = query.limit || 10;
		const skip = (page - 1) * limit;

		queryBuilder.orderBy("notification.createdAt", "DESC");
		queryBuilder.take(limit).skip(skip);

		// Include relations if needed (e.g. task, recipient)
		queryBuilder.leftJoinAndSelect("notification.task", "task");
		queryBuilder.leftJoinAndSelect("notification.recipient", "recipient");

		const [notifications, total] = await queryBuilder.getManyAndCount();

		return {
			data: notifications,
			total,
			page,
			limit
		};
	}
}
