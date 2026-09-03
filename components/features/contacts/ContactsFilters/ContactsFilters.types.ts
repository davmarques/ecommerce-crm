export type ContactFilter = "All" | "Active" | "Leads";

export interface ContactsFiltersProps {
  filter: ContactFilter;
  query: string;
  onFilterChange: (value: ContactFilter) => void;
  onQueryChange: (value: string) => void;
}
