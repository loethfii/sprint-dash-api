import amqp from "amqplib";
import { entityManager } from "../types";
import { TaskEntity } from "../entities";
import { TaskStatus } from "../enums";
import { getRedisClient } from "../utils";

export class WorkerService {
	async sendDelayedTask() {
		try {
			const connection = await amqp.connect(process.env.RABBITMQ_URL || "");
			const channel = await connection.createChannel();

			const exchangeName = 'due.date';
			await channel.assertExchange(exchangeName, 'direct', { durable: true });

			const mainQueue = 'main_process_queue';
			await channel.assertQueue(mainQueue, { durable: true });
			await channel.bindQueue(mainQueue, exchangeName, 'proses_sekarang');
			const waitingQueue = 'waiting_1_min_queue_v2';
			await channel.assertQueue(waitingQueue, {
				durable: true,
				arguments: {
					'x-dead-letter-exchange': exchangeName,
					'x-dead-letter-routing-key': 'proses_sekarang',
					'x-message-ttl': 60000
				}
			});
			const message = JSON.stringify({ orderId: 12345, text: 'Pesan ini tertunda 1 menit!' });
			channel.sendToQueue(waitingQueue, Buffer.from(message), { persistent: true });

			console.info(`[x] Pesan masuk antrean tunda pada: ${new Date().toLocaleTimeString()}`);

			await channel.close();
			await connection.close();
		} catch (error) {
			console.error(error);
		}
	}

	async scheduleTaskDueCheck(taskId: string, endTime: Date) {
		const delayMs = endTime.getTime() - Date.now();
		if (delayMs <= 0) {
			console.log(`[Worker] Task ${taskId} is already past due. Updating status directly.`);
			await this.checkAndUpdateTaskOverdue(taskId);
			return;
		}

		try {
			const connection = await amqp.connect(process.env.RABBITMQ_URL || "");
			const channel = await connection.createChannel();

			const exchangeName = 'task.due.exchange';
			await channel.assertExchange(exchangeName, 'direct', { durable: true });

			const mainQueue = 'task.due.process.queue';
			await channel.assertQueue(mainQueue, { durable: true });
			await channel.bindQueue(mainQueue, exchangeName, 'task.due.process');

			const waitingQueue = 'task.due.waiting.queue';
			await channel.assertQueue(waitingQueue, {
				durable: true,
				arguments: {
					'x-dead-letter-exchange': exchangeName,
					'x-dead-letter-routing-key': 'task.due.process'
				}
			});

			const message = JSON.stringify({ taskId });

			channel.sendToQueue(waitingQueue, Buffer.from(message), {
				persistent: true,
				expiration: String(delayMs)
			});
			console.log(`[RabbitMQ] Scheduled overdue check for Task ${taskId} in ${delayMs}ms (at ${endTime.toLocaleTimeString()})`);

			await channel.close();
			await connection.close();
		} catch (error) {
			console.error("Failed to schedule task due check:", error);
		}
	}

	async initConsumer() {
		try {
			const connection = await amqp.connect(process.env.RABBITMQ_URL || "");
			const channel = await connection.createChannel();

			// 1. Consume manual test delay messages
			const manualQueue = 'main_process_queue';
			await channel.assertQueue(manualQueue, { durable: true });
			channel.consume(manualQueue, (msg) => {
				if (msg !== null) {
					console.log(`[x] Received manual test message: ${msg.content.toString()} at ${new Date().toLocaleTimeString()}`);
					channel.ack(msg);
				}
			});

			// 2. Consume task overdue messages
			const exchangeName = 'task.due.exchange';
			await channel.assertExchange(exchangeName, 'direct', { durable: true });

			const mainQueue = 'task.due.process.queue';
			await channel.assertQueue(mainQueue, { durable: true });
			await channel.bindQueue(mainQueue, exchangeName, 'task.due.process');

			console.log(`[*] Worker listening for overdue tasks in ${mainQueue}...`);

			channel.consume(mainQueue, async (msg) => {
				if (msg !== null) {
					try {
						const data = JSON.parse(msg.content.toString());
						const taskId = data.taskId;
						if (taskId) {
							await this.checkAndUpdateTaskOverdue(taskId);
						}
					} catch (err) {
						console.error("Failed to process task due message:", err);
					} finally {
						channel.ack(msg);
					}
				}
			});
		} catch (error) {
			console.error("Failed to start subscriber/consumer:", error);
		}
	}

	private async checkAndUpdateTaskOverdue(taskId: string) {
		try {
			const task = await entityManager.findOne(TaskEntity, { where: { id: taskId } });
			if (!task) {
				console.log(`[Overdue Worker] Task ${taskId} not found.`);
				return;
			}

			if (task.status !== TaskStatus.CLOSED && task.endTime.getTime() <= Date.now()) {
				task.status = TaskStatus.OVERDUE;
				await entityManager.save(TaskEntity, task);
				console.log(`[Overdue Worker] Task "${task.title}" (${taskId}) is OVERDUE. Updated status.`);
				await this.clearTaskTreeCache();
			} else {
				console.log(`[Overdue Worker] Task "${task.title}" (${taskId}) check: status is ${task.status}, endTime is ${task.endTime.toLocaleTimeString()}. No action taken.`);
			}
		} catch (err) {
			console.error(`[Overdue Worker] Error updating task ${taskId}:`, err);
		}
	}

	private async clearTaskTreeCache() {
		try {
			const client = getRedisClient(1);
			const keys = await client.keys("tree:task:*");
			if (keys.length > 0) {
				await client.del(...keys);
			}
		} catch (error) {
			console.error("Failed to clear Redis cache in WorkerService:", error);
		}
	}
}