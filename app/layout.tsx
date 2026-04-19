import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Rodinný web — Nekulovi",
    template: "%s | Nekulovi",
  },
  description: "Rodinný web rodiny Nekulových — odkazy a stránky pro Tinušku, Tea a další.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${inter.variable} ${geistMono.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-app-bg text-app-fg">
        {children}
      </body>
    </html>
  );
}
