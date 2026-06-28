import { HttpException } from "./HttpException";

export class UnauthorizedException extends HttpException {
	constructor(message: string = "Unauthorized") {
		super(401, message);
	}
}
