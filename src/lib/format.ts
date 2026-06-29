export function formatCurrency(value: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function onlyDigits(value: string): string {
  return (value ?? "").replace(/\D/g, "");
}

export function formatPhoneInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatMoneyInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 12);

  if (!digits) return "";

  const integerPart = digits.slice(0, -2) || "0";
  const centsPart = digits.slice(-2).padStart(2, "0");
  const normalizedInteger = String(Number(integerPart));
  const formattedInteger = normalizedInteger.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ".",
  );

  return `${formattedInteger},${centsPart}`;
}

export function formatCpfInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);

  if (!digits) return "";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatCepInput(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);

  if (!digits) return "";
  if (digits.length <= 5) return digits;

  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatPhone(value: string): string {
  const digits = onlyDigits(value);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return value || "—";
}

export function formatCpf(value: string): string {
  const digits = onlyDigits(value);
  if (digits.length !== 11) return value || "—";
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-BR");
}

export function initials(name: string, lastName: string): string {
  const a = name?.trim()?.[0] ?? "";
  const b = lastName?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}
