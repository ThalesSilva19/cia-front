import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SeatProvider } from "@/contexts/SeatContext";
import { ToastProvider } from "@/contexts/ToastContext";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meraki - O respiro das telas | Cia de Dança Ufscar",
  description: "Reserve seu assento para o espetáculo Meraki - O respiro das telas da Cia de Dança Ufscar. 01 de novembro - Colégio La Salle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <ToastProvider>
          <SeatProvider>
            {children}
            <WhatsAppFloatButton />
          </SeatProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
