import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LogicForge: The Programmer\'s Brain',
  description: 'Educational programming adventure game',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
