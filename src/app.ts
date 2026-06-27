import express from "express";
import {
	UserController,
	RootController,
	AuthController,
	ProjectController,
	TaskController,
} from "./controllers";
import { registerRoutes } from "./utils";
import "reflect-metadata";
import { AppDataSource } from "./data-source";

const app = express();
const port = 3000;
const host = "0.0.0.0";

app.use(express.json());

registerRoutes(
	app,
	[UserController, RootController, AuthController, ProjectController, TaskController],
	"/api/v1"
);

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
