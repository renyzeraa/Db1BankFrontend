import type {
  Customer,
  CustomerCreatePayload,
  CustomerUpdatePayload,
} from "@/types/customer";
import { apiRequest } from "./http";

const RESOURCE = "/customer";

export function listCustomers(): Promise<Customer[]> {
  return apiRequest<Customer[]>(RESOURCE, { method: "GET" });
}

export function createCustomer(
  payload: CustomerCreatePayload,
): Promise<Customer> {
  return apiRequest<Customer>(RESOURCE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCustomer(
  payload: CustomerUpdatePayload,
): Promise<Customer> {
  return apiRequest<Customer>(RESOURCE, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCustomer(id: string): Promise<void> {
  return apiRequest<void>(`${RESOURCE}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
