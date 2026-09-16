"use client";

import { useState } from "react";
import { CheckCircle2, AlertTriangle, Key, MapPin, Save, ExternalLink, Eye, EyeOff } from "lucide-react";
import type { StoreMelhorEnvioSettingsProps } from "./StoreMelhorEnvioSettings.types";

export function StoreMelhorEnvioSettings({
  integrationSettings,
  form,
  isSaving,
  onChange,
  onSave,
}: StoreMelhorEnvioSettingsProps) {
  const [showToken, setShowToken] = useState(false);

  const isConfigured = Boolean(
    integrationSettings?.hasMelhorEnvioToken || form.melhorEnvioToken
  );

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
                isConfigured ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {isConfigured ? <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" /> : <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">Melhor Envio</h2>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold ${
                    isConfigured
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                      : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20"
                  }`}
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      isConfigured ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {isConfigured ? "Configurado" : "Pendente"}
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {isConfigured
                  ? "Cálculo automático de frete ativo (Correios, Jadlog, Loggi, etc.) no carrinho e checkout da loja."
                  : "Insira seu token de API e o endereço de origem para habilitar cotações automáticas de frete."}
              </p>
            </div>
          </div>

          <a
            href="https://melhorenvio.com.br/painel/gerenciar/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500/20"
          >
            <ExternalLink className="h-4 w-4" />
            Gerar Token
          </a>
        </div>
      </section>

      {/* 2. Token de Acesso */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs">
        <div className="mb-4 sm:mb-5 flex items-center gap-3 border-b border-slate-100 pb-3 sm:pb-4">
          <div className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl bg-purple-50 text-purple-600">
            <Key className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Token de API do Melhor Envio</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Token JWT gerado no painel da sua conta Melhor Envio</p>
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-700">
            <span className="flex items-center justify-between">
              <span>Token de Acesso (Bearer Token)</span>
              {integrationSettings?.hasMelhorEnvioToken && (
                <span className="text-xs font-semibold text-emerald-600">✓ Token salvo</span>
              )}
            </span>
            <div className="relative mt-1.5">
              <input
                type={showToken ? "text" : "password"}
                value={form.melhorEnvioToken}
                placeholder={
                  integrationSettings?.hasMelhorEnvioToken
                    ? "••••••••••••••••••••••••••••••••••••••••••••••••"
                    : "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs..."
                }
                onChange={(e) => onChange("melhorEnvioToken", e.target.value)}
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
          <p className="mt-1.5 text-[11px] sm:text-xs text-slate-500">
            Gere um token com permissões de <strong>Cálculo de Fretes</strong> e <strong>Envios</strong> em seu painel Melhor Envio.
          </p>
        </div>
      </section>

      {/* 3. Endereço de Origem (Remetente) */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-xs">
        <div className="mb-4 sm:mb-5 flex items-center gap-3 border-b border-slate-100 pb-3 sm:pb-4">
          <div className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900">Endereço de Origem (Remetente)</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Endereço de onde os produtos serão despachados para cálculo da distância e frete</p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              CEP de Origem (8 dígitos) *
              <input
                type="text"
                maxLength={9}
                value={form.originZip}
                placeholder="00000-000"
                onChange={(e) => onChange("originZip", e.target.value.replace(/\D/g, ""))}
                className={inputClass}
              />
            </label>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              Rua / Logradouro
              <input
                type="text"
                value={form.originStreet}
                placeholder="Ex: Av. Paulista"
                onChange={(e) => onChange("originStreet", e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              Número
              <input
                type="text"
                value={form.originNumber}
                placeholder="Ex: 1000"
                onChange={(e) => onChange("originNumber", e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              Bairro
              <input
                type="text"
                value={form.originDistrict}
                placeholder="Ex: Bela Vista"
                onChange={(e) => onChange("originDistrict", e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              Cidade
              <input
                type="text"
                value={form.originCity}
                placeholder="Ex: São Paulo"
                onChange={(e) => onChange("originCity", e.target.value)}
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              Estado (UF)
              <input
                type="text"
                maxLength={2}
                value={form.originState}
                placeholder="SP"
                onChange={(e) => onChange("originState", e.target.value.toUpperCase())}
                className={inputClass}
              />
            </label>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700">
              País
              <input
                type="text"
                value={form.originCountry || "BR"}
                placeholder="BR"
                onChange={(e) => onChange("originCountry", e.target.value.toUpperCase())}
                className={inputClass}
              />
            </label>
          </div>
        </div>
      </section>

      {/* Botão de Salvar da subpágina Melhor Envio */}
      <div className="flex items-center justify-end rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Salvando configurações..." : "Salvar Configurações do Melhor Envio"}
        </button>
      </div>
    </div>
  );
}

