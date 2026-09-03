export interface ContactRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  state: string;
  status: "active" | "lead";
  value: number;
}

export interface ContactsTableProps {
  contacts: ContactRow[];
  isLoading: boolean;
  onContactSelect: (contactId: string) => void;
}
