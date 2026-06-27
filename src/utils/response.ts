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
		pagination?: PaginationMeta
	) {
		return res.status(200).json({
			data,
			...(pagination && { pagination }),
			timestamp: new Date().toISOString(),
		});
	}
}
