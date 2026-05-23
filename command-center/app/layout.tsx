import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Cyberpunk Command Center",
  description: "Operational dashboard for AI orchestration and automation pipelines."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
