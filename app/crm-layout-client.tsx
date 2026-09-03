"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CrmSidebar } from "@/components/ui/CrmSidebar";

interface CrmLayoutClientProps {
  children: ReactNode;
}

export function CrmLayoutClient({ children }: CrmLayoutClientProps) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#EEF2F7] text-slate-900 pl-[250px]">
      <CrmSidebar />
      <div className="min-h-screen">{children}</div>
    </div>
  );
}
