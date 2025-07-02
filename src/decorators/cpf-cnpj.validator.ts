import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { CpfCnpjValidator } from 'src/validators/documentValidator';

@ValidatorConstraint({ async: false })
export class IsCpfOrCnpjConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        if (typeof value !== 'string' || /\D/.test(value)) return false; 
        return CpfCnpjValidator.validate(value);
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} deve ser um CPF ou CNPJ válido`;
    }
}

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCpfOrCnpjConstraint,
        });
    };
}
