import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ridercritic',
  description: 'Your ultimate guide to motorcycles and riding culture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex flex-1">
                <div className="md:block hidden">
                  <Sidebar />
                </div>
                <main className="flex-1 p-4 md:p-6">{children}</main>
              </div>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}