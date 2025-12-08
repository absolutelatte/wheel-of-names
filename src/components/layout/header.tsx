'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Moon, Sun, Disc, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  readonly channel: string;
  readonly onCustomize?: () => void;
  readonly isSpinning?: boolean;
}

export function Header({ channel, onCustomize, isSpinning = false }: HeaderProps): JSX.Element {
  const { theme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Disc className="h-6 w-6 text-primary" />
          <span className="font-semibold">Twitch Wheel of Names</span>
        </Link>

        <div className="flex items-center gap-4">
          {onCustomize && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCustomize}
              disabled={isSpinning}
              className="hidden sm:flex"
            >
              <Settings className="mr-2 h-4 w-4" />
              Customize
            </Button>
          )}
          
          <Badge variant="outline" className="hidden sm:inline-flex">
            {channel}
          </Badge>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  );
}
