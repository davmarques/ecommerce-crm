"use client";

import { useState } from "react";
import {
  Save,
  Monitor,
  Tablet,
  Smartphone,
  Palette,
  ShoppingBag,
  Search,
  User,
  Menu,
  Sparkles,
  Eye,
  Quote as QuoteIcon,
  Image as ImageIcon,
} from "lucide-react";
import type { StoreAboutSettingsProps } from "./StoreAboutSettings.types";
import { InlineEditableText } from "../StoreHomeSettings/InlineEditableText";
import { InlineMediaEditor } from "../StoreHomeSettings/InlineMediaEditor";
import { ThemeSettingsDrawer } from "../StoreHomeSettings/ThemeSettingsDrawer";

type ViewportMode = "desktop" | "tablet" | "mobile";

export function StoreAboutSettings({
  settings,
  isSaving,
  onChange,
  onUploadMedia,
  onPositionChange,
  onSave,
  uploadingKind,
}: StoreAboutSettingsProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [isThemeDrawerOpen, setIsThemeDrawerOpen] = useState(false);

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

  return (
    <div className="space-y-4">
      {/* Top Floating / Fixed Action Bar */}
      <div className="sticky top-4 z-40 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
            <Sparkles className="h-4 w-4" />
            <span>Editor Visual ao Vivo — Página Sobre</span>
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
              className={`rounded-lg p-1.5 transition ${
                viewport === "desktop"
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
              className={`rounded-lg p-1.5 transition ${
                viewport === "tablet"
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
              className={`rounded-lg p-1.5 transition ${
                viewport === "mobile"
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
            {isSaving ? "Salvando..." : "Salvar Configurações do Sobre"}
          </button>
        </div>
      </div>

      {/* Viewport Canvas Wrapper */}
      <div className="flex justify-center overflow-x-auto rounded-3xl bg-slate-900/90 p-3 sm:p-6 shadow-2xl">
        <div
          style={dynamicStyles}
          className={`transition-all duration-300 ${
            viewport === "desktop"
              ? "w-full max-w-6xl"
              : viewport === "tablet"
              ? "w-[768px]"
              : "w-[390px]"
          } overflow-hidden rounded-2xl border border-white/10 shadow-2xl`}
        >
          {/* ================= ABOUT PAGE RENDER ================= */}
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

                  {/* Editable Page / Store Title */}
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

            {/* 1. HEADER */}
            <header
              className="border-b border-white/10 px-4 py-4 md:px-12"
              style={{ backgroundColor: "var(--header-bg)" }}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Logo */}
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
                  <span
                    className="cursor-default font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Sobre
                  </span>
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
                      0
                    </span>
                  </button>
                  <button type="button" className="md:hidden p-1 text-white">
                    <Menu className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </header>

            {/* 2. ABOUT HERO */}
            <section className="border-b border-white/10 px-4 py-16 md:px-20 lg:py-24">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-white/60">
                  <InlineEditableText
                    value={settings.about_eyebrow}
                    placeholder="Nossa história"
                    onChange={(val) => onChange("about_eyebrow", val)}
                  />
                </p>

                <h1
                  className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
                  style={{ fontFamily: "var(--font-heading), sans-serif" }}
                >
                  <InlineEditableText
                    value={settings.about_title}
                    placeholder="Feito para a forma como vivemos hoje"
                    onChange={(val) => onChange("about_title", val)}
                    multiline
                    rows={2}
                    as="span"
                  />
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">
                  <InlineEditableText
                    value={settings.about_description}
                    placeholder="A marca começou com uma crença simples: os objetos que usamos todos os dias devem ser discretos, bonitos e feitos para durar."
                    onChange={(val) => onChange("about_description", val)}
                    multiline
                    rows={4}
                    as="span"
                  />
                </p>
              </div>
            </section>

            {/* 3. IMAGEM DE DESTAQUE DA PÁGINA SOBRE */}
            <section className="px-4 py-10 md:px-20 lg:py-14">
              <InlineMediaEditor
                label="Imagem da Página Sobre"
                kind="about_image"
                value={settings.about_image_url}
                position={settings.og_image_position || "50% 50%"}
                onFileChange={onUploadMedia}
                onPositionChange={(pos) => onPositionChange("og_image_position", pos)}
                isUploading={uploadingKind === "about_image"}
              >
                <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
                  {settings.about_image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={settings.about_image_url}
                      alt={settings.about_title || "Imagem Sobre Nós"}
                      className="h-full w-full select-none object-cover"
                      style={{ objectPosition: settings.og_image_position || "50% 50%" }}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-white">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-white">Adicione a Imagem Institucional da Página Sobre</p>
                      <p className="mt-1 text-xs text-white/50">Passe o mouse para fazer upload da fotografia do estúdio ou time</p>
                    </div>
                  )}
                </div>
              </InlineMediaEditor>
            </section>

            {/* 4. HISTÓRIA & MISSÃO */}
            <section className="border-t border-white/10 px-4 py-12 md:px-20 lg:py-16">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                {/* História */}
                <div>
                  <h2
                    className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                    style={{ fontFamily: "var(--font-heading), sans-serif" }}
                  >
                    <InlineEditableText
                      value={settings.about_story_title}
                      placeholder="Uma abordagem mais lenta para as coisas"
                      onChange={(val) => onChange("about_story_title", val)}
                      as="span"
                    />
                  </h2>
                  <p className="mt-4 leading-relaxed text-white/70">
                    <InlineEditableText
                      value={settings.about_story_text}
                      placeholder="Em vez de perseguir tendências, focamos na forma, material e função. Cada peça na coleção é escolhida por sua habilidade de envelhecer com graça."
                      onChange={(val) => onChange("about_story_text", val)}
                      multiline
                      rows={4}
                      as="span"
                    />
                  </p>
                </div>

                {/* Missão */}
                <div>
                  <h2
                    className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                    style={{ fontFamily: "var(--font-heading), sans-serif" }}
                  >
                    <InlineEditableText
                      value={settings.about_mission_title}
                      placeholder="Feito para ser vivido"
                      onChange={(val) => onChange("about_mission_title", val)}
                      as="span"
                    />
                  </h2>
                  <p className="mt-4 leading-relaxed text-white/70">
                    <InlineEditableText
                      value={settings.about_mission_text}
                      placeholder="Fazemos parcerias com artesãos que compartilham nosso respeito pelo ofício. Nossos produtos são feitos para serem usados e amados por anos."
                      onChange={(val) => onChange("about_mission_text", val)}
                      multiline
                      rows={4}
                      as="span"
                    />
                  </p>
                </div>
              </div>
            </section>

            {/* 5. CITAÇÃO / MANIFESTO */}
            <section className="border-t border-white/10 px-4 py-16 md:px-20 lg:py-24">
              <div className="mx-auto max-w-2xl text-center">
                <QuoteIcon className="mx-auto h-8 w-8 text-white/40 mb-4" />
                <blockquote
                  className="text-2xl font-medium leading-snug tracking-tight text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-heading), sans-serif" }}
                >
                  “
                  <InlineEditableText
                    value={settings.about_quote}
                    placeholder="O bom design é o mínimo de design possível."
                    onChange={(val) => onChange("about_quote", val)}
                    multiline
                    rows={2}
                    as="span"
                  />
                  ”
                </blockquote>
                <p className="mt-4 text-sm text-white/60">
                  —{" "}
                  <InlineEditableText
                    value={settings.about_quote_author}
                    placeholder="Dieter Rams"
                    onChange={(val) => onChange("about_quote_author", val)}
                  />
                </p>
              </div>
            </section>

            {/* 6. VALORES DA MARCA */}
            <section className="border-t border-white/10 px-4 py-16 md:px-20 lg:py-24">
              <h2
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                style={{ fontFamily: "var(--font-heading), sans-serif" }}
              >
                <InlineEditableText
                  value={settings.about_values_title}
                  placeholder="Nossos valores"
                  onChange={(val) => onChange("about_values_title", val)}
                  as="span"
                />
              </h2>

              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* Valor 1 */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs">
                  <h3
                    className="text-lg font-medium text-white"
                    style={{ fontFamily: "var(--font-heading), sans-serif" }}
                  >
                    <InlineEditableText
                      value={settings.about_value_1_title}
                      placeholder="Mínimo por intenção"
                      onChange={(val) => onChange("about_value_1_title", val)}
                      as="span"
                    />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    <InlineEditableText
                      value={settings.about_value_1_text}
                      placeholder="Removemos o desnecessário para que cada objeto possa cumprir sua função excepcionalmente bem."
                      onChange={(val) => onChange("about_value_1_text", val)}
                      multiline
                      rows={3}
                      as="span"
                    />
                  </p>
                </div>

                {/* Valor 2 */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs">
                  <h3
                    className="text-lg font-medium text-white"
                    style={{ fontFamily: "var(--font-heading), sans-serif" }}
                  >
                    <InlineEditableText
                      value={settings.about_value_2_title}
                      placeholder="Materiais duráveis"
                      onChange={(val) => onChange("about_value_2_title", val)}
                      as="span"
                    />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    <InlineEditableText
                      value={settings.about_value_2_text}
                      placeholder="Materiais naturais e resistentes escolhidos para ganhar personalidade com o tempo, em vez de se desgastarem."
                      onChange={(val) => onChange("about_value_2_text", val)}
                      multiline
                      rows={3}
                      as="span"
                    />
                  </p>
                </div>

                {/* Valor 3 */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs">
                  <h3
                    className="text-lg font-medium text-white"
                    style={{ fontFamily: "var(--font-heading), sans-serif" }}
                  >
                    <InlineEditableText
                      value={settings.about_value_3_title}
                      placeholder="Produção responsável"
                      onChange={(val) => onChange("about_value_3_title", val)}
                      as="span"
                    />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    <InlineEditableText
                      value={settings.about_value_3_text}
                      placeholder="Produção ética, embalagens reduzidas e parceiros que se preocupam com as pessoas e o meio ambiente."
                      onChange={(val) => onChange("about_value_3_text", val)}
                      multiline
                      rows={3}
                      as="span"
                    />
                  </p>
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
          {/* ================= END ABOUT PAGE ================= */}
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
