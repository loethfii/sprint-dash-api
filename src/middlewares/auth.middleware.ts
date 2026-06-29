import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { entityManager } from "../types";
import { UserEntity } from "../entities";
import { UnauthorizedException } from "../exceptions";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export interface AuthenticatedRequest extends Request {
	user?: UserEntity;
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return next(new UnauthorizedException("Access token is missing or invalid"));
	}

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
		const user = await entityManager.findOne(UserEntity, {
			where: { id: decoded.userId }, relations: {
				menu: true
			}
		});
		if (!user) {
			return next(new UnauthorizedException("User not found"));
		}
		(req as any).user = user;
		next();
	} catch (err) {
		return next(new UnauthorizedException("Invalid token"));
	}
}
