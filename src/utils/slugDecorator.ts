import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function IsSlug(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: "isSlug",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions || {},
      validator: {
        validate(value: string) {
          const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
          return slugRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid slug (only lower-case letters, numbers and hyphens)`;
        },
      },
    });
  };
}
