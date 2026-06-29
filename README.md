# DB1 Bank Express — Frontend

Aplicação frontend do projeto **DB1BankExpress**, criada para oferecer a
interface de cadastro, listagem, edição e exclusão de clientes consumindo a
API REST do backend.

O backend deste projeto está no repositório:

- https://github.com/renyzeraa/DB1BankExpress

Este projeto foi desenvolvido **100% a partir de spec** e com apoio de
**IA**, usando a especificação como fonte principal para orientar estrutura,
fluxos, contrato de integração e decisões de interface.

Construído com **React 19 + TypeScript + Vite**, usando **Tailwind CSS v4**,
**shadcn/ui**, **React Router**, **React Hook Form**, **Zod** e **Sonner**
(toasts).

<img width="1895" height="904" alt="Image" src="https://github.com/user-attachments/assets/3dd189d3-43e4-4d17-b31c-d6e1493b32a5" />

<img width="1905" height="903" alt="Image" src="https://github.com/user-attachments/assets/afca43e8-7c96-472a-ba9c-2aecb119f169" />


## Pré-requisitos

- Node.js 20+ (testado com Node 22)
- A API do projeto rodando localmente em `http://localhost:5073`
- Repositório da API: `https://github.com/renyzeraa/DB1BankExpress`
- Swagger: `http://localhost:5073/swagger`

## Como rodar localmente

### 1. Subir a API

Clone e execute o backend seguindo as instruções do repositório oficial:

`https://github.com/renyzeraa/DB1BankExpress`

Resumo do fluxo:

```bash
docker compose up -d
dotnet restore
dotnet run --launch-profile http
```

Depois disso, a API deve ficar disponível em `http://localhost:5073`.

### 2. Subir o frontend

```bash
# 1. Instalar dependências
npm install

# 2. Subir o frontend em modo desenvolvimento
npm run dev
```

O app abre em `http://localhost:5173`.

> O Vite já está configurado com um **proxy de desenvolvimento**: toda chamada
> para `/api/*` é encaminhada para `http://localhost:5073`, evitando problemas
> de CORS. Não é preciso configurar nada no navegador.

### Variável de ambiente

A URL base da API fica em `.env`:

```
VITE_API_BASE_URL=/api
```

Mantenha `/api` em desenvolvimento (passa pelo proxy). Se um dia for apontar
direto para o backend, troque para `http://localhost:5073/api`.

## Scripts

| Comando           | O que faz                                 |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Sobe o servidor de desenvolvimento (Vite) |
| `npm run build`   | Type-check (`tsc`) + build de produção    |
| `npm run preview` | Serve o build de produção localmente      |
| `npm run lint`    | Roda o oxlint                             |

## Estrutura

```
src/
├── components/
│   ├── ui/            # Componentes shadcn/ui (button, input, card, dialog, ...)
│   ├── form/          # Field reutilizável (label + erro)
│   ├── layout/        # Layout base (header + nav + footer)
│   └── customers/     # CustomerCard, EditCustomerDialog
├── pages/
│   ├── Cadastro.tsx        # Formulário de cadastro completo (rota /cadastro)
│   └── CustomersPage.tsx   # Listagem, edição e exclusão (rota /customers)
├── schemas/           # Schemas Zod (criação e edição)
├── services/          # Camada de API (http.ts + customer.ts)
├── types/             # Tipagens (Customer, Address, Documents, payloads)
└── lib/               # utils (cn) e formatadores
```

## Rotas

- `/cadastro` — formulário de cadastro de cliente
- `/customers` — listagem com edição e exclusão

## Observações sobre o contrato atual do backend

1. **A rota `/cadastro` é, na prática, um cadastro.** O backend ainda não tem
   autenticação real; o único formulário "de entrada" disponível é o `POST
/api/customer`. Por isso a rota foi exposta como `/cadastro` no frontend,
   pedido), mas semanticamente é um **cadastro de cliente**.

2. **Edição limitada.** O `PUT /api/customer` aceita somente `id`, `name` e
   `lastName`. O diálogo de edição expõe apenas esses campos — os demais
   (documentos, endereço, etc.) não são editáveis enquanto o contrato não mudar.

3. **`password` nunca é exibido.** A API retorna o campo no `GET`, mas a
   interface não o mostra em nenhum lugar.

4. **Exclusão** usa query string: `DELETE /api/customer?id={guid}`.
