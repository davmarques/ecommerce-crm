"use client";

import { useContacts } from "@/features/contacts/hooks/useContacts";
import { CrmFeedback } from "@/components/ui/CrmFeedback";
import { CrmPageShell } from "@/components/ui/CrmPageShell";
import { ContactsTable } from "@/components/features/contacts/ContactsTable";
import { ContactsFilters } from "@/components/features/contacts/ContactsFilters";
import { ContactDetailsModal } from "@/components/features/contacts/ContactDetailsModal";

export default function ContactsPage() {
  const {
    filteredContacts,
    query,
    filter,
    selectedContactId,
    error,
    isLoading,
    setQuery,
    setFilter,
    setSelectedContactId,
  } = useContacts();

  return (
    <CrmPageShell title="Contatos" description="Usuarios vinculados ao tenant atual.">
      <ContactsFilters
        filter={filter}
        query={query}
        onFilterChange={setFilter}
        onQueryChange={setQuery}
      />
      <ContactsTable
        contacts={filteredContacts}
        isLoading={isLoading}
        onContactSelect={setSelectedContactId}
      />
      <CrmFeedback error={error} />
      <ContactDetailsModal
        contactId={selectedContactId}
        onClose={() => setSelectedContactId(null)}
      />
    </CrmPageShell>
  );
}
