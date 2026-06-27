import "reflect-metadata";

export interface ParameterMetadata {
	index: number;
	type: "body" | "query" | "param" | "req" | "res";
	key?: string;
}

function registerParam(type: ParameterMetadata["type"], key?: string) {
	return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
		const existingParams: ParameterMetadata[] =
			Reflect.getOwnMetadata("params", target, propertyKey) || [];
		existingParams.push({ index: parameterIndex, type, key });
		Reflect.defineMetadata("params", existingParams, target, propertyKey);
	};
}

export function Body(key?: string): ParameterDecorator {
	return registerParam("body", key);
}

export function Query(key?: string): ParameterDecorator {
	return registerParam("query", key);
}

export function Param(key?: string): ParameterDecorator {
	return registerParam("param", key);
}

export function Req(): ParameterDecorator {
	return registerParam("req");
}

export function Res(): ParameterDecorator {
	return registerParam("res");
}
