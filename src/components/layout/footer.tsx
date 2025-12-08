import type { JSX } from 'react';
import { Github } from 'lucide-react';

export function Footer(): JSX.Element {
  return (
    <footer className="border-t py-4 bg-background">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm text-muted-foreground px-4">
        <span>Vibe Coded by</span>
        <a
          href="https://github.com/benchuangxd"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-medium hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
          benchuangxd
        </a>
      </div>
    </footer>
  );
}