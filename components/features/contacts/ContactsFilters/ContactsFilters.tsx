import { Search } from "lucide-react";
import type { ContactFilter, ContactsFiltersProps } from "./ContactsFilters.types";

export function ContactsFilters({
  filter,
  query,
  onFilterChange,
  onQueryChange,
}: ContactsFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <div className="flex rounded-xl border border-slate-200 bg-white p-1">
        {(["All", "Active", "Leads"] as ContactFilter[]).map((item) => (
          <button
            key={item}
            onClick={() => onFilterChange(item)}
            className={`rounded-lg px-3 py-1.5 text-sm ${filter === item ? "bg-[#2B3A4F] text-white" : "text-slate-600"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="relative min-w-[250px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar por nome, cidade ou estado"
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#2B3A4F]"
        />
      </div>
    </div>
  );
}
