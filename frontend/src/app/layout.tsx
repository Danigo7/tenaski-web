import "./globals.css";
import Header from "@/components/layout/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-zinc-50 text-black antialiased">
        
        <Header />

        <main>{children}</main>

      </body>
    </html>
  );
}