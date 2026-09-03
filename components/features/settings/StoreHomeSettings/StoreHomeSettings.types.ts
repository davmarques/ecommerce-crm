import type { StoreSettings } from "@/features/settings/types/StoreSettings.types";
import type { BrandingMediaKind } from "@/lib/api";

export interface StoreHomeSettingsProps {
  settings: StoreSettings;
  isSaving: boolean;
  onChange: (field: keyof StoreSettings, value: string | boolean) => void;
  onUploadMedia: (kind: BrandingMediaKind, file?: File) => void;
  onPositionChange: (field: keyof StoreSettings, position: string) => void;
  onSave: () => void;
  uploadingKind?: BrandingMediaKind | null;
}
