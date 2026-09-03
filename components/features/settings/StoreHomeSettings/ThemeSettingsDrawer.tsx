"use client";

import { X, Palette, Type, Share2, Sparkles, Image as ImageIcon } from "lucide-react";
import type { StoreSettings } from "@/features/settings/types/StoreSettings.types";
import { MediaUploadField } from "../MediaUploadField";
import type { BrandingMediaKind } from "@/lib/api";

interface ThemeSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onChange: (field: keyof StoreSettings, value: string | boolean) => void;
  onUploadMedia: (kind: BrandingMediaKind, file?: File) => void;
  onPositionChange: (field: keyof StoreSettings, position: string) => void;
  uploadingKind?: BrandingMediaKind | null;
}

const colorFields: Array<[keyof StoreSettings, string]> = [
  ["primary_color", "Primária (Botões e destaques)"],
  ["primary_foreground", "Texto primário (Contraste)"],
  ["secondary_color", "Secundária (Acentos)"],
  ["background_color", "Fundo da loja"],
  ["header_background", "Fundo do cabeçalho"],
  ["footer_background", "Fundo do rodapé"],
];

const fonts = ["Inter", "Montserrat", "Poppins", "Playfair Display", "Roboto"];
const radii = [
  ["none", "Nenhum (0px)"],
  ["sm", "Pequeno (4px)"],
  ["md", "Médio (8px)"],
  ["lg", "Grande (16px)"],
  ["full", "Pílula"],
];

export function ThemeSettingsDrawer({
  isOpen,
  onClose,
  settings,
  onChange,
  onUploadMedia,
  onPositionChange,
  uploadingKind,
}: ThemeSettingsDrawerProps) {
  if (!isOpen) return null;

  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  const getStringValue = (field: keyof StoreSettings) => String(settings[field] ?? "");
  const getColorValue = (field: keyof StoreSettings) => {
    const raw = String(settings[field] ?? "").trim();
    return /^#[0-9A-Fa-f]{6}$/.test(raw) ? raw : "#000000";
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-slate-900 text-white shadow-2xl transition-all rounded-xl">
      {/* Drawer Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600/20 text-blue-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Estilos & Configurações da Loja</h2>
            <p className="text-[11px] text-slate-400">Personalize cores, tipografia e mídias</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Cores */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Palette className="h-3.5 w-3.5 text-blue-400" />
            Paleta de Cores
          </div>
          <div className="grid grid-cols-2 gap-3">
            {colorFields.map(([field, label]) => (
              <div key={field} className="rounded-xl border border-slate-800 bg-slate-800/60 p-2.5">
                <label className="block text-[11px] font-medium text-slate-300">{label}</label>
                <div className="mt-1.5 flex items-center gap-2">
                  <input
                    type="color"
                    value={getColorValue(field)}
                    onChange={(e) => onChange(field, e.target.value)}
                    className="h-7 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={getStringValue(field)}
                    onChange={(e) => onChange(field, e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-mono uppercase text-slate-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tipografia */}
        <section className="space-y-3 border-t border-slate-800 pt-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Type className="h-3.5 w-3.5 text-purple-400" />
            Tipografia & Bordas
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-300">
              Fonte dos Títulos
              <select
                value={getStringValue("font_heading") || "Inter"}
                onChange={(e) => onChange("font_heading", e.target.value)}
                className={inputClass}
              >
                {fonts.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-slate-300">
              Fonte do Corpo
              <select
                value={getStringValue("font_body") || "Inter"}
                onChange={(e) => onChange("font_body", e.target.value)}
                className={inputClass}
              >
                {fonts.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-xs font-medium text-slate-300">
              Arredondamento de Bordas
              <select
                value={getStringValue("border_radius") || "md"}
                onChange={(e) => onChange("border_radius", e.target.value)}
                className={inputClass}
              >
                {radii.map(([val, lbl]) => (
                  <option key={val} value={val}>
                    {lbl}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {/* Mídias Adicionais */}
        <section className="space-y-3 border-t border-slate-800 pt-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <ImageIcon className="h-3.5 w-3.5 text-emerald-400" />
            Mídias Adicionais (Favicon, Mobile & OG)
          </div>
          <div className="space-y-4">
            <MediaUploadField
              label="Favicon (.ico ou .png)"
              accept=".ico,image/png"
              kind="favicon"
              value={getStringValue("favicon_url")}
              position={getStringValue("favicon_position")}
              isIcon
              isUploading={uploadingKind === "favicon"}
              onFileChange={onUploadMedia}
              onPositionChange={(pos) => onPositionChange("favicon_position", pos)}
            />

            <MediaUploadField
              label="Banner Mobile da Home"
              accept="image/*"
              kind="banner_home_mobile"
              value={getStringValue("banner_home_mobile_url")}
              position={getStringValue("banner_home_mobile_position")}
              isUploading={uploadingKind === "banner_home_mobile"}
              onFileChange={onUploadMedia}
              onPositionChange={(pos) => onPositionChange("banner_home_mobile_position", pos)}
            />

            <MediaUploadField
              label="Imagem Open Graph (Redes / 1200x630)"
              accept="image/*"
              kind="og_image"
              value={getStringValue("og_image_url")}
              position={getStringValue("og_image_position")}
              isUploading={uploadingKind === "og_image"}
              onFileChange={onUploadMedia}
              onPositionChange={(pos) => onPositionChange("og_image_position", pos)}
            />
          </div>
        </section>

        {/* Redes & Contato */}
        <section className="space-y-3 border-t border-slate-800 pt-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Share2 className="h-3.5 w-3.5 text-cyan-400" />
            Redes Sociais & Contato
          </div>
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-300">
              WhatsApp (com DDD)
              <input
                type="text"
                value={getStringValue("whatsapp_number")}
                placeholder="11999999999"
                onChange={(e) => onChange("whatsapp_number", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="block text-xs font-medium text-slate-300">
              Mensagem padrão do WhatsApp
              <input
                type="text"
                value={getStringValue("whatsapp_default_message")}
                placeholder="Olá! Vim pelo site..."
                onChange={(e) => onChange("whatsapp_default_message", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="block text-xs font-medium text-slate-300">
              E-mail de Suporte
              <input
                type="email"
                value={getStringValue("support_email")}
                placeholder="suporte@loja.com"
                onChange={(e) => onChange("support_email", e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="block text-xs font-medium text-slate-300">
              Instagram (URL)
              <input
                type="text"
                value={getStringValue("instagram_url")}
                placeholder="https://instagram.com/..."
                onChange={(e) => onChange("instagram_url", e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        </section>
      </div>

      {/* Drawer Footer */}
      <div className="border-t border-slate-800 p-4">
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          Fechar Painel de Estilos
        </button>
      </div>
    </div>
  );
}
