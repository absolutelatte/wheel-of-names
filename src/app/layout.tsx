import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Twitch Wheel of Names',
  description: 'Interactive wheel for Twitch streams - Let viewers join and spin to win!',
  keywords: ['twitch', 'wheel', 'giveaway', 'streamer', 'interactive'],
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" visibleToasts={1} duration={1000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
