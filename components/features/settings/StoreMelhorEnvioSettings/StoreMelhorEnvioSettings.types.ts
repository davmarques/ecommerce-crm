import type { IntegrationSettings } from "@/lib/api";
import type { MelhorEnvioFormState } from "@/features/settings/types/StoreSettings.types";

export interface StoreMelhorEnvioSettingsProps {
  integrationSettings: IntegrationSettings | null;
  form: MelhorEnvioFormState;
  isSaving: boolean;
  onChange: (field: keyof MelhorEnvioFormState, value: string) => void;
  onSave: () => void;
}
