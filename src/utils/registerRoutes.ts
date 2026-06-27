import { Express, Request, Response } from "express";
import "reflect-metadata";

function joinPaths(...segments: string[]): string {
	const parts = segments
		.flatMap((seg) => (seg || "").split("/"))
		.map((part) => part.trim())
		.filter((part) => part.length > 0);
	return "/" + parts.join("/");
}

export function registerRoutes(app: Express, controllers: any[], basePath: string = "") {
	controllers.forEach((controller) => {
		const instance = new controller();
		const prefix = Reflect.getMetadata("prefix", controller) || "";
		const methods = Object.getOwnPropertyNames(controller.prototype).filter(
			(prop) => prop !== "constructor"
		);

		methods.forEach((method) => {
			const routeHandler = instance[method];
			const routePath = Reflect.getMetadata("path", routeHandler);
			const httpMethod = Reflect.getMetadata("method", routeHandler);

			if (typeof routePath === "string" && httpMethod) {
				const fullPath = joinPaths(basePath, prefix, routePath);
				app[httpMethod](
					fullPath,
					(req: Request, res: Response) => {
						const paramsMeta: any[] =
							Reflect.getMetadata("params", controller.prototype, method) || [];

						const args: any[] = [];
						if (paramsMeta.length === 0) {
							// Fallback: standard Express signature (req, res, next)
							for (let i = 0; i < routeHandler.length; i++) {
								if (i === 0) args.push(req);
								else if (i === 1) args.push(res);
								else args.push(undefined);
							}
						} else {
							const numArgs = routeHandler.length;
							for (let i = 0; i < numArgs; i++) {
								const param = paramsMeta.find((p) => p.index === i);
								if (param) {
									switch (param.type) {
										case "body":
											args.push(param.key ? req.body?.[param.key] : req.body);
											break;
										case "query":
											args.push(param.key ? req.query?.[param.key] : req.query);
											break;
										case "param":
											args.push(param.key ? req.params?.[param.key] : req.params);
											break;
										case "req":
											args.push(req);
											break;
										case "res":
											args.push(res);
											break;
										default:
											args.push(undefined);
									}
								} else {
									args.push(undefined);
								}
							}
						}

						routeHandler.apply(instance, args);
					}
				);

				console.log(
					`Registered route: ${httpMethod.toUpperCase()} ${fullPath}`
				);
			}
		});
	});
}
