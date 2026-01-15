import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Àwùjọ NG | Transparency in Governance",
  description: "A digital platform for tracking Nigerian budget performance, project implementation, and policy changes.",
  metadataBase: new URL("https://awujo-ng.online"),
  keywords: [
    "Nigerian leaders",
    "public officials",
    "politics",
    "government",
    "ratings",
    "news",
    "share opinions",
    "Nigerian politics",
    "budget tracking",
    "project implementation",
  ],
  authors: [
    {
      name: "Praise Ibe",
      url: "https://awujo-ng.online",
    },
  ],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  creator: "Praise Ibe",
  openGraph: {
    title: "Àwùjọ NG | Transparency in Governance",
    description: "Tracking Nigerian budget performance, project implementation, and policy changes for a more transparent future.",
    url: "https://awujo-ng.online",
    siteName: "Àwùjọ",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Àwùjọ - Transparency in Governance",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Àwùjọ NG | Transparency in Governance",
    description: "Tracking Nigerian budget performance, project implementation, and policy changes.",
    images: ["/og-image.png"],
  },
};

import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased font-sans flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Toaster position="top-right" expand={false} richColors />
          <div className="gov-banner">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
            Official platform for citizen transparency
          </div>
          <Navbar />
          <main className="flex-grow pt-[108px]">
            {children}
          </main>
          <Footer />
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
