'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CHANNEL_REGEX } from '@/config/constants';

export default function HomePage(): JSX.Element {
  const router = useRouter();
  const [channel, setChannel] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmed = channel.trim().toLowerCase();
    
    if (!CHANNEL_REGEX.test(trimmed)) {
      setError('Invalid channel name. Use 3-25 characters: letters, numbers, underscores only.');
      return;
    }
    
    router.push(`/${trimmed}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Twitch Wheel of Names</CardTitle>
          <CardDescription>
            Enter your Twitch channel name to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="channel" className="text-sm font-medium">
                Channel Name
              </label>
              <input
                id="channel"
                name="channel"
                type="text"
                value={channel}
                onChange={(e) => {
                  setChannel(e.target.value);
                  setError('');
                }}
                placeholder="Type your channel name"
                required
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {error ? (
                <p className="text-xs text-destructive">{error}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  3-25 characters, letters, numbers, and underscores only
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Go to Wheel
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or go directly
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Navigate to{' '}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
              /channelname
            </code>{' '}
            to access your wheel
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
