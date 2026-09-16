"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  ArrowRight,
  Mail,
  ShoppingBag,
  Search,
  User,
  Menu,
  Sparkles,
  Eye,
  ImageIcon,
  Tags,
} from "lucide-react";
import type { StoreHomeSettingsProps } from "./StoreHomeSettings.types";
import { InlineEditableText } from "./InlineEditableText";
import { InlineMediaEditor } from "./InlineMediaEditor";
import { ThemeSettingsDrawer } from "./ThemeSettingsDrawer";
import { Select } from "@/components/ui/Select";
import { fetchCategories, type ApiCategory } from "@/lib/api";

type ViewportMode = "desktop" | "tablet" | "mobile";

export function StoreHomeSettings({
  settings,
  isSaving,
  onChange,
  onUploadMedia,
  onPositionChange,
  onSave,
  uploadingKind,
}: StoreHomeSettingsProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState<ApiCategory[]>([]);

  useEffect(() => {
    fetchCategories()
      .then(setCategoriesList)
      .catch(() => {});
  }, []);

  // Dynamic CSS variables derived from live settings
  const dynamicStyles = {
    "--primary": settings.primary_color || "#009BFF",
    "--primary-foreground": settings.primary_foreground || "#FFFFFF",
    "--secondary": settings.secondary_color || "#E8368F",
    "--background": settings.background_color || "#000932",
    "--header-bg": settings.header_background || "#000932",
    "--footer-bg": settings.footer_background || "#000932",
    "--font-heading": settings.font_heading || "Inter",
    "--font-body": settings.font_body || "Inter",
  } as React.CSSProperties;

  const mockProducts = [
    {
      id: "1",
      name: "Camiseta Tech Minimalist",
      category: "Vestuário",
      price: "R$ 149,90",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "2",
      name: "Sneaker Urban Runner Pro",
      category: "Calçados",
      price: "R$ 499,90",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "3",
      name: "Smartwatch Horizon V2",
      category: "Acessórios",
      price: "R$ 789,00",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    },
    {
      id: "4",
      name: "Mochila Impermeável Stealth",
      category: "Acessórios",
      price: "R$ 299,00",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const categorySlots = [
    {
      slotNum: 1,
      idField: "category_1_id" as const,
      imageField: "category_1_image" as const,
      mediaKind: "category_1" as const,
      gridClass: "md:col-span-2 md:row-span-2",
      bg: "bg-gradient-to-br from-blue-500/25 via-[#00124F] to-[#000932] border border-blue-500/30 hover:border-blue-500/60 hover:shadow-blue-500/10",
      defaultName: "Lançamentos",
    },
    {
      slotNum: 2,
      idField: "category_2_id" as const,
      imageField: "category_2_image" as const,
      mediaKind: "category_2" as const,
      gridClass: "md:col-span-1 md:row-span-1",
      bg: "bg-gradient-to-br from-pink-500/25 via-[#00124F] to-[#000932] border border-pink-500/30 hover:border-pink-500/60 hover:shadow-pink-500/10",
      defaultName: "Coleção Premium",
    },
    {
      slotNum: 3,
      idField: "category_3_id" as const,
      imageField: "category_3_image" as const,
      mediaKind: "category_3" as const,
      gridClass: "md:col-span-1 md:row-span-2",
      bg: "bg-gradient-to-br from-purple-500/30 via-[#00124F] to-[#000932] border border-purple-500/30 hover:border-purple-500/60 hover:shadow-purple-500/10",
      defaultName: "Acessórios",
    },
    {
      slotNum: 4,
      idField: "category_4_id" as const,
      imageField: "category_4_image" as const,
      mediaKind: "category_4" as const,
      gridClass: "md:col-span-1 md:row-span-1",
      bg: "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/15 hover:border-white/40",
      defaultName: "Ofertas Especiais",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Floating / Fixed Action Bar */}
      <div className="sticky top-4 z-40 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <Sparkles className="h-4 w-4" />
            <span>Editor Visual ao Vivo</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
            <Eye className="h-3.5 w-3.5" />
            <span>Clique nos textos e imagens para editar</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              title="Visualização Desktop"
              className={`rounded-lg p-1.5 transition ${viewport === "desktop"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              title="Visualização Tablet"
              className={`rounded-lg p-1.5 transition ${viewport === "tablet"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              title="Visualização Mobile"
              className={`rounded-lg p-1.5 transition ${viewport === "mobile"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
                }`}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          {/* Color & Theme Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsThemeDrawerOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
          >
            <Palette className="h-3.5 w-3.5 text-blue-600" />
            <span>Cores & Tema</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || Boolean(uploadingKind)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>

      {/* Viewport Canvas Wrapper */}
      <div className="flex justify-center overflow-x-auto rounded-3xl bg-slate-900/90 p-3 sm:p-6 shadow-2xl">
        <div
          style={dynamicStyles}
          className={`transition-all duration-300 ${viewport === "desktop"
            ? "w-full max-w-6xl"
            : viewport === "tablet"
              ? "w-[768px]"
              : "w-[390px]"
            } overflow-hidden rounded-2xl border border-white/10 shadow-2xl`}
        >
          {/* ================= STOREFRONT RENDER ================= */}
          <div
            className="min-h-screen text-white select-text"
            style={{
              backgroundColor: "var(--background)",
              fontFamily: "var(--font-body), sans-serif",
            }}
          >
            {/* MOCK BROWSER TAB WITH FAVICON & STORE NAME EDITABLE */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 py-2 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-slate-900 px-2.5 py-1 text-slate-200 shadow-sm transition hover:border-white/30">
                  {/* Editable Favicon */}
                  <InlineMediaEditor
                    label="Favicon da Aba (.ico ou .png)"
                    kind="favicon"
                    accept=".ico,image/png,image/x-icon"
                    value={settings.favicon_url}
                    onFileChange={onUploadMedia}
                    isUploading={uploadingKind === "favicon"}
                  >
                    <button
                      type="button"
                      title="Clique para alterar o Favicon da aba"
                      className="group/fav flex items-center justify-center rounded p-0.5 hover:bg-white/10 transition"
                    >
                      {settings.favicon_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={settings.favicon_url}
                          alt="Favicon"
                          className="h-4 w-4 object-contain rounded transition group-hover/fav:scale-110"
                        />
                      ) : (
                        <span className="text-xs">🌐</span>
                      )}
                    </button>
                  </InlineMediaEditor>

                  {/* Editable Store / Page Title */}
                  <div className="text-[11px] font-medium text-white/90">
                    <InlineEditableText
                      value={settings.store_name || settings.hero_title}
                      placeholder="Nome da Loja na Aba"
                      onChange={(val) => {
                        onChange("store_name", val);
                      }}
                      className="max-w-[180px] sm:max-w-[240px] truncate"
                    />
                  </div>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[11px] text-slate-500">
                Aba do Navegador (Clique no ícone ou título para alterar)
              </span>
            </div>

            {/* 1. TOPBAR / ANNOUNCEMENT BAR */}
            <div
              className={`border-b border-white/10 px-4 py-2 text-center text-xs transition ${settings.topbar_active ? "bg-white/10" : "bg-red-500/10 opacity-70"
                }`}
            >
              <div className="flex flex-wrap items-center justify-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-slate-300">
                  <input
                    type="checkbox"
                    checked={settings.topbar_active}
                    onChange={(e) => onChange("topbar_active", e.target.checked)}
                    className="h-3 w-3 rounded text-blue-600"
                  />
                  <span>{settings.topbar_active ? "Barra Ativa" : "Oculta na Loja"}</span>
                </label>

                <InlineEditableText
                  value={settings.topbar_announcement}
                  placeholder="Clique para editar o anúncio superior (ex: Frete grátis para todo Brasil!)..."
                  onChange={(val) => onChange("topbar_announcement", val)}
                  className="font-medium text-white/90"
                />
              </div>
            </div>

            {/* 2. HEADER */}
            <header
              className="border-b border-white/10 px-4 py-4 md:px-12"
              style={{ backgroundColor: "var(--header-bg)" }}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Logo with Inline Upload */}
                <div className="flex items-center gap-3">
                  <InlineMediaEditor
                    label="Logo Principal"
                    kind="logo"
                    value={settings.logo_url}
                    position={settings.logo_position}
                    onFileChange={onUploadMedia}
                    onPositionChange={(pos) => onPositionChange("logo_position", pos)}
                    isUploading={uploadingKind === "logo"}
                  >
                    <div className="flex h-10 items-center">
                      {settings.logo_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={settings.logo_url}
                          alt="Logo da Loja"
                          className="h-9 w-auto max-w-[160px] object-contain"
                          style={{ objectPosition: settings.logo_position || "50% 50%" }}
                        />
                      ) : (
                        <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 font-bold tracking-tight text-white">
                          <span className="text-lg">⭐</span>
                          <span>Minha Loja</span>
                        </div>
                      )}
                    </div>
                  </InlineMediaEditor>
                </div>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80">
                  <span className="cursor-default hover:text-white">Shop</span>
                  <span className="cursor-default hover:text-white">Coleções</span>
                  <span className="cursor-default hover:text-white">Sobre</span>
                </nav>

                {/* Header Icons */}
                <div className="flex items-center gap-3 text-white/80">
                  <button type="button" className="p-1 hover:text-white">
                    <Search className="h-5 w-5" />
                  </button>
                  <button type="button" className="p-1 hover:text-white">
                    <User className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 p-1 hover:text-white"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span
                      className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: "var(--primary)" }}
                    >
                      2
                    </span>
                  </button>
                  <button type="button" className="md:hidden p-1 text-white">
                    <Menu className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </header>

            {/* 3. HERO SECTION */}
            <section className="relative px-4 py-12 md:px-12 md:py-20">
              <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
                {/* Left: Hero Texts */}
                <div className="space-y-6">
                  <div>
                    <h1
                      className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl"
                      style={{ fontFamily: "var(--font-heading), sans-serif" }}
                    >
                      <InlineEditableText
                        value={settings.hero_title}
                        placeholder="Inovação & Estilo para seu dia a dia"
                        onChange={(val) => onChange("hero_title", val)}
                        as="span"
                      />
                    </h1>
                  </div>

                  <p className="max-w-md text-base leading-relaxed text-white/70">
                    <InlineEditableText
                      value={settings.hero_subtitle}
                      placeholder="Descubra peças e soluções exclusivas desenvolvidas com máxima qualidade e precisão."
                      onChange={(val) => onChange("hero_subtitle", val)}
                      multiline
                      rows={3}
                      as="span"
                    />
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-xl transition hover:opacity-90"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }}
                    >
                      <InlineEditableText
                        value={settings.hero_cta_text}
                        placeholder="Comprar Agora"
                        onChange={(val) => onChange("hero_cta_text", val)}
                      />
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-xs transition hover:bg-white/10"
                    >
                      Ver Coleções
                    </button>
                  </div>
                </div>

                {/* Right: Hero Banner with Inline Editor */}
                <InlineMediaEditor
                  label="Banner Principal da Home"
                  kind="banner_home"
                  value={settings.banner_home_url}
                  position={settings.banner_home_position}
                  onFileChange={onUploadMedia}
                  onPositionChange={(pos) => onPositionChange("banner_home_position", pos)}
                  isUploading={uploadingKind === "banner_home"}
                >
                  <div className="relative aspect-[4/5] md:aspect-square overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
                    {settings.banner_home_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={settings.banner_home_url}
                        alt="Banner Hero"
                        className="h-full w-full select-none object-cover"
                        style={{ objectPosition: settings.banner_home_position || "50% 50%" }}
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white">
                          <Palette className="h-8 w-8" />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-white">Adicione um Banner de Destaque</p>
                        <p className="mt-1 text-xs text-white/50">Passe o mouse para fazer upload da imagem do Hero</p>
                      </div>
                    )}
                  </div>
                </InlineMediaEditor>
              </div>
            </section>

            {/* 4. FEATURED PRODUCTS SECTION */}
            <section className="border-t border-white/10 px-4 py-16 md:px-12">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2
                    className="text-2xl font-bold tracking-tight text-white md:text-3xl"
                    style={{ fontFamily: "var(--font-heading), sans-serif" }}
                  >
                    <InlineEditableText
                      value={settings.featured_title}
                      placeholder="Destaques da Semana"
                      onChange={(val) => onChange("featured_title", val)}
                      as="span"
                    />
                  </h2>
                  <p className="mt-2 text-sm text-white/70">
                    <InlineEditableText
                      value={settings.featured_subtitle}
                      placeholder="As peças que estão definindo a tendência desta temporada."
                      onChange={(val) => onChange("featured_subtitle", val)}
                      as="span"
                    />
                  </p>
                </div>

                <div
                  className="cursor-pointer border-b pb-0.5 text-xs font-semibold transition"
                  style={{
                    color: "var(--primary)",
                    borderColor: "var(--primary)",
                  }}
                >
                  <InlineEditableText
                    value={settings.featured_cta_text}
                    placeholder="Ver todos os produtos"
                    onChange={(val) => onChange("featured_cta_text", val)}
                  />
                </div>
              </div>

              {/* Product Cards Grid Preview */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                {mockProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 shadow-lg backdrop-blur-xs transition hover:border-white/20 hover:bg-white/10"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3">
                      <span className="text-[11px] font-medium text-white/50">{prod.category}</span>
                      <h3 className="mt-0.5 text-sm font-semibold text-white line-clamp-1">
                        {prod.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{prod.price}</span>
                        <button
                          type="button"
                          className="rounded-lg p-1.5 text-white transition"
                          style={{ backgroundColor: "var(--primary)" }}
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. CATEGORIES BENTO GRID */}
            <section className="border-t border-white/10 px-4 py-16 md:px-12">
              <div className="mb-10 text-center md:text-left">
                <h2
                  className="text-3xl md:text-4xl font-bold text-white"
                  style={{ fontFamily: "var(--font-heading), sans-serif" }}
                >
                  Comprar por Categoria
                </h2>
                <p className="mt-1 text-xs text-white/50">
                  Selecione a categoria de cada card e adicione uma imagem de fundo personalizada.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 min-h-[580px] md:h-[660px]">
                {categorySlots.map((slot) => {
                  const selectedId = settings[slot.idField];
                  const customImage = settings[slot.imageField];
                  const matchedCategory = categoriesList.find((c) => c.id === selectedId);
                  const categoryName = matchedCategory?.name || slot.defaultName;

                  return (
                    <div
                      key={slot.slotNum}
                      className={`group relative overflow-hidden rounded-3xl shadow-xl transition-all duration-300 min-h-[220px] md:min-h-0 ${slot.bg} ${slot.gridClass}`}
                    >
                      {/* Background Image */}
                      {customImage ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={customImage}
                            alt={categoryName}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 group-hover:from-black/75 transition-colors z-10" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                      )}

                      {/* Top Category Select */}
                      <div className="absolute top-3 left-3 z-30">
                        <Select
                          value={selectedId || ""}
                          onChange={(val) => onChange(slot.idField, val)}
                          icon={<Tags className="h-3.5 w-3.5" />}
                          options={[
                            { value: "", label: `${slot.defaultName} (Padrão)` },
                            ...categoriesList.map((cat) => ({
                              value: cat.id,
                              label: cat.name,
                            })),
                          ]}
                          placeholder={slot.defaultName}
                          triggerClassName="max-w-[150px] sm:max-w-[180px] py-1 px-2.5 text-xs bg-black/80 border-white/20 hover:border-blue-400 backdrop-blur-md"
                          dropdownClassName="w-52"
                        />
                      </div>

                      {/* Center: Upload / Change Image Button */}
                      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none p-4">
                        <div className="pointer-events-auto">
                          <InlineMediaEditor
                            label={`Imagem do Card ${slot.slotNum} (${categoryName})`}
                            kind={slot.mediaKind}
                            value={customImage}
                            onFileChange={onUploadMedia}
                            isUploading={uploadingKind === slot.mediaKind}
                          >
                            <button
                              type="button"
                              className="flex items-center gap-1.5 rounded-xl border border-white/25 bg-black/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-2xl cursor-pointer"
                            >
                              <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
                              <span>{customImage ? "Trocar Imagem" : "Adicionar Imagem"}</span>
                            </button>
                          </InlineMediaEditor>
                        </div>
                      </div>

                      {/* Bottom Title & Link */}
                      <div className="absolute bottom-8 left-8 z-20">
                        <h3 className="text-white text-2xl font-bold font-outfit drop-shadow-md">
                          {categoryName}
                        </h3>
                        <span className="text-white/80 font-medium border-b border-white/30 group-hover:border-white group-hover:text-white transition-all text-sm">
                          Explorar
                        </span>
                      </div>

                      {/* Watermark text when no custom image */}
                      {!customImage && (
                        <div className="flex h-full w-full items-center justify-center text-white/5 text-4xl font-bold uppercase select-none">
                          {categoryName}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 6. NEWSLETTER SECTION */}
            <section className="border-t border-white/10 px-4 py-16 text-center md:px-12">
              <div className="mx-auto max-w-xl">
                <div
                  className="mx-auto grid h-12 w-12 place-items-center rounded-2xl shadow-lg"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <Mail className="h-6 w-6 text-white" />
                </div>

                <h2
                  className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl"
                  style={{ fontFamily: "var(--font-heading), sans-serif" }}
                >
                  <InlineEditableText
                    value={settings.newsletter_title}
                    placeholder="Fique por dentro das novidades"
                    onChange={(val) => onChange("newsletter_title", val)}
                    as="span"
                  />
                </h2>

                <p className="mt-2 text-sm text-white/70">
                  <InlineEditableText
                    value={settings.newsletter_subtitle}
                    placeholder="Lançamentos exclusivos, descontos e novidades diretamente no seu e-mail."
                    onChange={(val) => onChange("newsletter_subtitle", val)}
                    as="span"
                  />
                </p>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    disabled
                    className="h-11 rounded-xl border border-white/20 bg-white/5 px-4 text-xs text-white placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    className="h-11 rounded-xl px-6 text-xs font-semibold text-white shadow-lg transition hover:opacity-90"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    <InlineEditableText
                      value={settings.newsletter_cta_text}
                      placeholder="Inscrever-se"
                      onChange={(val) => onChange("newsletter_cta_text", val)}
                    />
                  </button>
                </div>
              </div>
            </section>

            {/* 7. FOOTER */}
            <footer
              className="border-t border-white/10 px-4 py-12 md:px-12"
              style={{ backgroundColor: "var(--footer-bg)" }}
            >
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <InlineMediaEditor
                    label="Logo do Rodapé"
                    kind="logo"
                    value={settings.logo_url}
                    position={settings.logo_position}
                    onFileChange={onUploadMedia}
                    onPositionChange={(pos) => onPositionChange("logo_position", pos)}
                    isUploading={uploadingKind === "logo"}
                  >
                    {settings.logo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={settings.logo_url}
                        alt="Logo Footer"
                        className="h-8 w-auto object-contain"
                      />
                    ) : (
                      <span className="font-bold text-white">Minha Loja</span>
                    )}
                  </InlineMediaEditor>

                  <div className="mt-3 text-xs leading-relaxed text-white/60">
                    <InlineEditableText
                      value={settings.footer_about_text}
                      placeholder="Breve descrição da marca no rodapé para os clientes..."
                      onChange={(val) => onChange("footer_about_text", val)}
                      multiline
                      rows={2}
                      as="span"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Shop</h4>
                  <ul className="mt-3 space-y-1.5 text-xs text-white/60">
                    <li>Todos os produtos</li>
                    <li>Novidades</li>
                    <li>Destaques</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Institucional</h4>
                  <ul className="mt-3 space-y-1.5 text-xs text-white/60">
                    <li>Sobre nós</li>
                    <li>Qualidade & Inovação</li>
                    <li>Contato</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Atendimento</h4>
                  <p className="mt-3 text-xs text-white/60">
                    WhatsApp: {settings.whatsapp_number || "(11) 99999-9999"}
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Email: {settings.support_email || "suporte@loja.com"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
                <div>
                  <InlineEditableText
                    value={settings.copyright_text}
                    placeholder="© 2026 Minha Loja. Todos os direitos reservados."
                    onChange={(val) => onChange("copyright_text", val)}
                    as="span"
                  />
                </div>
                <div className="flex gap-4">
                  <span>Privacidade</span>
                  <span>Termos de Uso</span>
                </div>
              </div>
            </footer>
          </div>
          {/* ================= END STOREFRONT ================= */}
        </div>
      </div>

      {/* Slide-over Theme Settings Drawer */}
      <ThemeSettingsDrawer
        isOpen={isThemeDrawerOpen}
        onClose={() => setIsThemeDrawerOpen(false)}
        settings={settings}
        onChange={onChange}
        onUploadMedia={onUploadMedia}
        onPositionChange={onPositionChange}
        uploadingKind={uploadingKind}
      />
    </div>
  );
}
