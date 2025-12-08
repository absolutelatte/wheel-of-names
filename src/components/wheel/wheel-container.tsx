'use client';

import type { JSX } from 'react';
import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { WheelControls } from './wheel-controls';
import { WheelManagement } from './wheel-management';
import { ParticipantsList } from './participants-list';
import { WheelSpinner } from './wheel-spinner';
import { WheelSettingsDialog } from './wheel-settings-dialog';
import { WinnerDialog } from './winner-dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWheel } from '@/hooks/use-wheel';
import { useTwitchChat } from '@/hooks/use-twitch-chat';
import { useWheelSettings } from '@/hooks/use-wheel-settings';
import { useWheelMetadata } from '@/hooks/use-wheel-metadata';
import { useAudio } from '@/hooks/use-audio';
import { Users, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WheelContainerProps {
  readonly channel: string;
  readonly settingsOpen?: boolean;
  readonly setSettingsOpen?: (open: boolean) => void;
  readonly onSpinningChange?: (spinning: boolean) => void;
  readonly onTitleChange?: (title: string) => void;
}

/**
 * Sample random participants if count exceeds maxVisible
 * Uses a seed to keep the same sample during spins
 */
function sampleParticipants(
  participants: readonly string[],
  maxVisible: number,
  seed: number
): readonly string[] {
  if (participants.length <= maxVisible) return participants;

  // Create a seeded random for consistent sampling
  const seededRandom = (s: number): number => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  // Create indices and shuffle with seed
  const indices = participants.map((_, i) => i);
  let currentSeed = seed;
  for (let i = indices.length - 1; i > 0; i--) {
    currentSeed++;
    const j = Math.floor(seededRandom(currentSeed) * (i + 1));
    const temp = indices[i];
    const swap = indices[j];
    if (temp !== undefined && swap !== undefined) {
      indices[i] = swap;
      indices[j] = temp;
    }
  }

  return indices.slice(0, maxVisible).map(i => participants[i] ?? '');
}

export function WheelContainer({ 
  channel, 
  settingsOpen: externalSettingsOpen,
  setSettingsOpen: externalSetSettingsOpen,
  onSpinningChange,
  onTitleChange 
}: WheelContainerProps): JSX.Element {
  const {
    status,
    participants,
    open,
    close,
    reset,
    addParticipant,
    removeParticipant,
    removeAllInstances,
    setParticipants,
  } = useWheel();

  // Settings and metadata hooks
  const { settings, updateSettings } = useWheelSettings();
  const { metadata } = useWheelMetadata();

  // Audio hook
  const { playTick, playWin } = useAudio({ volume: settings.volume });

  // Dialog states - use external state if provided, otherwise use local state
  const [internalSettingsOpen, setInternalSettingsOpen] = useState(false);
  const settingsOpen = externalSettingsOpen ?? internalSettingsOpen;
  const setSettingsOpen = externalSetSettingsOpen ?? setInternalSettingsOpen;

  // Sync title with parent component
  useEffect(() => {
    if (onTitleChange) {
      onTitleChange(metadata.title);
    }
  }, [metadata.title, onTitleChange]);
  
  const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);
  const [winnerName, setWinnerName] = useState('');
  const [isSpinning, setIsSpinningState] = useState(false);

  const setIsSpinning = useCallback((spinning: boolean) => {
    setIsSpinningState(spinning);
    onSpinningChange?.(spinning);
  }, [onSpinningChange]);

  // Memoize valid participants to ensure stable reference
  const validParticipants = useMemo(
    () => participants.filter(p => p.trim().length > 0),
    [participants]
  );

  // Seed for consistent sampling (only changes when participant list changes)
  const sampleSeedRef = useRef(Date.now());
  const prevParticipantsRef = useRef<readonly string[]>([]);
  
  // Sample participants for display (memoized with stable seed)
  const displayedParticipants = useMemo(() => {
    // Only update seed when participants actually change
    if (prevParticipantsRef.current !== validParticipants) {
      sampleSeedRef.current = Date.now();
      prevParticipantsRef.current = validParticipants;
    }
    return sampleParticipants(validParticipants, settings.maxVisible, sampleSeedRef.current);
  }, [validParticipants, settings.maxVisible]);

  // Spin start handler
  const handleSpinStart = useCallback((): void => {
    setIsSpinning(true);
    // Automatically close entries when spinning starts
    if (status === 'open') {
      close();
    }
  }, [status, close]);

  // Spin completion handler
  const handleSpinEnd = useCallback((winner: string): void => {
    setIsSpinning(false);
    playWin();
    setWinnerName(winner);
    setWinnerDialogOpen(true);
  }, [playWin]);

  const handleJoin = useCallback(
    (username: string): void => {
      if (status === 'open') {
        addParticipant(username);
        toast.success(`${username} joined the wheel!`);
      }
    },
    [status, addParticipant]
  );

  const handleOpenWheel = useCallback((): void => {
    open();
    toast.info('Wheel is now open! Type !join to participate.');
  }, [open]);

  const handleCloseWheel = useCallback((): void => {
    close();
    toast.info('Wheel is now closed.');
  }, [close]);

  const handleShuffle = useCallback((): void => {
    if (participants.length <= 1) {
      toast.info('Need at least 2 participants to shuffle.');
      return;
    }

    // Fisher-Yates shuffle algorithm
    const shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      const swap = shuffled[j];
      if (temp !== undefined && swap !== undefined) {
        shuffled[i] = swap;
        shuffled[j] = temp;
      }
    }

    setParticipants(shuffled);
    toast.success('Participants shuffled!');
  }, [participants, setParticipants]);

  const { isConnected, error } = useTwitchChat({
    channel,
    onJoin: handleJoin,
    onOpenWheel: handleOpenWheel,
    onCloseWheel: handleCloseWheel,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6 lg:min-h-[700px]">
      {/* Wheel Section - Takes up 8 or 9 columns on large screens */}
      <Card className="lg:col-span-8 xl:col-span-9 flex flex-col border-muted shadow-sm lg:h-full">
        <CardContent className="flex-1 p-4 flex items-center justify-center bg-muted/5 min-h-0">
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <WheelSpinner
              participants={displayedParticipants}
              onSpinStart={handleSpinStart}
              onSpinEnd={handleSpinEnd}
              onSegmentChange={playTick}
              spinDuration={settings.spinTime}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Section - Takes up 4 or 3 columns */}
      <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 lg:h-full">
        {/* Settings Card */}
        <Card className="border-muted shadow-sm">
          <CardContent className="p-4">
            <WheelManagement
              onReset={reset}
              onShuffle={handleShuffle}
              isSpinning={isSpinning}
            />
          </CardContent>
        </Card>

        {/* Participants Card */}
        <Card className="flex flex-col min-h-[400px] lg:flex-1 border-muted shadow-sm">
        <CardHeader className="px-6 py-4 border-b bg-muted/20">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline" className="font-mono">
              {validParticipants.length}
            </Badge>
            <Badge 
              variant={status === 'open' ? 'success' : 'secondary'}
              className={cn(
                "px-3 py-1 text-sm font-medium transition-colors",
                status === 'open' 
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" 
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              )}
            >
              {status === 'open' ? 'Accepting Entries' : 'Entries Closed'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-4 gap-4 min-h-0">
          {/* Connection Status */}
          <div className={cn(
            "flex items-center gap-2 text-xs px-3 py-2 rounded-md border",
            error ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-800" :
            isConnected ? "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800" :
            "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800"
          )}>
            {error ? <AlertCircle className="h-3.5 w-3.5" /> :
             isConnected ? <Wifi className="h-3.5 w-3.5" /> :
             <WifiOff className="h-3.5 w-3.5" />}
            <span className="font-medium truncate">
              {error ? `Error: ${error}` :
               isConnected ? `Connected to ${channel}` :
               'Connecting to chat...'}
            </span>
          </div>

          <div className="flex-1 min-h-0 flex flex-col relative">
            <ParticipantsList
              participants={participants}
              onParticipantsChange={setParticipants}
              disabled={status === 'open' || isSpinning}
            />
          </div>

          <Separator />

          <WheelControls
            status={status}
            onOpen={handleOpenWheel}
            onClose={handleCloseWheel}
            isSpinning={isSpinning}
          />
        </CardContent>
      </Card>
      </div>

      {/* Settings Dialog */}
      <WheelSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={updateSettings}
      />

      {/* Winner Dialog */}
      <WinnerDialog
        open={winnerDialogOpen}
        onOpenChange={setWinnerDialogOpen}
        winnerName={winnerName}
        onClose={() => setWinnerDialogOpen(false)}
        onRemove={() => {
          removeParticipant(winnerName);
          setWinnerDialogOpen(false);
        }}
        onRemoveAll={() => {
          removeAllInstances(winnerName);
          setWinnerDialogOpen(false);
        }}
      />
    </div>
  );
}
