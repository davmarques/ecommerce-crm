import type { BrandingMediaKind } from "@/lib/api";

export interface MediaUploadFieldProps {
  label: string;
  accept: string;
  kind: BrandingMediaKind;
  value: string;
  position: string;
  isIcon?: boolean;
  onFileChange: (kind: BrandingMediaKind, file?: File) => void;
  onPositionChange: (newPosition: string) => void;
  isUploading?: boolean;
}
