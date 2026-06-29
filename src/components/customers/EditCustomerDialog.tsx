import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/form/Field";
import {
  customerUpdateSchema,
  type CustomerUpdateForm,
} from "@/schemas/customer";
import { updateCustomer } from "@/services/customer";
import { ApiError } from "@/services/http";
import type { Customer } from "@/types/customer";

interface EditCustomerDialogProps {
  customer: Customer | null;
  onClose: () => void;
  onSaved: () => void;
}

export function EditCustomerDialog({
  customer,
  onClose,
  onSaved,
}: Readonly<EditCustomerDialogProps>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerUpdateForm>({
    resolver: zodResolver(customerUpdateSchema),
    defaultValues: { id: "", name: "", lastName: "" },
  });

  // Sincroniza o formulario sempre que o cliente em edicao muda.
  useEffect(() => {
    if (customer) {
      reset({
        id: customer.id,
        name: customer.name,
        lastName: customer.lastName,
      });
    }
  }, [customer, reset]);

  async function onSubmit(values: CustomerUpdateForm) {
    try {
      await updateCustomer({
        id: values.id,
        name: values.name.trim(),
        lastName: values.lastName.trim(),
      });
      toast.success("Cliente atualizado", {
        description: `${values.name} ${values.lastName} foi salvo.`,
      });
      onSaved();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Erro inesperado ao atualizar o cliente.";
      toast.error("Nao foi possivel atualizar", { description: message });
    }
  }

  return (
    <Dialog
      open={customer !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription>
            O backend atual permite alterar apenas nome e sobrenome.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <input type="hidden" {...register("id")} />

          <Field
            label="Nome"
            htmlFor="edit-name"
            required
            error={errors.name?.message}
          >
            <Input
              id="edit-name"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
          </Field>

          <Field
            label="Sobrenome"
            htmlFor="edit-lastName"
            required
            error={errors.lastName?.message}
          >
            <Input
              id="edit-lastName"
              {...register("lastName")}
              aria-invalid={!!errors.lastName}
            />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alteracoes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
