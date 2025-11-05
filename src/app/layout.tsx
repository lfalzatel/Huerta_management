import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Huerta Verde Management - Sistema de Gestión de Huerta",
  description: "Sistema integral para la gestión de huertas, control de inventario, ventas y clientes",
  keywords: ["huerta", "gestión", "inventario", "ventas", "agricultura", "organico"],
  authors: [{ name: "Huerta Verde Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Huerta Verde Management",
    description: "Sistema integral para la gestión de huertas",
    url: "https://huerta-verde.com",
    siteName: "Huerta Verde",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Huerta Verde Management",
    description: "Sistema integral para la gestión de huertas",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
