"use client";

import Link from "next/link";
import { CheckSquare, ArrowLeft } from "lucide-react";
import { CrmPageShell } from "@/components/ui/CrmPageShell";

export default function TasksPage() {
  return (
    <CrmPageShell
      title="Tarefas e Lembretes"
      description="Gerenciamento de pendências e rotinas operacionais"
    >
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-slate-100 text-slate-400">
          <CheckSquare className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-slate-900">Módulo Indisponível</h2>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          O gerenciador de tarefas está temporariamente indisponível para manutenção e aprimoramentos.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1D2735] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2A3647]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
      </div>
    </CrmPageShell>
  );
}

