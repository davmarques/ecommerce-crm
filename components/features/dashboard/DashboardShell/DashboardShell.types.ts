import type { ReactNode } from "react";
import type { ApiAuthUser } from "@/lib/api";

export interface DashboardShellProps {
  user?: ApiAuthUser | null;
  onLogout?: () => void;
  children: ReactNode;
}
