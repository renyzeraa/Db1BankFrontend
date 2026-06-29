import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/form/Field";
import { SectionTitle } from "@/components/form/SectionTitle";
import {
  formatCepInput,
  formatCpfInput,
  formatMoneyInput,
  formatPhoneInput,
  onlyDigits,
} from "@/lib/format";
import {
  customerCreateSchema,
  parseMoney,
  type CustomerCreateForm,
} from "@/schemas/customer";
import {
  cadastroDefaultValues,
  cadastroUfOptions,
} from "@/pages/cadastro.constants";
import { createCustomer } from "@/services/customer";
import { ApiError } from "@/services/http";
import { fetchAddressByCep } from "@/services/viacep";
import type { CustomerCreatePayload } from "@/types/customer";

export function Cadastro() {
  const {
    control,
    getValues,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CustomerCreateForm>({
    resolver: zodResolver(customerCreateSchema),
    defaultValues: cadastroDefaultValues,
  });
  const [cepLookupError, setCepLookupError] = useState<string | null>(null);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const lastFetchedCepRef = useRef("");
  const cepValue = watch("address.cep");

  useEffect(() => {
    const digits = onlyDigits(cepValue);

    if (digits.length !== 8) {
      lastFetchedCepRef.current = "";
      setIsFetchingCep(false);
      setCepLookupError(null);
      return;
    }

    if (digits === lastFetchedCepRef.current) {
      return;
    }

    let cancelled = false;

    async function lookupCep() {
      setIsFetchingCep(true);
      setCepLookupError(null);

      try {
        const address = await fetchAddressByCep(digits);

        if (cancelled) return;

        lastFetchedCepRef.current = digits;
        setValue("address.publicPlace", address.publicPlace, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("address.neighborhood", address.neighborhood, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("address.city", address.city, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setValue("address.uf", address.uf, {
          shouldDirty: true,
          shouldValidate: true,
        });

        if (!getValues("address.addtionalInformation")) {
          setValue(
            "address.addtionalInformation",
            address.addtionalInformation,
            {
              shouldDirty: true,
              shouldValidate: true,
            },
          );
        }
      } catch (err) {
        if (cancelled) return;

        lastFetchedCepRef.current = "";
        setCepLookupError(
          err instanceof ApiError
            ? err.message
            : "Erro inesperado ao consultar o CEP.",
        );
      } finally {
        if (!cancelled) {
          setIsFetchingCep(false);
        }
      }
    }

    void lookupCep();

    return () => {
      cancelled = true;
    };
  }, [cepValue, getValues, setValue]);

  async function onSubmit(values: CustomerCreateForm) {
    const payload: CustomerCreatePayload = {
      name: values.name.trim(),
      lastName: values.lastName.trim(),
      birthDate: `${values.birthDate}T00:00:00`,
      motherName: values.motherName.trim(),
      fatherName: values.fatherName.trim(),
      email: values.email.trim(),
      password: values.password,
      cellPhoneNumber: onlyDigits(values.cellPhoneNumber),
      monthlyIncome: parseMoney(values.monthlyIncome),
      documents: {
        rgDocument: values.documents.rgDocument.trim(),
        securityNumber: onlyDigits(values.documents.securityNumber),
        issuingInstitution: values.documents.issuingInstitution.trim(),
        uf: values.documents.uf.toUpperCase(),
      },
      address: {
        cep: values.address.cep.trim(),
        neighborhood: values.address.neighborhood.trim(),
        residenceNumber: values.address.residenceNumber.trim(),
        city: values.address.city.trim(),
        uf: values.address.uf.toUpperCase(),
        publicPlace: values.address.publicPlace.trim(),
        addtionalInformation: values.address.addtionalInformation.trim(),
      },
    };

    try {
      await createCustomer(payload);
      toast.success("Cliente cadastrado", {
        description: `${payload.name} ${payload.lastName} foi adicionado com sucesso.`,
      });
      reset(cadastroDefaultValues);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Erro inesperado ao cadastrar o cliente.";
      toast.error("Nao foi possivel cadastrar", { description: message });
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Novo cliente</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Preencha os dados para registrar um cliente no Bank Express.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            Campos marcados com <span className="text-destructive">*</span> sao
            obrigatorios.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            {/* Dados pessoais */}
            <section>
              <SectionTitle>Dados pessoais</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Nome"
                  htmlFor="name"
                  error={errors.name?.message}
                  required
                >
                  <Input id="name" placeholder="Maria" {...register("name")} />
                </Field>
                <Field
                  label="Sobrenome"
                  htmlFor="lastName"
                  error={errors.lastName?.message}
                  required
                >
                  <Input
                    id="lastName"
                    placeholder="Silva"
                    {...register("lastName")}
                  />
                </Field>
                <Field
                  label="Data de nascimento"
                  htmlFor="birthDate"
                  error={errors.birthDate?.message}
                  required
                >
                  <Input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                  />
                </Field>
                <Field
                  label="E-mail"
                  htmlFor="email"
                  error={errors.email?.message}
                  required
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="maria@email.com"
                    {...register("email")}
                  />
                </Field>
                <Field
                  label="Senha"
                  htmlFor="password"
                  error={errors.password?.message}
                  required
                >
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register("password")}
                  />
                </Field>
                <Field
                  label="Celular"
                  htmlFor="cellPhoneNumber"
                  error={errors.cellPhoneNumber?.message}
                  required
                >
                  <Input
                    id="cellPhoneNumber"
                    placeholder="(11) 99999-9999"
                    inputMode="numeric"
                    maxLength={15}
                    {...register("cellPhoneNumber", {
                      onChange: (event) => {
                        event.target.value = formatPhoneInput(
                          event.target.value,
                        );
                      },
                    })}
                  />
                </Field>
                <Field
                  label="Nome da mae"
                  htmlFor="motherName"
                  error={errors.motherName?.message}
                  required
                >
                  <Input
                    id="motherName"
                    placeholder="Ana Silva"
                    {...register("motherName")}
                  />
                </Field>
                <Field
                  label="Nome do pai"
                  htmlFor="fatherName"
                  error={errors.fatherName?.message}
                  required
                >
                  <Input
                    id="fatherName"
                    placeholder="Joao Silva"
                    {...register("fatherName")}
                  />
                </Field>
                <Field
                  label="Renda mensal"
                  htmlFor="monthlyIncome"
                  error={errors.monthlyIncome?.message}
                  required
                >
                  <Input
                    id="monthlyIncome"
                    placeholder="4500,00"
                    inputMode="numeric"
                    maxLength={16}
                    {...register("monthlyIncome", {
                      onChange: (event) => {
                        event.target.value = formatMoneyInput(
                          event.target.value,
                        );
                      },
                    })}
                  />
                </Field>
              </div>
            </section>

            {/* Documentos */}
            <section>
              <SectionTitle>Documentos</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="RG"
                  htmlFor="documents.rgDocument"
                  error={errors.documents?.rgDocument?.message}
                  required
                >
                  <Input
                    id="documents.rgDocument"
                    placeholder="123456789"
                    {...register("documents.rgDocument")}
                  />
                </Field>
                <Field
                  label="CPF"
                  htmlFor="documents.securityNumber"
                  error={errors.documents?.securityNumber?.message}
                  required
                >
                  <Input
                    id="documents.securityNumber"
                    placeholder="12345678900"
                    inputMode="numeric"
                    maxLength={14}
                    {...register("documents.securityNumber", {
                      onChange: (event) => {
                        event.target.value = formatCpfInput(event.target.value);
                      },
                    })}
                  />
                </Field>
                <Field
                  label="Orgao emissor"
                  htmlFor="documents.issuingInstitution"
                  error={errors.documents?.issuingInstitution?.message}
                  required
                >
                  <Input
                    id="documents.issuingInstitution"
                    placeholder="SSP"
                    {...register("documents.issuingInstitution")}
                  />
                </Field>
                <Field
                  label="UF"
                  htmlFor="documents.uf"
                  error={errors.documents?.uf?.message}
                  required
                >
                  <Controller
                    control={control}
                    name="documents.uf"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="documents.uf"
                          aria-invalid={!!errors.documents?.uf}
                        >
                          <SelectValue placeholder="Selecione a UF" />
                        </SelectTrigger>
                        <SelectContent>
                          {cadastroUfOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
            </section>

            {/* Endereco */}
            <section>
              <SectionTitle>Endereco</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="CEP"
                  htmlFor="address.cep"
                  error={
                    errors.address?.cep?.message ?? cepLookupError ?? undefined
                  }
                  hint={
                    isFetchingCep ? "Buscando endereco pelo CEP..." : undefined
                  }
                  required
                >
                  <Input
                    id="address.cep"
                    placeholder="01234-567"
                    inputMode="numeric"
                    maxLength={9}
                    {...register("address.cep", {
                      onChange: (event) => {
                        event.target.value = formatCepInput(event.target.value);
                      },
                    })}
                  />
                </Field>
                <Field
                  label="Logradouro"
                  htmlFor="address.publicPlace"
                  error={errors.address?.publicPlace?.message}
                  required
                >
                  <Input
                    id="address.publicPlace"
                    placeholder="Rua das Flores"
                    {...register("address.publicPlace")}
                  />
                </Field>
                <Field
                  label="Numero"
                  htmlFor="address.residenceNumber"
                  error={errors.address?.residenceNumber?.message}
                  required
                >
                  <Input
                    id="address.residenceNumber"
                    placeholder="123"
                    {...register("address.residenceNumber")}
                  />
                </Field>
                <Field
                  label="Complemento"
                  htmlFor="address.addtionalInformation"
                  error={errors.address?.addtionalInformation?.message}
                >
                  <Input
                    id="address.addtionalInformation"
                    placeholder="Apto 12"
                    {...register("address.addtionalInformation")}
                  />
                </Field>
                <Field
                  label="Bairro"
                  htmlFor="address.neighborhood"
                  error={errors.address?.neighborhood?.message}
                  required
                >
                  <Input
                    id="address.neighborhood"
                    placeholder="Centro"
                    {...register("address.neighborhood")}
                  />
                </Field>
                <Field
                  label="Cidade"
                  htmlFor="address.city"
                  error={errors.address?.city?.message}
                  required
                >
                  <Input
                    id="address.city"
                    placeholder="Sao Paulo"
                    {...register("address.city")}
                  />
                </Field>
                <Field
                  label="UF"
                  htmlFor="address.uf"
                  error={errors.address?.uf?.message}
                  required
                >
                  <Controller
                    control={control}
                    name="address.uf"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="address.uf"
                          aria-invalid={!!errors.address?.uf}
                        >
                          <SelectValue placeholder="Selecione a UF" />
                        </SelectTrigger>
                        <SelectContent>
                          {cadastroUfOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
            </section>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-40"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Cadastrar cliente
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
