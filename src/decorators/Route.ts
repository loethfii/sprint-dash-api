import "reflect-metadata";

export function Get(path: string = ""): MethodDecorator {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata("method", "get", descriptor.value);
		Reflect.defineMetadata("path", path, descriptor.value);
	};
}

export function Post(path: string = ""): MethodDecorator {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata("method", "post", descriptor.value);
		Reflect.defineMetadata("path", path, descriptor.value);
	};
}

export function Put(path: string = ""): MethodDecorator {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata("method", "put", descriptor.value);
		Reflect.defineMetadata("path", path, descriptor.value);
	};
}

export function Delete(path: string = ""): MethodDecorator {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata("method", "delete", descriptor.value);
		Reflect.defineMetadata("path", path, descriptor.value);
	};
}

export function Patch(path: string = ""): MethodDecorator {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata("method", "patch", descriptor.value);
		Reflect.defineMetadata("path", path, descriptor.value);
	};
}
