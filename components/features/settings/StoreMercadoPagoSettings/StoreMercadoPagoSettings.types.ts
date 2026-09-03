import type { IntegrationSettings } from "@/lib/api";
import type { MercadoPagoFormState } from "@/features/settings/types/StoreSettings.types";

export interface StoreMercadoPagoSettingsProps {
  integrationSettings: IntegrationSettings | null;
  form: MercadoPagoFormState;
  mercadoPagoConnectUrl: string;
  isSaving: boolean;
  onChange: (field: keyof MercadoPagoFormState, value: string) => void;
  onSave: () => void;
}
