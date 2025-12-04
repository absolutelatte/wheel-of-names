'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { WheelControls } from './wheel-controls';
import { ParticipantsList } from './participants-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWheel } from '@/hooks/use-wheel';
import { useTwitchChat } from '@/hooks/use-twitch-chat';
import { WHEEL_URL } from '@/config/constants';
import { Disc, Users } from 'lucide-react';

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

  const wheelUrl = `${WHEEL_URL}?mute=false&choices=${participants.join(',')}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
      <Card className="lg:col-span-3 flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Disc className="h-5 w-5" />
            Wheel
          </CardTitle>
          <Badge variant={status === 'open' ? 'success' : 'secondary'}>
            {status === 'open' ? 'Open' : 'Closed'}
          </Badge>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <iframe
            src={wheelUrl}
            title="Picker Wheel"
            className="w-full h-full border-0 rounded-b-xl"
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
          />
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participants
          </CardTitle>
          <Badge variant="outline">{participants.length}</Badge>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          {error && (
            <p className="text-sm text-destructive">Chat error: {error}</p>
          )}
          {!isConnected && !error && (
            <p className="text-sm text-muted-foreground">Connecting to chat...</p>
          )}
          {isConnected && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Connected to {channel}&apos;s chat
            </p>
          )}

          <ParticipantsList
            participants={participants}
            onParticipantsChange={setParticipants}
            disabled={status === 'open'}
          />

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
