// URL base da API. Por padrao usa "/api", que e redirecionado pelo proxy
// de desenvolvimento do Vite para http://localhost:5073 (evita CORS).
// Pode ser sobrescrita por VITE_API_BASE_URL no arquivo .env.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const text = await response.text();
    if (!text) return `Erro ${response.status} ao comunicar com a API.`;

    try {
      const data = JSON.parse(text);
      // Tenta os formatos de erro mais comuns de APIs .NET / ProblemDetails.
      if (typeof data?.detail === "string") return data.detail;
      if (typeof data?.title === "string") return data.title;
      if (typeof data?.message === "string") return data.message;
      if (data?.errors && typeof data.errors === "object") {
        const first = Object.values(data.errors).flat()[0];
        if (typeof first === "string") return first;
      }
    } catch {
      // Corpo nao era JSON; usa o texto cru.
      return text.slice(0, 300);
    }

    return `Erro ${response.status} ao comunicar com a API.`;
  } catch {
    return `Erro ${response.status} ao comunicar com a API.`;
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers ?? {}),
      },
      ...options,
    });
  } catch {
    throw new ApiError(
      "Nao foi possivel conectar a API. Confirme se o backend esta rodando em http://localhost:5073.",
      0,
    );
  }

  if (!response.ok) {
    throw new ApiError(await extractErrorMessage(response), response.status);
  }

  // PUT/DELETE podem responder sem corpo (204). Tratamos isso com seguranca.
  const text = await response.text();
  if (!text) return undefined as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}
