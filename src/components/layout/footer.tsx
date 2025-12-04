import type { JSX } from 'react';
import { Github, Zap } from 'lucide-react';

export function Footer(): JSX.Element {
  return (
    <footer className="border-t py-4 bg-background">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm text-muted-foreground px-4">
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4" />
          <span>Powered by PickerWheel & ComfyJS</span>
        </div>
        <span className="mx-2 text-muted-foreground/50">•</span>
        <span>VibeCoded by</span>
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