import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { entityManager } from "../types";
import { UserEntity } from "../entities";
import { BadRequestException, UnauthorizedException } from "../exceptions";
import { LoginDto } from "../dtos";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export class AuthService {
	async login(body: LoginDto) {
		const user = await entityManager.findOne(UserEntity, {
			where: [{ username: body.identifier }, { email: body.identifier }]
		});
		if (!user) {
			throw new UnauthorizedException("Invalid username or password");
		}

		const isPasswordValid = await bcrypt.compare(body.password, user.passwordHash);
		if (!isPasswordValid) {
			throw new UnauthorizedException("Invalid username or password");
		}

		const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

		// Exclude passwordHash from user info returned
		const { passwordHash, ...userResponse } = user;

		return {
			accessToken,
			user: userResponse,
		};
	}

	async logout() {
		return { message: "Successfully logged out" };
	}

	async me(user: UserEntity) {
		// Exclude passwordHash
		const { passwordHash, ...userResponse } = user;
		return userResponse;
	}
}
