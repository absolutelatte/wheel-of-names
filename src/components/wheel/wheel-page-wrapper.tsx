'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { WheelContainer } from './wheel-container';

interface WheelPageWrapperProps {
  readonly channel: string;
}

export function WheelPageWrapper({ channel }: WheelPageWrapperProps): JSX.Element {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelTitle, setWheelTitle] = useState<string>('');

  return (
    <>
      <Header 
        channel={channel} 
        onCustomize={() => setSettingsOpen(true)}
        isSpinning={isSpinning}
        wheelTitle={wheelTitle}
        onTitleChange={setWheelTitle}
      />
      <main className="flex-1 container mx-auto p-4 overflow-y-auto">
        <WheelContainer 
          channel={channel}
          settingsOpen={settingsOpen}
          setSettingsOpen={setSettingsOpen}
          onSpinningChange={setIsSpinning}
          onTitleChange={setWheelTitle}
        />
      </main>
    </>
  );
}
