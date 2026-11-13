import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'SID UNIVERSE — The Interactive Digital Cosmos of Sid',
  description: 'A 3D solar system representing the digital world of Sid. Explore creations, active studies, gaming, music, watchlist, and live Windows telemetry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="cosmic-bg min-h-screen flex flex-col text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Header />
        <main className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
