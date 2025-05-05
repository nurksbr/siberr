import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./components/ClientWrapper";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CYBERLY - Siber Güvenlik Farkındalık Platformu",
  description: "Kişiler ve kurumlar için siber güvenlik farkındalığı, eğitimler ve güncel tehdit istihbaratı",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>'
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className="antialiased bg-gray-900 text-white"
      >
        {/* Kod akışı animasyonu istemci tarafında render edilecek */}
        <ClientWrapper />
        
        <AuthProvider>
          <div className="relative z-20">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
