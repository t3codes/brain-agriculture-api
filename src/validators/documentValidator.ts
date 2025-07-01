export class CpfCnpjValidator {
  static validate(value: string): boolean {
    const clean = value.replace(/\D/g, '');

    if (clean.length === 11) {
      return this.isValidCpf(clean);
    }

    if (clean.length === 14) {
      return this.isValidCnpj(clean);
    }

    return false;
  }

  static isValidCpf(cpf: string): boolean {
    if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i]) * (10 - i);
    }

    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;
    if (firstDigit !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i]) * (11 - i);
    }

    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;
    return secondDigit === parseInt(cpf[10]);
  }

  static isValidCnpj(cnpj: string): boolean {
    if (!cnpj || cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, ...weights1];

    const calcDigit = (base: string, weights: number[]) => {
      const sum = base
        .split('')
        .reduce((acc, digit, i) => acc + parseInt(digit) * weights[i], 0);
      const result = sum % 11;
      return result < 2 ? 0 : 11 - result;
    };

    const base = cnpj.slice(0, 12);
    const digit1 = calcDigit(base, weights1);
    const digit2 = calcDigit(base + digit1, weights2);

    return cnpj === base + digit1.toString() + digit2.toString();
  }
}
