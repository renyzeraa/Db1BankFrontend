import { type ReactNode } from "react";
import { Pencil, Trash2, Phone, MapPin, Wallet, IdCard } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCpf, formatCurrency, formatPhone, initials } from "@/lib/format";
import type { Customer } from "@/types/customer";

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  disabled?: boolean;
}

interface DataRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

function DataRow({ icon, label, value, mono }: DataRowProps) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          "text-foreground ml-auto truncate text-right" +
          (mono ? " font-mono tabular-nums" : "")
        }
      >
        {value}
      </span>
    </div>
  );
}

export function CustomerCard({
  customer,
  onEdit,
  onDelete,
  disabled,
}: CustomerCardProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <div className="bg-muted/40 flex items-center gap-3 border-b px-5 py-4">
        <div className="bg-primary/10 text-primary grid size-11 shrink-0 place-items-center rounded-full font-mono text-sm font-semibold">
          {initials(customer.name, customer.lastName)}
        </div>
        <div className="min-w-0">
          <p className="truncate leading-tight font-semibold">
            {customer.name} {customer.lastName}
          </p>
          <p className="text-muted-foreground truncate text-sm">
            {customer.email || "—"}
          </p>
        </div>
      </div>

      <CardContent className="space-y-2.5 px-5 py-4">
        <DataRow
          icon={<Phone />}
          label="Telefone"
          value={formatPhone(customer.cellPhoneNumber)}
          mono
        />
        <DataRow
          icon={<Wallet />}
          label="Renda"
          value={formatCurrency(customer.monthlyIncome)}
          mono
        />
        <DataRow
          icon={<IdCard />}
          label="CPF"
          value={formatCpf(customer.documents?.securityNumber ?? "")}
          mono
        />
        <DataRow
          icon={<MapPin />}
          label="Cidade"
          value={
            customer.address?.city
              ? `${customer.address.city}/${customer.address.uf}`
              : "—"
          }
        />
      </CardContent>

      <CardFooter className="justify-end gap-2 border-t px-5 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(customer)}
          disabled={disabled}
        >
          <Pencil />
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(customer)}
          disabled={disabled}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
