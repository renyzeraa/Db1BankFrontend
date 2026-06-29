import { ApiError } from "./http";

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export interface CepAddress {
  cep: string;
  publicPlace: string;
  neighborhood: string;
  city: string;
  uf: string;
  addtionalInformation: string;
}

export async function fetchAddressByCep(cep: string): Promise<CepAddress> {
  let response: Response;

  try {
    response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new ApiError("Nao foi possivel consultar o CEP no ViaCEP.", 0);
  }

  if (!response.ok) {
    throw new ApiError("Falha ao consultar o CEP no ViaCEP.", response.status);
  }

  const data = (await response.json()) as ViaCepResponse;

  if (data.erro) {
    throw new ApiError("CEP nao encontrado.", 404);
  }

  return {
    cep: data.cep ?? cep,
    publicPlace: data.logradouro ?? "",
    neighborhood: data.bairro ?? "",
    city: data.localidade ?? "",
    uf: data.uf ?? "",
    addtionalInformation: data.complemento ?? "",
  };
}
