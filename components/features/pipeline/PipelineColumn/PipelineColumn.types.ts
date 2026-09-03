import type { CrmDeal, CrmDealStage } from "@/lib/api";

export interface PipelineStageMeta {
  key: CrmDealStage;
  label: string;
  color: string;
}

export interface PipelineColumnProps {
  stage: PipelineStageMeta;
  deals: CrmDeal[];
  isUpdatingDealId: string | null;
  onMoveNextStage: (deal: CrmDeal) => void;
}
