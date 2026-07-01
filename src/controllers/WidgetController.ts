import { Controller, Get, Res, Auth } from "../decorators";
import { Response } from "express";
import { ApiResponse } from "../utils";
import { WidgetService } from "../service";

@Controller("widget")
export class WidgetController {
	private widgetService: WidgetService;

	constructor() {
		this.widgetService = new WidgetService();
	}

	@Get("dashboard")
	@Auth()
	async getDashboardWidgets(@Res() res: Response) {
		const result = await this.widgetService.getDashboardWidgets();
		ApiResponse.success(res, result);
	}
}
