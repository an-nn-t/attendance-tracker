'use client';

import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </>
  );
}
