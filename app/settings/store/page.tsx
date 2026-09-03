"use client";

import { Suspense } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { CrmPageShell } from "@/components/ui/CrmPageShell";
import { StoreSettingsTabs } from "@/components/features/settings/StoreSettingsTabs";
import { StoreHomeSettings } from "@/components/features/settings/StoreHomeSettings";
import { StoreAboutSettings } from "@/components/features/settings/StoreAboutSettings";
import { StoreMercadoPagoSettings } from "@/components/features/settings/StoreMercadoPagoSettings";
import { StoreMelhorEnvioSettings } from "@/components/features/settings/StoreMelhorEnvioSettings";
import { useStoreSettings } from "@/features/settings/hooks/useStoreSettings";

function StoreSettingsContent() {
  const {
    activeTab,
    setActiveTab,
    settings,
    integrationSettings,
    mercadoPagoForm,
    melhorEnvioForm,
    mercadoPagoConnectUrl,
    isLoading,
    isSaving,
    uploadingKind,
    message,
    handleChange,
    handlePositionChange,
    handleMercadoPagoChange,
    handleMelhorEnvioChange,
    handleSaveBranding,
    handleSaveMercadoPago,
    handleSaveMelhorEnvio,
    handleMediaUpload,
  } = useStoreSettings();

  const isMercadoPagoConnected = Boolean(
    integrationSettings?.hasMercadoPagoOAuth ||
      integrationSettings?.hasMercadoPagoAccessToken
  );

  const isMelhorEnvioConfigured = Boolean(
    integrationSettings?.hasMelhorEnvioToken || melhorEnvioForm.melhorEnvioToken
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-slate-600">Carregando configurações da loja...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast / Feedback Alert */}
      {message && (
        <div
          role="alert"
          className={`flex items-center gap-3 rounded-2xl border p-4 shadow-sm transition-all duration-300 ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          )}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      {/* Navegação por Subpáginas / Tabs */}
      <StoreSettingsTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMercadoPagoConnected={isMercadoPagoConnected}
        isMelhorEnvioConfigured={isMelhorEnvioConfigured}
      />

      {/* Conteúdo da Subpágina Ativa */}
      <div>
        {activeTab === "inicio" && (
          <StoreHomeSettings
            settings={settings}
            isSaving={isSaving}
            onChange={handleChange}
            onUploadMedia={handleMediaUpload}
            onPositionChange={handlePositionChange}
            onSave={() => void handleSaveBranding("Configurações do Início")}
            uploadingKind={uploadingKind}
          />
        )}

        {activeTab === "sobre" && (
          <StoreAboutSettings
            settings={settings}
            isSaving={isSaving}
            onChange={handleChange}
            onUploadMedia={handleMediaUpload}
            onPositionChange={handlePositionChange}
            onSave={() => void handleSaveBranding("Configurações do Sobre")}
            uploadingKind={uploadingKind}
          />
        )}

        {activeTab === "mercadopago" && (
          <StoreMercadoPagoSettings
            integrationSettings={integrationSettings}
            form={mercadoPagoForm}
            mercadoPagoConnectUrl={mercadoPagoConnectUrl}
            isSaving={isSaving}
            onChange={handleMercadoPagoChange}
            onSave={() => void handleSaveMercadoPago()}
          />
        )}

        {activeTab === "melhorenvio" && (
          <StoreMelhorEnvioSettings
            integrationSettings={integrationSettings}
            form={melhorEnvioForm}
            isSaving={isSaving}
            onChange={handleMelhorEnvioChange}
            onSave={() => void handleSaveMelhorEnvio()}
          />
        )}
      </div>
    </div>
  );
}

export default function StoreSettingsPage() {
  return (
    <CrmPageShell
      title="Configurações da Loja"
      description="Gerencie a identidade visual da Home, conteúdo institucional, pagamentos e envios"
    >
      <Suspense
        fallback={
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        }
      >
        <StoreSettingsContent />
      </Suspense>
    </CrmPageShell>
  );
}
