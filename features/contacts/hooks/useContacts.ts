"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchCrmContacts } from "@/lib/api";
import { clearStoredToken, fetchCrmSnapshot, getStoredToken } from "@/lib/crm-session";
import type { ContactFilter } from "@/components/features/contacts/ContactsFilters";
import type { ContactRow } from "@/components/features/contacts/ContactsTable";

export function useContacts() {
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ContactFilter>("All");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = getStoredToken();
      if (!token) {
        setError("Sessao nao encontrada. Entre pelo dashboard do CRM.");
        setIsLoading(false);
        return;
      }

      try {
        const { user, products } = await fetchCrmSnapshot(token);
        const tenantContacts = await fetchCrmContacts(token, user.tenantId);
        const baseValue = products.reduce(
          (total, product) => total + Number(product.price || 0),
          0,
        );
        setContacts(
          tenantContacts.map((contact) => {
            const address = contact.addresses[0];
            return {
              id: contact.id,
              name: contact.name,
              email: contact.email,
              phone: contact.phone || "Nao informado",
              company: contact.tenantId,
              city: address?.city || "Nao informado",
              state: address?.state || "",
              status: address ? "active" : "lead",
              value: Math.round(baseValue / Math.max(1, tenantContacts.length)),
            };
          }),
        );
      } catch (loadError) {
        clearStoredToken();
        setError(
          loadError instanceof Error ? loadError.message : "Nao foi possivel carregar contatos.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return contacts.filter((contact) => {
      const matchesQuery =
        !normalizedQuery ||
        [contact.name, contact.city, contact.state].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        );
      const matchesFilter =
        filter === "All" ||
        (filter === "Active" && contact.status === "active") ||
        (filter === "Leads" && contact.status === "lead");
      return matchesQuery && matchesFilter;
    });
  }, [contacts, filter, query]);

  return {
    filteredContacts,
    query,
    filter,
    selectedContactId,
    error,
    isLoading,
    setQuery,
    setFilter,
    setSelectedContactId,
  };
}
