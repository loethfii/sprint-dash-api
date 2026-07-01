import { EventEmitter } from "events";
import { entityManager } from "../types";
import { EmailNotificationEntity } from "../entities";
import { EmailType, EmailStatus } from "../enums";

export const eventEmitter = new EventEmitter();

export const EVENTS = {
	TASK_ASSIGNED: "task.assigned",
};

interface TaskAssignedEventPayload {
	taskId: string;
	recipientId: string;
}

// Register listener for TASK_ASSIGNED event
eventEmitter.on(EVENTS.TASK_ASSIGNED, async (payload: TaskAssignedEventPayload) => {
	try {
		const notification = entityManager.create(EmailNotificationEntity, {
			taskId: payload.taskId,
			recipientId: payload.recipientId,
			type: EmailType.TASK_ASSIGNED,
			status: EmailStatus.SENT,
		});

		await entityManager.save(EmailNotificationEntity, notification);
		console.log(`[Event] Notification successfully created for User ${payload.recipientId} on Task ${payload.taskId}`);
	} catch (error) {
		console.error("[Event Error] Failed to create notification asynchronously:", error);
	}
});
