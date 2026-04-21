import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import QueryProvider from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "MRO-HRIS",
  description: "MRO Human Resource Informatie Systeem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
	<html lang="nl">
      <body>
		<QueryProvider>
			<AppShell>{children}</AppShell>
		</QueryProvider>
	  </body>
    </html>
  );
}
