import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCpfOrCnpj',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          // Implemente a lógica de validação aqui
          return value.length === 11 || value.length === 14; // Exemplo simplificado
        },
        defaultMessage(args: ValidationArguments) {
          return 'CPF/CNPJ inválido (deve ter 11 ou 14 dígitos)';
        },
      },
    });
  };
}