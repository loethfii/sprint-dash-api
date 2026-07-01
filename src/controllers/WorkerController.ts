import { Controller, Post, Body, Res } from "../decorators";
import { Response } from "express";
import { WorkerService } from "../service";
import { ApiResponse } from "../utils";

@Controller("workers")
export class WorkerController {
    private workerService: WorkerService;

    constructor() {
        this.workerService = new WorkerService();
    }

    @Post("send-delayed-task")
    async sendDelayedTask(@Res() res: Response) {
        await this.workerService.sendDelayedTask();
        ApiResponse.success(res, "Task sent successfully");
    }
}