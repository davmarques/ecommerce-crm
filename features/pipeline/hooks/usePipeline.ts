"use client";

import { useEffect, useMemo, useState } from "react";
import { clearStoredToken, getStoredToken } from "@/lib/crm-session";
import {
  CrmDeal,
  CrmDealStage,
  fetchCrmDeals,
  fetchCurrentUser,
  updateCrmDealStage,
} from "@/lib/api";
import type { PipelineStageMeta } from "@/components/features/pipeline/PipelineColumn";

export const pipelineStages: PipelineStageMeta[] = [
  { key: "LEAD", label: "Lead", color: "#6A87A7" },
  { key: "QUALIFIED", label: "Qualificado", color: "#2D9BA0" },
  { key: "PROPOSAL", label: "Proposta", color: "#F2A107" },
  { key: "NEGOTIATION", label: "Negociacao", color: "#E2384D" },
  { key: "WON", label: "Ganho", color: "#389B5D" },
];

export function usePipeline() {
  const [deals, setDeals] = useState<CrmDeal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingDealId, setIsUpdatingDealId] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = getStoredToken();
      if (!token) {
        setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
        setIsLoading(false);
        return;
      }
      try {
        const user = await fetchCurrentUser(token);
        setTenantId(user.tenantId);
        setDeals(await fetchCrmDeals(token, user.tenantId));
      } catch (loadError) {
        clearStoredToken();
        setError(
          loadError instanceof Error ? loadError.message : "Nao foi possivel carregar pipeline.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  async function moveToNextStage(deal: CrmDeal) {
    const token = getStoredToken();
    if (!token) {
      setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
      return;
    }
    const currentIndex = pipelineStages.findIndex((stage) => stage.key === deal.stage);
    const nextStage = pipelineStages[Math.min(pipelineStages.length - 1, currentIndex + 1)].key;
    if (nextStage === deal.stage || !tenantId) return;
    setIsUpdatingDealId(deal.id);
    setError(null);
    try {
      const updated = await updateCrmDealStage(token, deal.productId, nextStage, tenantId);
      setDeals((current) =>
        current.map((item) =>
          item.id === deal.id
            ? { ...item, stage: updated.stage, probability: updated.probability }
            : item,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Nao foi possivel atualizar o estagio.",
      );
    } finally {
      setIsUpdatingDealId(null);
    }
  }

  const totalValue = useMemo(() => deals.reduce((sum, deal) => sum + deal.value, 0), [deals]);
  return { deals, error, isLoading, isUpdatingDealId, totalValue, moveToNextStage };
}
