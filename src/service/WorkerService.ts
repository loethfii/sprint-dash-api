import amqp from "amqplib";

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
            const waitingQueue = 'waiting_1_min_queue';
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

    async initConsumer() {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL || "");
            const channel = await connection.createChannel();

            const mainQueue = 'main_process_queue';
            await channel.assertQueue(mainQueue, { durable: true });

            console.log(`[*] Worker listening for messages in ${mainQueue}...`);

            channel.consume(mainQueue, (msg) => {
                if (msg !== null) {
                    console.log(`[x] Received message: ${msg.content.toString()} at ${new Date().toLocaleTimeString()}`);
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error("Failed to start subscriber/consumer:", error);
        }
    }
}