import type { Metadata } from 'next';
import '../styles/globals.scss';

export const metadata: Metadata = {
  title: 'PocketPilot',
  description: 'Know what is safe to spend before payday.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
