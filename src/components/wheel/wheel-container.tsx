'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { WheelControls } from './wheel-controls';
import { ParticipantsList } from './participants-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWheel } from '@/hooks/use-wheel';
import { useTwitchChat } from '@/hooks/use-twitch-chat';
import { WHEEL_URL } from '@/config/constants';
import { Disc, Users, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WheelContainerProps {
  readonly channel: string;
}

export function WheelContainer({ channel }: WheelContainerProps): JSX.Element {
  const {
    status,
    participants,
    open,
    close,
    reset,
    addParticipant,
    setParticipants,
  } = useWheel();

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

  const { isConnected, error } = useTwitchChat({
    channel,
    onJoin: handleJoin,
    onOpenWheel: handleOpenWheel,
    onCloseWheel: handleCloseWheel,
  });

  const validParticipants = participants.filter(p => p.trim().length > 0);
  const wheelUrl = `${WHEEL_URL}?mute=false&choices=${validParticipants.join(',')}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-full">
      {/* Wheel Section - Takes up 8 or 9 columns on large screens */}
      <Card className="lg:col-span-8 xl:col-span-9 flex flex-col h-[500px] lg:h-full border-muted shadow-sm">
        <CardHeader className="px-6 py-4 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Disc className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Wheel of Names</CardTitle>
                <CardDescription>Wait for participants to join</CardDescription>
              </div>
            </div>
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
        <CardContent className="flex-1 p-0 relative overflow-hidden bg-muted/5 min-h-[400px] min-w-[320px]">
          <iframe
            src={wheelUrl}
            title="Picker Wheel"
            className="absolute inset-0 w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
          />
        </CardContent>
      </Card>

      {/* Sidebar Section - Takes up 4 or 3 columns */}
      <Card className="lg:col-span-4 xl:col-span-3 flex flex-col h-[500px] lg:h-full border-muted shadow-sm">
        <CardHeader className="px-6 py-4 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Participants</CardTitle>
            </div>
            <Badge variant="outline" className="font-mono">
              {validParticipants.length}
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
              disabled={status === 'open'}
            />
          </div>

          <Separator />

          <WheelControls
            status={status}
            onOpen={handleOpenWheel}
            onClose={handleCloseWheel}
            onReset={reset}
          />
        </CardContent>
      </Card>
    </div>
  );
}
