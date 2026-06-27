import { Response } from "express";

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages?: number;
}

export class ApiResponse {
	/**
	 * Send a successful response with standardized format
	 */
	static success<T>(
		res: Response,
		data: T,
		statusCode: number = 200,
		pagination?: PaginationMeta
	) {
		return res.status(statusCode).json({
			data,
			...(pagination && { pagination }),
			timestamp: new Date().toISOString(),
		});
	}
}
