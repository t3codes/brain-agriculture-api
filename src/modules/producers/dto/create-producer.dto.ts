import { IsString, Length } from 'class-validator';
import { IsCpfOrCnpj } from 'src/decorators/cpf-cnpj.validator';

export class CreateProducerDto {
  @IsString()
  @Length(11, 14, { message: 'CPF ou CNPJ deve ter entre 11 e 14 caracteres' })
  @IsCpfOrCnpj({ message: 'CPF ou CNPJ inválido' })
  cpfOrCnpj: string;

  @IsString({ message: 'O nome é obrigatório' })
  name: string;
}
