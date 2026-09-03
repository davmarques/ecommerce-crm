import type { StoreTabKey } from "@/features/settings/types/StoreSettings.types";

export interface StoreSettingsTabsProps {
  activeTab: StoreTabKey;
  onSelectTab: (tab: StoreTabKey) => void;
  isMercadoPagoConnected: boolean;
  isMelhorEnvioConfigured: boolean;
}
