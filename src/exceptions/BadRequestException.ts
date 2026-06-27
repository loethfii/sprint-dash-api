import { HttpException } from "./HttpException";

export class BadRequestException extends HttpException {
	constructor(message: string = "Bad Request") {
		super(400, message);
	}
}
