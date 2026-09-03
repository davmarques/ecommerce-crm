export type TeamRole = "admin" | "salesperson";
export type TeamStatus = "active" | "pending" | "inactive";
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  status: TeamStatus;
  joinedAt: string;
}
