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
		const paginationMeta = pagination
			? {
					...pagination,
					totalPages: Math.ceil(pagination.total / (pagination.limit || 10)),
			  }
			: undefined;

		return res.status(200).json({
			data,
			...(paginationMeta && { pagination: paginationMeta }),
			timestamp: new Date().toISOString(),
		});
	}
}
