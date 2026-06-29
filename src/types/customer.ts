// Tipagens espelhando o contrato atual da API DB1BankExpress.

export interface Documents {
  id?: string;
  rgDocument: string;
  securityNumber: string;
  issuingInstitution: string;
  uf: string;
}

export interface Address {
  id?: string;
  cep: string;
  neighborhood: string;
  residenceNumber: string;
  city: string;
  uf: string;
  publicPlace: string;
  // Mantido com a grafia do backend ("addtional") para casar com o contrato.
  addtionalInformation: string;
}

export interface Customer {
  id: string;
  name: string;
  lastName: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
  email: string;
  // A API retorna password, mas a UI nunca o exibe nem o usa.
  password?: string;
  cellPhoneNumber: string;
  monthlyIncome: number;
  documents: Documents;
  address: Address;
}

// POST /api/customer — corpo aceito na criacao.
export interface CustomerCreatePayload {
  name: string;
  lastName: string;
  birthDate: string;
  motherName: string;
  fatherName: string;
  email: string;
  password: string;
  cellPhoneNumber: string;
  monthlyIncome: number;
  documents: Documents;
  address: Address;
}

// PUT /api/customer — o backend atual aceita SOMENTE estes campos.
export interface CustomerUpdatePayload {
  id: string;
  name: string;
  lastName: string;
}
