export interface ApiUserAddress {
  id: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface ApiAuthUser {
  id: string;
  name: string;
  email: string;
  cpf: string | null;
  phone: string | null;
  addresses: ApiUserAddress[];
  role: "CLIENT" | "ADMIN" | "SUPERADMIN";
  tenantId: string;
}

export interface ApiCrmContact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  tenantId: string;
  addresses: Array<{
    city: string;
    state: string;
    isDefault: boolean;
  }>;
}

export interface ApiCrmContactDetails extends ApiCrmContact {
  cpf: string | null;
  role: "CLIENT" | "ADMIN" | "SUPERADMIN";
  createdAt: string;
  updatedAt: string;
  addresses: ApiUserAddress[];
  orders: Array<{
    id: string;
    orderNumber: number;
    status: string;
    totalAmount: number;
    customerName: string;
    customerEmail: string;
    customerCpf: string;
    customerPhone: string;
    shippingZip: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingService: string;
    shippingCost: number;
    trackingCode: string | null;
    paymentId: string | null;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
    items: Array<{
      id: string;
      quantity: number;
      price: number;
      variant: {
        size: string;
        sku: string;
        product: { name: string };
      };
    }>;
  }>;
}

export interface ApiProductVariant {
  id: string;
  size: string;
  sku: string;
  stock: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  tenantId: string;
  description: string;
  weight: number;
  height: number;
  width: number;
  length: number;
  categoryId: string;
  isFeatured: boolean;
  category?: {
    name: string;
  } | null;
  variants?: ApiProductVariant[];
  isActive?: boolean;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export interface ProductVariantPayload {
  id?: string;
  size: string;
  sku: string;
  stock: number;
}

export interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  weight: number;
  height: number;
  width: number;
  length: number;
  categoryId: string;
  variants: ProductVariantPayload[];
  isFeatured?: boolean;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  tenantId: string;
  _count?: { products: number };
}

export type CrmDealStage = "LEAD" | "QUALIFIED" | "PROPOSAL" | "NEGOTIATION" | "WON";

export interface CrmDeal {
  id: string;
  productId: string;
  tenantId: string;
  title: string;
  value: number;
  stage: CrmDealStage;
  probability: number;
}

export type CrmTaskType = "CALL" | "EMAIL" | "MEETING" | "FOLLOW_UP";
export type CrmTaskPriority = "HIGH" | "MEDIUM" | "LOW";

export interface CrmTask {
  id: string;
  tenantId: string;
  title: string;
  type: CrmTaskType;
  priority: CrmTaskPriority;
  dueLabel: string;
  isDone: boolean;
  assigneeName: string;
  createdById: string;
  productId: string | null;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CrmActivityKind = "DEAL" | "TASK" | "CONTACT" | "NOTE";

export interface CrmActivity {
  id: string;
  tenantId: string;
  actorId: string | null;
  actorName: string;
  kind: CrmActivityKind;
  action: string;
  target: string;
  createdAt: string;
}

export type BrandingMediaKind =
  | 'logo'
  | 'logo_dark'
  | 'favicon'
  | 'banner_home'
  | 'banner_home_mobile'
  | 'og_image'
  | 'about_image'
  | 'category_1'
  | 'category_2'
  | 'category_3'
  | 'category_4';

interface AuthResponse {
  token: string;
  user: ApiAuthUser;
}

export interface IntegrationSettings {
  supportEmail?: string;
  originZip?: string;
  originStreet?: string | null;
  originNumber?: string | null;
  originDistrict?: string | null;
  originCity?: string | null;
  originState?: string | null;
  originCountry?: string | null;
  mercadoPagoWebhookUrl?: string | null;
  hasMelhorEnvioToken?: boolean;
  hasMercadoPagoAccessToken?: boolean;
  hasMercadoPagoOAuth?: boolean;
  hasMercadoPagoPublicKey?: boolean;
  hasMercadoPagoWebhookSecret?: boolean;
}

export interface UpdateIntegrationSettingsPayload {
  supportEmail?: string;
  originZip?: string;
  originStreet?: string | null;
  originNumber?: string | null;
  originDistrict?: string | null;
  originCity?: string | null;
  originState?: string | null;
  originCountry?: string | null;
  melhorEnvioToken?: string | null;
  mercadoPagoAccessToken?: string | null;
  mercadoPagoPublicKey?: string | null;
  mercadoPagoWebhookUrl?: string | null;
  mercadoPagoWebhookSecret?: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const STORE_DOMAIN = process.env.NEXT_PUBLIC_STORE_DOMAIN || "lojademonstracao.com.br";

function buildHeaders(token?: string, extraHeaders?: HeadersInit) {
  const headers = new Headers(extraHeaders);
  headers.set("x-store-domain", STORE_DOMAIN);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

async function parseJsonSafely<T>(res: Response): Promise<T | null> {
  if (res.status === 204) return null;

  const raw = await res.text();
  if (!raw.trim()) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function assertTenant<T extends { tenantId: string }>(
  items: T[],
  tenantId: string,
  resource: string,
) {
  if (items.some((item) => item.tenantId !== tenantId)) {
    throw new Error(`Dados de ${resource} pertencem a outro tenant.`);
  }

  return items;
}

export async function loginUser(payload: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: buildHeaders(undefined, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely<AuthResponse & { message?: string }>(res);

  if (!res.ok) {
    throw new Error(data?.message ?? "Falha ao autenticar no CRM.");
  }

  if (!data) {
    throw new Error("Resposta inesperada do servidor.");
  }

  return data;
}

export async function fetchCurrentUser(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    cache: "no-store",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<ApiAuthUser>(res);

  if (!res.ok || !data) {
    throw new Error("Sessao invalida. Faca login novamente.");
  }

  return data;
}

export async function fetchBrandingSettings(token: string) {
  const res = await fetch(`${API_URL}/store-config/branding`, { cache: "no-store", headers: buildHeaders(token) });
  const data = await parseJsonSafely<Record<string, string | boolean | null> & { message?: string }>(res);
  if (!res.ok || !data) throw new Error(data?.message ?? "Nao foi possivel carregar as configuracoes.");
  return data;
}

export async function updateBrandingSettings(token: string, payload: object) {
  const res = await fetch(`${API_URL}/store-config/branding`, { method: "PATCH", headers: buildHeaders(token, { "Content-Type": "application/json" }), body: JSON.stringify(payload) });
  const data = await parseJsonSafely<Record<string, string | boolean | null> & { message?: string }>(res);
  if (!res.ok || !data) throw new Error(data?.message ?? "Nao foi possivel salvar as configuracoes.");
  return data;
}

export async function fetchIntegrationSettings(token: string) {
  const res = await fetch(`${API_URL}/store-config/integrations`, { cache: "no-store", headers: buildHeaders(token) });
  const data = await parseJsonSafely<IntegrationSettings & { message?: string }>(res);
  if (!res.ok || !data) throw new Error(data?.message ?? "Nao foi possivel carregar as integracoes.");
  return data;
}

export async function updateIntegrationSettings(token: string, payload: UpdateIntegrationSettingsPayload) {
  const res = await fetch(`${API_URL}/store-config/integrations`, {
    method: "PATCH",
    headers: buildHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  const data = await parseJsonSafely<IntegrationSettings & { message?: string }>(res);
  if (!res.ok || !data) throw new Error(data?.message ?? "Nao foi possivel salvar as integracoes.");
  return data;
}

export function buildMercadoPagoConnectUrl(storeId: string) {
  return `${API_URL}/integrations/mercadopago/connect?storeId=${encodeURIComponent(storeId)}`;
}

export async function uploadBrandingMedia(
  token: string,
  file: File,
  kind: BrandingMediaKind,
) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('kind', kind);

  const res = await fetch(`${API_URL}/store-config/branding/upload`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: formData,
  });

  const data = await parseJsonSafely<{ url?: string; message?: string }>(res);

  if (!res.ok || !data?.url) {
    throw new Error(data?.message ?? 'Nao foi possivel enviar a imagem.');
  }

  return data.url;
}

export async function fetchCrmContacts(token: string, tenantId: string) {
  const res = await fetch(`${API_URL}/crm/contacts`, {
    cache: "no-store",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<ApiCrmContact[]>(res);

  if (!res.ok) {
    throw new Error("Nao foi possivel carregar contatos.");
  }

  return Array.isArray(data) ? assertTenant(data, tenantId, "contatos") : [];
}

export async function fetchCrmContact(token: string, contactId: string) {
  const res = await fetch(`${API_URL}/crm/contacts/${contactId}`, {
    cache: "no-store",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<ApiCrmContactDetails & { message?: string }>(res);

  if (!res.ok || !data) {
    throw new Error(data?.message ?? "Nao foi possivel carregar os dados do contato.");
  }

  return data;
}

export async function fetchProducts(token: string, tenantId: string) {
  const res = await fetch(`${API_URL}/products`, {
    cache: "no-store",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<ApiProduct[]>(res);

  if (!res.ok) {
    throw new Error("Nao foi possivel carregar produtos.");
  }

  return Array.isArray(data) ? assertTenant(data, tenantId, "produtos") : [];
}

export async function fetchCategories(token?: string, tenantId?: string): Promise<ApiCategory[]> {
  const res = await fetch(`${API_URL}/categories`, {
    cache: "no-store",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<ApiCategory[]>(res);

  if (!res.ok) {
    throw new Error("Nao foi possivel carregar categorias.");
  }

  if (!Array.isArray(data)) return [];
  return tenantId ? assertTenant(data, tenantId, "categorias") : data;
}

export async function createProduct(token: string, payload: ProductPayload) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: buildHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely<ApiProduct & { message?: string }>(res);
  if (!res.ok || !data) {
    throw new Error(data?.message ?? "Nao foi possivel criar o produto.");
  }

  return data;
}

export async function updateProduct(token: string, id: string, payload: ProductPayload) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers: buildHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely<ApiProduct & { message?: string }>(res);
  if (!res.ok || !data) {
    throw new Error(data?.message ?? "Nao foi possivel atualizar o produto.");
  }

  return data;
}

export async function deleteProduct(token: string, id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<{ message?: string }>(res);
  if (!res.ok) {
    throw new Error(data?.message ?? "Nao foi possivel excluir o produto.");
  }
}

export async function createCategory(token: string, payload: { name: string }) {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: buildHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely<ApiCategory & { message?: string }>(res);
  if (!res.ok || !data) {
    throw new Error(data?.message ?? "Nao foi possivel criar a categoria.");
  }

  return data;
}

export async function updateCategory(token: string, id: string, payload: { name: string }) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "PATCH",
    headers: buildHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely<ApiCategory & { message?: string }>(res);
  if (!res.ok || !data) {
    throw new Error(data?.message ?? "Nao foi possivel atualizar a categoria.");
  }

  return data;
}

export async function deleteCategory(token: string, id: string) {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<{ message?: string }>(res);
  if (!res.ok) {
    throw new Error(data?.message ?? "Nao foi possivel excluir a categoria.");
  }
}

export async function fetchCrmDeals(token: string, tenantId: string) {
  const res = await fetch(`${API_URL}/crm/deals`, {
    cache: "no-store",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<CrmDeal[]>(res);

  if (!res.ok) {
    throw new Error("Nao foi possivel carregar o pipeline CRM.");
  }

  return Array.isArray(data) ? assertTenant(data, tenantId, "deals") : [];
}

export async function updateCrmDealStage(
  token: string,
  productId: string,
  stage: CrmDealStage,
  tenantId: string,
) {
  const res = await fetch(`${API_URL}/crm/deals/${productId}/stage`, {
    method: "PATCH",
    headers: buildHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify({ stage }),
  });

  const data = await parseJsonSafely<CrmDeal>(res);

  if (!res.ok || !data) {
    throw new Error("Nao foi possivel atualizar o estagio do deal.");
  }

  if (data.tenantId !== tenantId) {
    throw new Error("Deal atualizado pertence a outro tenant.");
  }

  return data;
}

export async function fetchCrmTasks(token: string, tenantId: string) {
  const res = await fetch(`${API_URL}/crm/tasks`, {
    cache: "no-store",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<CrmTask[]>(res);

  if (!res.ok) {
    throw new Error("Nao foi possivel carregar as tarefas CRM.");
  }

  return Array.isArray(data) ? assertTenant(data, tenantId, "tarefas") : [];
}

export async function toggleCrmTask(token: string, taskId: string) {
  const res = await fetch(`${API_URL}/crm/tasks/${taskId}/toggle`, {
    method: "PATCH",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<CrmTask>(res);

  if (!res.ok || !data) {
    throw new Error("Nao foi possivel atualizar a tarefa.");
  }

  return data;
}

export async function fetchCrmActivities(token: string, tenantId: string) {
  const res = await fetch(`${API_URL}/crm/activities`, {
    cache: "no-store",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<CrmActivity[]>(res);

  if (!res.ok) {
    throw new Error("Nao foi possivel carregar as atividades CRM.");
  }

  return Array.isArray(data) ? assertTenant(data, tenantId, "atividades") : [];
}

export interface ApiOrderItem {
  id: string;
  quantity: number;
  price: number;
  variantId: string;
  variant: {
    id?: string;
    size: string;
    sku: string;
    color?: string | null;
    product: {
      name: string;
      slug?: string;
    };
  };
}

export interface ApiOrder {
  id: string;
  orderNumber: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELED";
  totalAmount: number;
  tenantId: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone: string;
  shippingZip: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingService: string;
  shippingCost: number;
  trackingCode?: string | null;
  paymentId?: string | null;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  } | null;
}

export async function fetchCrmOrders(token: string, tenantId: string) {
  const res = await fetch(`${API_URL}/crm/orders`, {
    cache: "no-store",
    headers: buildHeaders(token),
  });

  const data = await parseJsonSafely<ApiOrder[]>(res);

  if (!res.ok) {
    throw new Error("Nao foi possivel carregar pedidos.");
  }

  return Array.isArray(data) ? assertTenant(data, tenantId, "pedidos") : [];
}

export async function updateCrmOrderStatus(
  token: string,
  orderId: string,
  status: string,
  tenantId: string,
) {
  const res = await fetch(`${API_URL}/crm/orders/${orderId}/status`, {
    method: "PATCH",
    headers: buildHeaders(token, { "Content-Type": "application/json" }),
    body: JSON.stringify({ status }),
  });

  const data = await parseJsonSafely<ApiOrder & { message?: string }>(res);

  if (!res.ok || !data) {
    throw new Error(data?.message ?? "Nao foi possivel atualizar o status do pedido.");
  }

  if (data.tenantId !== tenantId) {
    throw new Error("Pedido atualizado pertence a outro tenant.");
  }

  return data;
}


