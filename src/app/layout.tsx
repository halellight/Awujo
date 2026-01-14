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
};

import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "sonner";

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
        </AuthProvider>
      </body>
    </html>
  );
}
