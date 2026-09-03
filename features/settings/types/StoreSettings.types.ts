export type StoreTabKey = "inicio" | "sobre" | "mercadopago" | "melhorenvio";

export interface StoreSettings {
  store_name: string;
  logo_url: string;
  logo_dark_url: string;
  favicon_url: string;
  banner_home_url: string;
  banner_home_mobile_url: string;
  og_image_url: string;
  about_image_url: string;
  logo_position: string;
  logo_dark_position: string;
  favicon_position: string;
  banner_home_position: string;
  banner_home_mobile_position: string;
  og_image_position: string;
  primary_color: string;
  primary_foreground: string;
  secondary_color: string;
  background_color: string;
  header_background: string;
  footer_background: string;
  font_heading: string;
  font_body: string;
  border_radius: string;
  topbar_announcement: string;
  topbar_active: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  featured_title: string;
  featured_subtitle: string;
  featured_cta_text: string;
  newsletter_title: string;
  newsletter_subtitle: string;
  newsletter_cta_text: string;
  about_eyebrow: string;
  about_title: string;
  about_description: string;
  about_story_title: string;
  about_story_text: string;
  about_mission_title: string;
  about_mission_text: string;
  about_quote: string;
  about_quote_author: string;
  about_values_title: string;
  about_value_1_title: string;
  about_value_1_text: string;
  about_value_2_title: string;
  about_value_2_text: string;
  about_value_3_title: string;
  about_value_3_text: string;
  category_1_id: string;
  category_1_image: string;
  category_2_id: string;
  category_2_image: string;
  category_3_id: string;
  category_3_image: string;
  category_4_id: string;
  category_4_image: string;
  footer_about_text: string;
  copyright_text: string;
  whatsapp_number: string;
  whatsapp_default_message: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  support_email: string;
}

export interface MercadoPagoFormState {
  mercadoPagoAccessToken: string;
  mercadoPagoPublicKey: string;
  mercadoPagoWebhookUrl: string;
  mercadoPagoWebhookSecret: string;
}

export interface MelhorEnvioFormState {
  melhorEnvioToken: string;
  originZip: string;
  originStreet: string;
  originNumber: string;
  originDistrict: string;
  originCity: string;
  originState: string;
  originCountry: string;
}
