import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
import { SessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Fyshe — Fishing Companion",
  description: "Track your catches, plan trips, and discover fly patterns.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <SessionProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
