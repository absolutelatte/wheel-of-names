import { Skeleton } from '@/components/ui/skeleton';

export default function ChannelLoading(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          <div className="lg:col-span-3">
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-[500px] w-full rounded-lg" />
          </div>
        </div>
      </main>
      <footer className="border-t p-4">
        <Skeleton className="h-4 w-64 mx-auto" />
      </footer>
    </div>
  );
}
