import './globals.css';
import type { Metadata } from 'next';
import { fonts } from './fonts';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/header';
import MainNav from '@/components/main-nav';
import Sidebar from '@/components/sidebar';
import Footer from '@/components/footer';
import { cn } from '@/lib/utils';

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
    <html lang="en" suppressHydrationWarning className={fonts.geist.className}>
      <body className={cn(
        "min-h-screen bg-background antialiased",
        fonts.nordique.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            {/* MainNav on both mobile and desktop */}
            <MainNav />
            <div className="flex flex-1 min-h-0">
              <Sidebar />
              <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}