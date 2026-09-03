"use client";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { DashboardLoginView } from "@/components/features/dashboard/DashboardLoginView";

export default function LoginPage() {
  const { email, password, setEmail, setPassword, error, isLoading, handleLogin } = useAuth();

  return (
    <DashboardLoginView
      email={email}
      password={password}
      isLoading={isLoading}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
    />
  );
}
