import type { JSX } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WheelContainer } from '@/components/wheel/wheel-container';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CHANNEL_REGEX } from '@/config/constants';

interface ChannelPageProps {
  readonly params: Promise<{ channel: string }>;
}

export async function generateMetadata({ params }: ChannelPageProps): Promise<Metadata> {
  const { channel } = await params;
  
  return {
    title: `${channel} - Wheel of Names`,
    description: `Twitch Wheel of Names for ${channel}`,
  };
}

function isValidChannel(name: string): boolean {
  return CHANNEL_REGEX.test(name);
}

export default async function ChannelPage({ params }: ChannelPageProps): Promise<JSX.Element> {
  const { channel } = await params;
  
  if (!isValidChannel(channel)) {
    notFound();
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header channel={channel} />
      <main className="flex-1 container mx-auto p-4 min-h-0">
        <WheelContainer channel={channel} />
      </main>
      <Footer />
    </div>
  );
}
