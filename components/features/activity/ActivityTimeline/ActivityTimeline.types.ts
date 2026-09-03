export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  kind: "product" | "category" | "address" | "task";
}

export interface ActivityTimelineProps {
  items: ActivityItem[];
  isLoading: boolean;
}
