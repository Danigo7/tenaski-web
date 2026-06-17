import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Tena Skis — Esquís artesanales de los Pirineos",
  description: "Esquís hechos a mano en los Pirineos. Precisión, madera y nieve en su forma más pura.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-zinc-50 text-black antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}