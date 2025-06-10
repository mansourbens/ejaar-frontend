import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/components/auth/auth-provider';
import {ChatProvider} from "@/contexts/chat-context";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EJAAR',
  description: 'Solutions professionnelles de location de matériel informatique pour les entreprises.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
