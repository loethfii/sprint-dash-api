import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import {
	UserController,
	RootController,
	AuthController,
	ProjectController,
	TaskController,
	WidgetController,
	NotificationController,
} from "./controllers";
import { registerRoutes } from "./utils";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { HttpException } from "./exceptions";

const app = express();
const port = 3000;
const host = "0.0.0.0";

app.use(express.json());
app.use(cors());

registerRoutes(
	app,
	[UserController, RootController, AuthController, ProjectController, TaskController, WidgetController, NotificationController],
	"/api/v1"
);

// Global Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	const statusCode = err instanceof HttpException ? err.statusCode : 500;
	const message = err.message || "Internal Server Error";
	
	res.status(statusCode).json({
		error: message,
		timestamp: new Date().toISOString(),
	});
});

AppDataSource.initialize()
	.then(() => {
		console.log("Data Source has been initialized!");
		app.listen(port, host, () => {
			console.log(`Server is running on http://${host}:${port}`);
		});
	})
	.catch((err) => {
		console.error("Error during Data Source initialization", err);
	});
