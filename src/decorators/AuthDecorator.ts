import "reflect-metadata";
import { UserRole } from "../enums";

export function Auth(roles?: UserRole[]): MethodDecorator {
	return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
		Reflect.defineMetadata("authRequired", true, descriptor.value);
		if (roles) {
			Reflect.defineMetadata("authRoles", roles, descriptor.value);
		}
	};
}
