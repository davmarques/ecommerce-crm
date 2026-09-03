"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";
import { saveToken } from "@/lib/crm-token";

export function useAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const auth = await loginUser({ email, password });
      saveToken(auth.token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar no CRM.");
      setIsLoading(false);
    }
  }

  return { email, password, setEmail, setPassword, error, isLoading, handleLogin };
}
