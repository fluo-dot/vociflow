
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'VociFlow | 100% Privates Vokabellernen',
  description: 'Die intelligente, kostenlose Art, Vokabeln zu lernen. Privat, lokal und ohne Accounts direkt in deinem Browser.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        <ThemeProvider defaultTheme="light" storageKey="vociflow-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
