import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAPORA — Smart Connections, Simplified",
  description: "NFC business cards and review stands."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
