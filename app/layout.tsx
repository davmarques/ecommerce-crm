import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { CrmLayoutClient } from "./crm-layout-client";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "CRM | Ecommerce",
  description: "Painel CRM integrado ao backend do Ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={manrope.variable}>
        <CrmLayoutClient>{children}</CrmLayoutClient>
      </body>
    </html>
  );
}
