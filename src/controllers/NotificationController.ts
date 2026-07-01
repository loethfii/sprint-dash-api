import { Controller, Get, Query, Res, Auth, ValidateQuery, Req } from "../decorators";
import { Response } from "express";
import { ApiResponse } from "../utils";
import { NotificationService } from "../service";
import { NotificationQueryDTO } from "../dtos";

@Controller("notifications")
export class NotificationController {
	private notificationService: NotificationService;

	constructor() {
		this.notificationService = new NotificationService();
	}

	@Get()
	@Auth()
	@ValidateQuery(NotificationQueryDTO)
	async getAllNotifications(@Req() req: any, @Query() query: NotificationQueryDTO, @Res() res: Response) {
		const result = await this.notificationService.getAllNotifications(query, req.user.id);
		ApiResponse.success(res, result.data, {
			total: result.total,
			page: result.page,
			limit: result.limit,
		});
	}
}
