"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type {
  StoreSettings,
  StoreTabKey,
  MercadoPagoFormState,
  MelhorEnvioFormState,
} from "@/features/settings/types/StoreSettings.types";
import {
  buildMercadoPagoConnectUrl,
  fetchBrandingSettings,
  fetchCurrentUser,
  fetchIntegrationSettings,
  updateBrandingSettings,
  updateIntegrationSettings,
  uploadBrandingMedia,
} from "@/lib/api";
import type { BrandingMediaKind, IntegrationSettings } from "@/lib/api";
import { getStoredToken } from "@/lib/crm-session";

const initialSettings: StoreSettings = {
  store_name: "",
  logo_url: "",
  logo_dark_url: "",
  favicon_url: "",
  banner_home_url: "",
  banner_home_mobile_url: "",
  og_image_url: "",
  about_image_url: "",
  logo_position: "50% 50%",
  logo_dark_position: "50% 50%",
  favicon_position: "50% 50%",
  banner_home_position: "50% 50%",
  banner_home_mobile_position: "50% 50%",
  og_image_position: "50% 50%",
  primary_color: "#3B82F6",
  primary_foreground: "#FFFFFF",
  secondary_color: "#10B981",
  background_color: "#FFFFFF",
  header_background: "#FFFFFF",
  footer_background: "#111827",
  font_heading: "Inter",
  font_body: "Inter",
  border_radius: "md",
  topbar_announcement: "",
  topbar_active: false,
  hero_title: "",
  hero_subtitle: "",
  hero_cta_text: "",
  featured_title: "",
  featured_subtitle: "",
  featured_cta_text: "",
  newsletter_title: "",
  newsletter_subtitle: "",
  newsletter_cta_text: "",
  about_eyebrow: "",
  about_title: "",
  about_description: "",
  about_story_title: "",
  about_story_text: "",
  about_mission_title: "",
  about_mission_text: "",
  about_quote: "",
  about_quote_author: "",
  about_values_title: "",
  about_value_1_title: "",
  about_value_1_text: "",
  about_value_2_title: "",
  about_value_2_text: "",
  about_value_3_title: "",
  about_value_3_text: "",
  category_1_id: "",
  category_1_image: "",
  category_2_id: "",
  category_2_image: "",
  category_3_id: "",
  category_3_image: "",
  category_4_id: "",
  category_4_image: "",
  footer_about_text: "",
  copyright_text: "",
  whatsapp_number: "",
  whatsapp_default_message: "",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  support_email: "",
};

const initialMercadoPagoForm: MercadoPagoFormState = {
  mercadoPagoAccessToken: "",
  mercadoPagoPublicKey: "",
  mercadoPagoWebhookUrl: "",
  mercadoPagoWebhookSecret: "",
};

const initialMelhorEnvioForm: MelhorEnvioFormState = {
  melhorEnvioToken: "",
  originZip: "",
  originStreet: "",
  originNumber: "",
  originDistrict: "",
  originCity: "",
  originState: "",
  originCountry: "BR",
};

export interface FeedbackMessage {
  type: "success" | "error";
  text: string;
}

const validTabs: StoreTabKey[] = ["inicio", "sobre", "mercadopago", "melhorenvio"];

export function useStoreSettings() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tabParam = searchParams.get("tab") as StoreTabKey | null;
  const [activeTab, setActiveTabState] = useState<StoreTabKey>(
    tabParam && validTabs.includes(tabParam) ? tabParam : "inicio"
  );

  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings | null>(null);
  const [mercadoPagoForm, setMercadoPagoForm] = useState<MercadoPagoFormState>(initialMercadoPagoForm);
  const [melhorEnvioForm, setMelhorEnvioForm] = useState<MelhorEnvioFormState>(initialMelhorEnvioForm);
  const [mercadoPagoConnectUrl, setMercadoPagoConnectUrl] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKind, setUploadingKind] = useState<BrandingMediaKind | null>(null);
  const [message, setMessage] = useState<FeedbackMessage | null>(null);

  const setActiveTab = useCallback(
    (tab: StoreTabKey) => {
      setActiveTabState(tab);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const tab = searchParams.get("tab") as StoreTabKey | null;
    if (tab && validTabs.includes(tab) && tab !== activeTab) {
      setActiveTabState(tab);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    Promise.all([
      fetchCurrentUser(token),
      fetchBrandingSettings(token),
      fetchIntegrationSettings(token),
    ])
      .then(([user, branding, integrations]) => {
        setSettings({ ...initialSettings, ...branding });
        setIntegrationSettings(integrations);
        setMercadoPagoConnectUrl(buildMercadoPagoConnectUrl(user.tenantId));

        if (integrations) {
          setMercadoPagoForm({
            mercadoPagoAccessToken: "",
            mercadoPagoPublicKey: integrations.hasMercadoPagoPublicKey ? "••••••••" : "",
            mercadoPagoWebhookUrl: integrations.mercadoPagoWebhookUrl || "",
            mercadoPagoWebhookSecret: "",
          });

          setMelhorEnvioForm({
            melhorEnvioToken: "",
            originZip: integrations.originZip || "",
            originStreet: integrations.originStreet || "",
            originNumber: integrations.originNumber || "",
            originDistrict: integrations.originDistrict || "",
            originCity: integrations.originCity || "",
            originState: integrations.originState || "",
            originCountry: integrations.originCountry || "BR",
          });
        }
      })
      .catch(() =>
        setMessage({ type: "error", text: "Não foi possível carregar as configurações da loja." })
      )
      .finally(() => setIsLoading(false));
  }, []);

  const showFeedback = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    if (type === "success") {
      window.setTimeout(() => setMessage(null), 4000);
    }
  };

  function handleChange(field: keyof StoreSettings, value: string | boolean) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function handlePositionChange(field: keyof StoreSettings, position: string) {
    setSettings((current) => ({ ...current, [field]: position }));
  }

  function handleMercadoPagoChange(field: keyof MercadoPagoFormState, value: string) {
    setMercadoPagoForm((current) => ({ ...current, [field]: value }));
  }

  function handleMelhorEnvioChange(field: keyof MelhorEnvioFormState, value: string) {
    setMelhorEnvioForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSaveBranding(tabName = "Configurações") {
    setIsSaving(true);
    setMessage(null);
    try {
      const token = getStoredToken();
      if (!token) throw new Error("Sessão inválida. Faça login novamente.");
      await updateBrandingSettings(token, settings);
      showFeedback("success", `${tabName} salvas com sucesso!`);
    } catch (error) {
      showFeedback("error", error instanceof Error ? error.message : "Erro ao salvar configurações");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveMercadoPago() {
    setIsSaving(true);
    setMessage(null);
    try {
      const token = getStoredToken();
      if (!token) throw new Error("Sessão inválida. Faça login novamente.");

      const payload: Record<string, string | null> = {};
      if (mercadoPagoForm.mercadoPagoAccessToken.trim()) {
        payload.mercadoPagoAccessToken = mercadoPagoForm.mercadoPagoAccessToken.trim();
      }
      if (mercadoPagoForm.mercadoPagoPublicKey.trim()) {
        payload.mercadoPagoPublicKey = mercadoPagoForm.mercadoPagoPublicKey.trim();
      }
      if (mercadoPagoForm.mercadoPagoWebhookUrl !== undefined) {
        payload.mercadoPagoWebhookUrl = mercadoPagoForm.mercadoPagoWebhookUrl.trim() || null;
      }
      if (mercadoPagoForm.mercadoPagoWebhookSecret.trim()) {
        payload.mercadoPagoWebhookSecret = mercadoPagoForm.mercadoPagoWebhookSecret.trim();
      }

      if (!Object.keys(payload).length) {
        showFeedback("error", "Nenhuma alteração informada para salvar.");
        return;
      }

      const updated = await updateIntegrationSettings(token, payload);
      setIntegrationSettings(updated);
      setMercadoPagoForm((prev) => ({
        ...prev,
        mercadoPagoAccessToken: "",
        mercadoPagoWebhookSecret: "",
      }));
      showFeedback("success", "Configurações do Mercado Pago salvas com sucesso!");
    } catch (error) {
      showFeedback("error", error instanceof Error ? error.message : "Erro ao salvar Mercado Pago");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveMelhorEnvio() {
    setIsSaving(true);
    setMessage(null);
    try {
      const token = getStoredToken();
      if (!token) throw new Error("Sessão inválida. Faça login novamente.");

      const payload: Record<string, string | null> = {
        originZip: melhorEnvioForm.originZip.replace(/\D/g, ""),
        originStreet: melhorEnvioForm.originStreet.trim() || null,
        originNumber: melhorEnvioForm.originNumber.trim() || null,
        originDistrict: melhorEnvioForm.originDistrict.trim() || null,
        originCity: melhorEnvioForm.originCity.trim() || null,
        originState: melhorEnvioForm.originState.trim().toUpperCase() || null,
        originCountry: melhorEnvioForm.originCountry.trim().toUpperCase() || "BR",
      };

      if (melhorEnvioForm.melhorEnvioToken.trim()) {
        payload.melhorEnvioToken = melhorEnvioForm.melhorEnvioToken.trim();
      }

      const updated = await updateIntegrationSettings(token, payload);
      setIntegrationSettings(updated);
      setMelhorEnvioForm((prev) => ({
        ...prev,
        melhorEnvioToken: "",
      }));
      showFeedback("success", "Configurações do Melhor Envio salvas com sucesso!");
    } catch (error) {
      showFeedback("error", error instanceof Error ? error.message : "Erro ao salvar Melhor Envio");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleMediaUpload(kind: BrandingMediaKind, file?: File) {
    if (!file) return;
    const token = getStoredToken();
    if (!token) {
      showFeedback("error", "Sessão inválida.");
      return;
    }

    setUploadingKind(kind);
    try {
      const uploadedUrl = await uploadBrandingMedia(token, file, kind);
      const mediaFieldMap: Record<BrandingMediaKind, keyof StoreSettings> = {
        logo: "logo_url",
        logo_dark: "logo_dark_url",
        favicon: "favicon_url",
        banner_home: "banner_home_url",
        banner_home_mobile: "banner_home_mobile_url",
        og_image: "og_image_url",
        about_image: "about_image_url",
        category_1: "category_1_image",
        category_2: "category_2_image",
        category_3: "category_3_image",
        category_4: "category_4_image",
      };

      const positionFieldMap: Record<BrandingMediaKind, keyof StoreSettings> = {
        logo: "logo_position",
        logo_dark: "logo_dark_position",
        favicon: "favicon_position",
        banner_home: "banner_home_position",
        banner_home_mobile: "banner_home_mobile_position",
        og_image: "og_image_position",
        about_image: "og_image_position",
        category_1: "banner_home_position",
        category_2: "banner_home_position",
        category_3: "banner_home_position",
        category_4: "banner_home_position",
      };

      const field = mediaFieldMap[kind];
      const posField = positionFieldMap[kind];

      setSettings((current) => ({
        ...current,
        [field]: uploadedUrl,
        [posField]: current[posField] || "50% 50%",
      }));

      showFeedback("success", "Imagem enviada com sucesso!");
    } catch (error) {
      showFeedback("error", error instanceof Error ? error.message : "Erro ao enviar imagem");
    } finally {
      setUploadingKind(null);
    }
  }

  return {
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
  };
}
