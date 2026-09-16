"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, ExternalLink, Key, Webhook, Save, ShieldCheck, Eye, EyeOff } from "lucide-react";
import type { StoreMercadoPagoSettingsProps } from "./StoreMercadoPagoSettings.types";

export function StoreMercadoPagoSettings({
  integrationSettings,
  form,
  mercadoPagoConnectUrl,
  isSaving,
  onChange,
  onSave,
}: StoreMercadoPagoSettingsProps) {
  const [showToken, setShowToken] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const isConnected = Boolean(
    integrationSettings?.hasMercadoPagoOAuth ||
      integrationSettings?.hasMercadoPagoAccessToken ||
      form.mercadoPagoAccessToken
  );

  const isOAuth = Boolean(integrationSettings?.hasMercadoPagoOAuth);

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-800 shadow-2xs transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Status Geral da Integração */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div
              className={`grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-2xl ${
                isConnected ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {isConnected ? <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" /> : <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">Mercado Pago</h2>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold ${
                    isConnected
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                      : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                  }`}
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      isConnected ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {isConnected ? (isOAuth ? "Conectado via OAuth" : "Conectado via Credenciais") : "Não conectado"}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {isConnected
                  ? "Sua loja está pronta para processar vendas com PIX e Cartão de Crédito transparente."
                  : "Conecte sua conta do Mercado Pago para habilitar o checkout transparente e receber pagamentos."}
              </p>
            </div>
          </div>

          <a
            href={mercadoPagoConnectUrl || undefined}
            className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition ${
              mercadoPagoConnectUrl
                ? "bg-[#009EE3] hover:bg-[#0089c7] focus:outline-none focus:ring-2 focus:ring-[#009EE3]/20"
                : "pointer-events-none bg-slate-300"
            }`}
          >
            <ExternalLink className="h-4 w-4" />
            {isConnected ? "Reconectar Conta" : "Conectar Mercado Pago"}
          </a>
        </div>
      </section>

      {/* 2. Conexão OAuth Explicada */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-sky-50/50 p-4 sm:p-6">
        <div className="flex items-start gap-3.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-blue-950">Conexão Recomendada: OAuth 2.0</h3>
            <p className="mt-1 text-xs leading-relaxed text-blue-800">
              Ao clicar no botão <strong>Conectar Mercado Pago</strong>, você será redirecionado para autorizar o aplicativo oficial. As credenciais e renovações de token serão gerenciadas de forma 100% segura e automática.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Credenciais Manuais de API */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs">
        <div className="mb-4 sm:mb-5 flex items-center gap-3 border-b border-slate-100 pb-3 sm:pb-4">
          <div className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl bg-purple-50 text-purple-600">
            <Key className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Credenciais Manuais de API (Opcional)</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Utilize caso prefira inserir seu Access Token e Public Key de produção manualmente</p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              <span className="flex items-center justify-between">
                <span>Access Token (Produção)</span>
                {integrationSettings?.hasMercadoPagoAccessToken && (
                  <span className="text-xs font-semibold text-emerald-600">✓ Salvo</span>
                )}
              </span>
              <div className="relative mt-1.5">
                <input
                  type={showToken ? "text" : "password"}
                  value={form.mercadoPagoAccessToken}
                  placeholder={
                    integrationSettings?.hasMercadoPagoAccessToken
                      ? "••••••••••••••••••••••••••••••••"
                      : "APP_USR-..."
                  }
                  onChange={(e) => onChange("mercadoPagoAccessToken", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 pr-10 text-xs sm:text-sm text-slate-800 shadow-2xs transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowToken((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <p className="mt-1 text-[11px] text-slate-400">Encontrado em: Mercado Pago Developers &gt; Suas Aplicações &gt; Credenciais de Produção.</p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              <span className="flex items-center justify-between">
                <span>Public Key</span>
                {integrationSettings?.hasMercadoPagoPublicKey && (
                  <span className="text-xs font-semibold text-emerald-600">✓ Salvo</span>
                )}
              </span>
              <input
                type="text"
                value={form.mercadoPagoPublicKey}
                placeholder={
                  integrationSettings?.hasMercadoPagoPublicKey
                    ? "APP_USR-••••••••"
                    : "APP_USR-..."
                }
                onChange={(e) => onChange("mercadoPagoPublicKey", e.target.value)}
                className={inputClass}
              />
            </label>
            <p className="mt-1 text-[11px] text-slate-400">Necessária para inicialização do SDK frontend do Mercado Pago.</p>
          </div>
        </div>
      </section>

      {/* 4. Notificações e Webhooks */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs">
        <div className="mb-4 sm:mb-5 flex items-center gap-3 border-b border-slate-100 pb-3 sm:pb-4">
          <div className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl bg-cyan-50 text-cyan-600">
            <Webhook className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Webhooks de Pagamento</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Notificações em tempo real sobre status de PIX e pagamentos aprovados</p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              URL do Webhook
              <input
                type="text"
                value={form.mercadoPagoWebhookUrl}
                placeholder="https://api.seudominio.com.br/payments/webhook"
                onChange={(e) => onChange("mercadoPagoWebhookUrl", e.target.value)}
                className={inputClass}
              />
            </label>
            <p className="mt-1 text-[11px] text-slate-400">Endpoint para onde o Mercado Pago enviará os eventos IPN/Webhook.</p>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              <span className="flex items-center justify-between">
                <span>Webhook Secret (Chave Secreta)</span>
                {integrationSettings?.hasMercadoPagoWebhookSecret && (
                  <span className="text-xs font-semibold text-emerald-600">✓ Secret salvo</span>
                )}
              </span>
              <div className="relative mt-1.5">
                <input
                  type={showSecret ? "text" : "password"}
                  value={form.mercadoPagoWebhookSecret}
                  placeholder={
                    integrationSettings?.hasMercadoPagoWebhookSecret
                      ? "••••••••••••••••"
                      : "Chave de assinatura do webhook"
                  }
                  onChange={(e) => onChange("mercadoPagoWebhookSecret", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 pr-10 text-xs sm:text-sm text-slate-800 shadow-2xs transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <p className="mt-1 text-[11px] text-slate-400">Usado para validar a integridade das notificações recebidas.</p>
          </div>
        </div>
      </section>

      {/* Botão de Salvar da subpágina Mercado Pago */}
      <div className="flex items-center justify-end rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Salvando configurações..." : "Salvar Configurações do Mercado Pago"}
        </button>
      </div>
    </div>
  );
}

