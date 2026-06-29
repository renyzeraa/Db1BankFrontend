# DB1 Bank Express — Frontend

Frontend para consumir a API REST do projeto **DB1BankExpress**.
Construído com **React 19 + TypeScript + Vite**, usando **Tailwind CSS v4**,
**shadcn/ui**, **React Router**, **React Hook Form**, **Zod** e **Sonner** (toasts).

## Pré-requisitos

- Node.js 20+ (testado com Node 22)
- A API rodando localmente em `http://localhost:5073`
  - Swagger: `http://localhost:5073/swagger`

## Como rodar localmente

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
