import type { ReactNode } from "react";

export interface CrmPageShellProps {
  title: string;
  description: string;
  maxWidthClassName?: string;
  children: ReactNode;
}
