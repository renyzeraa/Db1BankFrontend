import { z } from "zod";
import { onlyDigits } from "@/lib/format";

const ufRegex = /^[A-Za-z]{2}$/;

// Normaliza renda aceitando "3500.50" ou "3500,50".
export function parseMoney(value: string): number {
  return Number(value.trim().replaceAll(".", "").replaceAll(",", "."));
}

function isValidMoney(value: string): boolean {
  const n = parseMoney(value);
  return !Number.isNaN(n) && n > 0;
}

// Formulario de criacao (pagina /cadastro). Todos os campos sao string,
// como vem dos inputs; a conversao para number/ISO acontece no submit.
export const customerCreateSchema = z.object({
  name: z.string().min(1, "Informe o nome"),
  lastName: z.string().min(1, "Informe o sobrenome"),
  birthDate: z.string().min(1, "Informe a data de nascimento"),
  motherName: z.string().min(1, "Informe o nome da mae"),
  fatherName: z.string().min(1, "Informe o nome do pai"),
  email: z.email("Informe um e-mail valido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
  cellPhoneNumber: z
    .string()
    .refine((value) => {
      const digits = onlyDigits(value);
      return digits.length === 10 || digits.length === 11;
    }, "Informe um telefone valido"),
  monthlyIncome: z
    .string()
    .min(1, "Informe a renda mensal")
    .refine(isValidMoney, "Renda invalida (use apenas numeros)"),
  documents: z.object({
    rgDocument: z.string().min(1, "Informe o RG"),
    securityNumber: z.string().refine((value) => onlyDigits(value).length === 11, {
      message: "Informe um CPF valido",
    }),
    issuingInstitution: z.string().min(1, "Informe o orgao emissor"),
    uf: z.string().regex(ufRegex, "UF deve ter 2 letras"),
  }),
  address: z.object({
    cep: z.string().min(8, "CEP deve ter 8 digitos").max(9, "CEP invalido"),
    neighborhood: z.string().min(1, "Informe o bairro"),
    residenceNumber: z.string().min(1, "Informe o numero"),
    city: z.string().min(1, "Informe a cidade"),
    uf: z.string().regex(ufRegex, "UF deve ter 2 letras"),
    publicPlace: z.string().min(1, "Informe o logradouro"),
    addtionalInformation: z.string(),
  }),
});

export type CustomerCreateForm = z.infer<typeof customerCreateSchema>;

// Formulario de edicao — o PUT atual aceita somente id, name e lastName.
export const customerUpdateSchema = z.object({
  id: z.string().min(1, "ID ausente"),
  name: z.string().min(1, "Informe o nome"),
  lastName: z.string().min(1, "Informe o sobrenome"),
});

export type CustomerUpdateForm = z.infer<typeof customerUpdateSchema>;
