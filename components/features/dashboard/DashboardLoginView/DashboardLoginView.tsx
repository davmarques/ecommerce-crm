import type { DashboardLoginViewProps } from "./DashboardLoginView.types";

export function DashboardLoginView({
  email,
  password,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: DashboardLoginViewProps) {
  return (
    <main className="flex min-h-screen items-center justify-center p-6 lg:p-10">
      <section className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-[0_20px_70px_-35px_rgba(16,24,40,0.45)] lg:grid lg:grid-cols-[1.2fr_1fr]">
        <div className="relative hidden overflow-hidden bg-[#1E2A39] p-10 text-slate-100 lg:block">
          <div className="absolute -right-24 -top-20 h-52 w-52 rounded-full bg-[#60A5FA]/20" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#34D399]/20" />
          <p className="relative text-xs uppercase tracking-[0.28em] text-slate-300">
            Forge CRM Suite
          </p>
          <h1 className="relative mt-6 text-4xl font-semibold leading-tight">
            Seu painel comercial
            <br />
            conectado ao backend
          </h1>
          <p className="relative mt-5 max-w-sm text-sm leading-7 text-slate-300">
            Entre com sua conta para acompanhar produtos, categorias e os principais indicadores da
            loja.
          </p>
        </div>

        <div className="p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Acesso CRM</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">Entrar no painel</h2>
          <p className="mt-3 text-sm text-slate-600">
            Use uma conta existente no backend para autenticar.
          </p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <input
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              type="email"
              placeholder="E-mail"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F6E8C]"
              required
            />
            <input
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              type="password"
              placeholder="Senha"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1F6E8C]"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#243448] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1E2A39] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Entrando..." : "Entrar no CRM"}
            </button>
          </form>

          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
