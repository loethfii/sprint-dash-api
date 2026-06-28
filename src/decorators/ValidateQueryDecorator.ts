import "reflect-metadata";

export function ValidateQuery(dtoClass: any): MethodDecorator {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata("validateQueryDto", dtoClass, descriptor.value);
	};
}
