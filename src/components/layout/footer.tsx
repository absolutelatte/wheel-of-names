import { Zap } from 'lucide-react';

export function Footer(): JSX.Element {
  return (
    <footer className="border-t py-4">
      <div className="container flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Zap className="h-4 w-4" />
        <span>Powered by PickerWheel & ComfyJS</span>
      </div>
    </footer>
  );
}
