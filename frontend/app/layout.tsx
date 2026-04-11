import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "MRO-HRIS",
  description: "MRO Human Resource Information System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
		<AppShell>{children}</AppShell>
	  </body>
    </html>
  );
}
