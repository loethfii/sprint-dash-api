import "reflect-metadata";

export function Validate(dtoClass: any): MethodDecorator {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata("validateDto", dtoClass, descriptor.value);
	};
}
