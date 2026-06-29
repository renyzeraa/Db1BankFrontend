import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, Users, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { EditCustomerDialog } from "@/components/customers/EditCustomerDialog";
import { deleteCustomer, listCustomers } from "@/services/customer";
import { ApiError } from "@/services/http";
import type { Customer } from "@/types/customer";

type Status = "loading" | "error" | "success";

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await listCustomers();
      setCustomers(Array.isArray(data) ? data : []);
      setStatus("success");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Erro inesperado ao carregar os clientes.";
      setErrorMessage(message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmDelete() {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      await deleteCustomer(deleting.id);
      toast.success("Cliente excluido", {
        description: `${deleting.name} ${deleting.lastName} foi removido.`,
      });
      setDeleting(null);
      await load();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Erro inesperado ao excluir o cliente.";
      toast.error("Nao foi possivel excluir", { description: message });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {status === "success"
              ? `${customers.length} cliente(s) cadastrado(s).`
              : "Clientes registrados no Bank Express."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={load}
          disabled={status === "loading"}
        >
          <RefreshCw className={status === "loading" ? "animate-spin" : ""} />
          Atualizar
        </Button>
      </div>

      {status === "loading" ? <LoadingGrid /> : null}

      {status === "error" ? (
        <ErrorState message={errorMessage} onRetry={load} />
      ) : null}

      {status === "success" && customers.length === 0 ? <EmptyState /> : null}

      {status === "success" && customers.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={setEditing}
              onDelete={setDeleting}
              disabled={isDeleting}
            />
          ))}
        </div>
      ) : null}

      <EditCustomerDialog
        customer={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          load();
        }}
      />

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir cliente</DialogTitle>
            <DialogDescription>
              Esta acao nao pode ser desfeita.{" "}
              {deleting ? (
                <span className="text-foreground font-medium">
                  {deleting.name} {deleting.lastName}
                </span>
              ) : null}{" "}
              sera removido permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleting(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-muted/50 h-56 animate-pulse rounded-xl border"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="bg-muted text-muted-foreground grid size-12 place-items-center rounded-full">
        <Users className="size-6" />
      </div>
      <p className="mt-4 font-medium">Nenhum cliente cadastrado</p>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Cadastre o primeiro cliente na aba Cadastro para ve-lo aqui.
      </p>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center rounded-xl border py-16 text-center">
      <div className="bg-destructive/10 text-destructive grid size-12 place-items-center rounded-full">
        <AlertTriangle className="size-6" />
      </div>
      <p className="mt-4 font-medium">Falha ao carregar os clientes</p>
      <p className="text-muted-foreground mt-1 max-w-md text-sm">{message}</p>
      <Button variant="outline" className="mt-5" onClick={onRetry}>
        <RefreshCw />
        Tentar novamente
      </Button>
    </div>
  );
}
