# Estrutura do CRM - Ecommerce Whitelabel

## 📋 Visão Geral

O CRM foi reorganizado seguindo a arquitetura de funil e vendas integrada ao e-commerce whitelabel. Abaixo está a estrutura completa com prioridades de implementação.

---

## 🎯 MVP - Prioridade 1 (v1.0)

Estas são as 5 páginas essenciais para o lançamento rápido:

### 1. 📊 `/crm/dashboard`

**Objetivo:** Visão macro da saúde de vendas.

**Componentes:**

- Cards de faturamento
- Novos leads no dia/mês
- Taxa de conversão do funil
- Ticket médio
- Gráfico de desempenho de vendas

**Status:** ✅ Implementado

---

### 2. 👥 `/crm/contacts`

**Objetivo:** Centralizar base de contatos (e-commerce + CRM).

**Componentes:**

- Tabela com busca rápida
- Segmentação por tags (VIP, Abandono de Carrinho, Inativo)
- Status do lead
- Total gasto na loja

**Status:** ✅ Implementado

---

### 3. 👤 `/crm/contacts/[id]`

**Objetivo:** Perfil completo do cliente (Visão 360°).

**Componentes:**

- Dados de contato e endereço
- Histórico de compras (LTV - Lifetime Value)
- Timeline de atividades e interações
- Favoritos do cliente

**Status:** ✅ Implementado

---

### 4. 📦 `/crm/orders`

**Objetivo:** Acompanhar pedidos do e-commerce.

**Componentes:**

- Tabela de pedidos em tempo real
- Status: Aguardando Pagamento, Em Separação, Enviado, Concluído, Cancelado
- Botões para emitir nota e código de rastreio
- Filtros por status

**Status:** ✅ Implementado

---

### 5. ⚙️ `/crm/settings/store`

**Objetivo:** Configurar identidade visual whitelabel.

**Componentes:**

- Upload de logo/favicon
- Seletor de cores (primária e secundária)
- Configuração de subdomínio/domínio próprio
- Nome e descrição da loja

**Status:** ✅ Implementado

---

## 📈 Prioridade 2 (v1.1+)

### 6. 📊 `/crm/pipeline` (Kanban)

**Objetivo:** Funil de vendas visual.

**Componentes:**

- Colunas Kanban (Prospecção, Cotação, Negociação, Ganho, Perdido)
- Drag & drop entre colunas
- Valor de cada oportunidade
- Timeline de próximas ações

**Status:** ✅ Já existe em `/crm/app/pipeline/page.tsx`

---

### 7. 🛍️ `/crm/products`

**Objetivo:** Catálogo para inclusão em propostas.

**Componentes:**

- Tabela sincronizada com e-commerce
- Preço, estoque e status de publicação
- Busca rápida
- Filtros por categoria

**Status:** ✅ Implementado

---

### 8. ✅ `/crm/tasks`

**Objetivo:** Organizar rotina de atendimento.

**Componentes:**

- Lista de tarefas
- Datas de vencimento
- Alertas e prioridades
- Vinculação com contatos

**Status:** ✅ Já existe em `/crm/app/tasks/`

---

## 🔐 Prioridade 3 (Fase 2+)

### 9. 👨‍💼 `/crm/settings/team`

**Objetivo:** Gestão de usuários e permissões.

**Componentes:**

- Lista de usuários/vendedores
- Convites por e-mail
- Permissões (Admin vs Vendedor)
- Status de ativação

**Status:** ✅ Implementado

---

### 10. 🔄 `/crm/automations` (Opcional)

**Objetivo:** Configurar réguas de comunicação automáticas.

**Exemplos:**

- Carrinho abandonado → Lead "Carrinho Abandonado"
- Pedido pago → Lead "Cliente Ativo"
- Inatividade 30 dias → Lead "Inativo"

**Status:** ⏳ Planejado para v2.0

---

## 📁 Estrutura de Diretórios

```
crm/app/
├── page.tsx                      (redireciona para /dashboard)
├── layout.tsx                    (layout principal)
├── globals.css                   (estilos globais)
├── dashboard/
│   └── page.tsx                  ✅ Dashboard principal
├── contacts/
│   ├── page.tsx                  ✅ Lista de contatos
│   └── [id]/
│       └── page.tsx              ✅ Perfil do cliente
├── orders/
│   └── page.tsx                  ✅ Gestão de pedidos
├── products/
│   └── page.tsx                  ✅ Catálogo de produtos
├── pipeline/
│   └── page.tsx                  ✅ Funil de vendas (Kanban)
├── tasks/
│   └── page.tsx                  ✅ Tarefas e lembretes
├── settings/
│   ├── store/
│   │   └── page.tsx              ✅ Configurações da loja
│   └── team/
│       └── page.tsx              ✅ Gestão da equipe
└── activity/ ou login/           (páginas adicionais)
```

---

## 🔗 Rotas Principais

| Rota              | Descrição                     | Status |
| ----------------- | ----------------------------- | ------ |
| `/`               | Redireciona para `/dashboard` | ✅     |
| `/dashboard`      | Painel geral                  | ✅     |
| `/contacts`       | Lista de contatos             | ✅     |
| `/contacts/[id]`  | Perfil do cliente             | ✅     |
| `/orders`         | Gestão de pedidos             | ✅     |
| `/products`       | Catálogo                      | ✅     |
| `/pipeline`       | Funil de vendas               | ✅     |
| `/tasks`          | Tarefas                       | ✅     |
| `/settings/store` | Config. loja                  | ✅     |
| `/settings/team`  | Gestão equipe                 | ✅     |

---

## 🎨 Componentes Base

Todos os pages utilizam o componente `DashboardShell` para layout consistente:

```tsx
import { DashboardShell } from "@/components/features/dashboard/DashboardShell";

export default function Page() {
  return <DashboardShell>{/* Conteúdo da página */}</DashboardShell>;
}
```

---

## 📝 Próximas Etapas

1. **Integração com API Backend**
   - Conectar endpoints de contatos, pedidos, produtos
   - Sincronização em tempo real

2. **Componentes Visuais**
   - Refinar styling com Tailwind
   - Adicionar ícones (Lucide, Heroicons)
   - Implementar dark mode

3. **Autenticação & Autorização**
   - Integrar com sistema de auth backend
   - Roles e permissões por página

4. **Validações & Erros**
   - Loading states
   - Error boundaries
   - Toast notifications

5. **Automações (v2.0)**
   - Criar página `/crm/automations`
   - Integrar com webhooks do backend

---

## 🚀 Como Começar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Verifique se está conectado ao backend CRM (confira `.env.example`)

3. Inicie o servidor:

   ```bash
   npm run dev
   ```

4. Acesse: `http://localhost:3000/crm`

---

## 📞 Suporte

Para dúvidas sobre a estrutura, consulte a documentação do backend em `backend/README.md`.
