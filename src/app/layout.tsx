import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/Navigation";
import { ClientProviders } from "@/components/ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StyleSense AI | Dressed for you. Built for the moment.",
  description: "A luxury fashion AI web app that creates personalized outfits based on your body type, skin tone, and preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-ivory text-charcoal font-sans selection:bg-rosegold/30 selection:text-charcoal transition-colors duration-500">
        <ClientProviders>
          <Navigation />
          <main className="flex-1 flex flex-col pt-24">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}

