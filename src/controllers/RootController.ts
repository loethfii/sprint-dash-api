import { Controller, Get } from "../decorators";
import { Request, Response } from "express";

@Controller("/")
export class RootController {
	@Get("/")
	get(_req: Request, res: Response) {
		res.json({
			message: "Hello, World!",
		});
	}
}
